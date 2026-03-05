// js/components/AccountProfile.jsx
const { useState } = React;

window.Components.AccountProfile = ({ currentUser, isDarkMode }) => {
    const { Check, PenSquare, Shield } = window.Icons;
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    return (
        <div className="animate-fade-in flex flex-col h-full">
            <div className="mb-6 pb-2 border-b border-slate-200 dark:border-slate-700 flex justify-between items-end shrink-0">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Hồ sơ cá nhân</h3>

                <div className="flex items-center gap-2">
                    {isEditingProfile ? (
                        <>
                            <button
                                onClick={() => setIsEditingProfile(false)}
                                className={`text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800`}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => setIsEditingProfile(false)}
                                className={`text-sm font-bold flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700 shadow-sm`}
                            >
                                <Check className="w-4 h-4" /> Lưu
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditingProfile(true)}
                            className={`text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800`}
                        >
                            <PenSquare className="w-4 h-4" /> Chỉnh sửa
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1">
                <div className={`rounded-xl border shadow-sm overflow-hidden mb-6 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className={`p-8 border-b flex flex-col sm:flex-row items-center gap-6 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50/50 border-slate-50'}`}>
                        <div className="relative group cursor-pointer">
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Administrator')}&background=6366f1&color=fff&size=128`} className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-700 shadow-md object-cover" />
                            {isEditingProfile && <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center"><i className="text-white text-xs">Sửa</i></div>}
                        </div>
                        <div className="text-center sm:text-left">
                            <h4 className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{currentUser?.name || "Administrator"}</h4>
                            <p className="text-sm text-slate-500 font-medium">ID: #839201 • Super Admin</p>
                            <p className="text-xs text-slate-400 mt-2">Thành viên từ: 20/10/2023</p>
                        </div>
                    </div>

                    {isEditingProfile ? (
                        <div className={`p-8 grid grid-cols-1 md:grid-cols-2 gap-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50/50'}`}>
                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Họ</label>
                                <input type="text" defaultValue="Nguyễn" className={`w-full px-4 py-2.5 border rounded-lg text-sm ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`} />
                            </div>
                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Tên</label>
                                <input type="text" defaultValue={currentUser?.name?.split(' ').pop() || "Admin"} className={`w-full px-4 py-2.5 border rounded-lg text-sm ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`} />
                            </div>
                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Tên hiển thị</label>
                                <input type="text" defaultValue={currentUser?.name || "Administrator"} className={`w-full px-4 py-2.5 border rounded-lg text-sm ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`} />
                            </div>
                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Username hệ thống</label>
                                <input type="text" defaultValue={currentUser?.email?.split('@')[0] || "admin"} className={`w-full px-4 py-2.5 border rounded-lg text-sm ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`} />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Email</label>
                                <input type="email" defaultValue={currentUser?.email || "admin@rinoedu.com"} disabled className={`w-full px-4 py-2.5 border rounded-lg text-sm cursor-not-allowed ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`} />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Giới thiệu</label>
                                <textarea rows="3" defaultValue="Quản trị viên hệ thống." className={`w-full px-4 py-2.5 border rounded-lg text-sm ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`}></textarea>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                            <div><label className="block text-xs uppercase text-slate-400 font-bold mb-2">Họ và tên</label><p className={`font-medium text-base border-b pb-2 ${isDarkMode ? 'text-slate-200 border-slate-700' : 'text-slate-800 border-slate-100'}`}>{currentUser?.name || "Administrator"}</p></div>
                            <div><label className="block text-xs uppercase text-slate-400 font-bold mb-2">Tên hiển thị</label><p className={`font-medium text-base border-b pb-2 ${isDarkMode ? 'text-slate-200 border-slate-700' : 'text-slate-800 border-slate-100'}`}>{currentUser?.name || "Administrator"}</p></div>
                            <div><label className="block text-xs uppercase text-slate-400 font-bold mb-2">Username</label><p className={`font-medium text-base border-b pb-2 ${isDarkMode ? 'text-slate-200 border-slate-700' : 'text-slate-800 border-slate-100'}`}>{currentUser?.email?.split('@')[0] || "admin"}</p></div>
                            <div><label className="block text-xs uppercase text-slate-400 font-bold mb-2">Email</label><p className={`font-medium text-base border-b pb-2 ${isDarkMode ? 'text-slate-200 border-slate-700' : 'text-slate-800 border-slate-100'}`}>{currentUser?.email || "admin@rinoedu.com"}</p></div>
                            <div className="md:col-span-2"><label className="block text-xs uppercase text-slate-400 font-bold mb-2">Giới thiệu</label><p className={`italic ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Quản trị viên hệ thống.</p></div>
                        </div>
                    )}
                </div>

                <div className={`rounded-xl border shadow-sm overflow-hidden p-6 mb-6 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <h4 className={`text-sm font-bold mb-4 uppercase tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Định danh tài khoản (KYC)</h4>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-orange-50 dark:bg-orange-900/10 p-5 rounded-xl border border-orange-100 dark:border-orange-900/30">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 shrink-0">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className={`text-lg font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Chưa xác minh</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">Vui lòng cung cấp CCCD/Hộ chiếu để xác thực danh tính.</p>
                            </div>
                        </div>
                        <button className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-700 text-orange-600 dark:text-orange-400 font-bold text-sm rounded-lg hover:bg-orange-50 dark:hover:bg-slate-700 shadow-sm transition-all shrink-0">
                            Bắt đầu xác minh
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
