// src/api/client.js
const API_BASE = "https://rinoapp-mcp.gasy.one/api"; // will be served by Cloudflare Workers

export async function apiRequest(path, options = {}) {
    const url = `${API_BASE}${path}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(`API error ${response.status}: ${err}`);
    }
    return response.json();
}

// Example placeholder endpoint – replace with real ones as needed
export async function getCurrentUser() {
    return apiRequest("/user/me", { method: "GET" });
}
