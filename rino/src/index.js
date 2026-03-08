const OPENAI_API_URL = "https://api.openai-proxy.com/v1/chat/completions";
const OPENAI_MODEL = "gpt-4o-mini";

import { WHITEPAPER_CONTENT } from "./whitepaper.js";

const openaiTools = [
    {
        type: "function",
        function: {
            name: "read_whitepaper",
            description: "Doc tai lieu sach trang RinoEdu. Luon uu tien goi tool nay khi nguoi dung hoi ve tinh nang, giao dien, module, homepage, dashboard hoac kien truc san pham.",
            parameters: { type: "object", properties: {}, required: [] },
        },
    },
    {
        type: "function",
        function: {
            name: "create_document",
            description: "Tao mot tai lieu whitepaper, guideline, hoac quy trinh moi vao trong he thong Trung tam Tri thuc RinoEdu.",
            parameters: {
                type: "object",
                properties: {
                    title: { type: "string", description: "Tieu de cua tai lieu" },
                    category: { type: "string", description: "Danh muc tai lieu (vi du: Architecture, Development, Process, Security, General)" },
                    content: { type: "string", description: "Noi dung text cua tai lieu duoc dinh dang sang chuan Markdown giup hien thi tot nhat tren giao dien." }
                },
                required: ["title", "category", "content"]
            },
        },
    },
];

async function callOpenAI(messages, env, useTools = true) {
    const body = {
        model: OPENAI_MODEL,
        messages,
        temperature: 0.7,
        max_completion_tokens: 1500,
    };

    if (useTools) {
        body.tools = openaiTools;
        body.tool_choice = "auto";
    }

    const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
    }

    return await response.json();
}

function corsHeaders(extraHeaders = {}) {
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        ...extraHeaders,
    };
}

function jsonResponse(payload, init = {}) {
    return new Response(JSON.stringify(payload), {
        ...init,
        headers: corsHeaders({
            "Content-Type": "application/json",
            ...(init.headers || {}),
        }),
    });
}

