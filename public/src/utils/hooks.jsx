// src/utils/hooks.jsx
const { useState, useEffect, useCallback, useMemo } = React;

window.Hooks = window.Hooks || {};

/**
 * Hook Quản lý Trạng thái Xác thực (Auth)
 * Thay vì read/write LocalStorage rải rác, toàn bộ hệ thống dùng useAuth()
 */
window.Hooks.useAuth = () => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('rino_user_profile');
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    });

    // Hàm update user session khi vừa đăng nhập xong mà không cần load lại trang
    const refreshUser = useCallback(() => {
        try {
            const saved = localStorage.getItem('rino_user_profile');
            setUser(saved ? JSON.parse(saved) : null);
        } catch { setUser(null); }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('rino_auth_session');
        localStorage.removeItem('rino_auth_token');
        localStorage.removeItem('rino_user_profile');
        setUser(null);
    }, []);

    return { user, isAuthenticated: !!user, logout, refreshUser };
};

/**
 * Hook Cốt lõi của PBAC (Policy-Based Access Control)
 * @param {string} action - Tên hành động (e.g., 'crm:leads:edit', 'education:classes:delete')
 * @param {object} resourceContext - Dữ liệu thực tế để check Ownership (e.g., { ownerId: 'usr_xyz' })
 * @returns {boolean} - true nếu Allow, false nếu Deny hoặc không có quyền.
 */
window.Hooks.usePermission = (action, resourceContext = {}) => {
    const { user } = window.Hooks.useAuth();

    return useMemo(() => {
        // Khách Vãng lai không có user object
        if (!user) return false;

        // Super Admin có quyền sinh sát (Bypass PBAC)
        if (user.role === 'SUPER_ADMIN') return true;

        if (!user.policies || !Array.isArray(user.policies)) return false;

        let isAllowed = false;

        for (const policy of user.policies) {
            // 1. Kiểm tra Action Matcher (Hỗ trợ nhạy cảm * wildcard)
            const actionMatch = policy.action.some(a => {
                if (a === '*') return true;
                if (a.endsWith('*')) {
                    const prefix = a.replace('*', '');
                    return action.startsWith(prefix);
                }
                return a === action;
            });

            if (actionMatch) {
                // 2. Kiểm tra Condition ngặt nghèo (vd: Dữ liệu này có phải do user tạo ra không?)
                let conditionPassed = true;

                if (policy.condition) {
                    // Check luật: "Ai tạo nấy sửa" (isOwner)
                    if (policy.condition.isOwner === true) {
                        if (resourceContext.ownerId && resourceContext.ownerId === user.id) {
                            conditionPassed = true;
                        } else {
                            conditionPassed = false;
                        }
                    }

                    // Bạn có thể design mở rộng luật ở đây (vd: isManager, isDuringWorkingHours...)
                }

                // 3. Quyết định (Effect)
                if (conditionPassed) {
                    if (policy.effect === 'Deny') {
                        return false; // Deny (Chặn) sinh ra là để ghi đè mọi Allow khác
                    }
                    if (policy.effect === 'Allow') {
                        isAllowed = true;
                    }
                }
            }
        }

        return isAllowed;
    }, [user, action, resourceContext]);
};
