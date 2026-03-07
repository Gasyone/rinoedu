// js/components/Header.jsx
window.Components = window.Components || {};

const SafeIcon = ({ iconName, className = "" }) => {
    const IconComponent = window.Icons && window.Icons[iconName];
    if (IconComponent) return <IconComponent className={className} />;
    return <div className={`w-4 h-4 bg-slate-200 rounded-sm animate-pulse ${className}`} title={`Missing icon: ${iconName}`}></div>;
};

window.Components.Header = ({
    currentUser, currentApp, isDarkMode, setShowGlobalSearch,
    showNotifications, setShowNotifications, unreadCount,
    showUserMenu, setShowUserMenu, setShowSettingsModal, setShowLocationModal,
    groupedNotifications, notifFilter, setNotifFilter, markAsRead, markAllAsRead,
    notifications, isDevAIOpen, setIsDevAIOpen, breadcrumb
}) => {
    const { Search, Bell, ChevronDown, ChevronRight } = window.Icons || {};
    const {
        Sliders, CheckSquare, X, Briefcase, Video, Shield, Check, Sparkles,
        MessageSquare, AlertCircle, Star
    } = window.Icons || {};

    // Work status indicator on avatar
    const workStatus = 'online'; // could be prop later

    return (
        <header className={`h-14 flex items-center justify-between px-4 md:px-5 z-30 sticky top-0 backdrop-blur-md border-b transition-colors flex-shrink-0 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-100'}`}>
            {/* LEFT: App breadcrumb */}
            <div className="flex items-center gap-2 min-w-0">
                <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${currentApp.color.replace('text', 'bg').replace('500', '100').replace('600', '100')}`}>
                    <currentApp.icon className={`w-4 h-4 ${currentApp.color}`} />
                </div>
                <span className={`font-bold text-sm truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{currentApp.name}</span>
                {breadcrumb && (
                    <>
                        <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
                        <span className={`text-sm truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{breadcrumb}</span>
                    </>
                )}
            </div>


            <div className="flex items-center gap-2 md:gap-3">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition cursor-pointer ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-white hover:shadow-sm'}`} onClick={() => setShowGlobalSearch(true)}>
                    <Search className="w-4 h-4" />
                    <span className="text-xs hidden md:inline">Tìm kiếm <kbd className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded border ${isDarkMode ? 'border-slate-600 bg-slate-700' : 'border-slate-200 bg-white'}`}>⌘K</kbd></span>
                </div>

                <div className="relative flex items-center gap-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsDevAIOpen(!isDevAIOpen);
                        }}
                        className={`relative p-2 rounded-full transition flex items-center justify-center ${isDevAIOpen ? (isDarkMode ? 'bg-indigo-900/40 text-indigo-300' : 'bg-indigo-50 text-indigo-600') : (isDarkMode ? 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100')}`}
                        title="Hỏi RinoAI"
                    >
                        <Sparkles className="w-5 h-5" />
                        {isDevAIOpen && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-900 animate-pulse" />}
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowNotifications(!showNotifications);
                        }}
                        className={`p-2 rounded-full transition relative ${showNotifications ? 'bg-blue-50 text-blue-600 dark:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 px-1">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* NOTIFICATION DROPDOWN */}
                    {showNotifications && (
                        <div className="fixed inset-0 z-[100] md:absolute md:inset-auto md:top-12 md:right-0 w-full md:w-96 md:rounded-2xl shadow-xl border overflow-hidden animate-fadeIn glass-panel bg-white/95 dark:bg-slate-900/95 border-slate-100 dark:border-slate-700 flex flex-col md:block" onClick={e => e.stopPropagation()}>
                            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white/50 dark:bg-slate-800/50">
                                <h3 className="font-bold text-sm text-slate-800 dark:text-white">Thông báo ({unreadCount})</h3>
                                <div className="flex items-center gap-2">
                                    <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-400" title="Cài đặt thông báo"><Sliders className="w-4 h-4" /></button>
                                    <button onClick={markAllAsRead} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-400" title="Đánh dấu tất cả là đã đọc"><CheckSquare className="w-4 h-4" /></button>
                                    <button onClick={() => setShowNotifications(false)} className="md:hidden p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-400"><X className="w-4 h-4" /></button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-1 px-4 py-2 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30">
                                <button onClick={() => setNotifFilter('all')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${notifFilter === 'all' ? 'bg-white shadow-sm text-slate-800 dark:bg-slate-700 dark:text-white' : 'text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'}`}>Tất cả</button>
                                <button onClick={() => setNotifFilter('unread')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${notifFilter === 'unread' ? 'bg-white shadow-sm text-blue-600 dark:bg-slate-700 dark:text-blue-400' : 'text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'}`}>Chưa đọc</button>
                                <button onClick={() => setNotifFilter('high')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${notifFilter === 'high' ? 'bg-white shadow-sm text-red-600 dark:bg-slate-700 dark:text-red-400' : 'text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'}`}>Quan trọng</button>
                            </div>

                            <div className="flex-1 overflow-y-auto hover-scroll p-2 max-h-[calc(100vh-140px)] md:max-h-[400px]">
                                {/* Group: Today */}
                                {groupedNotifications.today && groupedNotifications.today.length > 0 && (
                                    <div className="mb-2">
                                        <h4 className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hôm nay</h4>
                                        {groupedNotifications.today.map(n => (
                                            <div key={n.id} className={`group p-3 rounded-xl mb-1 flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer relative overflow-hidden ${!n.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                                {!n.read && <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-blue-500 rounded-r-full"></div>}
                                                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${n.type === 'work' ? 'bg-green-100 text-green-600' : n.type === 'meeting' ? 'bg-purple-100 text-purple-600' : n.type === 'security' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                                    {n.type === 'work' ? <Briefcase className="w-5 h-5" /> : n.type === 'meeting' ? <Video className="w-5 h-5" /> : n.type === 'security' ? <Shield className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <p className={`text-sm truncate pr-2 ${!n.read ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>{n.title}</p>
                                                        <span className="text-[10px] text-slate-400 whitespace-nowrap flex-shrink-0">{n.time}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.desc}</p>
                                                    <div className="flex gap-2 mt-2">
                                                        {n.priority === 'high' && <span className="text-[9px] font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded border border-red-200 dark:border-red-800/50">Quan trọng</span>}
                                                        <span className="text-[9px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600 uppercase">{n.type}</span>
                                                    </div>
                                                    {n.actionable && n.status === 'pending' && (
                                                        <div className="flex gap-2 mt-3 mb-1">
                                                            <button onClick={(e) => { e.stopPropagation(); }} className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">Phê duyệt</button>
                                                            <button onClick={(e) => { e.stopPropagation(); }} className="flex-1 py-1.5 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors shadow-sm">Từ chối</button>
                                                        </div>
                                                    )}
                                                    {n.actionable && n.status === 'approved' && (
                                                        <div className="mt-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md inline-flex border border-emerald-100 dark:border-emerald-800/30">
                                                            <Check className="w-3 h-3" /> Đã phê duyệt
                                                        </div>
                                                    )}
                                                    {n.actionable && n.status === 'rejected' && (
                                                        <div className="mt-2 text-[10px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md inline-flex border border-red-100 dark:border-red-800/30">
                                                            <X className="w-3 h-3" /> Đã từ chối
                                                        </div>
                                                    )}
                                                </div>

                                                <div className={`flex flex-col gap-1 md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity justify-center ml-2 ${!n.read ? '' : 'hidden'}`}>
                                                    {!n.read && (
                                                        <button onClick={(e) => markAsRead(e, n.id)} className="p-1.5 rounded-full hover:bg-blue-100 text-blue-500" title="Đánh dấu đã đọc">
                                                            <Check className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Group: Yesterday/Earlier */}
                                {groupedNotifications.yesterday && groupedNotifications.yesterday.length > 0 && (
                                    <div>
                                        <h4 className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">Trước đó</h4>
                                        {groupedNotifications.yesterday.map(n => (
                                            <div key={n.id} className="group p-3 rounded-xl mb-1 flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer opacity-75 hover:opacity-100 relative overflow-hidden">
                                                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500`}>
                                                    {n.type === 'work' ? <Briefcase className="w-5 h-5" /> : n.type === 'meeting' ? <Video className="w-5 h-5" /> : n.type === 'security' ? <Shield className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{n.title}</p>
                                                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.desc}</p>
                                                    {n.actionable && n.status === 'pending' && (
                                                        <div className="flex gap-2 mt-3 mb-1">
                                                            <button onClick={(e) => { e.stopPropagation(); }} className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">Phê duyệt</button>
                                                            <button onClick={(e) => { e.stopPropagation(); }} className="flex-1 py-1.5 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors shadow-sm">Từ chối</button>
                                                        </div>
                                                    )}
                                                    {n.actionable && n.status === 'approved' && (
                                                        <div className="mt-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md inline-flex border border-emerald-100 dark:border-emerald-800/30">
                                                            <Check className="w-3 h-3" /> Đã phê duyệt
                                                        </div>
                                                    )}
                                                    {n.actionable && n.status === 'rejected' && (
                                                        <div className="mt-2 text-[10px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md inline-flex border border-red-100 dark:border-red-800/30">
                                                            <X className="w-3 h-3" /> Đã từ chối
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {notifications.length === 0 && <div className="p-8 text-center text-slate-400 text-xs">Không có thông báo mới</div>}
                            </div>
                            <div className="p-2 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 mt-auto md:mt-0">
                                <button onClick={() => { setShowNotifications(false); if (window.__handleOpenApp) window.__handleOpenApp('social'); }} className="w-full py-2 text-xs font-bold text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition">Xem tất cả thông báo</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* USER AVATAR + WORKSPACE INFO */}
                <button onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                    setShowSettingsModal(false);
                    setShowNotifications(false);
                    setShowLocationModal(false);
                }} className={`flex items-center gap-3 pl-1 pr-2 py-1 rounded-full border transition group ${showUserMenu ? 'bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700' : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 shadow-sm border border-white dark:border-slate-700 flex items-center justify-center font-bold text-white text-xs">
                        {currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : '?'}
                    </div>

                    <ChevronDown className="w-3 h-3 text-slate-400 hidden md:block group-hover:text-slate-600" />
                </button>
            </div>
        </header>
    );
};
