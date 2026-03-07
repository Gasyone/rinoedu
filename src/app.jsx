// js/app.jsx
const { useState, useMemo, useEffect, useRef } = React;
// Removed brittle destructuring of window.Components and window.Icons at the top
// to avoid 'undefined' issues during initial Babel transpilation.


const { ALL_APP_LIBRARY, WORK_LOCATIONS, NOTIFICATIONS_MOCK } = window.Data;
const MenuIcon = window.Icons?.Menu || (() => null);
const HomeIcon = window.Icons?.Home || (() => null);
const PlusIcon = window.Icons?.Plus || (() => null);

function App() {
    // --- STATE ---
    const [myAppIds, setMyAppIds] = useState(['square_home', 'dashboard', 'account_manager', 'social', 'chat', 'work', 'directory', 'wallet', 'assets']);
    const [pinnedAppIds, setPinnedAppIds] = useState(['square_home', 'dashboard', 'social', 'chat', 'work', 'directory', 'wallet', 'assets']);
    const [activeModuleId, setActiveModuleId] = useState('dashboard');

    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const [showAppLauncher, setShowAppLauncher] = useState(false);
    const [showGlobalSearch, setShowGlobalSearch] = useState(false);
    const [isDevAIOpen, setIsDevAIOpen] = useState(false); // New state for AI Sidebar toggle
    const [isSwitchingModule, setIsSwitchingModule] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentView, setCurrentView] = useState('square'); // 'square' | 'login' | 'workspace'
    const [isLoading, setIsLoading] = useState(true); // Added for initial loading effect
    const [showShortcutGuide, setShowShortcutGuide] = useState(false);

    // Initial Loading Effect
    useEffect(() => {
        const initAuth = async () => {
            // Check stored session
            const sessionStr = localStorage.getItem('rino_auth_session');
            const tokenStr = localStorage.getItem('rino_auth_token');
            let hasValidToken = false;
            let activeToken = null;

            if (sessionStr) {
                try {
                    const session = JSON.parse(sessionStr);
                    if (session.expiry && Date.now() > session.expiry) {
                        localStorage.removeItem('rino_auth_session');
                    } else {
                        hasValidToken = !!session.token;
                        activeToken = session.token;
                    }
                } catch (e) {
                    localStorage.removeItem('rino_auth_session');
                }
            } else if (tokenStr) {
                hasValidToken = true;
                activeToken = tokenStr;
            }

            if (hasValidToken && activeToken) {
                // Fetch user profile based on token if needed, or bypass explicitly
                // Here we just mock the authenticated state or restore simple profile
                const savedUserStr = localStorage.getItem('rino_user_profile');
                if (savedUserStr) {
                    try {
                        setCurrentUser(JSON.parse(savedUserStr));
                    } catch (e) { }
                } else {
                    setCurrentUser({ name: 'Member', email: 'user@rinoedu.com' });
                }
                setIsAuthenticated(true);

                // Deep link support based on initial URL hash
                const hashPath = window.location.hash.replace('#/', '');
                if (hashPath && hashPath !== 'home' && window.Data.ALL_APP_LIBRARY[hashPath]) {
                    setActiveModuleId(hashPath);
                    setCurrentView('workspace');
                } else {
                    setCurrentView('square');
                }
            }

            // Intercept Keycloak or SSO redirect success
            const params = new URLSearchParams(window.location.search);
            if (params.get('code')) {
                // Return from Google OAuth callback -> Let LoginWebapp handle it
                setIsAuthenticated(false);
                setCurrentView('login');
            } else if (params.get('auth') === 'success') {
                setIsAuthenticated(true);
                setCurrentView('square');

                // Clean up the URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        };

        initAuth();
    }, []);

    // AI Tool Calling Event Listeners
    useEffect(() => {
        const handleAINavigate = (e) => {
            const { moduleId } = e.detail;
            if (moduleId && window.Data.ALL_APP_LIBRARY[moduleId]) {
                setActiveModuleId(moduleId);
                setCurrentView('workspace');
                window.location.hash = '#/' + moduleId;
            }
        };
        const handleAIToggleTheme = () => {
            setIsDarkMode(prev => !prev);
        };
        window.addEventListener('ai-navigate', handleAINavigate);
        window.addEventListener('ai-toggle-theme', handleAIToggleTheme);
        return () => {
            window.removeEventListener('ai-navigate', handleAINavigate);
            window.removeEventListener('ai-toggle-theme', handleAIToggleTheme);
        };
    }, []);

    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const [hoverTooltip, setHoverTooltip] = useState(null);

    // Notification State
    const [notifications, setNotifications] = useState(NOTIFICATIONS_MOCK);
    const [notifFilter, setNotifFilter] = useState('all');

    // Dashboard Personalization State
    const [dailyFocus, setDailyFocus] = useState(() => localStorage.getItem('dailyFocus') || '');
    const [shortcuts, setShortcuts] = useState([
        { id: 'mail', name: 'Email', icon: window.Icons.Mail, color: 'text-red-500', bg: 'bg-red-50' },
        { id: 'calendar', name: 'Lịch', icon: window.Icons.Calendar, color: 'text-green-600', bg: 'bg-green-50' },
        { id: 'chat', name: 'Chat', icon: window.Icons.MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 'docs', name: 'Tài liệu', icon: window.Icons.FileText, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    ]);

    // Settings
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isExpandedMode, setIsExpandedMode] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const [workLocation, setWorkLocation] = useState(WORK_LOCATIONS[0]);
    const [workStatus, setWorkStatus] = useState('onsite'); // 'online' | 'onsite'

    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedAppToBuy, setSelectedAppToBuy] = useState(null);

    // Handle resize events
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                if (!isSidebarOpen) setIsSidebarOpen(true);
            } else {
                if (isSidebarOpen) setIsSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Keyboard Shortcuts Listener
    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            // Ignore if typing in an input or textarea
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable) return;

            if (e.key === '?' || (e.shiftKey && e.key === '/')) {
                e.preventDefault();
                setShowShortcutGuide(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, []);

    useEffect(() => {
        if (activeModuleId === 'social') {
            // On mobile, keep sidebar closed
            if (window.innerWidth > 768) setIsSidebarOpen(false);
        } else {
            if (window.innerWidth > 768) setIsSidebarOpen(true);
        }
    }, [activeModuleId]);

    useEffect(() => {
        if (isDarkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [isDarkMode]);

    // Sync URL with current view/module (hash-based for static server compatibility)
    useEffect(() => {
        if (!isAuthenticated && currentView === 'login') return;

        let hash = '#/';
        if (currentView === 'workspace') {
            hash = `#/${activeModuleId}`;
        } else if (currentView === 'square') {
            hash = '#/home';
        }

        if (window.location.hash !== hash) {
            window.history.replaceState({}, '', hash);
        }
    }, [currentView, activeModuleId, isAuthenticated]);

    // --- ACTIONS ---
    const togglePinApp = (e, appId) => {
        e.stopPropagation();
        if (!myAppIds.includes(appId)) return;
        setPinnedAppIds(prev => prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]);
    };

    // New Install Logic with Payment
    const installApp = (e, appId) => {
        e.stopPropagation();
        if (myAppIds.includes(appId)) return;

        const app = ALL_APP_LIBRARY[appId];
        if (app.price === 'Free') {
            setMyAppIds(prev => [...prev, appId]);
        } else {
            // Trigger Payment Modal
            setSelectedAppToBuy(app);
            setPaymentModalOpen(true);
        }
    };

    const handlePaymentSuccess = () => {
        if (selectedAppToBuy) {
            setMyAppIds(prev => [...prev, selectedAppToBuy.id]);
            setPaymentModalOpen(false);
            setSelectedAppToBuy(null);
        }
    };

    const uninstallApp = (e, appId) => {
        e.stopPropagation();
        setMyAppIds(prev => prev.filter(id => id !== appId));
        setPinnedAppIds(prev => prev.filter(id => id !== appId));
    };

    const handleOpenApp = (moduleId) => {
        if (!myAppIds.includes(moduleId)) setMyAppIds(prev => [...prev, moduleId]);
        setShowAppLauncher(false);
        setShowGlobalSearch(false);
        setShowUserMenu(false);
        if (window.innerWidth <= 768) setIsSidebarOpen(false); // Close sidebar on mobile after click

        if (moduleId === 'square_home' || moduleId === 'square') {
            setCurrentView('square');
        } else {
            if (activeModuleId !== moduleId && currentView === 'workspace') {
                setIsSwitchingModule(true);
                setActiveModuleId(moduleId);
                setCurrentView('workspace');
                setTimeout(() => {
                    setIsSwitchingModule(false);
                }, 600);
            } else {
                setActiveModuleId(moduleId);
                setCurrentView('workspace');
            }
        }
    };
    // Expose to window so GlobalSearch can call it without prop drilling
    window.__handleOpenApp = handleOpenApp;



    // Notification Actions
    const markAsRead = (e, id) => {
        e.stopPropagation();
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const handleFocusChange = (e) => setDailyFocus(e.target.value);
    const handleFocusKeyDown = (e) => {
        if (e.key === 'Enter') {
            localStorage.setItem('dailyFocus', dailyFocus);
            e.target.blur();
        }
    };
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Chào buổi sáng';
        if (hour < 18) return 'Chào buổi chiều';
        return 'Chào buổi tối';
    };

    const currentApp = ALL_APP_LIBRARY[activeModuleId] || ALL_APP_LIBRARY.dashboard;

    // Notification Grouping Logic
    const groupedNotifications = useMemo(() => {
        let filtered = notifFilter === 'unread' ? notifications.filter(n => !n.read) :
            notifFilter === 'high' ? notifications.filter(n => n.priority === 'high') :
                notifications;

        const today = filtered.filter(n => n.group === 'today');
        const yesterday = filtered.filter(n => n.group === 'yesterday');

        return { today, yesterday };
    }, [notifFilter, notifications]);

    const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

    // MAIN RENDER
    if (currentView === 'square') {
        return (
            <div className="flex h-screen w-full relative">
                {window.Components.SquareHomepage ? (
                    <window.Components.SquareHomepage
                        isAuthenticated={isAuthenticated}
                        currentUser={currentUser}
                        onNavigateLogin={() => setCurrentView('login')}
                        onNavigateDashboard={() => {
                            const pendingModule = sessionStorage.getItem('rino_pending_module');
                            sessionStorage.removeItem('rino_pending_module');
                            setActiveModuleId(pendingModule || 'dashboard');
                            setCurrentView('workspace');
                        }}
                        onLogout={() => {
                            localStorage.removeItem('rino_auth_session');
                            localStorage.removeItem('rino_auth_token');
                            localStorage.removeItem('rino_user_profile');
                            setIsAuthenticated(false);
                            setCurrentView('square');
                        }}
                        showAppLauncher={showAppLauncher}
                        setShowAppLauncher={setShowAppLauncher}
                        isDevAIOpen={isDevAIOpen}
                        setIsDevAIOpen={setIsDevAIOpen}
                    />
                ) : <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-400">Đang khởi tạo RinoEdu...</div>}

                {/* Re-using the same global menus on top of the SquareHomepage */}
                {showUserMenu && isAuthenticated && (
                    <window.Components.UserMenu
                        showUserMenu={showUserMenu}
                        setShowUserMenu={setShowUserMenu}
                        currentUser={currentUser}
                        isDarkMode={isDarkMode}
                        setIsDarkMode={setIsDarkMode}
                        isExpandedMode={isExpandedMode}
                        setIsExpandedMode={setIsExpandedMode}
                        notificationsEnabled={notificationsEnabled}
                        setNotificationsEnabled={setNotificationsEnabled}
                        workLocation={workLocation}
                        setWorkLocation={setWorkLocation}
                        showLocationModal={showLocationModal}
                        setShowLocationModal={setShowLocationModal}
                        onLogout={() => {
                            localStorage.removeItem('rino_auth_session');
                            localStorage.removeItem('rino_auth_token');
                            localStorage.removeItem('rino_user_profile');
                            setIsAuthenticated(false);
                            setCurrentUser(null);
                            setShowUserMenu(false);
                            setCurrentView('square');
                        }}
                        setShowSettingsModal={setShowSettingsModal}
                        workStatus={workStatus}
                        setWorkStatus={setWorkStatus}
                        onOpenApp={(id) => {
                            handleOpenApp(id);
                            setCurrentView('workspace');
                        }}
                        isDevAIOpen={isDevAIOpen}
                        setIsDevAIOpen={setIsDevAIOpen}
                    />
                )}
                {showAppLauncher && isAuthenticated && (
                    <window.Components.AppLauncher
                        showAppLauncher={showAppLauncher}
                        setShowAppLauncher={setShowAppLauncher}
                        activeModuleId={activeModuleId}
                        handleOpenApp={(id) => {
                            if (id === 'square') {
                                setCurrentView('square');
                            } else {
                                handleOpenApp(id);
                                setCurrentView('workspace');
                            }
                            setShowAppLauncher(false);
                        }}
                        togglePinApp={togglePinApp}
                        pinnedAppIds={pinnedAppIds}
                        myAppIds={myAppIds}
                        isDarkMode={isDarkMode}
                    />
                )}

                {/* Dev AI Sidebar Overlay */}
                {isAuthenticated && window.Components.DevAISidebar && <window.Components.DevAISidebar isDarkMode={isDarkMode} isDevAIOpen={isDevAIOpen} setIsDevAIOpen={setIsDevAIOpen} />}
            </div>
        );
    }

    if (currentView === 'login') {
        return window.Components.LoginWebapp ? (
            <window.Components.LoginWebapp onLoginSuccess={(userProfile) => {
                setIsAuthenticated(true);
                setCurrentUser(userProfile || { name: 'Administrator', email: 'admin@enterprise.com' });
                setCurrentView('square');
            }} />
        ) : <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-400">Đang tải đăng nhập...</div>;
    }

    return (
        <div className="flex h-screen w-full" onClick={() => { setShowUserMenu(false); setShowSettingsModal(false); setShowLocationModal(false); setShowNotifications(false); setShowAppLauncher(false); }}>

            {/* LOADERS & PAYMENT MODAL */}
            {window.Components.PaymentModal && (
                <window.Components.PaymentModal
                    isOpen={paymentModalOpen}
                    app={selectedAppToBuy}
                    onClose={() => setPaymentModalOpen(false)}
                    onConfirm={handlePaymentSuccess}
                />
            )}

            {/* SIDEBAR & OVERLAYS */}
            {window.Components.Sidebar && (
                <window.Components.Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    activeModuleId={activeModuleId}
                    handleOpenApp={handleOpenApp}
                    pinnedAppIds={pinnedAppIds}
                    isDarkMode={isDarkMode}
                    setShowAppLauncher={setShowAppLauncher}
                    currentApp={currentApp}
                    setHoverTooltip={setHoverTooltip}
                />
            )}

            {/* MAIN AREA */}
            <div className={`flex-1 flex flex-col md:flex-row min-w-0 transition-all duration-300 ml-0 relative overflow-hidden ${isSidebarOpen ? 'md:ml-[60px]' : 'md:ml-0'}`}>

                {/* SUB SIDEBAR (Contextual Menu) */}
                {activeModuleId !== 'dashboard' && activeModuleId !== 'social' && activeModuleId !== 'account_manager' && (
                    <window.Components.SubSidebar
                        activeModuleId={activeModuleId}
                        isDarkMode={isDarkMode}
                        isOpen={true}
                    />
                )}

                {/* CONTENT AREA WITH HEADER */}
                <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto overflow-x-hidden relative">
                    {/* HEADER */}
                    {window.Components.Header && (
                        <window.Components.Header
                            currentUser={currentUser}
                            currentApp={currentApp}
                            isDarkMode={isDarkMode}
                            setShowGlobalSearch={setShowGlobalSearch}
                            showNotifications={showNotifications}
                            setShowNotifications={setShowNotifications}
                            unreadCount={unreadCount}
                            showUserMenu={showUserMenu}
                            setShowUserMenu={setShowUserMenu}
                            setShowSettingsModal={setShowSettingsModal}
                            setShowLocationModal={setShowLocationModal}
                            groupedNotifications={groupedNotifications}
                            markAsRead={markAsRead}
                            markAllAsRead={markAllAsRead}
                            notifications={notifications}
                            isDevAIOpen={isDevAIOpen}
                            setIsDevAIOpen={setIsDevAIOpen}
                        />
                    )}

                    {/* MOBILE HORIZONTAL APP NAVIGATION (Below Header) */}
                    <div className="md:hidden h-14 bg-white dark:bg-[#111827] border-b border-slate-100 dark:border-slate-800 flex items-center px-4 gap-4 overflow-x-auto no-scrollbar sticky top-16 z-20">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800`}>
                            {window.Icons?.Menu && <window.Icons.Menu className="w-5 h-5" />}
                        </button>
                        <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 flex-shrink-0"></div>

                        <button onClick={() => handleOpenApp('dashboard')} className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${activeModuleId === 'dashboard' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                            {window.Icons?.Home && <window.Icons.Home className="w-5 h-5" />}
                        </button>

                        <button onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu); setShowSettingsModal(false); setShowNotifications(false); }} className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 p-0.5 border-2 ${showUserMenu ? 'border-blue-500' : 'border-transparent'}`}>
                            <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 flex justify-center items-center font-bold text-slate-500 text-xs overflow-hidden">
                                {currentUser?.name?.substring(0, 2)?.toUpperCase() || ''}
                            </div>
                        </button>

                        <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 flex-shrink-0"></div>
                        {pinnedAppIds.filter(id => id !== 'dashboard').map(id => {
                            const app = ALL_APP_LIBRARY[id];
                            if (!app) return null;
                            const isActive = activeModuleId === id;
                            return (
                                <button key={id} onClick={() => handleOpenApp(id)} className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${isActive ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                    <app.icon className={`w-5 h-5 ${!isActive ? (isDarkMode ? 'text-slate-400' : app.color) : ''}`} />
                                </button>
                            )
                        })}
                        <button onClick={() => setShowAppLauncher(true)} className="flex-shrink-0 w-9 h-9 rounded-lg border border-dashed border-slate-300 text-slate-400 flex items-center justify-center ml-auto">
                            {window.Icons?.Plus && <window.Icons.Plus className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* CONTENT */}
                    <main className={`flex-1 relative ${activeModuleId === 'dashboard' || activeModuleId === 'social' || activeModuleId === 'wallet' ? (isExpandedMode ? 'w-full max-w-full px-4 md:px-8 py-4 md:py-6 lg:py-8' : 'w-full max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6 lg:py-8') : 'w-full h-full'}`}>
                        {isSwitchingModule ? (
                            <div className="animate-pulse w-full h-full p-4 md:p-8 flex flex-col gap-6">
                                <div className={`h-8 w-48 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                                    <div className="md:col-span-2 flex flex-col gap-6">
                                        <div className={`h-64 rounded-2xl w-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className={`h-32 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}></div>
                                            <div className={`h-32 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}></div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-6">
                                        <div className={`h-40 rounded-2xl w-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                                        <div className={`h-56 rounded-2xl w-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-fadeIn w-full h-full">
                                {activeModuleId === 'dashboard' ? (
                                    window.Components.Dashboard ? (
                                        <window.Components.Dashboard
                                            currentUser={currentUser}
                                            dailyFocus={dailyFocus}
                                            handleFocusChange={handleFocusChange}
                                            handleFocusKeyDown={handleFocusKeyDown}
                                            getGreeting={getGreeting}
                                            shortcuts={shortcuts}
                                            handleOpenApp={handleOpenApp}
                                        />
                                    ) : <div className="p-12 text-center text-slate-400">Đang tải trang chủ...</div>
                                ) : activeModuleId === 'social' ? (
                                    window.Components.SocialFeed ? <window.Components.SocialFeed isExpandedMode={isExpandedMode} /> : <div className="p-12 text-center text-slate-400">Đang tải bản tin...</div>
                                ) : activeModuleId === 'account_manager' ? (
                                    window.Components.AccountManager ? (
                                        <window.Components.AccountManager
                                            currentUser={currentUser}
                                            isDarkMode={isDarkMode}
                                            setIsDarkMode={setIsDarkMode}
                                            isExpandedMode={isExpandedMode}
                                            setIsExpandedMode={setIsExpandedMode}
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                <p className="text-sm text-slate-500">Đang tải Quản lý tài khoản...</p>
                                            </div>
                                        </div>
                                    )
                                ) : (activeModuleId === 'hr' || activeModuleId === 'center_ops') && window.Components.CenterOps ? (
                                    <window.Components.CenterOps
                                        isDarkMode={isDarkMode}
                                    />
                                ) : (activeModuleId === 'education' || activeModuleId === 'class_management') && window.Components.ClassManager ? (
                                    <window.Components.ClassManager
                                        isDarkMode={isDarkMode}
                                    />
                                ) : (activeModuleId === 'assets' || activeModuleId === 'mdm' || activeModuleId === 'inventory' || activeModuleId === 'real_estate') && window.Components.WarehouseModule ? (
                                    <window.Components.WarehouseModule
                                        isDarkMode={isDarkMode}
                                    />
                                ) : activeModuleId === 'wallet' ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className={`lg:col-span-2 rounded-3xl p-8 shadow-soft relative overflow-hidden text-white ${isDarkMode ? 'bg-slate-800' : 'bg-slate-900'}`}>
                                            <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Tổng tài sản</p>
                                            <h2 className="text-4xl font-light mb-8">125.000.000 <span className="text-xl text-slate-500">VND</span></h2>
                                            <div className="flex gap-3">
                                                <button className="px-6 py-2 bg-white text-slate-900 rounded-full font-bold text-sm hover:bg-slate-100 transition">Nạp tiền</button>
                                                <button className="px-6 py-2 border border-slate-600 text-slate-300 rounded-full font-bold text-sm hover:border-slate-500 hover:text-white transition">Chuyển khoản</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center p-6">
                                        <div className={`relative max-w-lg w-full text-center p-10 md:p-14 rounded-[2rem] border overflow-hidden transition-all duration-500 hover:shadow-2xl ${isDarkMode ? 'bg-slate-800/40 border-slate-700/60 shadow-black/20' : 'bg-white border-slate-200/60 shadow-slate-200/50'}`}>
                                            {/* Background Decoration */}
                                            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none rounded-[2rem]">
                                                <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[80px]"></div>
                                                <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[80px]"></div>
                                            </div>

                                            <div className="relative z-10 flex flex-col items-center">
                                                <div className="relative mb-8 group">
                                                    <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-tr from-blue-500 to-indigo-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                                                    <div className={`relative w-24 h-24 rounded-[1.5rem] flex items-center justify-center shadow-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 shadow-black/40' : 'bg-white border-slate-100 shadow-slate-200'} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3`}>
                                                        <currentApp.icon className={`w-12 h-12 ${currentApp.color}`} />
                                                        {currentApp.price !== 'Free' && (
                                                            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-300 to-yellow-500 text-yellow-900 border border-yellow-200/50 text-[10px] font-black tracking-wider px-2 py-1 rounded-lg shadow-sm transform rotate-12">
                                                                PRO
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <h2 className={`text-3xl font-extrabold mb-3 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{currentApp.name}</h2>

                                                <p className={`text-base max-w-[280px] mx-auto mb-10 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    Ứng dụng này đang trong quá trình phát triển để mang lại trải nghiệm tốt nhất.
                                                </p>

                                                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                                    <button onClick={() => handleOpenApp('dashboard')} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 whitespace-nowrap">
                                                        Quay về Dashboard
                                                    </button>
                                                    <button onClick={() => setShowAppLauncher(true)} className={`px-6 py-2.5 rounded-xl font-bold text-sm border transition-all hover:-translate-y-0.5 whitespace-nowrap ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                                        Mở Kho ứng dụng
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* MODALS */}

            {window.Components.ShortcutGuideModal && (
                <window.Components.ShortcutGuideModal
                    isOpen={showShortcutGuide}
                    onClose={() => setShowShortcutGuide(false)}
                    isDarkMode={isDarkMode}
                />
            )}

            {showAppLauncher && window.Components.AppLauncher && (
                <window.Components.AppLauncher
                    myAppIds={myAppIds}
                    setMyAppIds={setMyAppIds}
                    pinnedAppIds={pinnedAppIds}
                    isDarkMode={isDarkMode}
                    handleOpenApp={handleOpenApp}
                    togglePinApp={togglePinApp}
                    installApp={installApp}
                    uninstallApp={uninstallApp}
                    onClose={() => setShowAppLauncher(false)}
                />
            )
            }

            {window.Components.GlobalSearch && (
                <window.Components.GlobalSearch
                    showGlobalSearch={showGlobalSearch}
                    onClose={() => setShowGlobalSearch(false)}
                    isDarkMode={isDarkMode}
                    setIsDevAIOpen={setIsDevAIOpen}
                />
            )}

            {window.Components.UserMenu && (
                <window.Components.UserMenu
                    showUserMenu={showUserMenu}
                    setShowUserMenu={setShowUserMenu}
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                    isExpandedMode={isExpandedMode}
                    setIsExpandedMode={setIsExpandedMode}
                    notificationsEnabled={notificationsEnabled}
                    setNotificationsEnabled={setNotificationsEnabled}
                    workLocation={workLocation}
                    setWorkLocation={setWorkLocation}
                    workStatus={workStatus}
                    setWorkStatus={setWorkStatus}
                    showLocationModal={showLocationModal}
                    setShowLocationModal={setShowLocationModal}
                    showSettingsModal={showSettingsModal}
                    setShowSettingsModal={setShowSettingsModal}
                    onOpenApp={handleOpenApp}
                    onLogout={() => {
                        localStorage.removeItem('rino_auth_session');
                        localStorage.removeItem('rino_auth_token');
                        localStorage.removeItem('rino_user_profile');
                        setIsAuthenticated(false);
                        setCurrentUser(null);
                        setCurrentView('square');
                    }}
                    currentUser={currentUser}
                    isDevAIOpen={isDevAIOpen}
                    setIsDevAIOpen={setIsDevAIOpen}
                />
            )}

            {/* Render Modals as Bottom Sheets ONLY on Mobile */}
            <div className="md:hidden">
                {showLocationModal && (
                    <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm" onClick={() => setShowLocationModal(false)}>
                        <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-2xl p-4 animate-slide-up-mobile" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold flex items-center gap-2"><window.Icons.MapPin className="w-5 h-5 text-blue-500" /> Vị trí làm việc</h3>
                                <button onClick={(e) => { e.stopPropagation(); alert('Tính năng thêm địa điểm'); }} className="text-xs text-blue-600 hover:underline font-medium">Thêm</button>
                            </div>
                            <div className="space-y-2 mb-4">
                                {WORK_LOCATIONS.map(loc => (
                                    <button key={loc.id} onClick={() => { setWorkLocation(loc); setShowLocationModal(false); }} className={`w-full flex items-center justify-between p-3 rounded-xl border ${workLocation.id === loc.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-slate-200 dark:border-slate-700'}`}>
                                        <span className="font-bold">{loc.name}</span>
                                        {workLocation.id === loc.id && <window.Icons.Check className="w-5 h-5 text-blue-600" />}
                                    </button>
                                ))}
                            </div>
                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                <button onClick={() => setWorkStatus('onsite')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${workStatus === 'onsite' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600' : 'text-slate-500'}`}>Onsite</button>
                                <button onClick={() => setWorkStatus('online')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${workStatus === 'online' ? 'bg-white dark:bg-slate-600 shadow-sm text-green-600' : 'text-slate-500'}`}>Online</button>
                            </div>
                        </div>
                    </div>
                )}

                {showSettingsModal && (
                    <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm" onClick={() => setShowSettingsModal(false)}>
                        <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-2xl p-4 animate-slide-up-mobile" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold flex items-center gap-2"><window.Icons.Settings className="w-5 h-5 text-blue-500" /> Cài đặt nhanh</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800" onClick={() => setIsDarkMode(!isDarkMode)}>
                                    <span className="font-medium">Chế độ tối</span>
                                    <div className={`w-10 h-6 rounded-full flex items-center p-1 transition-all ${isDarkMode ? 'bg-blue-500 justify-end' : 'bg-slate-300 justify-start'}`}><div className="w-4 h-4 bg-white rounded-full"></div></div>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800" onClick={() => setIsExpandedMode(!isExpandedMode)}>
                                    <span className="font-medium">Mở rộng</span>
                                    <div className={`w-10 h-6 rounded-full flex items-center p-1 transition-all ${isExpandedMode ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}><div className="w-4 h-4 bg-white rounded-full"></div></div>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800" onClick={() => setNotificationsEnabled(!notificationsEnabled)}>
                                    <span className="font-medium">Thông báo</span>
                                    <div className={`w-10 h-6 rounded-full flex items-center p-1 transition-all ${notificationsEnabled ? 'bg-blue-500 justify-end' : 'bg-slate-300 justify-start'}`}><div className="w-4 h-4 bg-white rounded-full"></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Dev AI Sidebar Overlay */}
            {window.Components.DevAISidebar && (
                <window.Components.DevAISidebar isDarkMode={isDarkMode} isDevAIOpen={isDevAIOpen} setIsDevAIOpen={setIsDevAIOpen} />
            )}

            {/* Hover Tooltip */}
            {
                hoverTooltip && (
                    <div className={`fixed z-[120] text-xs font-bold px-3 py-1.5 rounded shadow-lg border pointer-events-none animate-fadeIn flex flex-col items-start ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`} style={{ top: hoverTooltip.rect.top + hoverTooltip.rect.height / 2, left: hoverTooltip.rect.right + 12, transform: 'translateY(-50%)' }}>
                        <span>{hoverTooltip.name}</span>
                        {hoverTooltip.category && <span className="text-[10px] font-normal opacity-70 border-t border-current mt-0.5 pt-0.5 w-full">{hoverTooltip.category}</span>}
                        <div className={`absolute top-1/2 -left-1 w-2 h-2 border-l border-b transform rotate-45 -translate-y-1/2 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}></div>
                    </div>
                )
            }
        </div >
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
