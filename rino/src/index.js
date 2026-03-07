/**
 * Rino Worker — Reverse Proxy + AI Endpoint (OpenAI GPT-4o-mini)
 * 
 * This Worker serves two purposes:
 * 1. Proxies all web requests to the Cloudflare Tunnel
 * 2. Provides AI chat endpoint at /mcp/v1/chat, powered by OpenAI
 */

const TUNNEL_ORIGIN = "https://67abe048-6e57-4883-b4a7-ebff1b1cbba6.cfargotunnel.com";
const OPENAI_API_URL = "https://api.openai-proxy.com/v1/chat/completions"; // Pure pass-through Proxy that accepts official OpenAI sk- keys
const OPENAI_MODEL = "gpt-4o-mini";

import { WHITEPAPER_CONTENT } from './whitepaper.js';

// ── OpenAI Function Calling Tool Definitions ──
const openaiTools = [
    {
        type: "function",
        function: {
            name: "read_whitepaper",
            description: "ĐỌC tài liệu Sách Trắng RinoEdu — LUÔN LUÔN gọi tool này KHI người dùng hỏi về: tính năng màn hình, giao diện, UI, Homepage, Dashboard, module, kiến trúc hệ thống, component, hoặc BẤT CỨ điều gì liên quan đến nền tảng RinoEdu.",
            parameters: { type: "object", properties: {}, required: [] }
        }
    },
    {
        type: "function",
        function: {
            name: "read_whitepaper",
            description: "ĐỌC tài liệu Sách Trắng RinoEdu — LUÔN LUÔN gọi tool này KHI người dùng hỏi về: tính năng màn hình, giao diện, UI, Homepage, Dashboard, module, kiến trúc hệ thống, component, hoặc BẤT CỨ điều gì liên quan đến nền tảng RinoEdu.",
            parameters: { type: "object", properties: {}, required: [] }
        }
    },
    {
        type: "function",
        function: {
            name: "create_ticket",
            description: "Tạo một Support Ticket (yêu cầu hỗ trợ/báo lỗi/tính năng mới) trên hệ thống RinoEdu dựa trên yêu cầu người dùng.",
            parameters: {
                type: "object",
                properties: {
                    title: { type: "string", description: "Tiêu đề ngắn gọn của ticket" },
                    description: { type: "string", description: "Mô tả chi tiết nội dung cần hỗ trợ" },
                    type: { type: "string", enum: ["Bug", "Feature", "Question"], description: "Phân loại ticket" }
                },
                required: ["title", "description", "type"]
            }
        }
    }
];

