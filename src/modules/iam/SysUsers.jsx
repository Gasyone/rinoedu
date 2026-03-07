const { useState, useMemo } = React;

window.Components = window.Components || {};

const SafeIcon = ({ iconName, className = "" }) => {
    const IconComponent = window.Icons && window.Icons[iconName];
    if (IconComponent) return <IconComponent className={className} />;
    return <div className={`w-4 h-4 bg-slate-200 rounded-sm animate-pulse ${className}`} title={`Missing icon: ${iconName}`}></div>;
};

window.Components.SysUsers = ({ isDarkMode }) => {
    const MOCK_USERS = [
        { id: 1, name: 'Nguyễn Văn An', email: 'an.nguyen@rinoedu.com', role: 'Admin', status: 'active', lastLogin: '07/03/2026, 08:00', avatar: 'AN' },
        { id: 2, name: 'Trần Thị Bình', email: 'binh.tran@rinoedu.com', role: 'Manager', status: 'active', lastLogin: '06/03/2026, 17:45', avatar: 'TB' },
        { id: 3, name: 'Lê Hoàng Cường', email: 'cuong.le@rinoedu.com', role: 'Editor', status: 'active', lastLogin: '05/03/2026, 09:12', avatar: 'LC' },
        { id: 4, name: 'Phạm Minh Dương', email: 'duong.pham@rinoedu.com', role: 'Viewer', status: 'blocked', lastLogin: '01/02/2026, 14:30', avatar: 'PD' },
        { id: 5, name: 'Hoàng Thị Em', email: 'em.hoang@rinoedu.com', role: 'Editor', status: 'active', lastLogin: '07/03/2026, 07:55', avatar: 'HE' },
        { id: 6, name: 'Vũ Đức Phong', email: 'phong.vu@rinoedu.com', role: 'Manager', status: 'active', lastLogin: '04/03/2026, 11:20', avatar: 'VP' },
        { id: 7, name: 'Đỗ Thanh Giang', email: 'giang.do@rinoedu.com', role: 'Viewer', status: 'blocked', lastLogin: '15/01/2026, 16:00', avatar: 'DG' },
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [users, setUsers] = useState(MOCK_USERS);

    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = roleFilter === 'all' || u.role === roleFilter;
            const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchQuery, roleFilter, statusFilter]);

    const toggleBlock = (userId) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u));
    };

    const ROLES = ['all', 'Admin', 'Manager', 'Editor', 'Viewer'];
    const activeCount = users.filter(u => u.status === 'active').length;
    const blockedCount = users.filter(u => u.status === 'blocked').length;

    return (
        <div className="space-y-6 pb-12 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h1 className={`text-2xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Người dùng hệ thống</h1>
                    <p className="text-sm text-slate-500 mt-1">Quản lý tất cả tài khoản trên nền tảng RinoEdu.</p>
                </div>
                <div className="flex gap-3">
                    <div className={`px-4 py-2 rounded-xl text-center border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <p className="text-lg font-extrabold text-emerald-500">{activeCount}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Hoạt động</p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-center border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <p className="text-lg font-extrabold text-red-500">{blockedCount}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Bị khóa</p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-center border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <p className="text-lg font-extrabold text-blue-500">{users.length}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Tổng cộng</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className={`flex flex-col md:flex-row gap-3 p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className={`flex-1 flex items-center gap-2 px-4 py-2 rounded-xl border ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                    <SafeIcon iconName="Search" className="w-4 h-4 text-slate-400" />
                    <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Tìm kiếm theo tên hoặc email..." className={`flex-1 bg-transparent outline-none text-sm ${isDarkMode ? 'text-white placeholder:text-slate-500' : 'text-slate-800 placeholder:text-slate-400'}`} />
                </div>
                <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className={`px-4 py-2 rounded-xl text-sm font-medium border outline-none ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                    {ROLES.map(r => <option key={r} value={r}>{r === 'all' ? 'Tất cả vai trò' : r}</option>)}
                </select>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={`px-4 py-2 rounded-xl text-sm font-medium border outline-none ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="blocked">Bị khóa</option>
                </select>
            </div>

            {/* User Table */}
            <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                {/* Table Header */}
                <div className={`hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold uppercase tracking-wider border-b ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                    <div className="col-span-4">Người dùng</div>
                    <div className="col-span-2">Vai trò</div>
                    <div className="col-span-2">Trạng thái</div>
                    <div className="col-span-3">Đăng nhập gần nhất</div>
                    <div className="col-span-1 text-right">Thao tác</div>
                </div>

                {/* Table Rows */}
                {filteredUsers.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 text-sm">Không tìm thấy người dùng nào.</div>
                ) : (
                    filteredUsers.map(user => (
                        <div key={user.id} className={`grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 md:px-6 py-4 items-center border-b last:border-b-0 transition hover:bg-slate-50/50 dark:hover:bg-slate-700/30 ${isDarkMode ? 'border-slate-700/50' : 'border-slate-100'}`}>
                            {/* User Info */}
                            <div className="md:col-span-4 flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${user.status === 'blocked' ? 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                    {user.avatar}
                                </div>
                                <div className="min-w-0">
                                    <p className={`text-sm font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{user.name}</p>
                                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                </div>
                            </div>

                            {/* Role */}
                            <div className="md:col-span-2">
                                <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-lg border
                                    ${user.role === 'Admin' ? 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/50' :
                                        user.role === 'Manager' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50' :
                                            user.role === 'Editor' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50' :
                                                'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600'}`}>
                                    {user.role}
                                </span>
                            </div>

                            {/* Status */}
                            <div className="md:col-span-2">
                                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg ${user.status === 'active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                    {user.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                                </span>
                            </div>

                            {/* Last Login */}
                            <div className="md:col-span-3">
                                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{user.lastLogin}</p>
                            </div>

                            {/* Actions */}
                            <div className="md:col-span-1 flex justify-end gap-1">
                                <button onClick={() => toggleBlock(user.id)} title={user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'} className={`p-2 rounded-lg text-xs transition ${user.status === 'active' ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}>
                                    <SafeIcon iconName={user.status === 'active' ? 'ShieldOff' : 'Shield'} className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
