// js/components/AccountSecurity.jsx
const { useState } = React;

window.Components.AccountSecurity = ({ isDarkMode }) => {
    const { Key, ChevronDown, Smartphone, MessageSquare, Shield, List, Monitor, LogOut, History, Users, Grid3x3, QrCode } = window.Icons || {};

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isTwoFAEnabled, setIsTwoFAEnabled] = useState(true);
    const [isSMSModalOpen, setIsSMSModalOpen] = useState(false);
    const [isAuthAppModalOpen, setIsAuthAppModalOpen] = useState(false);
    const [isBackupCodesModalOpen, setIsBackupCodesModalOpen] = useState(false);

    const [isEditingRecovery, setIsEditingRecovery] = useState(false);
    const [recoveryData, setRecoveryData] = useState({ email: 'n***@gmail.com', phone: '098****123' });
    const [tempRecoveryData, setTempRecoveryData] = useState(recoveryData);

    const [connectedAccounts, setConnectedAccounts] = useState({ google: true, facebook: false, apple: false });
    const [authorizedApps, setAuthorizedApps] = useState([
        { id: '1', name: 'Rino CRM', access: 'Đọc & Ghi', date: '21/10/2023', icon: window.Icons.Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { id: '2', name: 'Rino Chat Mobile', access: 'Đọc', date: '05/11/2023', icon: window.Icons.MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' }
    ]);
    const [sessions, setSessions] = useState([
        { id: '1', name: 'Windows - Chrome', type: 'desktop', location: 'Hà Nội, VN', time: 'Đang hoạt động', current: true },
        { id: '2', name: 'iPhone 13 Pro', type: 'mobile', location: 'Hồ Chí Minh, VN', time: 'Hôm qua, 14:30', current: false },
        { id: '3', name: 'MacBook Pro', type: 'desktop', location: 'Đà Nẵng, VN', time: '10/12/2023', current: false }
    ]);

    const [confirmModal, setConfirmModal] = useState({ open: false, title: '', message: '', onConfirm: null, type: 'danger' });

    const handleSaveRecovery = () => { setRecoveryData(tempRecoveryData); setIsEditingRecovery(false); };
    const handleCancelRecovery = () => { setTempRecoveryData(recoveryData); setIsEditingRecovery(false); };
    const handleToggleSocial = (platform) => { setConnectedAccounts(prev => ({ ...prev, [platform]: !prev[platform] })); };

    const handleRevokeApp = (app) => {
        setConfirmModal({
            open: true, title: `Thu hồi quyền truy cập`, message: `Bạn có chắc chắn muốn thu hồi quyền truy cập của ứng dụng "${app.name}" không?`, type: 'danger',
            onConfirm: () => { setAuthorizedApps(prev => prev.filter(a => a.id !== app.id)); setConfirmModal({ open: false, title: '', message: '', onConfirm: null }); }
        });
    };

    const handleLogoutDevice = (session) => {
        setConfirmModal({
            open: true, title: `Đăng xuất thiết bị`, message: `Đăng xuất khỏi thiết bị "${session.name}"? Bạn sẽ cần đăng nhập lại trên thiết bị đó.`, type: 'danger',
            onConfirm: () => { setSessions(prev => prev.filter(s => s.id !== session.id)); setConfirmModal({ open: false, title: '', message: '', onConfirm: null }); }
        });
    };

    const handleLogoutAll = () => {
        setConfirmModal({
            open: true, title: `Đăng xuất tất cả`, message: `Bạn sẽ bị đăng xuất khỏi TẤT CẢ các thiết bị khác, ngoại trừ thiết bị hiện tại.`, type: 'danger',
            onConfirm: () => { setSessions(prev => prev.filter(s => s.current)); setConfirmModal({ open: false, title: '', message: '', onConfirm: null }); }
        });
    };

    return (
        <div className="animate-fade-in flex flex-col gap-6 pb-10 relative">
            <div className="mb-2 border-b border-slate-200 dark:border-slate-700 pb-4">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Bảo mật & Liên kết</h3>
                <p className="text-sm text-slate-500">Quản lý mật khẩu, bảo mật 2 lớp và các ứng dụng liên kết.</p>
            </div>

            {/* SECTION 1: SECURITY */}
            <div className="grid gap-6">
                <h4 className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Bảo mật (Security)</h4>

                <div className={`p-4 rounded-xl border shadow-sm cursor-pointer hover:shadow-md transition-shadow ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-blue-300'}`} onClick={() => setIsPasswordModalOpen(true)}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Key className="w-5 h-5" /></div>
                            <div>
                                <h5 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Đổi mật khẩu</h5>
                                <p className="text-xs text-slate-500">Thay đổi mật khẩu hiện tại của bạn để bảo vệ tài khoản.</p>
                            </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-slate-400 -rotate-90" />
                    </div>
                </div>

                <div className={`p-6 rounded-xl border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-100 dark:border-slate-700 pb-6">
                        <div>
                            <h5 className={`font-bold text-base flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                <Smartphone className="w-4 h-4 text-purple-500" /> Xác thực hai bước (2FA)
                            </h5>
                            <p className="text-xs text-slate-500 mt-1">Tăng cường bảo mật bằng cách yêu cầu mã xác nhận khi đăng nhập.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`text-xs font-bold ${isTwoFAEnabled ? 'text-green-500' : (isDarkMode ? 'text-slate-300' : 'text-slate-600')}`}>
                                {isTwoFAEnabled ? 'Đang bật' : 'Đang tắt'}
                            </span>
                            <button
                                onClick={() => setIsTwoFAEnabled(!isTwoFAEnabled)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${isTwoFAEnabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${isTwoFAEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    </div>

                    {isTwoFAEnabled && (
                        <div className="space-y-4 animate-slide-up">
                            <div className={`p-4 rounded-lg border flex items-center justify-between ${isDarkMode ? 'border-slate-700 bg-slate-900/50' : 'border-slate-100 bg-slate-50'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><MessageSquare className="w-4 h-4" /></div>
                                    <div>
                                        <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Tin nhắn SMS</p>
                                        <p className="text-xs text-slate-500">Gửi mã OTP qua số điện thoại.</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsSMSModalOpen(true)} className="text-xs font-bold text-blue-600 hover:underline">Thiết lập</button>
                            </div>
                            <div className={`p-4 rounded-lg border flex items-center justify-between ${isDarkMode ? 'border-slate-700 bg-slate-900/50' : 'border-slate-100 bg-slate-50'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><Shield className="w-4 h-4" /></div>
                                    <div>
                                        <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Ứng dụng xác thực</p>
                                        <p className="text-xs text-slate-500">Khuyên dùng</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsAuthAppModalOpen(true)} className="text-xs font-bold text-blue-600 hover:underline">Thiết lập</button>
                            </div>
                            <div className="pt-2">
                                <button onClick={() => setIsBackupCodesModalOpen(true)} className={`text-sm font-bold flex items-center gap-2 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                                    <List className="w-4 h-4" /> Quản lý mã dự phòng
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className={`p-6 rounded-xl border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <h5 className={`font-bold text-base mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        <Monitor className="w-4 h-4 text-emerald-500" /> Thiết bị & Phiên đăng nhập
                    </h5>
                    <div className="space-y-3">
                        {sessions.map(session => (
                            <div key={session.id} className={`p-3 rounded-lg flex justify-between items-center ${session.current ? (isDarkMode ? 'bg-slate-900/50 border-l-4 border-l-green-500 border-t border-r border-b border-slate-700' : 'bg-white border-l-4 border-l-green-500 border border-slate-100') : (isDarkMode ? 'bg-slate-900/50 border border-slate-700' : 'bg-white border border-slate-100')}`}>
                                <div className="flex items-center gap-3">
                                    {session.type === 'desktop' ? <Monitor className="w-5 h-5 text-slate-400" /> : <Smartphone className="w-5 h-5 text-slate-400" />}
                                    <div>
                                        <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{session.name}</p>
                                        <p className="text-xs text-slate-500">{session.location} • {session.time}</p>
                                    </div>
                                </div>
                                {session.current ? (
                                    <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded">THIS DEVICE</span>
                                ) : (
                                    <button onClick={() => handleLogoutDevice(session)} className="text-xs text-red-500 hover:underline font-medium">Đăng xuất</button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm flex items-center justify-center animate-fade-in p-4" onClick={() => setIsPasswordModalOpen(false)}>
                    <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl animate-scaleIn ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
                        <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Đổi mật khẩu</h3>
                        <div className="flex justify-end gap-3 pt-4">
                            <button onClick={() => setIsPasswordModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500">Hủy</button>
                            <button onClick={() => setIsPasswordModalOpen(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">Cập nhật</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
