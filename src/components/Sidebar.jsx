// js/components/Sidebar.jsx
const { LayoutGrid, Home, Plus, Activity, FileText, Settings, ChevronsRight, ChevronsLeft, Grid3x3 } = window.Icons;

window.Components = window.Components || {};

window.Components.Sidebar = ({
    isSidebarOpen, setIsSidebarOpen, activeModuleId, handleOpenApp,
    pinnedAppIds, isDarkMode, setShowAppLauncher, currentApp, setHoverTooltip
}) => {
    const ALL_APP_LIBRARY = window.Data.ALL_APP_LIBRARY;

    return (
        <>
            {/* MOBILE BACKDROP FOR SIDEBAR */}
            <div
                className={`fixed inset-0 z-30 bg-black/20 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>

            {/* DESKTOP FLOATING TOGGLE BUTTON (When Sidebar Closed) */}
            <button
                onClick={() => setIsSidebarOpen(true)}
                className={`fixed bottom-4 left-[-10px] z-50 w-8 h-10 bg-white dark:bg-slate-800 rounded-r-xl border-y border-r border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-md hover:w-10 hover:left-0 transition-all group hidden md:flex ${isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}
            >
                <ChevronsRight className="w-5 h-5 text-blue-600" />
            </button>

            {/* SIDEBAR */}
            <aside className={`fixed inset-y-0 left-0 z-40 bg-white dark:bg-[#111827] border-r border-slate-100 dark:border-slate-800 flex flex-col items-center py-5 transition-transform duration-300 shadow-lg ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-[240px] md:w-[72px]`} onClick={e => e.stopPropagation()}>

                {/* Desktop Home Button (Fixed Navigation) */}
                <div className="mb-6 hidden md:flex">
                    <button onClick={() => handleOpenApp('dashboard')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeModuleId === 'dashboard' ? 'bg-blue-600 text-white shadow-glow' : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-700 dark:text-slate-300'}`} onMouseEnter={e => setHoverTooltip({ name: "Trang chủ", rect: e.target.getBoundingClientRect() })} onMouseLeave={() => setHoverTooltip(null)}>
                        <Home className="w-5 h-5" />
                    </button>
                </div>

                {/* Desktop Main Navigation */}
                <nav className="flex-1 w-full px-2 flex-col gap-3 overflow-y-auto hover-scroll hidden md:flex" style={{ scrollbarWidth: 'none' }}>
                    {pinnedAppIds.filter(id => id !== 'dashboard').map(id => {
                        const app = ALL_APP_LIBRARY[id];
                        if (!app) return null;
                        const isActive = activeModuleId === id;
                        return (
                            <button key={id} onClick={() => handleOpenApp(id)} className={`relative group w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800'}`} onMouseEnter={e => setHoverTooltip({ name: app.name, category: app.category, rect: e.target.getBoundingClientRect() })} onMouseLeave={() => setHoverTooltip(null)}>
                                <app.icon className={`w-6 h-6 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'} ${!isActive ? (isDarkMode ? 'text-slate-400' : app.color) : ''}`} />
                                {isActive && <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-600 rounded-r-full"></div>}
                            </button>
                        )
                    })}
                    <button onClick={() => setShowAppLauncher(true)} className="w-10 h-10 mx-auto rounded-full border border-dashed border-slate-300 text-slate-400 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center mt-2 transition"><Plus className="w-5 h-5" /></button>
                </nav>

                {/* Mobile Context Menu (Visible only on Mobile) */}
                <div className="flex-1 w-full px-4 flex flex-col gap-2 overflow-y-auto md:hidden">
                    <div className="flex items-center gap-3 p-2 mb-4 border-b border-slate-100 dark:border-slate-700">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentApp.color.replace('text', 'bg').replace('500', '100').replace('600', '100')} bg-opacity-20`}>
                            <currentApp.icon className={`w-5 h-5 ${currentApp.color}`} />
                        </div>
                        <span className="font-bold text-sm text-slate-800 dark:text-white truncate">{currentApp.name}</span>
                    </div>

                    <button className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400 font-medium text-sm">
                        <Activity className="w-4 h-4" /> Tổng quan
                    </button>
                    <button className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition font-medium text-sm">
                        <FileText className="w-4 h-4" /> Báo cáo
                    </button>
                    <button className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition font-medium text-sm">
                        <Settings className="w-4 h-4" /> Cấu hình
                    </button>
                </div>

                {/* Desktop Bottom Actions */}
                <div className="mt-auto flex flex-col items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 w-full hidden md:flex">
                    <button onClick={() => setShowAppLauncher(true)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800`} onMouseEnter={e => setHoverTooltip({ name: "Ứng dụng", rect: e.target.getBoundingClientRect() })} onMouseLeave={() => setHoverTooltip(null)}>
                        <Grid3x3 className="w-5 h-5" />
                    </button>
                    {/* Toggle Sidebar Button */}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800`} onMouseEnter={e => setHoverTooltip({ name: "Thu gọn", rect: e.target.getBoundingClientRect() })} onMouseLeave={() => setHoverTooltip(null)}>
                        <ChevronsLeft className={`w-5 h-5 transition-transform ${!isSidebarOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </aside>
        </>
    );
};
