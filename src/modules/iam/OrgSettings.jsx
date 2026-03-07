window.Components = window.Components || {};

const SafeIcon = ({ iconName, className = "" }) => {
    const IconComponent = window.Icons && window.Icons[iconName];
    if (IconComponent) return <IconComponent className={className} />;
    return <div className={`w-4 h-4 bg-slate-200 rounded-sm animate-pulse ${className}`} title={`Missing icon: ${iconName}`}></div>;
};

window.Components.OrgSettings = ({ isDarkMode }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [saved, setSaved] = useState(false);

    const orgData = window.Data.ORGANIZATION_INFO || { name: 'RinoEdu' };
    const branches = window.Data.BRANCH_LIST_DETAILED || [];
    const activities = window.Data.ORG_ACTIVITY_FEED || [];

    const handleSave = () => {
        // Cập nhật dữ liệu global để các component khác (Header, Dashboard) có thể phản hồi
        window.Data.ORGANIZATION_INFO = {
            ...window.Data.ORGANIZATION_INFO,
            name: document.getElementById('org-name-input')?.value || orgData.name,
            website: document.getElementById('org-website-input')?.value || orgData.website,
        };

        setSaved(true);
        setTimeout(() => setSaved(false), 2000);

        // Phát sự kiện để báo hiệu dữ liệu đã thay đổi (nếu các component khác có lắng nghe)
        window.dispatchEvent(new CustomEvent('org-data-updated'));
    };

    const TABS = [
        { id: 'profile', label: 'Hồ sơ Tổ chức', iconName: 'Building' },
        { id: 'branches', label: 'Cơ sở vật lý', iconName: 'MapPin' },
        { id: 'settings', label: 'Cấu hình vận hành', iconName: 'Palette' },
        { id: 'activity', label: 'Nhật ký thay đổi', iconName: 'Activity' },
    ];

    const renderProfileTab = () => (
        <div className="space-y-8 animate-fadeIn">
            {/* Identity & Contact */}
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    <SafeIcon iconName="Building" className="w-4 h-4" /> Định danh & Liên hệ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Logo Section */}
                    <div className="flex flex-col items-center gap-4 py-2">
                        <div className={`w-32 h-32 rounded-3xl flex items-center justify-center text-4xl font-black border-2 border-dashed transition-all hover:scale-105 group overflow-hidden ${isDarkMode ? 'bg-slate-700 border-slate-600 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
                            <span className="group-hover:hidden">{orgData.logo}</span>
                            <div className="hidden group-hover:flex items-center justify-center w-full h-full bg-blue-600/10 backdrop-blur-sm cursor-pointer">
                                <SafeIcon iconName="Upload" className="w-8 h-8" />
                            </div>
                        </div>
                        <button className="text-xs font-bold text-blue-500 hover:text-blue-600 transition">Thay đổi Logo</button>
                    </div>

                    {/* Basic Info Form */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="sm:col-span-2">
                            <label className={`block text-[11px] font-black uppercase mb-1.5 transition ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Tên tổ chức</label>
                            <input id="org-name-input" defaultValue={orgData.name} className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium border outline-none transition focus:ring-2 focus:ring-blue-500/20 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
                        </div>
                        <div>
                            <label className={`block text-[11px] font-black uppercase mb-1.5 transition ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Website</label>
                            <div className="relative">
                                <SafeIcon iconName="Globe" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input id="org-website-input" defaultValue={orgData.website} className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium border outline-none transition focus:ring-2 focus:ring-blue-500/20 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
                            </div>
                        </div>
                        <div>
                            <label className={`block text-[11px] font-black uppercase mb-1.5 transition ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Email đại diện</label>
                            <div className="relative">
                                <SafeIcon iconName="Mail" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input defaultValue={orgData.email} className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium border outline-none transition focus:ring-2 focus:ring-blue-500/20 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
                            </div>
                        </div>
                        <div>
                            <label className={`block text-[11px] font-black uppercase mb-1.5 transition ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Số điện thoại</label>
                            <div className="relative">
                                <SafeIcon iconName="Phone" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input defaultValue={orgData.phone} className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium border outline-none transition focus:ring-2 focus:ring-blue-500/20 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
                            </div>
                        </div>
                        <div>
                            <label className={`block text-[11px] font-black uppercase mb-1.5 transition ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Ngày thành lập</label>
                            <div className="relative">
                                <SafeIcon iconName="Calendar" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input type="date" defaultValue={orgData.established} className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium border outline-none transition focus:ring-2 focus:ring-blue-500/20 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Legal & Compliance */}
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    <SafeIcon iconName="Shield" className="w-4 h-4" /> Pháp lý & Tuân thủ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className={`block text-[11px] font-black uppercase mb-1.5 transition ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Mã số thuế</label>
                        <div className="relative">
                            <SafeIcon iconName="Hash" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input defaultValue={orgData.taxCode} className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium border outline-none transition focus:ring-2 focus:ring-blue-500/20 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
                        </div>
                    </div>
                    <div>
                        <label className={`block text-[11px] font-black uppercase mb-1.5 transition ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Số GP KD</label>
                        <div className="relative">
                            <SafeIcon iconName="FileText" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input defaultValue={orgData.businessLicense} className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium border outline-none transition focus:ring-2 focus:ring-blue-500/20 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className={`block text-[11px] font-black uppercase mb-1.5 transition ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Mô tả tổ chức</label>
                        <textarea rows="3" defaultValue={orgData.description} className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium border outline-none transition focus:ring-2 focus:ring-blue-500/20 resize-none ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}></textarea>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderBranchesTab = () => (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Hệ thống cơ sở vật lý</h3>
                    <p className="text-sm text-slate-500">Quản lý trung tâm, chi nhánh và điểm vận hành.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105">
                    <SafeIcon iconName="Plus" className="w-4 h-4" /> Thêm cơ sở mới
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.map(branch => (
                    <div key={branch.id} className={`group rounded-2xl border transition-all hover:shadow-xl hover:-translate-y-1 ${isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-white border-slate-200 hover:border-blue-200 shadow-sm'}`}>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${branch.type === 'Trụ sở chính' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'bg-slate-100 text-slate-600 dark:bg-slate-800'}`}>
                                    <SafeIcon iconName="Building" className="w-5 h-5" />
                                </div>
                                <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg ${branch.status === 'Hoạt động' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                    {branch.status}
                                </span>
                            </div>

                            <h4 className={`font-bold mb-1 group-hover:text-blue-600 transition ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{branch.name}</h4>
                            <p className="text-[11px] text-slate-400 font-bold mb-4 flex items-center gap-1.5 uppercase tracking-wide">
                                <SafeIcon iconName="Hash" className="w-3 h-3" /> {branch.code} • {branch.type}
                            </p>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-start gap-3">
                                    <SafeIcon iconName="MapPin" className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-500 leading-relaxed italic">{branch.address}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <SafeIcon iconName="User" className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{branch.manager}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <SafeIcon iconName="Clock" className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    <span className="text-xs text-slate-600 dark:text-slate-300">{branch.operatingHours}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Phòng học</p>
                                    <p className="text-sm font-black text-slate-700 dark:text-slate-200">{branch.rooms}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Hotline</p>
                                    <p className="text-sm font-black text-slate-700 dark:text-slate-200">{branch.phone.split(' ')[0]}...</p>
                                </div>
                            </div>
                        </div>

                        <div className={`p-3 flex items-center justify-between border-t transition overflow-hidden group-hover:bg-blue-50/50 dark:group-hover:bg-blue-900/10 ${isDarkMode ? 'border-slate-700' : 'border-slate-50'}`}>
                            <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition">
                                <SafeIcon iconName="Edit2" className="w-3 h-3" /> Chỉnh sửa
                            </button>
                            <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700"></div>
                            <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-slate-500 hover:text-red-600 transition">
                                <SafeIcon iconName="Trash2" className="w-3 h-3" /> Vô hiệu hóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderSettingsTab = () => (
        <div className="space-y-8 animate-fadeIn">
            {/* Operational Config */}
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    <SafeIcon iconName="Clock" className="w-4 h-4" /> Vận hành & Vùng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={`block text-[11px] font-black uppercase mb-1.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Múi giờ hệ thống</label>
                        <select defaultValue={orgData.timezone} className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium border outline-none transition ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                            <option>Asia/Ho_Chi_Minh (UTC+7)</option>
                            <option>Asia/Bangkok (UTC+7)</option>
                            <option>Asia/Singapore (UTC+8)</option>
                        </select>
                    </div>
                    <div>
                        <label className={`block text-[11px] font-black uppercase mb-1.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Ngôn ngữ mặc định</label>
                        <select defaultValue={orgData.language} className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium border outline-none transition ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                            <option>Tiếng Việt</option>
                            <option>English</option>
                        </select>
                    </div>
                    <div>
                        <label className={`block text-[11px] font-black uppercase mb-1.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Đơn vị tiền tệ</label>
                        <select defaultValue={orgData.currency} className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium border outline-none transition ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                            <option>VND ( Việt Nam Đồng)</option>
                            <option>USD (US Dollar)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Branding */}
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    <SafeIcon iconName="Palette" className="w-4 h-4" /> Bản sắc thương hiệu
                </h3>
                <div className="space-y-6">
                    <div>
                        <label className={`block text-[11px] font-black uppercase mb-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Màu chủ đạo (Theme Color)</label>
                        <div className="flex gap-4 flex-wrap">
                            {['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B', '#10B981', '#06B6D4'].map(color => (
                                <button key={color} className={`w-10 h-10 rounded-xl transition-all hover:scale-110 border-4 ${orgData.themeColor === color ? 'border-white shadow-lg ring-2 ring-blue-500' : 'border-transparent'}`} style={{ backgroundColor: color }}></button>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 rounded-xl flex items-center gap-4 border border-dashed border-slate-200 dark:border-slate-700">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: orgData.themeColor }}>Abc</div>
                        <div>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Màu thương hiệu đã chọn</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{orgData.themeColor}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderActivityTab = () => (
        <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Nhật ký thay đổi</h3>
                <button className="text-xs font-bold text-blue-500 hover:underline">Tải dữ liệu (.csv)</button>
            </div>

            <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                {activities.map((item, idx) => (
                    <div key={item.id} className={`flex items-center gap-4 p-5 transition hover:bg-slate-50 dark:hover:bg-slate-800 ${idx !== activities.length - 1 ? 'border-b' : ''} ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.type === 'create' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'}`}>
                            {item.type === 'create' ? <SafeIcon iconName="Plus" className="w-5 h-5" /> : <SafeIcon iconName="Edit2" className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                <span className="font-bold">{item.user}</span> {item.action}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5 font-bold uppercase tracking-tight">{item.time}</p>
                        </div>
                        <button className="p-2 text-slate-300 hover:text-blue-500 transition">
                            <SafeIcon iconName="ChevronRight" className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8 pb-20 max-w-[1400px] mx-auto min-h-full">
            {/* Sub-sidebar for Tabs */}
            <aside className="lg:w-72 flex-shrink-0">
                <div className="sticky top-10 space-y-1">
                    <div className="mb-6 px-4">
                        <h2 className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Quản lý Tổ chức</h2>
                        <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.2em] mt-1">Hệ thống RinoEdu</p>
                    </div>
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]' : 'text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm'}`}
                        >
                            <SafeIcon iconName={tab.iconName} className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
                            {tab.label}
                            {activeTab === tab.id && <SafeIcon iconName="ChevronRight" className="w-4 h-4 ml-auto opacity-70" />}
                        </button>
                    ))}

                    <div className="pt-8 px-4 mt-8 border-t border-slate-100 dark:border-slate-800">
                        <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-slate-800/40' : 'bg-blue-50/50'}`}>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Trạng thái Nền tảng</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Hoạt động ổn định</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
                <div className="max-w-4xl">
                    {activeTab === 'profile' && renderProfileTab()}
                    {activeTab === 'branches' && renderBranchesTab()}
                    {activeTab === 'settings' && renderSettingsTab()}
                    {activeTab === 'activity' && renderActivityTab()}

                    {/* Global Save Button for forms */}
                    {(activeTab === 'profile' || activeTab === 'settings') && (
                        <div className={`mt-10 p-4 sticky bottom-6 rounded-2xl flex justify-between items-center backdrop-blur-md border shadow-2xl ${isDarkMode ? 'bg-slate-900/80 border-slate-700 shadow-black' : 'bg-white/80 border-slate-100 shadow-blue-100'}`}>
                            <div className="hidden sm:block">
                                <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Thay đổi chưa được lưu</p>
                                <p className="text-[10px] text-slate-400">Hệ thống sẽ không tự động lưu.</p>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition ${isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}>Hủy bỏ</button>
                                <button onClick={handleSave} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold transition shadow-lg ${saved ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'}`}>
                                    <SafeIcon iconName="Save" className="w-4 h-4" /> {saved ? 'Thành công!' : 'Lưu tất cả'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
