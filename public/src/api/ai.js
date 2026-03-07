// src/api/ai.js — RinoEdu AI Assistant v2.0
// Smart mock with streaming effect + Tool Calling (Quick Actions)
// To connect a real backend, replace the sendMessage() body with a real fetch().

; (function () {

    // ─── TOOL CALLING: Quick Actions ────────────────────────────────────────
    const TOOLS = {
        navigate: (moduleId) => {
            if (window.dispatchEvent) {
                window.dispatchEvent(new CustomEvent('ai-navigate', { detail: { moduleId } }));
            }
            return `✅ Đã mở module: **${moduleId}**`;
        },
        toggleTheme: () => {
            if (window.dispatchEvent) {
                window.dispatchEvent(new CustomEvent('ai-toggle-theme'));
            }
            return '✅ Đã chuyển đổi chế độ Sáng/Tối.';
        },
        getData: (key) => {
            const data = window.Data;
            if (!data) return '⚠️ Không tìm thấy dữ liệu hệ thống.';

            switch (key) {
                case 'branches': {
                    const branches = data.BRANCH_LIST_DETAILED || data.MOCK_BRANCHES || [];
                    if (!branches.length) return 'Chưa có dữ liệu chi nhánh.';
                    let result = '**Danh sách Chi nhánh/Cơ sở:**\n\n';
                    branches.forEach((b, i) => {
                        result += `${i + 1}. **${b.name}** (${b.code || b.location || ''}) — ${b.status || 'N/A'}\n`;
                        if (b.address) result += `   📍 ${b.address}\n`;
                        if (b.manager) result += `   👤 Quản lý: ${b.manager}\n`;
                    });
                    return result;
                }
                case 'classes': {
                    const classes = data.MOCK_CLASSES || [];
                    if (!classes.length) return 'Chưa có dữ liệu lớp học.';
                    let result = '**Danh sách Lớp học đang hoạt động:**\n\n';
                    classes.forEach((c, i) => {
                        result += `${i + 1}. **${c.name}** (${c.code}) — ${c.status}\n`;
                        result += `   📅 ${c.schedule} | 👥 ${c.students} HV | 📊 ${c.progress}%\n`;
                    });
                    return result;
                }
                case 'teachers': {
                    const teachers = data.MOCK_TEACHERS || [];
                    if (!teachers.length) return 'Chưa có dữ liệu giáo viên.';
                    let result = '**Danh sách Giáo viên:**\n\n';
                    teachers.forEach((t, i) => {
                        result += `${i + 1}. **${t.name}** — ${t.subject} (${t.branch})\n`;
                        result += `   ⏱ ${t.hours}h/tuần | ${t.status}\n`;
                    });
                    return result;
                }
                case 'org': {
                    const org = data.ORGANIZATION_INFO;
                    if (!org) return 'Chưa có dữ liệu tổ chức.';
                    return `**Thông tin Tổ chức:**\n\n` +
                        `• Tên: **${org.name}**\n` +
                        `• Website: ${org.website}\n` +
                        `• Email: ${org.email}\n` +
                        `• Điện thoại: ${org.phone}\n` +
                        `• Trụ sở: ${org.headquarters}\n` +
                        `• MST: ${org.taxCode}\n` +
                        `• Ngôn ngữ: ${org.language} | Múi giờ: ${org.timezone}`;
                }
                default:
                    return `⚠️ Không nhận diện được key dữ liệu: "${key}"`;
            }
        }
    };

    // ─── KNOWLEDGE BASE (Expanded v2.0) ─────────────────────────────────────
    const KB = [
        // Greetings
        {
            kw: ['xin chào', 'chào', 'hello', 'hi', 'hey', 'alo', 'bạn là ai', 'bạn tên gì', 'giới thiệu'],
            reply: `Xin chào! Tôi là **RinoEdu AI** – trợ lý thông minh tích hợp vào nền tảng RinoEdu.

Tôi hiểu toàn bộ hệ thống: từ quản lý học viên, lớp học, giáo viên, cho đến tổ chức và vận hành trung tâm.

💡 **Tôi có thể thực hiện hành động thực:**
• Gõ "mở dashboard" → tôi sẽ điều hướng cho bạn
• Gõ "danh sách lớp" → tôi truy xuất dữ liệu thực
• Gõ "đổi theme" → tôi chuyển Dark/Light mode

Bạn cần tôi hỗ trợ gì?`
        },

        // Tool: Navigate
        {
            kw: ['mở dashboard', 'vào dashboard', 'đi tới dashboard'],
            reply: null,
            action: () => TOOLS.navigate('dashboard')
        },
        {
            kw: ['mở quản lý tài khoản', 'mở account', 'vào tài khoản', 'mở iam'],
            reply: null,
            action: () => TOOLS.navigate('account_manager')
        },
        {
            kw: ['mở quản lý đào tạo', 'mở education', 'vào đào tạo', 'mở giảng dạy'],
            reply: null,
            action: () => TOOLS.navigate('class_manager')
        },
        {
            kw: ['mở trang chủ', 'vào trang chủ', 'về trang chủ', 'mở home'],
            reply: null,
            action: () => TOOLS.navigate('square_home')
        },

        // Tool: Theme toggle
        {
            kw: ['đổi theme', 'dark mode', 'light mode', 'chế độ tối', 'chế độ sáng', 'đổi màu nền'],
            reply: null,
            action: () => TOOLS.toggleTheme()
        },

        // Tool: Get Data
        {
            kw: ['danh sách chi nhánh', 'xem chi nhánh', 'cơ sở', 'có bao nhiêu chi nhánh', 'liệt kê chi nhánh'],
            reply: null,
            action: () => TOOLS.getData('branches')
        },
        {
            kw: ['danh sách lớp', 'xem lớp học', 'có bao nhiêu lớp', 'lớp đang hoạt động', 'liệt kê lớp'],
            reply: null,
            action: () => TOOLS.getData('classes')
        },
        {
            kw: ['danh sách giáo viên', 'xem giáo viên', 'có bao nhiêu gv', 'liệt kê giáo viên'],
            reply: null,
            action: () => TOOLS.getData('teachers')
        },
        {
            kw: ['thông tin tổ chức', 'xem tổ chức', 'tên công ty', 'thông tin công ty', 'org info'],
            reply: null,
            action: () => TOOLS.getData('org')
        },

        // Học viên / Students
        {
            kw: ['học viên', 'học sinh', 'student', 'danh sách học viên', 'tìm học viên', 'hồ sơ học viên'],
            reply: `**Quản lý học viên** trong RinoEdu:

• Vào module **Quản lý Đào tạo** → tab Học viên
• Tìm theo tên, mã học viên, lớp, hoặc trạng thái (đang học / bảo lưu / tốt nghiệp)
• Xem hồ sơ chi tiết: thông tin cá nhân, lịch sử học, điểm danh, học phí đã đóng
• Xuất danh sách ra Excel / PDF để báo cáo

💡 Gõ **"mở quản lý đào tạo"** để tôi mở module cho bạn!`
        },

        // Lớp học / Classes
        {
            kw: ['lớp học', 'class', 'lịch học', 'thời khóa biểu', 'khai giảng', 'lớp mới'],
            reply: `**Quản lý lớp học** trong RinoEdu:

• Module **Quản lý Giảng dạy** cho phép tạo, chỉnh sửa và theo dõi lớp học
• Mỗi lớp có: Tên lớp, giáo viên phụ trách, học viên, lịch học, phòng học
• Xem thời khóa biểu theo ngày/tuần/tháng
• Điểm danh trực tiếp từ giao diện lớp học
• Quản lý trạng thái: Đang hoạt động / Sắp khai giảng / Đã kết thúc

💡 Gõ **"danh sách lớp"** để tôi truy xuất dữ liệu thực cho bạn!`
        },

        // Giáo viên / Teachers
        {
            kw: ['giáo viên', 'giảng viên', 'teacher', 'phân công', 'thời gian dạy', 'lịch dạy'],
            reply: `**Quản lý giáo viên** trong RinoEdu:

• Hồ sơ giáo viên: thông tin cá nhân, chuyên môn, lịch sử giảng dạy
• Phân công giảng dạy: gán giáo viên vào lớp với thời gian cụ thể
• Xem lịch dạy của từng giáo viên theo tuần
• Theo dõi số giờ dạy để tính lương/thù lao

💡 Gõ **"danh sách giáo viên"** để xem danh sách trực tiếp!`
        },

        // Học phí / Payments
        {
            kw: ['học phí', 'thanh toán', 'payment', 'đóng tiền', 'công nợ', 'hóa đơn', 'biên lai', 'nợ học phí'],
            reply: `**Quản lý học phí** trong RinoEdu:

• Xem trạng thái học phí từng học viên: Đã thanh toán / Còn nợ / Quá hạn
• Tạo phiếu thu và biên lai tự động (PDF)
• Cấu hình nhắc nhở học phí tự động (email/SMS)
• Báo cáo doanh thu: theo ngày, tuần, tháng, hoặc theo lớp học
• Hỗ trợ nhiều hình thức thanh toán: tiền mặt, chuyển khoản, ví điện tử`
        },

        // Báo cáo / Reports
        {
            kw: ['báo cáo', 'thống kê', 'report', 'doanh thu', 'kpi', 'số liệu', 'tổng kết'],
            reply: `**Báo cáo & Thống kê** trong RinoEdu:

• **Dashboard**: tổng quan số liệu theo thời gian thực
• Báo cáo học viên: số lượng đang học, tỷ lệ hoàn thành, dropout rate
• Báo cáo tài chính: doanh thu, chi phí, lợi nhuận theo tháng/quý
• Báo cáo giảng dạy: tỷ lệ điểm danh, hiệu suất lớp học
• Tất cả có thể xuất ra Excel/PDF`
        },

        // Điểm danh
        {
            kw: ['điểm danh', 'attendance', 'vắng mặt', 'buổi học', 'chuyên cần'],
            reply: `**Điểm danh** trong RinoEdu:

• Điểm danh trực tiếp khi vào lớp: giáo viên tick từng học viên
• Lịch sử điểm danh: xem học viên vắng bao nhiêu buổi
• Tỷ lệ chuyên cần: tự động tính % và cảnh báo khi dưới ngưỡng`
        },

        // Cài đặt
        {
            kw: ['cài đặt', 'setting', 'cấu hình', 'config', 'phân quyền', 'quyền hạn', 'admin'],
            reply: `**Cài đặt hệ thống** RinoEdu:

• Quản lý tài khoản → Cài đặt chung (Dark Mode, Ngôn ngữ, Múi giờ)
• Cài đặt nền tảng → Org Profile, Chi nhánh, Theme Color
• Quản trị Hệ thống → Users, Logs, Webhooks

💡 Gõ **"mở quản lý tài khoản"** để tôi đưa bạn đến ngay!`
        },

        // Tìm kiếm
        {
            kw: ['tìm kiếm', 'search', 'tìm', 'ctrl+k'],
            reply: `**Tìm kiếm toàn hệ thống** RinoEdu:

• Nhấn **Ctrl+K** để mở nhanh
• Tìm được: ứng dụng, tài liệu, thành viên
• Hỗ trợ fuzzy search — không cần gõ đúng 100%
• Hoặc dùng **RinoEdu AI** (tôi!) để hỏi bằng ngôn ngữ tự nhiên.`
        },

        // Workspace / Dashboard
        {
            kw: ['workspace', 'dashboard', 'không gian làm việc', 'vào dashboard'],
            reply: `**Workspace Dashboard** là trung tâm điều hành của RinoEdu:

• Tổng quan: thời tiết, lịch hôm nay, truy cập nhanh
• Sidebar bên trái: điều hướng đến tất cả modules
• Mỗi module là một ứng dụng độc lập

💡 Gõ **"mở dashboard"** để tôi đưa bạn đến ngay!`
        },

        // Đăng nhập
        {
            kw: ['đăng nhập', 'login', 'quên mật khẩu', 'đăng ký', 'tài khoản'],
            reply: `**Đăng nhập vào RinoEdu**:

• Nhấn nút **Đăng nhập** ở góc trên phải trang chủ
• Nhập email và mật khẩu, hoặc đăng nhập bằng Google
• Quên mật khẩu: nhấn "Quên mật khẩu" → nhận link reset qua email
• Hệ thống có 3 cấp quyền: **Quản trị viên** / **Giáo viên** / **Nhân viên**`
        },

        // Kho tài sản
        {
            kw: ['kho', 'warehouse', 'tài liệu', 'file', 'tài nguyên', 'lưu trữ', 'upload'],
            reply: `**Kho AI & Tài nguyên** là nơi lưu trữ tài liệu cho RinoEdu AI:

• Upload tài liệu (PDF, Word, Excel) để AI tham khảo
• Tổ chức theo thư mục
• Tính năng upload đang trong lộ trình, hiện hiển thị tài liệu mẫu.`
        },

        // Coding
        {
            kw: ['code', 'coding', 'lập trình', 'tạo code', 'generate', 'script'],
            reply: `**Chế độ Coding** của RinoEdu AI:

• Bật bằng nút **"Coding"** trong thanh chế độ
• Yêu cầu AI tạo: giao diện HTML, script xử lý, công thức báo cáo
• Preview tab: xem trực tiếp kết quả; Code tab: xem source code`
        },

        // Help
        {
            kw: ['giúp', 'hướng dẫn', 'help', 'hỗ trợ', 'sử dụng', 'cách', 'làm sao', 'như thế nào'],
            reply: `Tôi có thể hỗ trợ bạn về bất kỳ chủ đề nào liên quan đến RinoEdu:

**📋 Hỏi thông tin:** hỏi về học viên, lớp học, giáo viên, học phí, cài đặt...
**🚀 Thực hiện hành động:** "mở dashboard", "đổi theme", "danh sách lớp"
**📊 Truy xuất dữ liệu:** "danh sách chi nhánh", "thông tin tổ chức"

Hãy hỏi tôi bất cứ điều gì!`
        },
    ];

    const FALLBACK = [
        'Câu hỏi hay! Bạn có thể hỏi cụ thể hơn về: học viên, lớp học, giáo viên, cài đặt, chi nhánh? Hoặc gõ **"help"** để xem danh sách tính năng.',
        'Tôi chưa có thông tin cụ thể về điều đó. Gõ **"danh sách lớp"** hoặc **"thông tin tổ chức"** để tôi truy xuất dữ liệu thực cho bạn!',
        'Tôi là RinoEdu AI v2.0 — giờ đây tôi có thể thực hiện hành động thực! Gõ **"mở dashboard"**, **"đổi theme"**, hoặc **"danh sách chi nhánh"** để trải nghiệm.',
    ];

    function findReply(msg) {
        const lower = msg.toLowerCase();
        for (const entry of KB) {
            if (entry.kw.some(k => lower.includes(k))) {
                // Tool Calling: execute action and return result
                if (entry.action) {
                    return entry.action();
                }
                return entry.reply;
            }
        }
        return FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
    }

    async function streamText(text, onChunk) {
        const tokens = text.split(/(\s+)/);
        for (const token of tokens) {
            if (!token) continue;
            onChunk(token);
            const isPunct = /[.!?,\n]$/.test(token.trim());
            await new Promise(r => setTimeout(r, isPunct ? 70 : 20 + Math.random() * 20));
        }
    }

    window.RinoAI = {
        /**
         * @param {string}   userMessage
         * @param {Function} onChunk   - called with each text chunk
         * @param {Function} onDone    - called when done
         * @param {Function} onError   - called with error string
         */
        async sendMessage(userMessage, onChunk, onDone, onError) {
            try {
                await new Promise(r => setTimeout(r, 500 + Math.random() * 400));
                const reply = findReply(userMessage);
                await streamText(reply, onChunk);
                onDone && onDone();
            } catch (err) {
                onError && onError('Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.');
            }
        }
    };

})();
