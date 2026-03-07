// js/api/mock_auth.js

/**
 * Identity & Access Management (IAM) Mock Server
 * Mô phỏng toàn bộ hoạt động của IAM Cấp JWT và PBAC (Policy-Based Access Control)
 */

window.API = window.API || {};

// Database Ảo của Identity Center
const MOCK_USERS_DB = [
    {
        id: 'usr_rinohq_001',
        email: 'admin@rinoedu.com',
        password: 'Password123!',
        name: 'Trần Super Admin',
        role: 'SUPER_ADMIN',
        unit_id: 'GLOBAL_HQ',
        avatar: 'AD',
        // Gắn Policy Quyền Lực Tuyệt Đối
        policies: [
            { effect: 'Allow', action: ['*'], resource: 'arn:rinoedu:*' }
        ]
    },
    {
        id: 'usr_branch_002',
        email: 'teacher@rinoedu.com',
        password: 'Password123!',
        name: 'Giáo Viên A',
        role: 'TEACHER',
        unit_id: 'BRANCH_HN_CAUGIAY',
        avatar: 'TA',
        // Policy: Chỉ xem lớp mình dạy, không được quản trị user
        policies: [
            { effect: 'Allow', action: ['education:classes:read', 'education:attendance:create'], resource: 'arn:rinoedu:education:branch_hn_caugiay:*' },
            { effect: 'Deny', action: ['iam:*', 'crm:*'], resource: '*' } // Cấm module khác
        ]
    },
    {
        id: 'usr_sales_003',
        email: 'sales@rinoedu.com',
        password: 'Password123!',
        name: 'Nguyễn Văn Sales',
        role: 'STAFF',
        unit_id: 'PHONG_TUYENSINH_01',
        avatar: 'NS',
        // Policy: Chỉ xem/sửa Lead DO MÌNH TẠO (isOwner = true)
        policies: [
            { effect: 'Allow', action: ['crm:leads:read', 'crm:leads:create'], resource: 'arn:rinoedu:crm:phong_tuyensinh_01:*' },
            { effect: 'Allow', action: ['crm:leads:edit', 'crm:leads:delete'], resource: 'arn:rinoedu:crm:phong_tuyensinh_01:*', condition: { isOwner: true } }
        ]
    }
];

// Helper: Phản hồi mạng bị trễ ảo (Simulate network delay)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

window.API.MockAuth = {
    /**
     * Intelligent Flow: Khách hàng gõ Email, kiểm tra xem đã tồn tại chưa
     * Nếu tồn tại -> Đưa ra form nhập pass
     * Nếu không -> Đưa ra form đăng ký (Tạo password mới)
     */
    checkEmail: async (email) => {
        await delay(800); // Mạng ảo
        const user = MOCK_USERS_DB.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
            return { status: 200, isExist: true, message: 'Welcome back' };
        } else {
            return { status: 200, isExist: false, message: 'User not found, switch to Setup mode' };
        }
    },

    /**
     * API Login truyền thống (Email + Pass)
     */
    login: async (email, password) => {
        await delay(1200);
        const user = MOCK_USERS_DB.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

        if (!user) {
            throw new Error("Tài khoản hoặc mật khẩu không chính xác.");
        }

        // Tạo JWT Token giả (Tích hợp PBAC Policies vào Payload)
        const mockJwtToken = "eyMockToken_" + Math.random().toString(36).substr(2, 9);

        // Loại bỏ trường password khi trả về UserProfile
        const { password: _, ...safeProfile } = user;

        return {
            status: 200,
            token: mockJwtToken,
            user: safeProfile
        };
    },

    /**
     * Đăng ký tài khoản (Tạo account Rino Mới)
     */
    register: async (email, password) => {
        await delay(1500);

        const exist = MOCK_USERS_DB.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (exist) throw new Error("Email đã tồn tại trên hệ thống.");

        // Thêm vào DB ảo
        const newUser = {
            id: 'usr_new_' + Math.random().toString(36).substr(2, 6),
            email: email,
            name: email.split('@')[0], // Extract từ email
            password: password,
            role: 'CUSTOMER_OR_GUEST',
            unit_id: 'EXTERNAL', // Người ngoài hệ thống nội bộ
            avatar: email.charAt(0).toUpperCase(),
            policies: [] // Mặc định không có quyền (Guest)
        };

        MOCK_USERS_DB.push(newUser);

        // Trả kết quả kèm Auto-Login Token
        const mockJwtToken = "eyMockToken_" + Math.random().toString(36).substr(2, 9);
        const { password: _, ...safeProfile } = newUser;

        return {
            status: 201,
            token: mockJwtToken,
            user: safeProfile
        };
    },

    /**
     * Gửi mã OTP xác thực email (Forgot Pass)
     */
    sendOTP: async (email) => {
        await delay(1000);
        const exist = MOCK_USERS_DB.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!exist) throw new Error("Không tìm thấy email đăng ký RinoEdu.");

        // Giả lập gửi Email thành công
        return { status: 200, message: "Mã OTP 6 số (999999) đã được gửi đến thiết bị." };
    },

    /**
     * Verify OTP (Mock luôn luôn nhận mã 999999 là đúng)
     */
    verifyOTP: async (email, otpCode) => {
        await delay(1000);
        if (otpCode === '999999') {
            return { status: 200, resetToken: "Vld_Reset_Tk_" + Math.random() };
        } else {
            throw new Error("Mã OTP không hợp lệ hoặc đã hết hạn.");
        }
    },

    /**
     * Reset Password Mới
     */
    resetPassword: async (resetToken, newPassword) => {
        await delay(1000);
        if (!resetToken) throw new Error("Token đã hết hạn, vui lòng xin lại OTP.");
        // Ở thực tế BE sẽ lookup DB, ở đây Mock Fake trả về Success
        return { status: 200, message: "Đổi mật khẩu thành công." };
    },

    /**
     * Google Login bằng One Tap / SDK Mock
     */
    loginGoogleMock: async () => {
        await delay(2000); // Giả lập cửa sổ Google Loading

        // Trả về một tài khoản mặc định coi như login GG thành công
        const mockGgProfile = {
            id: 'usr_gg_' + Math.random(),
            email: 'google.guest@mymail.com',
            name: 'Google User',
            role: 'CUSTOMER_OR_GUEST',
            unit_id: 'EXTERNAL',
            avatar: 'G',
            policies: []
        };

        return {
            status: 200,
            token: "eyMockGoogle_" + Math.random().toString(36).substr(2, 9),
            user: mockGgProfile
        };
    }
};
