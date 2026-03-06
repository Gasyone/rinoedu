const str = `Tôi xin lỗi, nhưng tôi không thể thực hiện được yêu cầu này vì tôi không có quyền truy cập vào tài liệu Confluence.
{"name": "confluence_search", "arguments": {"query": "tài liệu và workspace"}}`;

let toolCalls = [];
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

console.log("Extracted Tool Calls:", toolCalls);

let cleanedReply = str.replace(/{"name":\s*"[^"]+",\s*"arguments":\s*{[^}]*}}/g, "").trim();
console.log("Cleaned Text:", cleanedReply);
