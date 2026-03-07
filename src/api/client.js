// src/api/client.js
const API_BASE = "https://rinoapp-mcp.gasy.one/api"; // will be served by Cloudflare Workers

/**
 * Global API Request handler mimicking Axios Interceptors.
 * Automatically handles JWT injection and Global error boundaries (401, 403, 500).
 */
export async function apiRequest(path, options = {}) {
    const url = `${API_BASE}${path}`;

    // Inject Authorization Token if available
    const token = localStorage.getItem('rino_access_token');
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        // Xử lý Global Errors (Interceptors)
        if (!response.ok) {
            if (response.status === 401) {
                console.warn("[API Interceptor] 401 Unauthorized - Hết hạn token. Redirect về Login...");
                // Emit event to logout user globally
                window.dispatchEvent(new Event('rino_unauthorized'));
            }
            if (response.status === 403) {
                console.error("[API Interceptor] 403 Forbidden - Bạn không có quyền truy cập module này.");
            }
            if (response.status >= 500) {
                console.error("[API Interceptor] 500 Internal Server Error - Lỗi Backend kết nối.");
            }

            const errText = await response.text();
            throw new Error(`API error ${response.status}: ${errText}`);
        }

        // Return parsed JSON (or empty object if no body)
        return response.status === 204 ? {} : await response.json();
    } catch (error) {
        // Có thể bổ sung Toast Notification ở đây (ví dụ gọi window.showToast(error.message))
        throw error;
    }
}

// Example placeholder endpoint – replace with real ones as needed
export async function getCurrentUser() {
    return apiRequest("/user/me", { method: "GET" });
}
