/**
 * Rinoapp MCP Worker — Reverse Proxy + AI Endpoint
 * 
 * This Worker serves two purposes:
 * 1. Proxies all web requests to the Cloudflare Tunnel (localhost:3000)
 * 2. Provides AI chat endpoint at /mcp/v1/chat
 */

const TUNNEL_ORIGIN = "https://67abe048-6e57-4883-b4a7-ebff1b1cbba6.cfargotunnel.com";

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

        // AI Chat Endpoint
        if (url.pathname === "/mcp/v1/chat" && request.method === "POST") {
            try {
                const body = await request.json();
                const userMessages = body.messages || [];
                const messages = [
                    { role: "system", content: "You are RinoEdu AI, a helpful, intelligent, and friendly assistant integrated directly into the RinoEdu OS platform. You always answer in Vietnamese unless asked otherwise." },
                    ...userMessages
                ];
                const response = await env.AI.run("@cf/meta/llama-3-8b-instruct", { messages });
                return new Response(JSON.stringify({
                    status: "success",
                    reply: response.response || "Xin lỗi, tôi không thể trả lời lúc này."
                }), {
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                });
            } catch (e) {
                return new Response(JSON.stringify({ error: e.message }), {
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
