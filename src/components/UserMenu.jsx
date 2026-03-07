// js/components/UserMenu.jsx
const { useState } = React;
const { ChevronDown, Search, User, Building, Check, MapPin, Settings, Moon, Sun, LayoutGrid, Bell, LogOut } = window.Icons;

window.Components = window.Components || {};

window.Components.UserMenu = ({
    showUserMenu, setShowUserMenu, isDarkMode, setIsDarkMode,
    isExpandedMode, setIsExpandedMode, notificationsEnabled, setNotificationsEnabled,
    workLocation, setWorkLocation,
    workStatus, setWorkStatus, showLocationModal, setShowLocationModal,
    showSettingsModal, setShowSettingsModal, onOpenApp, onLogout, currentUser
}) => {
    const WORK_LOCATIONS = window.Data.WORK_LOCATIONS;
    const [lang, setLang] = useState('vi');

    if (!showUserMenu) return null;

    return (
        <div className={`fixed bottom-0 left-0 right-0 w-full md:w-80 md:top-16 md:right-4 md:left-auto md:bottom-auto rounded-t-2xl md:rounded-2xl shadow-2xl border z-[60] animate-slide-up-mobile md:animate-scaleIn glass-panel ${isDarkMode ? 'border-slate-700 text-white' : 'border-slate-200 text-slate-800'} md:overflow-visible overflow-hidden`} onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-t-2xl md:rounded-t-2xl">
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 shadow-md p-0.5 border-2 border-white dark:border-slate-700 overflow-visible">
                    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-full flex justify-center items-center font-bold text-slate-500 overflow-hidden">
                        {currentUser?.name?.substring(0, 2)?.toUpperCase() || 'AD'}
                    </div>
                    <div className="absolute -bottom-0.5 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold truncate">{currentUser?.name || 'Administrator'}</h4>
                    <p className="text-xs opacity-70 truncate">{currentUser?.email || 'admin@enterprise.com'}</p>
                    <button onClick={() => { onOpenApp('account_manager'); setShowUserMenu(false); }} className="text-[10px] text-blue-600 hover:underline mt-0.5 font-medium">Quản lý tài khoản</button>
                </div>
                <button onClick={() => setShowUserMenu(false)} className="md:hidden p-2 bg-slate-100 dark:bg-slate-700 rounded-full"><ChevronDown className="w-4 h-4" /></button>
            </div>

            <div className="p-2 bg-slate-50 dark:bg-slate-900 flex flex-col gap-1 pb-6 md:pb-2 rounded-b-2xl md:rounded-b-2xl">
                {/* Location Button */}
                <div className="relative group" onClick={(e) => { e.stopPropagation(); setShowLocationModal(!showLocationModal); setShowSettingsModal(false); }}>
                    <button className="w-full flex items-center gap-3 p-2 text-sm text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition font-medium justify-between group-hover:bg-slate-100 dark:group-hover:bg-slate-700">
                        <div className="flex items-center gap-3"><MapPin className="w-4 h-4" /> Vị trí làm việc</div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 group-hover:bg-white truncate max-w-[80px]">{workLocation.name}</span>
                            <ChevronDown className="w-3 h-3 opacity-50 md:-rotate-90" />
                        </div>
                    </button>

                    {/* Location Modal Popover */}
                    {showLocationModal && (
                        <div className="absolute right-full bottom-0 mr-2 w-72 rounded-2xl shadow-xl glass-panel animate-scaleIn z-[80] overflow-hidden text-sm hidden md:block">
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                                <h3 className="font-bold flex items-center gap-2"><MapPin className="w-4 h-4" /> Vị trí làm việc</h3>
                                <button onClick={(e) => { e.stopPropagation(); alert('Tính năng thêm địa điểm'); }} className="text-xs text-blue-600 hover:underline font-medium">Thêm</button>
                            </div>
                            <div className="p-3 space-y-2">
                                <div className="space-y-1 mb-2">
                                    {WORK_LOCATIONS.map(loc => (
                                        <button key={loc.id} onClick={() => setWorkLocation(loc)} className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition ${workLocation.id === loc.id ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${loc.type === 'office' ? 'bg-indigo-500' : 'bg-orange-500'}`}></div>
                                                <span className="truncate max-w-[160px] text-left text-xs">{loc.name}</span>
                                            </div>
                                            {workLocation.id === loc.id && <Check className="w-3.5 h-3.5" />}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                                    <button onClick={() => setWorkStatus('onsite')} className={`flex-1 py-1 text-[10px] font-bold rounded transition ${workStatus === 'onsite' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>Onsite</button>
                                    <button onClick={() => setWorkStatus('online')} className={`flex-1 py-1 text-[10px] font-bold rounded transition ${workStatus === 'online' ? 'bg-white dark:bg-slate-600 shadow-sm text-green-600 dark:text-green-400' : 'text-slate-500'}`}>Online</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Settings Button */}
                <div className="relative group" onClick={(e) => { e.stopPropagation(); setShowSettingsModal(!showSettingsModal); setShowLocationModal(false); }}>
                    <button className="w-full flex items-center gap-3 p-2 text-sm text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition font-medium group-hover:bg-slate-100 dark:group-hover:bg-slate-700 justify-between">
                        <div className="flex items-center gap-3"><Settings className="w-4 h-4" /> Cài đặt</div>
                        <ChevronDown className="w-3 h-3 opacity-50 md:-rotate-90" />
                    </button>

                    {/* Settings Modal Popover */}
                    {showSettingsModal && (
                        <div className="absolute right-full bottom-0 mr-2 w-72 rounded-2xl shadow-xl glass-panel animate-scaleIn z-[80] overflow-hidden text-sm hidden md:block">
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                                <h3 className="font-bold flex items-center gap-2"><Settings className="w-4 h-4" /> Cài đặt nhanh</h3>
                            </div>
                            <div className="p-3 space-y-2">
                                <div className="text-xs font-bold opacity-50 uppercase tracking-wider px-2">Giao diện</div>
                                <div className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-white/50 dark:hover:bg-slate-700 transition" onClick={() => setIsDarkMode(!isDarkMode)}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-600'}`}>{isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}</div>
                                        <span>Chế độ tối</span>
                                    </div>
                                    <div className={`w-8 h-4 rounded-full flex items-center transition-all p-0.5 ${isDarkMode ? 'bg-indigo-500 justify-end' : 'bg-slate-300 justify-start'}`}><div className="w-3 h-3 bg-white rounded-full shadow-sm"></div></div>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-white/50 dark:hover:bg-slate-700 transition" onClick={() => setIsExpandedMode(!isExpandedMode)}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-md ${isExpandedMode ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600'}`}><LayoutGrid className="w-4 h-4" /></div>
                                        <span>Mở rộng</span>
                                    </div>
                                    <div className={`w-8 h-4 rounded-full flex items-center transition-all p-0.5 ${isExpandedMode ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}><div className="w-3 h-3 bg-white rounded-full shadow-sm"></div></div>
                                </div>

                                <div className="text-xs font-bold opacity-50 uppercase tracking-wider px-2 mt-2 border-t border-slate-100 dark:border-slate-700 pt-2">Ngôn ngữ / Language</div>
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-2">
                                    <button onClick={(e) => { e.stopPropagation(); setLang('vi'); }} className={`flex-1 py-1.5 text-xs font-bold rounded transition ${lang === 'vi' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>Tiếng Việt</button>
                                    <button onClick={(e) => { e.stopPropagation(); setLang('en'); }} className={`flex-1 py-1.5 text-xs font-bold rounded transition ${lang === 'en' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>English</button>
                                </div>

                                <div className="text-xs font-bold opacity-50 uppercase tracking-wider px-2 mt-2 border-t border-slate-100 dark:border-slate-700 pt-2">Hệ thống</div>
                                <div className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-white/50 dark:hover:bg-slate-700 transition" onClick={() => setNotificationsEnabled(!notificationsEnabled)}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-md ${notificationsEnabled ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-600'}`}><Bell className="w-4 h-4" /></div>
                                        <span>Thông báo</span>
                                    </div>
                                    <div className={`w-8 h-4 rounded-full flex items-center transition-all p-0.5 ${notificationsEnabled ? 'bg-rose-500 justify-end' : 'bg-slate-300 justify-start'}`}><div className="w-3 h-3 bg-white rounded-full shadow-sm"></div></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-full h-px bg-slate-200 dark:bg-slate-700 my-1"></div>

                <button onClick={onLogout} className="w-full flex items-center gap-3 p-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition font-medium"><LogOut className="w-4 h-4" /> Đăng xuất</button>
            </div>
        </div>
    );
};