function buildSystemPrompt(screenContext) {
    if (screenContext.role === 'admin_doc_generator') {
        return `Bạn là một AI chuyên viết tài liệu kỹ thuật (Technical Writer) của nền tảng RinoEdu.
Nhiệm vụ của bạn là sinh ra các tài liệu Guideline, Whitepaper, Quy trình chuẩn.
YÊU CẦU BẮT BUỘC:
1. BẠN CHỈ ĐƯỢC PHÉP TRẢ VỀ NỘI DUNG MARKDOWN (.md).
2. KHÔNG BAO GỒM BẤT KỲ CÂU GIAO TIẾP NÀO VỚI NGƯỜI DÙNG (Không có "Dưới đây là tài liệu của bạn", không có "Có vẻ như...", không có lời giải thích hay kết luận).
3. LUÔN LUÔN trả lời bằng tiếng Việt.
4. Trình bày bài viết có tính thẩm mỹ, dùng Headers (H1, H2, H3), Bullet points và Bold thật chuyên nghiệp. Bắt đầu ngay lập tức bằng thẻ # Tiêu đề.`;
    }

    // --- DYNAMIC CONTEXT INJECTION FOR DOCUMENT CENTER ---
    if (screenContext.articleId && screenContext.articleContent) {
        return `Bạn là Trợ lý AI chuyên môn giải đáp thắc mắc về tài liệu: "${screenContext.articleTitle || screenContext.articleId}".
YÊU CẦU QUAN TRỌNG:
1. LUÔN LUÔN trả lời bằng tiếng Việt.
2. CHỈ trả lời dựa trên nội dung tài liệu được cung cấp dưới đây. Nếu thông tin không có trong tài liệu, hãy nói rõ là "Tài liệu này không đề cập đến vấn đề đó". Không tự bịa thông tin bên ngoài.
3. Trình bày câu trả lời ngắn gọn, rõ ràng, dùng bullet points nếu cần.

--- NỘI DUNG TÀI LIỆU ---
${screenContext.articleContent}
--- HẾT NỘI DUNG TÀI LIỆU ---`;
    }

    let prompt = `Ban la RinoEdu AI, tro ly cua nen tang quan ly giao duc RinoEdu.

QUY TAC:
1. Luon tra loi bang tieng Viet, gon, ro rang va co cau truc Markdown khi can.
2. Khong lap lai loi chao mac dinh tru khi nguoi dung hoi truc tiep ban la ai.
3. Khi nguoi dung hoi ve tinh nang, man hinh, giao dien, homepage, dashboard, module, kien truc hoac bat ky thong tin nao lien quan den san pham RinoEdu, bat buoc goi tool \`read_whitepaper\`.
4. Khong tu bua tinh nang. Neu khong chac, noi ro gioi han thong tin.
5. Neu co ngu canh man hinh hien tai, uu tien dua tren ngu canh do roi moi bo sung tu whitepaper.
6. Frontend RinoEdu dang duoc deploy tai: https://rinoedu-app.pages.dev`;

    if (screenContext.screenName || screenContext.path) {
        prompt += `\n\n--- NGU CANH MAN HINH HIEN TAI ---`;
        if (screenContext.screenName) prompt += `\nMan hinh: ${screenContext.screenTitle || screenContext.screenName}`;
        if (screenContext.currentModule) prompt += `\nModule: ${screenContext.currentModule}`;
        if (screenContext.path) prompt += `\nURL: \`${screenContext.url || screenContext.path}\``;
        if (screenContext.activeMode) prompt += `\nChe do: ${screenContext.activeMode}`;
        if (screenContext.visibleQuickApps) prompt += `\nTruy cap nhanh: ${screenContext.visibleQuickApps.join(", ")}`;
        if (screenContext.uiElements) prompt += `\nThanh phan UI hien thi:\n${screenContext.uiElements.map((item) => `- ${item}`).join("\n")}`;
        if (screenContext.isAuthenticated !== undefined) prompt += `\nDang nhap: ${screenContext.isAuthenticated ? "Da dang nhap" : "Chua dang nhap"}`;
        if (screenContext.currentUser) prompt += `\nUser: ${screenContext.currentUser.name} (${screenContext.currentUser.role || "N/A"})`;
        if (screenContext.role) prompt += `\nVai tro nguoi hoi: ${screenContext.role}`;
        prompt += `\n--- HET NGU CANH ---`;
    }

    return prompt;
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders() });
        }

        if (url.pathname === "/mcp/v1/ping") {
            return jsonResponse({ status: "ok", message: "MCP alive" });
        }

        if (url.pathname === "/api/integrations/status" && request.method === "GET") {
            return jsonResponse({
                status: "success",
                integrations: {
                    openai: Boolean(env.OPENAI_API_KEY),
                    whitepaper: Boolean(WHITEPAPER_CONTENT),
                    model: OPENAI_MODEL,
                },
            });
        }

        if (url.pathname === "/mcp/v1/chat" && request.method === "POST") {
            try {
                const body = await request.json();
                const screenContext = body.context || {};
                const messageHistory = Array.isArray(body.messages) ? body.messages : [];
                const userQuery = body.message || "";

                const messages = [{ role: "system", content: buildSystemPrompt(screenContext) }];

                if (messageHistory.length > 0) {
                    for (const message of messageHistory) {
                        if (message.role !== "system") {
                            messages.push({
                                role: message.role === "ai" ? "assistant" : "user",
                                content: message.content,
                            });
                        }
                    }
                } else {
                    messages.push({ role: "user", content: userQuery });
                }

                const maxIterations = 3;
                let iteration = 0;
                let finalReply = "Xin loi, toi khong the xu ly yeu cau luc nay.";

                while (iteration < maxIterations) {
                    iteration += 1;
                    const data = await callOpenAI(messages, env, iteration <= 2);
                    const choice = data.choices?.[0];

                    if (!choice) {
                        finalReply = "Loi: khong nhan duoc phan hoi tu AI.";
                        break;
                    }

                    const assistantMessage = choice.message;

                    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
                        messages.push(assistantMessage);

                        for (const toolCall of assistantMessage.tool_calls) {
                            let toolResult = "";

                            try {
                                if (toolCall.function.name === "read_whitepaper") {
                                    toolResult = WHITEPAPER_CONTENT;
                                } else if (toolCall.function.name === "create_document") {
                                    let args = {};
                                    try {
                                        args = JSON.parse(toolCall.function.arguments);
                                    } catch (e) { }
                                    return jsonResponse({
                                        reply: `Tuyệt vời! Tôi đã tạo xong tài liệu **"${args.title || 'Không tên'}"**. Bạn có thể xem nó ngay trong danh sách bên trái.`,
                                        action: { type: "ADD_DOCUMENT", data: args }
                                    });
                                } else {
                                    toolResult = JSON.stringify({ error: `Unknown tool: ${toolCall.function.name}` });
                                }
                            } catch (error) {
                                toolResult = JSON.stringify({ error: error.message });
                            }

                            messages.push({
                                role: "tool",
                                tool_call_id: toolCall.id,
                                content: toolResult,
                            });
                        }

                        continue;
                    }

                    finalReply = assistantMessage.content || finalReply;
                    break;
                }

                return jsonResponse({
                    status: "success",
                    reply: finalReply,
                });
            } catch (error) {
                console.error("Rino chat worker error:", error);
                return jsonResponse({ status: "error", error: "Internal server error" }, { status: 500 });
            }
        }

        return new Response("RinoEdu AI API Server", {
            status: 200,
            headers: corsHeaders({ "Content-Type": "text/plain; charset=utf-8" }),
        });
    },
};
