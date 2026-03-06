/**
 * Rinoapp MCP Worker — Reverse Proxy + AI Endpoint
 * 
 * This Worker serves two purposes:
 * 1. Proxies all web requests to the Cloudflare Tunnel
 * 2. Provides AI chat endpoint at /mcp/v1/chat, integrated with Confluence API
 */

const TUNNEL_ORIGIN = "https://67abe048-6e57-4883-b4a7-ebff1b1cbba6.cfargotunnel.com";

// --- Atlassian Confluence Config ---
// ⚠️  SECURITY: Credentials are loaded from Cloudflare Worker Secrets (env.*)
// To set: wrangler secret put CONFLUENCE_EMAIL
// To set: wrangler secret put CONFLUENCE_API_TOKEN
const CONFLUENCE_DOMAIN = "https://rinoeduai.atlassian.net";


async function searchConfluence(query, env) {
    if (!query) return JSON.stringify({ error: "Query is required" });
    const authHeader = `Basic ${btoa(`${env.CONFLUENCE_EMAIL}:${env.CONFLUENCE_API_TOKEN}`)}`;
    const cql = `text~"${query}" OR title~"${query}"`;
    const searchUrl = `${CONFLUENCE_DOMAIN}/wiki/rest/api/content/search?cql=${encodeURIComponent(cql)}&limit=3&expand=body.storage`;
    try {
        const response = await fetch(searchUrl, {
            headers: { "Authorization": authHeader, "Accept": "application/json" }
        });
        if (!response.ok) return JSON.stringify({ error: "Confluence API Error: " + response.statusText });
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            let combinedContent = "";
            for (const result of data.results) {
                const title = result.title;
                const htmlBody = result.body?.storage?.value || "";
                const cleanText = htmlBody.replace(/<[^>]*>?/gm, ' ').substring(0, 1500);
                combinedContent += `--- TÀI LIỆU CONFLUENCE: ${title} ---\n${cleanText}\n\n`;
            }
            return combinedContent;
        }
        return JSON.stringify({ message: "No documents found matching the query" });
    } catch (e) {
        return JSON.stringify({ error: "Failed to fetch from Confluence: " + e.message });
    }
}

async function countConfluenceSpaces(env) {
    const authHeader = `Basic ${btoa(`${env.CONFLUENCE_EMAIL}:${env.CONFLUENCE_API_TOKEN}`)}`;
    const spacesUrl = `${CONFLUENCE_DOMAIN}/wiki/rest/api/space`;
    try {
        const response = await fetch(spacesUrl, {
            headers: { "Authorization": authHeader, "Accept": "application/json" }
        });
        if (!response.ok) {
            const errText = await response.text();
            return `LỖI API: HTTP ${response.status} - ${errText}`;
        }
        const data = await response.json();
        const count = data.size || (data.results ? data.results.length : 0);
        let spaceNames = [];
        if (data.results) spaceNames = data.results.map(s => s.name);

        return JSON.stringify({ message: `Found ${count} workspaces.`, workspace_names: spaceNames });
    } catch (e) {
        return `EXCEPTION: ${e.message} Stack: ${e.stack}`;
    }
}

