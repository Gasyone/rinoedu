// src/api/ai.js — RinoEdu AI Assistant
// Smart mock with streaming effect + comprehensive RinoEdu system knowledge.
// To connect a real backend, replace the sendMessage() body with a real fetch().

; (function () {

    // ─── KNOWLEDGE BASE ───────────────────────────────────────────────────────
    // A rich set of Q&A pairs about the RinoEdu platform.
    const KB = [
        // Greetings
        {
            kw: ['xin chào', 'chào', 'hello', 'hi', 'hey', 'alo', 'bạn là ai', 'bạn tên gì', 'giới thiệu'],
            reply: `Xin chào! Tôi là **RinoEdu AI** – trợ lý thông minh được tích hợp vào nền tảng RinoEdu.

Tôi hiểu toàn bộ hệ thống: từ quản lý học viên, lớp học, giáo viên, cho đến báo cáo tài chính và vận hành trung tâm.

Bạn cần tôi hỗ trợ gì?`
        },

        // Học viên / Students
        {
            kw: ['học viên', 'học sinh', 'student', 'danh sách học viên', 'tìm học viên', 'hồ sơ học viên'],
            reply: `**Quản lý học viên** trong RinoEdu:

• Vào module **Quản lý Đào tạo** → tab Học viên
• Tìm theo tên, mã học viên, lớp, hoặc trạng thái (đang học / bảo lưu / tốt nghiệp)
• Xem hồ sơ chi tiết: thông tin cá nhân, lịch sử học, điểm danh, học phí đã đóng
• Xuất danh sách ra Excel / PDF để báo cáo

Bạn muốn tìm học viên nào, hay cần thêm thông tin về tính năng nào?`
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

Cần hướng dẫn tạo lớp mới hay xem lịch cụ thể không?`
        },

        // Giáo viên / Teachers
        {
            kw: ['giáo viên', 'giảng viên', 'teacher', 'phân công', 'thời gian dạy', 'lịch dạy'],
            reply: `**Quản lý giáo viên** trong RinoEdu:

• Hồ sơ giáo viên: thông tin cá nhân, chuyên môn, lịch sử giảng dạy
• Phân công giảng dạy: gán giáo viên vào lớp với thời gian cụ thể
• Xem lịch dạy của từng giáo viên theo tuần
• Theo dõi số giờ dạy để tính lương/thù lao (tích hợp module vận hành)
• Đánh giá hiệu suất: tỷ lệ điểm danh lớp, feedback học viên

Bạn cần thông tin về giáo viên nào, hay hướng dẫn phân công lớp?`
        },

        // Học phí / Payments
        {
            kw: ['học phí', 'thanh toán', 'payment', 'đóng tiền', 'công nợ', 'hóa đơn', 'biên lai', 'nợ học phí'],
            reply: `**Quản lý học phí** trong RinoEdu:

• Xem trạng thái học phí từng học viên: Đã thanh toán / Còn nợ / Quá hạn
• Tạo phiếu thu và biên lai tự động (PDF)
• Cấu hình nhắc nhở học phí tự động (email/SMS)
• Báo cáo doanh thu: theo ngày, tuần, tháng, hoặc theo lớp học
• Hỗ trợ nhiều hình thức thanh toán: tiền mặt, chuyển khoản, ví điện tử

Bạn muốn xem công nợ của ai, hay cần xuất báo cáo doanh thu?`
        },

        // Báo cáo / Reports
        {
            kw: ['báo cáo', 'thống kê', 'report', 'doanh thu', 'dashboard', 'kpi', 'số liệu', 'tổng kết'],
            reply: `**Báo cáo & Thống kê** trong RinoEdu:

• **Workspace Dashboard**: tổng quan số liệu theo thời gian thực
• Báo cáo học viên: số lượng đang học, tỷ lệ hoàn thành, dropout rate
• Báo cáo tài chính: doanh thu, chi phí, lợi nhuận theo tháng/quý
• Báo cáo giảng dạy: tỷ lệ điểm danh, hiệu suất lớp học
• Báo cáo tuyển sinh: nguồn học viên, tỷ lệ chuyển đổi

Tất cả có thể xuất ra Excel/PDF. Cần báo cáo loại nào?`
        },

        // Điểm danh / Attendance
        {
            kw: ['điểm danh', 'attendance', 'vắng mặt', 'buổi học', 'chuyên cần'],
            reply: `**Điểm danh** trong RinoEdu:

• Điểm danh trực tiếp khi vào lớp: giáo viên tick từng học viên
• Hỗ trợ điểm danh offline và đồng bộ sau khi có mạng
• Lịch sử điểm danh: xem học viên vắng bao nhiêu buổi, buổi nào nghỉ
• Tỷ lệ chuyên cần: tự động tính % và cảnh báo khi dưới ngưỡng cho phép
• Phụ huynh nhận thông báo khi học viên vắng (nếu cấu hình)

Cần hướng dẫn điểm danh hay xem danh sách vắng mặt gần đây?`
        },

        // Cài đặt / Settings
        {
            kw: ['cài đặt', 'setting', 'cấu hình', 'config', 'thay đổi', 'phân quyền', 'quyền hạn', 'admin'],
            reply: `**Cài đặt hệ thống** RinoEdu:

• Truy cập: User Menu (góc trên phải) → Cài đặt
• Thông tin trung tâm: tên, địa chỉ, logo, liên hệ
• Quản lý tài khoản người dùng và phân quyền (Admin / Giáo viên / Nhân viên)
• Cấu hình thông báo: email, SMS, hay push notification
• Ngôn ngữ và múi giờ hệ thống
• Kết nối cổng thanh toán và mạng xã hội

Bạn cần cấu hình phần nào?`
        },

        // Tìm kiếm / Search
        {
            kw: ['tìm kiếm', 'search', 'tìm', 'ctrl+k'],
            reply: `**Tìm kiếm toàn hệ thống** RinoEdu:

• Nhấn vào thanh tìm kiếm hoặc bấm **Ctrl+K** để mở nhanh
• Tìm được: học viên, giáo viên, lớp học, tài liệu, báo cáo, cài đặt
• Hỗ trợ tìm kiếm mờ (fuzzy search) – không cần gõ đúng hoàn toàn
• Kết quả được phân loại: Ứng dụng / Tài liệu / Mọi người

Hoặc dùng **RinoEdu AI** (tôi!) để hỏi bất cứ điều gì bằng ngôn ngữ tự nhiên.`
        },

        // Workspace / Dashboard
        {
            kw: ['workspace', 'dashboard', 'không gian làm việc', 'vào dashboard', 'navigat'],
            reply: `**Workspace Dashboard** là trung tâm điều hành của RinoEdu:

• Truy cập bằng nút **Dashboard** ở góc trên phải (khi đã đăng nhập)
• Tại đây bạn thấy: tổng quan học viên, lịch học hôm nay, thông báo mới, doanh thu nhanh
• Sidebar bên trái: điều hướng đến tất cả modules
• Mỗi module là một ứng dụng độc lập: Quản lý Đào tạo, Giảng dạy, Tài khoản...

Bạn đang cố truy cập phần nào?`
        },

        // Đăng nhập / Login
        {
            kw: ['đăng nhập', 'login', 'quên mật khẩu', 'đăng ký', 'tài khoản'],
            reply: `**Đăng nhập vào RinoEdu**:

• Nhấn nút **Đăng nhập** ở góc trên phải trang chủ
• Nhập email và mật khẩu được cấp bởi quản trị viên trung tâm
• Nếu quên mật khẩu: nhấn "Quên mật khẩu" → nhận link reset qua email

Lưu ý: Hệ thống có 3 cấp quyền: **Quản trị viên** / **Giáo viên** / **Nhân viên**. Mỗi cấp thấy các chức năng khác nhau.

Bạn gặp vấn đề gì khi đăng nhập?`
        },

        // Kho tài sản / Warehouse
        {
            kw: ['kho', 'warehouse', 'tài liệu', 'file', 'tài nguyên', 'lưu trữ', 'upload'],
            reply: `**Kho AI & Tài nguyên** là nơi lưu trữ tài liệu cho RinoEdu AI:

• Mở bằng nút **Kho tài sản** trong thanh công cụ AI, hoặc từ biểu tượng Server trong canvas
• Upload tài liệu (PDF, Word, Excel, hình ảnh) để AI có thể tham khảo
• Tổ chức theo thư mục
• AI có thể đọc tài liệu bạn upload để trả lời chính xác hơn về nội dung cụ thể của trung tâm

Tính năng upload thực sự đang trong lộ trình phát triển. Hiện tại kho hiển thị các tài liệu mẫu.`
        },

        // Coding / AI tools
        {
            kw: ['code', 'coding', 'lập trình', 'tạo code', 'generate', 'script'],
            reply: `**Chế độ Coding** của RinoEdu AI:

• Bật bằng nút **"Coding"** trong thanh chế độ (khi đang ở AI mode)
• Canvas Code/Preview sẽ xuất hiện bên dưới
• Bạn có thể yêu cầu AI tạo: giao diện HTML, script xử lý dữ liệu, công thức báo cáo...
• Preview tab: xem trực tiếp kết quả; Code tab: xem source code

Hiện tại AI đang ở chế độ smart mock. Hãy bật Coding và đặt yêu cầu cụ thể!`
        },

        // Help / General
        {
            kw: ['giúp', 'hướng dẫn', 'help', 'hỗ trợ', 'sử dụng', 'cách', 'làm sao', 'như thế nào'],
            reply: `Tôi có thể hỗ trợ bạn về bất kỳ chủ đề nào liên quan đến RinoEdu:

**Quản lý học vụ:**
• 👤 Học viên – hồ sơ, điểm danh, tiến độ học tập
• 📚 Lớp học – khai giảng, thời khóa biểu, quản lý sĩ số
• 👨‍🏫 Giáo viên – phân công, lịch dạy, đánh giá

**Vận hành & Tài chính:**
• 💰 Học phí – thu tiền, báo cáo doanh thu, nhắc nợ
• 📊 Báo cáo – KPI, thống kê, xuất Excel/PDF

**Hệ thống:**
• ⚙️ Cài đặt – phân quyền, thông báo, tích hợp

Hãy hỏi tôi bất cứ điều gì!`
        },
    ];

    const FALLBACK = [
        'Câu hỏi hay! Để tôi hiểu rõ hơn – bạn đang cần thông tin về học viên, lớp học, học phí, hay tính năng nào khác của RinoEdu?',
        'Tôi chưa có thông tin cụ thể về điều đó, nhưng bạn có thể tìm thấy chi tiết hơn trong **Workspace Dashboard** → module tương ứng. Bạn có muốn tôi hướng dẫn điều hướng không?',
        'Đó là một câu hỏi thú vị! Tính năng này có thể đang trong lộ trình phát triển của RinoEdu. Hãy kiểm tra mục **Thông báo hệ thống** để cập nhật mới nhất.',
        'Tôi là RinoEdu AI, được tối ưu để hỗ trợ quản lý trung tâm giáo dục. Bạn có thể hỏi tôi về học viên, lớp học, giáo viên, học phí, báo cáo, hoặc cách sử dụng bất kỳ tính năng nào!',
        'Hiện tại tôi đang chạy ở chế độ offline. Khi kết nối backend AI thực sự, tôi sẽ có thể truy xuất dữ liệu trực tiếp từ hệ thống của bạn và trả lời chính xác hơn nhiều.',
    ];

    function findReply(msg) {
        const lower = msg.toLowerCase();
        for (const entry of KB) {
            if (entry.kw.some(k => lower.includes(k))) return entry.reply;
        }
        return FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
    }

    async function streamText(text, onChunk) {
        // Stream word by word for a natural typing feel
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
                // Thinking pause: 500–900ms
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
