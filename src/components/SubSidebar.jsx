// js/components/SubSidebar.jsx
// Context-aware sub-navigation panel — shows per-module menu items
const { ChevronRight, BarChart2, Users, Settings, FileText, Calendar,
    BookOpen, GraduationCap, Package, ShoppingCart, CreditCard,
    PieChart, Shield, Briefcase, Bell, CheckCircle, Activity,
    MessageSquare, Archive, Home, Star, Clock, TrendingUp } = window.Icons || {};

window.Components = window.Components || {};

// Sub-menu config per module
const SUB_MENUS = {
    hr: {
        label: 'Nhân sự',
        groups: [
            {
                title: 'Quản lý',
                items: [
                    { id: 'hr_overview', icon: BarChart2, label: 'Tổng quan' },
                    { id: 'hr_employees', icon: Users, label: 'Nhân viên' },
                    { id: 'hr_attendance', icon: Clock, label: 'Chấm công' },
                    { id: 'hr_payroll', icon: CreditCard, label: 'Bảng lương' },
                    { id: 'hr_leaves', icon: Calendar, label: 'Nghỉ phép' },
                ],
            },
            {
                title: 'Hành chính',
                items: [
                    { id: 'hr_recruitment', icon: Star, label: 'Tuyển dụng' },
                    { id: 'hr_training', icon: BookOpen, label: 'Đào tạo' },
                    { id: 'hr_reports', icon: FileText, label: 'Báo cáo' },
                    { id: 'hr_settings', icon: Settings, label: 'Cấu hình' },
                ],
            },
        ],
    },
    education: {
        label: 'Giáo dục',
        groups: [
            {
                title: 'Lớp học',
                items: [
                    { id: 'edu_overview', icon: BarChart2, label: 'Tổng quan' },
                    { id: 'edu_classes', icon: GraduationCap, label: 'Lớp học' },
                    { id: 'edu_students', icon: Users, label: 'Học viên' },
                    { id: 'edu_schedule', icon: Calendar, label: 'Lịch học' },
                    { id: 'edu_lessons', icon: BookOpen, label: 'Bài giảng' },
                ],
            },
            {
                title: 'Vận hành',
                items: [
                    { id: 'edu_grades', icon: Star, label: 'Điểm số' },
                    { id: 'edu_reports', icon: FileText, label: 'Báo cáo' },
                    { id: 'edu_settings', icon: Settings, label: 'Cấu hình' },
                ],
            },
        ],
    },
    dashboard: {
        label: 'Dashboard',
        groups: [
            {
                title: 'Tổng quan',
                items: [
                    { id: 'dash_overview', icon: Home, label: 'Trang chủ' },
                    { id: 'dash_activity', icon: Activity, label: 'Hoạt động' },
                    { id: 'dash_tasks', icon: CheckCircle, label: 'Công việc' },
                    { id: 'dash_calendar', icon: Calendar, label: 'Lịch' },
                ],
            },
            {
                title: 'Phân tích',
                items: [
                    { id: 'dash_analytics', icon: TrendingUp, label: 'Thống kê' },
                    { id: 'dash_reports', icon: FileText, label: 'Báo cáo' },
                ],
            },
        ],
    },
    work: {
        label: 'Công việc',
        groups: [
            {
                title: 'Quản lý',
                items: [
                    { id: 'work_board', icon: Briefcase, label: 'Bảng công việc' },
                    { id: 'work_tasks', icon: CheckCircle, label: 'Tất cả tasks' },
                    { id: 'work_projects', icon: Archive, label: 'Dự án' },
                    { id: 'work_calendar', icon: Calendar, label: 'Lịch' },
                ],
            },
            {
                title: 'Cộng tác',
                items: [
                    { id: 'work_team', icon: Users, label: 'Nhóm của tôi' },
                    { id: 'work_reports', icon: BarChart2, label: 'Báo cáo' },
                ],
            },
        ],
    },
    assets: {
        label: 'Kho tài sản',
        groups: [
            {
                title: 'Tài sản',
                items: [
                    { id: 'assets_overview', icon: BarChart2, label: 'Tổng quan' },
                    { id: 'assets_list', icon: Package, label: 'Danh sách' },
                    { id: 'assets_incoming', icon: ShoppingCart, label: 'Nhập kho' },
                    { id: 'assets_outgoing', icon: Archive, label: 'Xuất kho' },
                ],
            },
            {
                title: 'Quản lý',
                items: [
                    { id: 'assets_warehouse', icon: Shield, label: 'Kho hàng' },
                    { id: 'assets_reports', icon: FileText, label: 'Báo cáo' },
                    { id: 'assets_settings', icon: Settings, label: 'Cấu hình' },
                ],
            },
        ],
    },
    wallet: {
        label: 'Tài chính',
        groups: [
            {
                title: 'Tài khoản',
                items: [
                    { id: 'wallet_overview', icon: CreditCard, label: 'Tổng quan' },
                    { id: 'wallet_transactions', icon: Activity, label: 'Giao dịch' },
                    { id: 'wallet_cards', icon: CreditCard, label: 'Thẻ' },
                ],
            },
            {
                title: 'Phân tích',
                items: [
                    { id: 'wallet_analytics', icon: PieChart, label: 'Thống kê' },
                    { id: 'wallet_reports', icon: FileText, label: 'Báo cáo' },
                ],
            },
        ],
    },
    chat: {
        label: 'Chat',
        groups: [
            {
                title: 'Tin nhắn',
                items: [
                    { id: 'chat_all', icon: MessageSquare, label: 'Tất cả' },
                    { id: 'chat_direct', icon: Users, label: 'Trực tiếp' },
                    { id: 'chat_groups', icon: Users, label: 'Nhóm' },
                    { id: 'chat_channels', icon: Bell, label: 'Kênh' },
                ],
            },
        ],
    },
};

window.Components.SubSidebar = ({ activeModuleId, isDarkMode, isOpen }) => {
    const [activeSubId, setActiveSubId] = React.useState(null);

    // Map some aliases
    const moduleKey = activeModuleId === 'inventory' || activeModuleId === 'mdm' || activeModuleId === 'real_estate'
        ? 'assets'
        : activeModuleId === 'class_management' ? 'education'
            : activeModuleId === 'center_ops' ? 'hr'
                : activeModuleId;

    const menu = SUB_MENUS[moduleKey];

    if (!menu || !isOpen) return null;

    return (
        <aside className={`hidden md:flex flex-col w-[200px] flex-shrink-0 border-r h-full overflow-y-auto transition-all duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
            {/* Module title */}
            <div className={`px-4 py-3.5 border-b flex items-center gap-2 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                <ChevronRight className={`w-3.5 h-3.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                <span className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{menu.label}</span>
            </div>

            <nav className="flex-1 p-2 space-y-4">
                {menu.groups.map((group, gi) => (
                    <div key={gi}>
                        <p className={`px-2 mb-1 text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>{group.title}</p>
                        <div className="space-y-0.5">
                            {group.items.map(item => {
                                const isActive = activeSubId === item.id ||
                                    (activeSubId === null && gi === 0 && group.items.indexOf(item) === 0);
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSubId(item.id)}
                                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left ${isActive
                                            ? (isDarkMode ? 'bg-blue-600/20 text-blue-400 font-semibold' : 'bg-blue-50 text-blue-700 font-semibold')
                                            : (isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm')
                                            }`}
                                    >
                                        <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') : ''}`} />
                                        <span className="truncate">{item.label}</span>
                                        {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    );
};