// ── Define AI Tools Schema ──
const agentTools = [
    {
        name: "confluence_search",
        description: "Search the Atlassian Confluence documentation for technical documentation, design specs, and requirements.",
        parameters: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "The search query, e.g., 'API integration' or 'database schema'"
                }
            },
            required: ["query"]
        }
    },
    {
        name: "confluence_count_spaces",
        description: "Count the total number of Space (Workspaces) currently available on the Atlassian Confluence system and list their basic names.",
        parameters: {
            type: "object",
            properties: {},
            required: []
        }
    }
];

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // Basic CORS handling
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
            });
        }

        // MCP Ping endpoint
        if (url.pathname === "/mcp/v1/ping") {
            return new Response(JSON.stringify({ status: "ok", message: "MCP alive" }), {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });
        }

        // AI Chat Endpoint with Confluence Agent Integration
        if (url.pathname === "/mcp/v1/chat" && request.method === "POST") {
            try {
                const body = await request.json();
                const userQuery = body.message || "";
                const contextParams = body.context || {};
                const currentPath = contextParams.path || "Không có";
                const messageHistory = body.messages || []; // Support full history

                let systemPrompt = `You are an autonomous AI Agent named RinoEdu AI, assisting users and developers on the RinoEdu platform.
You MUST answer in Vietnamese. 

1. NORMAL CHAT: If the user greets you (e.g., "hello", "hi") or asks general questions, reply normally and friendly. DO NOT mention Confluence or apologize for any lack of access. 

2. USING TOOLS: You have access to Atlassian Confluence tools.
If the user explicitly asks to search for documents, wikis, workspaces, or technical knowledge, you MUST NOT answer directly. Instead, you MUST output ONLY a JSON tool call exactly like this:
{"name": "confluence_search", "arguments": {"query": "search keywords"}}

3. ARCHITECTURE RULES (WHITE DOC):
You are aware that RinoEdu uses a "Modular Monolith" architecture.
- Core Modules: iam, hr, mdm, crm, education, logistics, fintech, comms.
- Rule 1: STRICT BOUNDARIES. No Cross-DB Queries. A module cannot directly query tables of another module.
- Rule 2: INTERNAL COMMUNICATION. Must go through DTOs/Interfaces defined in 'src/shared/interfaces/'.
- Rule 3: API CONTRACT. Frontend must not hardcode mock data, but must import Interfaces from 'src/shared/interfaces/'.
If a developer asks about architecture, API design, or boundaries, strictly evaluate their request against these rules and remind them if they violate Modular Monolith principles.

Always format your final responses using Markdown. Do not include tool syntax in your final conversational response.`;

                if (currentPath !== "Không có") {
                    systemPrompt += `\n\nNgữ cảnh hiện hành: User đang ở URL: \`${currentPath}\`.`;
                }

                // Build dialogue history
                const messages = [
                    { role: "system", content: systemPrompt }
                ];

                // Append history if provided by client, otherwise just use the single turn
                if (messageHistory.length > 0) {
                    for (const msg of messageHistory) {
                        // Skip system messages from client just in case
                        if (msg.role !== "system") {
                            messages.push({
                                role: msg.role === "ai" ? "assistant" : "user",
                                content: msg.content
                            });
                        }
                    }
                } else {
                    messages.push({ role: "user", content: userQuery });
                }

                // --- AGENT RE-ACT LOOP ---
                const MAX_ITERATIONS = 4;
                let iteration = 0;
                let finalReply = "Xin lỗi, tôi không thể xử lý yêu cầu lúc này.";

                while (iteration < MAX_ITERATIONS) {
                    iteration++;

                    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
                        messages: messages,
                        tools: agentTools
                    });

                    console.log(`[ITERATION ${iteration}] RAW AI RESPONSE:`, JSON.stringify(response, null, 2));

                    let toolCalls = response.tool_calls || [];

                    // Fallback manual parsing for Llama-3 raw JSON tool calls in text
                    if (toolCalls.length === 0 && response.response) {
                        const str = response.response;
                        const regex = /{"name":\s*"([^"]+)",\s*"arguments":\s*({[^}]*})}/g;
                        let match;
                        while ((match = regex.exec(str)) !== null) {
                            try {
                                toolCalls.push({
                                    name: match[1],
                                    arguments: JSON.parse(match[2])
                                });
                            } catch (e) { }
                        }
                    }

                    // Check if AI decided to call a tool
                    if (toolCalls.length > 0) {
                        // Add AI's tool call request to history as assistant message
                        messages.push({
                            role: "assistant",
                            content: `Tôi đang gọi tool: ${toolCalls[0].name}`
                        });

                        // Execute all requested tools
                        for (const toolCall of toolCalls) {
                            const params = toolCall.arguments || {};
                            let toolResult = "";

                            try {
                                if (toolCall.name === "confluence_search") {
                                    toolResult = await searchConfluence(params.query, env);
                                } else if (toolCall.name === "confluence_count_spaces") {
                                    toolResult = await countConfluenceSpaces(env);
                                } else {
                                    toolResult = JSON.stringify({ error: "Unknown tool: " + toolCall.name });
                                }
                            } catch (err) {
                                toolResult = JSON.stringify({ error: err.message });
                            }

                            // Inject tool result back into messages as a USER message so Llama 3 won't crash on invalid tool format
                            messages.push({
                                role: "user",
                                content: `Kết quả từ tool [${toolCall.name}]:\n${toolResult}\n\nHãy tạo câu trả lời cuối cùng cho người dùng dựa trên dữ liệu trên.`
                            });
                        }
                        // Loop continues to let AI generate a response based on the tool result
                    } else {
                        // AI provided a final text response. Clean up any stray JSON blocks in the final reply.
                        finalReply = (response.response || "").replace(/{"name":\s*"[^"]+",\s*"arguments":\s*{[^}]*}}/g, "").trim();
                        break;
                    }
                }

                if (iteration >= MAX_ITERATIONS) {
                    finalReply += "\n\n(Lưu ý: Agent đã chạm đến giới hạn tư duy và dừng lại sớm. Một số thông tin có thể chưa đầy đủ.)";
                }

                return new Response(JSON.stringify({
                    status: "success",
                    reply: finalReply
                }), {
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                });
            } catch (e) {
                return new Response(JSON.stringify({ error: e.message, stack: e.stack }), {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                });
            }
        }

        // ── REVERSE PROXY: Forward all other requests to the Cloudflare Tunnel ──
        try {
            const proxyUrl = new URL(url.pathname + url.search, TUNNEL_ORIGIN);
            const proxyRequest = new Request(proxyUrl.toString(), {
                method: request.method,
                headers: request.headers,
                body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
                redirect: "follow",
            });

            const proxyResponse = await fetch(proxyRequest);

            // Clone response and add CORS headers
            const responseHeaders = new Headers(proxyResponse.headers);
            responseHeaders.set("Access-Control-Allow-Origin", "*");

            return new Response(proxyResponse.body, {
                status: proxyResponse.status,
                statusText: proxyResponse.statusText,
                headers: responseHeaders,
            });
        } catch (e) {
            return new Response(
                `<!DOCTYPE html><html><head><title>RinoEdu</title></head><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#f1f5f9">
                <div style="text-align:center">
                    <h1 style="color:#1e40af">🚀 RinoEdu AI Platform</h1>
                    <p style="color:#64748b">Server đang khởi động, vui lòng thử lại sau vài giây...</p>
                    <p style="color:#94a3b8;font-size:12px">Error: ${e.message}</p>
                    <button onclick="location.reload()" style="margin-top:16px;padding:8px 24px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:bold">Tải lại</button>
                </div></body></html>`,
                {
                    status: 502,
                    headers: { "Content-Type": "text/html; charset=utf-8" },
                }
            );
        }
    },
};
