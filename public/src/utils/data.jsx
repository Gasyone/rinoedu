// js/data.jsx
(() => {
    const {
        Home, Fingerprint, Users, Globe, MessageSquare, Mail, Calendar, Cloud, FileText, Video, CheckCircle,
        BookOpen, Feather, Dumbbell, Star, HeartHandshake, Lightbulb, Box, ShoppingBag, Factory, Shield, Wrench,
        Truck, Container, Landmark, Building, Layers, Leaf, Briefcase, UserCircle, DollarSign, Calculator, Clipboard,
        Repeat, CreditCard, Heart, GraduationCap, Coffee, MapPin, Code, PenTool, Activity, Gamepad2, Music, Anchor, User,
        Phone, Smartphone, MapIcon, Lock, Info, ExternalLink, Hash, UserCheck
    } = window.Icons;

    window.Data = {
        ALL_APP_LIBRARY: {
            // ... (rest of the file)
            square_home: { id: 'square_home', name: 'Trang chính', icon: Globe, color: 'text-indigo-500', category: 'Hệ thống', desc: 'Quay lại màn hình giới thiệu & công cụ mở.', price: 'Free' },
            dashboard: { id: 'dashboard', name: 'Bảng làm việc', icon: Home, color: 'text-indigo-600', category: 'Hệ thống', desc: 'Bảng điều khiển tổng quan.', price: 'Free' },
            identity_center: { id: 'identity_center', name: 'Identity Center', icon: Fingerprint, color: 'text-rose-600', category: 'Hệ thống', desc: 'Quản lý định danh tập trung.', price: 'Free' },
            account_manager: { id: 'account_manager', name: 'Quản lý tài khoản', icon: User, color: 'text-blue-600', category: 'Hệ thống', desc: 'Hồ sơ, bảo mật & cài đặt chung', price: 'Free' },
            center_ops: { id: 'center_ops', name: 'Quản lý Đào tạo', icon: Building, color: 'text-blue-600', category: 'Vận hành', desc: 'Quản lý đa cơ sở, chương trình và nguồn lực.', price: 'Free' },
            class_management: { id: 'class_management', name: 'Quản lý Giảng dạy', icon: GraduationCap, color: 'text-emerald-600', category: 'Giảng dạy', desc: 'Quản lý lớp học, lịch dạy, năng lực học viên.', price: 'Free' },
            directory: { id: 'directory', name: 'Danh bạ', icon: Users, color: 'text-orange-500', category: 'Tổ chức', desc: 'Tra cứu nhân sự.', price: 'Free' },
            social: { id: 'social', name: 'Mạng xã hội', icon: Globe, color: 'text-pink-500', category: 'Truyền thông', desc: 'Tin tức nội bộ & cộng đồng.', price: 'Free' },
            chat: { id: 'chat', name: 'Tin nhắn', icon: MessageSquare, color: 'text-blue-500', category: 'Truyền thông', desc: 'Chat nhóm, chat 1-1.', price: 'Free' },
            mail: { id: 'mail', name: 'Email', icon: Mail, color: 'text-red-500', category: 'Văn phòng', desc: 'Hòm thư công việc.', price: 'Free' },
            calendar: { id: 'calendar', name: 'Lịch biểu', icon: Calendar, color: 'text-green-600', category: 'Văn phòng', desc: 'Lịch họp, sự kiện.', price: 'Free' },
            drive: { id: 'drive', name: 'Drive', icon: Cloud, color: 'text-yellow-500', category: 'Văn phòng', desc: 'Lưu trữ tài liệu.', price: '199.000đ' },
            docs: { id: 'docs', name: 'Tài liệu', icon: FileText, color: 'text-blue-400', category: 'Văn phòng', desc: 'Soạn thảo văn bản.', price: 'Free' },
            meeting: { id: 'meeting', name: 'Họp', icon: Video, color: 'text-purple-600', category: 'Văn phòng', desc: 'Video conference.', price: 'Free' },
            tasks: { id: 'tasks', name: 'Công việc', icon: CheckCircle, color: 'text-emerald-500', category: 'Văn phòng', desc: 'To-do list cá nhân.', price: 'Free' },
            library: { id: 'library', name: 'Thư viện', icon: BookOpen, color: 'text-amber-600', category: 'Văn hóa', desc: 'Sách & Tài liệu.', price: 'Free' },
            blog: { id: 'blog', name: 'Blog', icon: Feather, color: 'text-fuchsia-600', category: 'Truyền thông', desc: 'Góc nhìn & Chia sẻ.', price: 'Free' },
            sports: { id: 'sports', name: 'Thể thao', icon: Dumbbell, color: 'text-red-500', category: 'Văn hóa', desc: 'CLB & Giải đấu.', price: 'Free' },
            faith: { id: 'faith', name: 'Tín ngưỡng', icon: Star, color: 'text-violet-500', category: 'Cá nhân', desc: 'Lịch & Tử vi.', price: 'Free' },
            charity: { id: 'charity', name: 'Từ thiện', icon: HeartHandshake, color: 'text-rose-500', category: 'Văn hóa', desc: 'Hoạt động CSR.', price: 'Free' },
            innovation: { id: 'innovation', name: 'Sáng tạo', icon: Lightbulb, color: 'text-yellow-400', category: 'Sáng tạo', desc: 'Ý tưởng & Cải tiến.', price: 'Free' },
            inventory: { id: 'inventory', name: 'Kho', icon: Box, color: 'text-amber-700', category: 'Vận hành', desc: 'Xuất nhập tồn.', price: '499.000đ' },
            procurement: { id: 'procurement', name: 'Mua sắm', icon: ShoppingBag, color: 'text-slate-600', category: 'Vận hành', desc: 'Quản lý NCC & PO.', price: '299.000đ' },
            manufacturing: { id: 'manufacturing', name: 'Sản xuất', icon: Factory, color: 'text-orange-700', category: 'Sản xuất', desc: 'Lệnh sản xuất, BOM.', price: '999.000đ' },
            quality: { id: 'quality', name: 'Chất lượng', icon: Shield, color: 'text-teal-600', category: 'Sản xuất', desc: 'QA/QC.', price: '599.000đ' },
            maintenance: { id: 'maintenance', name: 'Bảo trì', icon: Wrench, color: 'text-gray-600', category: 'Vận hành', desc: 'Bảo dưỡng thiết bị.', price: '399.000đ' },
            fleet: { id: 'fleet', name: 'Vận tải', icon: Truck, color: 'text-blue-800', category: 'Logistics', desc: 'Đội xe & Lộ trình.', price: '499.000đ' },
            logistics: { id: 'logistics', name: 'XNK', icon: Container, color: 'text-indigo-700', category: 'Logistics', desc: 'Hải quan & Vận đơn.', price: '599.000đ' },
            real_estate: { id: 'real_estate', name: 'BĐS', icon: Landmark, color: 'text-amber-600', category: 'Tài sản', desc: 'Quản lý tòa nhà.', price: 'Free' },
            facilities: { id: 'facilities', name: 'Tòa nhà', icon: Building, color: 'text-cyan-700', category: 'Tài sản', desc: 'Điện nước, An ninh.', price: 'Free' },
            assets: { id: 'assets', name: 'Tài sản', icon: Layers, color: 'text-purple-700', category: 'Tài sản', desc: 'Khấu hao & Cấp phát.', price: '299.000đ' },
            garden: { id: 'garden', name: 'Vườn', icon: Leaf, color: 'text-green-500', category: 'Nông nghiệp', desc: 'Mùa vụ & Cây trồng.', price: 'Free' },
            work: { id: 'work', name: 'Dự án', icon: Briefcase, color: 'text-teal-600', category: 'Quản trị', desc: 'Tiến độ & Kanban.', price: '399.000đ' },
            hrm: { id: 'hrm', name: 'Nhân sự', icon: UserCircle, color: 'text-rose-500', category: 'Quản trị', desc: 'Hồ sơ & KPI.', price: '499.000đ' },
            payroll: { id: 'payroll', name: 'Lương', icon: DollarSign, color: 'text-green-500', category: 'Quản trị', desc: 'Bảng lương & Thuế.', price: '399.000đ' },
            accounting: { id: 'accounting', name: 'Kế toán', icon: Calculator, color: 'text-cyan-600', category: 'Tài chính', desc: 'Sổ cái & Báo cáo.', price: '699.000đ' },
            orders: { id: 'orders', name: 'Đơn hàng', icon: Clipboard, color: 'text-blue-600', category: 'Kinh doanh', desc: 'Quản lý đơn bán.', price: '299.000đ' },
            crm: { id: 'crm', name: 'CRM', icon: Users, color: 'text-blue-600', category: 'Kinh doanh', desc: 'Leads & Deals.', price: '399.000đ' },
            sales: { id: 'sales', name: 'POS', icon: ShoppingBag, color: 'text-orange-600', category: 'Kinh doanh', desc: 'Bán lẻ.', price: '299.000đ' },
            process: { id: 'process', name: 'Quy trình', icon: Repeat, color: 'text-fuchsia-600', category: 'Quản trị', desc: 'BPM & Luồng việc.', price: 'Free' },
            wallet: { id: 'wallet', name: 'Ví', icon: CreditCard, color: 'text-violet-600', category: 'Cá nhân', desc: 'Tài chính cá nhân.', price: 'Free' },
            health: { id: 'health', name: 'Sức khỏe', icon: Heart, color: 'text-red-500', category: 'Cá nhân', desc: 'Theo dõi sức khỏe.', price: 'Free' },
            learning: { id: 'learning', name: 'LMS', icon: GraduationCap, color: 'text-emerald-600', category: 'Giáo dục', desc: 'Đào tạo & Thi.', price: 'Free' },
            news: { id: 'news', name: 'Tin tức', icon: Coffee, color: 'text-amber-500', category: 'Tiện ích', desc: 'Điểm tin.', price: 'Free' },
            travel: { id: 'travel', name: 'Công tác', icon: MapPin, color: 'text-sky-500', category: 'Tiện ích', desc: 'Vé & Khách sạn.', price: 'Free' },
            dev: { id: 'dev', name: 'Dev', icon: Code, color: 'text-slate-800', category: 'Kỹ thuật', desc: 'Git & CI/CD.', price: 'Free' },
            design: { id: 'design', name: 'Design', icon: PenTool, color: 'text-pink-600', category: 'Sáng tạo', desc: 'Assets & Review.', price: 'Free' },
            hospital: { id: 'hospital', name: 'Y tế', icon: Activity, color: 'text-red-600', category: 'Y tế', desc: 'Bệnh án điện tử.', price: 'Free' },
            bank: { id: 'bank', name: 'Bank', icon: Landmark, color: 'text-indigo-800', category: 'Ngân hàng', desc: 'Core Banking.', price: 'Free' },
            game_chess: { id: 'game_chess', name: 'Cờ vua', icon: Gamepad2, color: 'text-slate-800', category: 'Giải trí', desc: 'Game trí tuệ.', price: 'Free' },
            game_music: { id: 'game_music', name: 'Music', icon: Music, color: 'text-fuchsia-500', category: 'Giải trí', desc: 'Nghe nhạc.', price: 'Free' },
            app_extra_1: { id: 'app_extra_1', name: 'Tiện ích 1', icon: Anchor, color: 'text-teal-500', category: 'Khác', desc: 'Mở rộng 1', price: 'Free' },
            app_extra_2: { id: 'app_extra_2', name: 'Tiện ích 2', icon: Shield, color: 'text-pink-500', category: 'Khác', desc: 'Mở rộng 2', price: 'Free' },
            square: { id: 'square', name: 'Trang chủ', icon: Home, color: 'text-blue-500', category: 'Hệ thống', desc: 'Trở về màn hình chính của mạng lưới Rinoapp.', price: 'Free' },
        },

        ACCOUNT_TABS: [
            // Tài khoản cá nhân
            { id: 'profile', label: 'Hồ sơ cá nhân', iconName: 'IdCard', category: 'Tài khoản' },
            { id: 'security', label: 'Bảo mật & Liên kết', iconName: 'Shield', category: 'Tài khoản' },
            { id: 'general', label: 'Cài đặt chung', iconName: 'Sliders', category: 'Tài khoản' },

            // Quản lý nền tảng Rino
            { id: 'org_settings', label: 'Cài đặt nền tảng', iconName: 'Building', category: 'Quản lý Nền tảng' },

            // Quản trị hệ thống
            { id: 'sys_users', label: 'Người dùng hệ thống', iconName: 'Server', category: 'Quản trị Hệ thống' },
            { id: 'sys_logs', label: 'Nhật ký hệ thống', iconName: 'History', category: 'Quản trị Hệ thống' },
            { id: 'webhooks', label: 'Webhooks & Tích hợp', iconName: 'Link', category: 'Quản trị Hệ thống' },
        ],

        // --- MOCK DATA FOR CLASS MANAGEMENT & CENTER OPS ---
        MOCK_CLASSES: [
            { id: 'c1', name: 'Toán Cao Cấp - K12', course: 'Đại số tuyến tính', code: 'MATH101', students: 35, schedule: 'T2, T4 (08:00 - 10:00)', progress: 45, status: 'Đang diễn ra', room: 'Phòng 301', color: 'blue' },
            { id: 'c2', name: 'Lập trình ReactJS Thực chiến', course: 'Frontend Master', code: 'DEV202', students: 24, schedule: 'T3, T5 (18:30 - 21:00)', progress: 15, status: 'Sắp bắt đầu', room: 'Lab 02', color: 'emerald' },
            { id: 'c3', name: 'Tiếng Anh Giao tiếp B1', course: 'Giao tiếp Quốc tế', code: 'ENG105', students: 18, schedule: 'T7, CN (09:00 - 11:30)', progress: 80, status: 'Đang diễn ra', room: 'Online', color: 'amber' },
            { id: 'c4', name: 'Nhập môn Trí tuệ nhân tạo', course: 'AI Foundation', code: 'AI100', students: 40, schedule: 'T6 (13:00 - 16:00)', progress: 0, status: 'Sắp bắt đầu', room: 'Phòng 405', color: 'purple' },
            { id: 'c5', name: 'Thiết kế UI/UX Cơ bản', course: 'Design Masterclass', code: 'DES101', students: 28, schedule: 'T7 (08:00 - 11:00)', progress: 100, status: 'Đã kết thúc', room: 'Lab 01', color: 'slate' }
        ],
        MOCK_COURSE_PROCESS: [
            { id: 'cp1', name: 'Lộ trình Tiếng Anh Giao Tiếp', duration: '6 tháng', levels: 3, classesCount: 12 },
            { id: 'cp2', name: 'Toán Tư Duy Tiểu Học', duration: '12 tháng', levels: 5, classesCount: 24 },
            { id: 'cp3', name: 'Khóa Lập trình Robotics Kids', duration: '3 tháng', levels: 2, classesCount: 5 },
        ],
        MOCK_CLASS_LIBRARY: [
            { id: 'cl1', name: 'Lớp TA Giao Tiếp Tiêu Chuẩn', capacity: '15 HV', type: 'Offline', hours: '36h' },
            { id: 'cl2', name: 'Lớp TA Giao Tiếp Nhóm Nhỏ', capacity: '6 HV', type: 'Hybrid', hours: '30h' },
            { id: 'cl3', name: 'Lớp Lập trình Web Khởi động', capacity: '20 HV', type: 'Online', hours: '45h' },
        ],
        MOCK_BRANCHES: [
            { id: 'b1', name: 'Cơ sở Cầu Giấy', location: 'Hà Nội', activeStudents: 1250, revenue: '2.5B', status: 'Hoạt động tốt' },
            { id: 'b2', name: 'Cơ sở Quận 1', location: 'TP.HCM', activeStudents: 980, revenue: '1.8B', status: 'Hoạt động tốt' },
            { id: 'b3', name: 'Cơ sở Thanh Khê', location: 'Đà Nẵng', activeStudents: 450, revenue: '800M', status: 'Cần chú ý' },
            { id: 'b4', name: 'Hệ thống Online', location: 'Toàn quốc', activeStudents: 3200, revenue: '4.2B', status: 'Tăng trưởng' },
        ],
        MOCK_TEACHERS: [
            { id: 't1', name: 'Nguyễn Tiến Dũng', subject: 'Toán học', branch: 'Cầu Giấy', hours: 45, status: 'Full-time' },
            { id: 't2', name: 'Trần Mai Phương', subject: 'Tiếng Anh', branch: 'Online', hours: 32, status: 'Part-time' },
            { id: 't3', name: 'Lê Hoàng Anh', subject: 'Lập trình', branch: 'Quận 1', hours: 50, status: 'Full-time' },
        ],


        SEARCH_RESULTS_MOCK: [
            { id: 1, type: 'app', name: 'Nhân sự (HRM)', desc: 'Quản lý hồ sơ nhân viên', icon: window.Icons.UserCircle, color: 'text-rose-500' },
            { id: 2, type: 'file', name: 'Báo cáo_Doanh_thu_Q4.pdf', desc: 'Cập nhật 2 giờ trước', icon: window.Icons.FileText, color: 'text-red-500' },
            { id: 3, type: 'user', name: 'Nguyễn Văn A', desc: 'Trưởng phòng Marketing', icon: window.Icons.User, color: 'text-blue-500' },
            { id: 4, type: 'app', name: 'Dự án (Project)', desc: 'Quản lý tiến độ dự án', icon: window.Icons.Briefcase, color: 'text-teal-600' },
        ],

        NOTIFICATIONS_MOCK: [
            { id: 1, type: 'approval', title: 'Phê duyệt nghỉ phép', desc: 'Nguyễn Văn A đã gửi yêu cầu nghỉ phép 2 ngày (20/10 - 21/10).', time: '10 phút trước', read: false, priority: 'high', group: 'today', actionable: true, status: 'pending' },
            { id: 2, type: 'meeting', title: 'Cuộc họp Team Marketing', desc: 'Bắt đầu trong 15 phút nữa tại phòng họp 302.', time: '15 phút trước', read: false, priority: 'medium', group: 'today' },
            { id: 3, type: 'system', title: 'Báo cáo doanh thu T12', desc: 'Hệ thống đã tạo xong báo cáo tự động.', time: '1 giờ trước', read: true, priority: 'low', group: 'today' },
            { id: 4, type: 'chat', title: 'Tin nhắn mới từ Sếp', desc: 'Em xem lại file báo cáo anh vừa gửi nhé.', time: 'Hôm qua, 14:30', read: true, priority: 'high', group: 'yesterday' },
            { id: 5, type: 'approval', title: 'Phê duyệt PO-2024-001', desc: 'Yêu cầu mua sắm trang thiết bị cho văn phòng mới.', time: 'Hôm qua, 09:00', read: true, priority: 'high', group: 'yesterday', actionable: true, status: 'approved' },
        ],

        SOCIAL_FEED_MOCK: [
            { id: 1, user: 'Ban Truyền Thông', avatar: 'bg-orange-100 text-orange-600', time: '1 giờ trước', content: '📣 Thông báo: Company Trip 2024 sẽ được tổ chức tại Đà Nẵng vào tháng tới! Mọi người chuẩn bị tinh thần nhé 🌊☀️', image: 'https://placehold.co/600x300/e0f2fe/0369a1?text=Trip+2024', likes: 245, comments: 56 },
            { id: 2, user: 'Nguyễn Văn Dev', avatar: 'bg-blue-100 text-blue-600', time: '3 giờ trước', content: 'Vừa deploy thành công module mới. Cảm ơn team đã support nhiệt tình đêm qua! 🚀🔥', image: null, likes: 45, comments: 12 },
        ],

        WORK_LOCATIONS: [
            { id: 'off_hn', name: 'VP Hà Nội', type: 'office', address: 'Tầng 72, Keangnam Landmark' },
            { id: 'off_hcm', name: 'VP Hồ Chí Minh', type: 'office', address: 'Bitexco Financial Tower' },
            { id: 'home', name: 'Nhà riêng', type: 'personal', address: 'Cầu Giấy, Hà Nội' },
            { id: 'cafe', name: 'Coffee Shop', type: 'personal', address: 'Highlands - Indochina Plaza' },
        ],

        ORGANIZATION_INFO: {
            name: 'RinoEdu Corporation',
            logo: 'RE',
            website: 'https://rinoedu.com',
            description: 'Hệ thống quản trị giáo dục và đào tạo toàn diện.',
            taxCode: '0101234567',
            businessLicense: 'GP-2024-88',
            email: 'contact@rinoedu.com',
            phone: '1900 1234',
            headquarters: 'Keangnam Landmark, Cầu Giấy, Hà Nội',
            timezone: 'Asia/Ho_Chi_Minh (UTC+7)',
            language: 'Tiếng Việt',
            currency: 'VND',
            established: '2024-01-01',
            themeColor: '#3B82F6'
        },

        BRANCH_LIST_DETAILED: [
            {
                id: 'b1',
                name: 'Trụ sở Cầu Giấy',
                code: 'HN-CG',
                address: 'Tầng 72, Keangnam Landmark, Hà Nội',
                maps: 'https://maps.google.com/?q=Keangnam+Landmark',
                manager: 'Trần Bình Minh',
                phone: '024 3344 5566',
                status: 'Hoạt động',
                type: 'Trụ sở chính',
                rooms: 12,
                operatingHours: '08:00 - 21:00'
            },
            {
                id: 'b2',
                name: 'Cơ sở Quận 1',
                code: 'HCM-Q1',
                address: 'Số 123 Lê Lợi, Bến Nghé, Quận 1, TP.HCM',
                maps: 'https://maps.google.com/?q=123+Le+Loi+HCM',
                manager: 'Lê Tuyết Mai',
                phone: '028 3344 5566',
                status: 'Hoạt động',
                type: 'Chi nhánh vệ tinh',
                rooms: 8,
                operatingHours: '08:30 - 20:30'
            },
            {
                id: 'b3',
                name: 'Cơ sở Thanh Khê',
                code: 'DN-TK',
                address: '456 Điện Biên Phủ, Đà Nẵng',
                maps: 'https://maps.google.com/?q=456+Dien+Bien+Phu+Danang',
                manager: 'Phạm Hải Đăng',
                phone: '0236 3344 5566',
                status: 'Bảo trì',
                type: 'Chi nhánh vệ tinh',
                rooms: 5,
                operatingHours: '08:00 - 18:00'
            }
        ],

        ORG_ACTIVITY_FEED: [
            { id: 1, user: 'Admin Rino', action: 'Cập nhật logo tổ chức', time: '10 phút trước', type: 'update' },
            { id: 2, user: 'Admin Rino', action: 'Thêm cơ sở mới: Quận 7', time: '2 giờ trước', type: 'create' },
            { id: 3, user: 'Trần Bình Minh', action: 'Cập nhật giờ hoạt động chi nhánh Cầu Giấy', time: 'Hôm qua', type: 'update' },
            { id: 4, user: 'Admin Rino', action: 'Đổi màu chủ đạo thành Blue 500', time: 'Hôm qua', type: 'update' },
        ]
    };
})();