// ── Call OpenAI Chat Completions API ──
async function callOpenAI(messages, env, useTools = true) {
    const body = {
        model: OPENAI_MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1500,
    };
    if (useTools) {
        body.tools = openaiTools;
        body.tool_choice = "auto";
    }

    const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenAI API Error ${response.status}: ${errText}`);
    }

    return await response.json();
}

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

        // AI Chat Endpoint — Powered by OpenAI GPT-4o-mini
        if (url.pathname === "/mcp/v1/chat" && request.method === "POST") {
            try {
                const body = await request.json();
                const userQuery = body.message || "";
                const ctx = body.context || {};
                const messageHistory = body.messages || [];

                let systemPrompt = `Bạn là RinoEdu AI — trợ lý thông minh của nền tảng quản lý giáo dục RinoEdu.

QUY TẮC QUAN TRỌNG:
1. Luôn trả lời bằng tiếng Việt.
2. KHÔNG BAO GIỜ tự giới thiệu hoặc lặp lại câu chào "Xin chào! Tôi là RinoEdu AI..." trừ khi người dùng nói "bạn là ai" hoặc "giới thiệu bản thân".
3. **QUY TẮC ƯU TIÊN TOOL**: Khi người dùng hỏi về TÍNH NĂNG, MÀN HÌNH, GIAO DIỆN, MODULE, KIẾN TRÚC, HOMEPAGE, DASHBOARD, hoặc BẤT CỨ GÌ liên quan đến sản phẩm RinoEdu → BẮT BUỘC gọi tool \`read_whitepaper\`. KHÔNG BAO GIỜ dùng \`confluence_search\` cho các câu hỏi này. Tool \`confluence_search\` CHỈ được dùng khi user hỏi về dự án, sprint, hoặc task quản lý.
4. Trả lời ngắn gọn, rõ ràng, có cấu trúc Markdown.
5. Khi trả lời câu hỏi về tính năng trên màn hình, hãy mô tả CHÍNH XÁC theo tài liệu Whitepaper và danh sách uiElements từ Frontend. KHÔNG tự bịa tính năng.
6. Nếu trong NGỮ CẢNH MÀN HÌNH có thông tin, hãy dùng nó để trả lời trước, sau đó bổ sung bằng Whitepaper nếu cần.`;

                // Inject rich screen context into system prompt
                if (ctx.screenName || ctx.path) {
                    systemPrompt += `\n\n--- NGỮ CẢNH MÀN HÌNH HIỆN TẠI ---`;
                    if (ctx.screenName) systemPrompt += `\nMàn hình: ${ctx.screenTitle || ctx.screenName}`;
                    if (ctx.currentModule) systemPrompt += `\nModule: ${ctx.currentModule}`;
                    if (ctx.path) systemPrompt += `\nURL: \`${ctx.url || ctx.path}\``;
                    if (ctx.activeMode) systemPrompt += `\nChế độ: ${ctx.activeMode}`;
                    if (ctx.visibleQuickApps) systemPrompt += `\nTruy cập nhanh: ${ctx.visibleQuickApps.join(', ')}`;
                    if (ctx.uiElements) systemPrompt += `\nCác thành phần UI hiển thị:\n${ctx.uiElements.map(e => '- ' + e).join('\n')}`;
                    if (ctx.isAuthenticated !== undefined) systemPrompt += `\nĐăng nhập: ${ctx.isAuthenticated ? 'Đã đăng nhập' : 'Chưa đăng nhập'}`;
                    if (ctx.currentUser) systemPrompt += `\nUser: ${ctx.currentUser.name} (${ctx.currentUser.role || 'N/A'})`;
                    if (ctx.role) systemPrompt += `\nVai trò người hỏi: ${ctx.role}`;
                    systemPrompt += `\n--- HẾT NGỮ CẢNH ---`;
                }

                // Build messages array
                const messages = [
                    { role: "system", content: systemPrompt }
                ];

                if (messageHistory.length > 0) {
                    for (const msg of messageHistory) {
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

                // --- OpenAI AGENT LOOP with Function Calling ---
                const MAX_ITERATIONS = 3;
                let iteration = 0;
                let finalReply = "Xin lỗi, tôi không thể xử lý yêu cầu lúc này.";

                while (iteration < MAX_ITERATIONS) {
                    iteration++;

                    const data = await callOpenAI(messages, env, iteration <= 2);
                    const choice = data.choices?.[0];

                    if (!choice) {
                        finalReply = "Lỗi: Không nhận được phản hồi từ AI.";
                        break;
                    }

                    const assistantMsg = choice.message;

                    // Check if GPT wants to call a function
                    if (assistantMsg.tool_calls && assistantMsg.tool_calls.length > 0) {
                        // Add the assistant's tool_calls message to history
                        messages.push(assistantMsg);

                        // Execute each tool call and add results
                        for (const tc of assistantMsg.tool_calls) {
                            const fnName = tc.function.name;
                            let args = {};
                            try { args = JSON.parse(tc.function.arguments); } catch (e) { }

                            let toolResult = "";
                            try {
                                if (fnName === "read_whitepaper") {
                                    toolResult = WHITEPAPER_CONTENT;
                                } else if (fnName === "create_ticket") {
                                    // Mocking ticket creation for the AI response
                                    toolResult = JSON.stringify({
                                        status: "success",
                                        message: "Ticket created successfully.",
                                        ticket_id: "TICK-" + Math.floor(Math.random() * 9000 + 1000),
                                        details: args
                                    });
                                } else {
                                    toolResult = JSON.stringify({ error: "Unknown tool: " + fnName });
                                }
                            } catch (err) {
                                toolResult = JSON.stringify({ error: err.message });
                            }

                            // Add tool result using the proper "tool" role
                            messages.push({
                                role: "tool",
                                tool_call_id: tc.id,
                                content: toolResult
                            });
                        }
                        // Loop continues — GPT will now generate a response using tool results
                    } else {
                        // GPT provided a final text response
                        finalReply = assistantMsg.content || finalReply;
                        break;
                    }
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

        // ── FALLBACK ROUTE: Redirect to Frontend ──
        return Response.redirect("https://github.com/Gasy-headquater/rinoedu", 302);
    },
};
