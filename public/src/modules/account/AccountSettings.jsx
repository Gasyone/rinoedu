// js/components/AccountSettings.jsx
const { useState } = React;

window.Components.AccountSettings = ({ isDarkMode }) => {
    const { Globe, Bell, Calendar, Lock, Mail, Smartphone, Globe2, Monitor, Eye, History, Shield, Trash2, CheckCircle2, ChevronRight } = window.Icons;

    const [generalSettings, setGeneralSettings] = useState({
        language: window.currentLanguage || 'vi',
        timezone: window.currentTimezone || 'Asia/Ho_Chi_Minh',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        marketingEmails: false,
        profileVisibility: 'public',
        showActivityStatus: true,
        allowSearchEngine: false,
        twoFactorAuth: true
    });

    const updateSetting = (key, value) => setGeneralSettings(prev => ({ ...prev, [key]: value }));
    const toggleSetting = (key) => setGeneralSettings(prev => ({ ...prev, [key]: !prev[key] }));

    const SettingToggle = ({ icon: Icon, title, description, checked, onChange, colorClass }) => (
        <div className="flex items-start justify-between py-4 border-b border-slate-100 dark:border-slate-700/50 last:border-0 last:pb-0">
            <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h5 className={`font-bold text-sm ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{title}</h5>
                    <p className="text-xs text-slate-500 mt-1 max-w-md">{description}</p>
                </div>
            </div>
            <button
                onClick={onChange}
                className={`w-11 h-6 rounded-full p-1 transition-colors shrink-0 ${checked ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </button>
        </div>
    );

    return (
        <div className="animate-fade-in flex flex-col gap-6 pb-10">
            <div className="mb-2 border-b border-slate-200 dark:border-slate-700 pb-4">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Cài đặt chung</h3>
                <p className="text-sm text-slate-500">Quản lý giao diện, ngôn ngữ, và tùy chọn thông báo của bạn.</p>
            </div>

            {/* Múi giờ & Ngôn ngữ */}
            <div className={`rounded-xl border shadow-sm p-6 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h4 className={`text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Globe className="w-4 h-4" /> Ngữ cảnh & Thời gian
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Ngôn ngữ hiển thị</label>
                        <select
                            value={generalSettings.language} onChange={(e) => {
                                updateSetting('language', e.target.value);
                                if (window.setLanguage) window.setLanguage(e.target.value);
                            }}
                            className={`w-full px-4 py-2.5 rounded-lg text-sm border focus:ring-2 focus:ring-blue-500 outline-none ${isDarkMode ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-200'}`}
                        >
                            <option value="vi">Tiếng Việt</option>
                            <option value="en">English (US)</option>
                            <option value="ja">日本語 (Nhật Bản)</option>
                            <option value="ko">한국어 (Hàn Quốc)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Múi giờ</label>
                        <select
                            value={generalSettings.timezone} onChange={(e) => {
                                updateSetting('timezone', e.target.value);
                                if (window.setTimezone) window.setTimezone(e.target.value);
                            }}
                            className={`w-full px-4 py-2.5 rounded-lg text-sm border focus:ring-2 focus:ring-blue-500 outline-none ${isDarkMode ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-200'}`}
                        >
                            <option value="Asia/Ho_Chi_Minh">(GMT+07:00) Indochina Time - Hồ Chí Minh</option>
                            <option value="Asia/Tokyo">(GMT+09:00) Japan Standard Time - Tokyo</option>
                            <option value="America/New_York">(GMT-05:00) Eastern Time - New York</option>
                            <option value="UTC">(GMT+00:00) Coordinated Universal Time</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Định dạng ngày</label>
                        <select
                            value={generalSettings.dateFormat} onChange={(e) => updateSetting('dateFormat', e.target.value)}
                            className={`w-full px-4 py-2.5 rounded-lg text-sm border focus:ring-2 focus:ring-blue-500 outline-none ${isDarkMode ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-200'}`}
                        >
                            <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2023)</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2023)</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD (2023-12-31)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Định dạng giờ</label>
                        <select
                            value={generalSettings.timeFormat} onChange={(e) => updateSetting('timeFormat', e.target.value)}
                            className={`w-full px-4 py-2.5 rounded-lg text-sm border focus:ring-2 focus:ring-blue-500 outline-none ${isDarkMode ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-200'}`}
                        >
                            <option value="24h">24 giờ (14:30)</option>
                            <option value="12h">12 giờ (02:30 PM)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Thông báo */}
            <div className={`rounded-xl border shadow-sm p-6 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h4 className={`text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Bell className="w-4 h-4" /> Thông báo
                </h4>

                <SettingToggle
                    icon={Mail} title="Email thông báo"
                    description="Nhận thông báo qua email về các hoạt động quan trọng, cập nhật hệ thống và tin nhắn mới."
                    checked={generalSettings.emailNotifications} onChange={() => toggleSetting('emailNotifications')}
                    colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                />

                <SettingToggle
                    icon={Monitor} title="Thông báo đẩy (Push Notifications)"
                    description="Hiển thị thông báo trên trình duyệt ngay cả khi bạn không mở ứng dụng Rino."
                    checked={generalSettings.pushNotifications} onChange={() => toggleSetting('pushNotifications')}
                    colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                />

                <SettingToggle
                    icon={Smartphone} title="Tin nhắn SMS"
                    description="Nhận cảnh báo bảo mật qua SMS (Tính phí theo quy định viễn thông)."
                    checked={generalSettings.smsNotifications} onChange={() => toggleSetting('smsNotifications')}
                    colorClass="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                />

                <SettingToggle
                    icon={Globe2} title="Email Marketing & Cập nhật"
                    description="Nhận bản tin tuần, tính năng mới và các mẹo sử dụng phần mềm hiệu quả."
                    checked={generalSettings.marketingEmails} onChange={() => toggleSetting('marketingEmails')}
                    colorClass="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                />
            </div>

            {/* Quyền riêng tư cơ bản */}
            <div className={`rounded-xl border shadow-sm p-6 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h4 className={`text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Eye className="w-4 h-4" /> Quyền riêng tư & Hiển thị
                </h4>

                <div className="py-4 border-b border-slate-100 dark:border-slate-700/50">
                    <label className={`text-sm font-medium block mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Trạng thái hiển thị hồ sơ</label>
                    <select
                        value={generalSettings.profileVisibility} onChange={(e) => updateSetting('profileVisibility', e.target.value)}
                        className={`w-full max-w-sm px-4 py-2.5 rounded-lg text-sm border focus:ring-2 focus:ring-blue-500 outline-none ${isDarkMode ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-200'}`}
                    >
                        <option value="public">Công khai (Mọi người trong tổ chức đều thấy)</option>
                        <option value="team">Chỉ Đội nhóm/Phòng ban hiện tại</option>
                        <option value="private">Riêng tư (Chỉ Admin rino_admin mới thấy)</option>
                    </select>
                    <p className="text-xs text-slate-500 mt-2">Xác định ai có thể tìm thấy bạn trong danh bạ nội bộ.</p>
                </div>

                <SettingToggle
                    icon={CheckCircle2} title="Hiển thị trạng thái hoạt động"
                    description="Cho phép người khác thấy khi bạn đang online trên Rino Chat."
                    checked={generalSettings.showActivityStatus} onChange={() => toggleSetting('showActivityStatus')}
                    colorClass="bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400"
                />
            </div>

            {/* Vùng nguy hiểm (Danger Zone) */}
            <div className={`rounded-xl border border-red-200 dark:border-red-900/50 shadow-sm p-6 bg-red-50/50 dark:bg-red-900/10 mt-4`}>
                <h4 className={`text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2 text-red-600 dark:text-red-400`}>
                    <Trash2 className="w-4 h-4" /> Vùng nguy hiểm
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Các hành động không thể hoàn tác. Xin lưu ý trước khi thực hiện.</p>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-red-100 dark:border-red-900/30">
                    <div>
                        <h5 className="font-bold text-sm text-red-700 dark:text-red-400">Yêu cầu vô hiệu hóa tài khoản</h5>
                        <p className="text-xs text-red-500 mt-1 max-w-md">Gửi yêu cầu tới Quản trị viên để khóa tài khoản. Bạn sẽ không thể đăng nhập sau khi vô hiệu hóa.</p>
                    </div>
                    <button className="px-4 py-2 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 font-bold rounded-lg text-sm bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors whitespace-nowrap">
                        Yêu cầu khóa
                    </button>
                </div>
            </div>

        </div>
    );
};
