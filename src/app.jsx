// js/app.jsx
const { useState, useMemo, useEffect, useRef } = React;
const {
    PaymentModal, Header, Sidebar,
    AppLauncher, GlobalSearch, UserMenu, Dashboard, SocialFeed, AccountManager, LoginWebapp, DevAISidebar
} = window.Components;


const { Menu, Home, Plus } = window.Icons;
const { ALL_APP_LIBRARY, WORK_LOCATIONS, NOTIFICATIONS_MOCK } = window.Data;

function App() {
    // --- STATE ---
    const [myAppIds, setMyAppIds] = useState(['square_home', 'dashboard', 'social', 'chat', 'work', 'directory', 'wallet']);
    const [pinnedAppIds, setPinnedAppIds] = useState(['square_home', 'dashboard', 'social', 'chat', 'work', 'directory', 'wallet']);
    const [activeModuleId, setActiveModuleId] = useState('dashboard');

    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const [showAppLauncher, setShowAppLauncher] = useState(false);
    const [showGlobalSearch, setShowGlobalSearch] = useState(false);
    const [isDevAIOpen, setIsDevAIOpen] = useState(false); // New state for AI Sidebar toggle
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentView, setCurrentView] = useState('square'); // 'square' | 'login' | 'workspace'
    const [isLoading, setIsLoading] = useState(true); // Added for initial loading effect

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

                // Deep link support based on initial URL
                const path = window.location.pathname.substring(1);
                if (path && path !== 'home' && window.Data.ALL_APP_LIBRARY[path]) {
                    setActiveModuleId(path);
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

    // Sync URL with current view/module
    useEffect(() => {
        if (!isAuthenticated && currentView === 'login') return;

        let path = '/';
        if (currentView === 'workspace') {
            path = `/${activeModuleId}`;
        } else if (currentView === 'square') {
            path = '/home';
        }

        if (window.location.pathname !== path) {
            window.history.replaceState({}, '', path);
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

        if (moduleId === 'square_home') {
            setCurrentView('square');
        } else {
            setActiveModuleId(moduleId);
        }
    };



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
                <window.Components.SquareHomepage
                    isAuthenticated={isAuthenticated}
                    currentUser={currentUser}
                    onNavigateLogin={() => setCurrentView('login')}
                    onNavigateDashboard={() => { setCurrentView('workspace'); setActiveModuleId('dashboard'); }}
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
                {isAuthenticated && <DevAISidebar isDarkMode={isDarkMode} isDevAIOpen={isDevAIOpen} setIsDevAIOpen={setIsDevAIOpen} />}
            </div>
        );
    }

    if (currentView === 'login') {
        return (
            <LoginWebapp onLoginSuccess={(userProfile) => {
                setIsAuthenticated(true);
                setCurrentUser(userProfile || { name: 'Administrator', email: 'admin@enterprise.com' });
                setCurrentView('square');
            }} />
        );
    }

    return (
        <div className="flex h-screen w-full" onClick={() => { setShowUserMenu(false); setShowSettingsModal(false); setShowLocationModal(false); setShowNotifications(false); setShowAppLauncher(false); }}>

            {/* LOADERS & PAYMENT MODAL */}
            <PaymentModal
                isOpen={paymentModalOpen}
                app={selectedAppToBuy}
                onClose={() => setPaymentModalOpen(false)}
                onConfirm={handlePaymentSuccess}
            />

            {/* SIDEBAR & OVERLAYS */}
            <Sidebar
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

            {/* MAIN AREA */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ml-0 relative overflow-y-auto overflow-x-hidden ${isSidebarOpen ? 'md:ml-[72px]' : 'md:ml-0'}`}>
                {/* HEADER */}
                <Header
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

                {/* MOBILE HORIZONTAL APP NAVIGATION (Below Header) */}
                <div className="md:hidden h-14 bg-white dark:bg-[#111827] border-b border-slate-100 dark:border-slate-800 flex items-center px-4 gap-4 overflow-x-auto no-scrollbar sticky top-16 z-20">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800`}>
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 flex-shrink-0"></div>

                    <button onClick={() => handleOpenApp('dashboard')} className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${activeModuleId === 'dashboard' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                        <Home className="w-5 h-5" />
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
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {/* CONTENT */}
                <main className={`flex-1 relative ${activeModuleId === 'dashboard' || activeModuleId === 'social' || activeModuleId === 'wallet' ? (isExpandedMode ? 'w-full max-w-full px-4 md:px-8 py-4 md:py-6 lg:py-8' : 'w-full max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6 lg:py-8') : 'w-full h-full'}`}>
                    <div className="animate-fadeIn w-full h-full">
                        {activeModuleId === 'dashboard' ? (
                            <Dashboard
                                currentUser={currentUser}
                                dailyFocus={dailyFocus}
                                handleFocusChange={handleFocusChange}
                                handleFocusKeyDown={handleFocusKeyDown}
                                getGreeting={getGreeting}
                                shortcuts={shortcuts}
                                handleOpenApp={handleOpenApp}
                            />
                        ) : activeModuleId === 'social' ? (
                            <SocialFeed isExpandedMode={isExpandedMode} />
                        ) : activeModuleId === 'account_manager' ? (
                            <AccountManager
                                currentUser={currentUser}
                                isDarkMode={isDarkMode}
                                setIsDarkMode={setIsDarkMode}
                                isExpandedMode={isExpandedMode}
                                setIsExpandedMode={setIsExpandedMode}
                            />
                        ) : activeModuleId === 'hr' ? (
                            <window.CenterOps
                                isDarkMode={isDarkMode}
                            />
                        ) : activeModuleId === 'education' ? (
                            <window.ClassManager
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
                            <div className={`text-center py-20 rounded-3xl border border-dashed flex flex-col items-center justify-center ${isDarkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-white border-slate-200'}`}>
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${currentApp.color.replace('text', 'bg').replace('500', '100').replace('600', '100')} bg-opacity-20`}>
                                    <currentApp.icon className={`w-10 h-10 ${currentApp.color}`} />
                                </div>
                                <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Chào mừng đến với {currentApp.name}</h2>
                                <p className="text-slate-500 max-w-sm mb-6">Module này đang được xây dựng với đầy đủ tính năng. Vui lòng quay lại sau.</p>
                                <div className="flex gap-2">
                                    {currentApp.price !== 'Free' && <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">Premium App</span>}
                                </div>
                            </div>
                        )
                        }
                    </div>
                </main>
            </div>

            {/* MODALS */}
            {showAppLauncher && (
                <AppLauncher
                    myAppIds={myAppIds}
                    pinnedAppIds={pinnedAppIds}
                    isDarkMode={isDarkMode}
                    handleOpenApp={handleOpenApp}
                    togglePinApp={togglePinApp}
                    installApp={installApp}
                    uninstallApp={uninstallApp}
                    onClose={() => setShowAppLauncher(false)}
                />
            )}

            <GlobalSearch
                showGlobalSearch={showGlobalSearch}
                onClose={() => setShowGlobalSearch(false)}
                isDarkMode={isDarkMode}
            />

            <UserMenu
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
            <DevAISidebar isDarkMode={isDarkMode} isDevAIOpen={isDevAIOpen} setIsDevAIOpen={setIsDevAIOpen} />

            {/* Hover Tooltip */}
            {hoverTooltip && (
                <div className={`fixed z-[120] text-xs font-bold px-3 py-1.5 rounded shadow-lg border pointer-events-none animate-fadeIn flex flex-col items-start ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`} style={{ top: hoverTooltip.rect.top + hoverTooltip.rect.height / 2, left: hoverTooltip.rect.right + 12, transform: 'translateY(-50%)' }}>
                    <span>{hoverTooltip.name}</span>
                    {hoverTooltip.category && <span className="text-[10px] font-normal opacity-70 border-t border-current mt-0.5 pt-0.5 w-full">{hoverTooltip.category}</span>}
                    <div className={`absolute top-1/2 -left-1 w-2 h-2 border-l border-b transform rotate-45 -translate-y-1/2 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}></div>
                </div>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
