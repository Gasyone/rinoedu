// js/components/AppLauncher.jsx
const { useState, useMemo } = React;
const { LayoutGrid, Search, X, CheckCircle, Pin, PinOff, GripVertical } = window.Icons;

window.Components = window.Components || {};

window.Components.AppLauncher = ({
    myAppIds, setMyAppIds, pinnedAppIds, isDarkMode,
    handleOpenApp, togglePinApp, installApp, uninstallApp, onClose
}) => {
    const [launcherTab, setLauncherTab] = useState('my_apps');
    const [appSearchQuery, setAppSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('Tất cả');
    const [draggedAppId, setDraggedAppId] = useState(null);

    const ALL_APP_LIBRARY = window.Data.ALL_APP_LIBRARY;

    // Calculate category counts
    const categoryCounts = useMemo(() => {
        const counts = { 'Tất cả': 0 };
        const apps = launcherTab === 'my_apps'
            ? Object.values(ALL_APP_LIBRARY).filter(app => myAppIds.includes(app.id))
            : Object.values(ALL_APP_LIBRARY);

        apps.forEach(app => {
            counts['Tất cả']++;
            counts[app.category] = (counts[app.category] || 0) + 1;
        });
        return counts;
    }, [launcherTab, myAppIds, ALL_APP_LIBRARY]);

    const categories = ['Tất cả', ...new Set(Object.values(ALL_APP_LIBRARY).map(app => app.category))];

    const displayedLauncherApps = useMemo(() => {
        let apps = launcherTab === 'my_apps'
            ? Object.values(ALL_APP_LIBRARY).filter(app => myAppIds.includes(app.id)).sort((a, b) => myAppIds.indexOf(a.id) - myAppIds.indexOf(b.id))
            : Object.values(ALL_APP_LIBRARY);

        if (activeCategory !== 'Tất cả') {
            apps = apps.filter(app => app.category === activeCategory);
        }

        if (appSearchQuery) {
            const query = appSearchQuery.toLowerCase();
            apps = apps.filter(app =>
                app.name.toLowerCase().includes(query) ||
                app.desc.toLowerCase().includes(query)
            );
        }
        return apps;
    }, [appSearchQuery, activeCategory, launcherTab, myAppIds, ALL_APP_LIBRARY]);

    // Drag and Drop Logic
    const handleDragStart = (e, appId) => {
        if (launcherTab !== 'my_apps' || appSearchQuery || activeCategory !== 'Tất cả') return;
        setDraggedAppId(appId);
        e.dataTransfer.effectAllowed = 'move';
        requestAnimationFrame(() => {
            e.target.classList.add('opacity-50', 'scale-95');
        });
    };

    const handleDragEnd = (e) => {
        setDraggedAppId(null);
        e.target.classList.remove('opacity-50', 'scale-95');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetAppId) => {
        e.preventDefault();
        if (!draggedAppId || draggedAppId === targetAppId) return;
        if (launcherTab !== 'my_apps' || !setMyAppIds) return;

        const newAppIds = [...myAppIds];
        const draggedIdx = newAppIds.indexOf(draggedAppId);
        const targetIdx = newAppIds.indexOf(targetAppId);

        if (draggedIdx > -1 && targetIdx > -1) {
            newAppIds.splice(draggedIdx, 1);
            newAppIds.splice(targetIdx, 0, draggedAppId);
            setMyAppIds(newAppIds);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center animate-fadeIn p-0 md:p-6" onClick={onClose}>
            <div className={`w-full h-full md:max-w-5xl md:h-[85vh] rounded-none md:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideUp glass-panel ${isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className={`px-4 md:px-5 py-2.5 border-b flex flex-col md:flex-row justify-between md:items-center gap-3 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                            <LayoutGrid className="w-5 h-5" />
                        </div>
                        <h2 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Kho Ứng Dụng</h2>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className={`flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg`}>
                            <button onClick={() => setLauncherTab('my_apps')} className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${launcherTab === 'my_apps' ? (isDarkMode ? 'bg-slate-700 text-white shadow' : 'bg-white text-blue-600 shadow-sm') : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}>Của tôi</button>
                            <button onClick={() => setLauncherTab('store')} className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${launcherTab === 'store' ? (isDarkMode ? 'bg-slate-700 text-white shadow' : 'bg-white text-blue-600 shadow-sm') : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}>Khám phá</button>
                        </div>
                        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-auto"><X className="w-4 h-4 text-slate-500" /></button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar Categories */}
                    <div className={`w-44 flex-shrink-0 border-r py-3 px-2.5 hidden md:flex flex-col gap-0.5 overflow-y-auto custom-scrollbar ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'}`}>
                        <div className="mb-3">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm..."
                                    value={appSearchQuery}
                                    onChange={(e) => setAppSearchQuery(e.target.value)}
                                    className={`w-full pl-8 pr-3 py-2 rounded-lg text-xs outline-none border transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500'}`}
                                />
                            </div>
                        </div>

                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1.5">Danh mục</p>
                        {categories.map(cat => {
                            const count = categoryCounts[cat] || 0;
                            if (cat !== 'Tất cả' && count === 0) return null;

                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${activeCategory === cat ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' : (isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100')}`}
                                >
                                    <span className="truncate">{cat}</span>
                                    {count > 0 && <span className={`text-[9px] px-1.5 py-0.5 rounded-full ml-1 ${activeCategory === cat ? 'bg-blue-500 text-white' : (isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-500')}`}>{count}</span>}
                                </button>
                            );
                        })}
                    </div>

                    {/* App Grid */}
                    <div className={`flex-1 overflow-y-auto p-3 md:p-5 custom-scrollbar relative ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50/30'}`}>
                        {/* Mobile category pills context */}
                        <div className={`md:hidden mb-4 pb-2 border-b flex gap-2 overflow-x-auto no-scrollbar ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                            {categories.map(cat => {
                                const count = categoryCounts[cat] || 0;
                                if (cat !== 'Tất cả' && count === 0) return null;
                                return (
                                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition ${activeCategory === cat ? 'bg-blue-600 text-white border-blue-600' : (isDarkMode ? 'border-slate-700 text-slate-400 hover:border-slate-500' : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600')}`}>{cat}</button>
                                );
                            })}
                        </div>

                        {displayedLauncherApps.length === 0 ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                <LayoutGrid className="w-16 h-16 mb-4 opacity-20" />
                                <p>Không tìm thấy ứng dụng nào.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 md:gap-3">
                                {displayedLauncherApps.map(app => {
                                    const isInstalled = myAppIds.includes(app.id);
                                    const isPinned = pinnedAppIds.includes(app.id);
                                    const isPaid = app.price !== 'Free';
                                    const isDraggable = launcherTab === 'my_apps' && !appSearchQuery && activeCategory === 'Tất cả';

                                    return (
                                        <div
                                            key={app.id}
                                            draggable={isDraggable}
                                            onDragStart={(e) => handleDragStart(e, app.id)}
                                            onDragEnd={handleDragEnd}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, app.id)}
                                            onClick={() => handleOpenApp(app.id)}
                                            className={`group relative p-3 rounded-xl border transition-all cursor-pointer flex flex-col bg-white hover:-translate-y-0.5 hover:shadow-lg ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-slate-600 hover:shadow-black/40' : 'border-slate-200 hover:border-blue-300'} ${draggedAppId === app.id ? 'opacity-50 scale-95' : ''}`}
                                        >
                                            {isPaid && <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 text-[8px] font-bold px-1.5 py-px rounded shadow-sm z-10">PRO</div>}
                                            {isDraggable && (
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab hover:text-blue-500 text-slate-400 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-0.5 rounded z-20" onClick={e => e.stopPropagation()}>
                                                    <GripVertical className="w-3.5 h-3.5" />
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2.5 mb-2">
                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-50 group-hover:bg-blue-50 transition-colors'}`}>
                                                    <app.icon className={`w-5 h-5 ${isDarkMode ? 'text-slate-300' : app.color}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className={`font-bold text-[11px] leading-tight truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{app.name}</h3>
                                                    <p className={`text-[9px] font-medium tracking-wide uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{app.category}</p>
                                                </div>
                                            </div>

                                            <p className={`text-[10px] line-clamp-2 leading-snug flex-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{app.desc}</p>

                                            <div className={`mt-2 pt-2 border-t flex justify-between items-center ${isDarkMode ? 'border-slate-700/50' : 'border-slate-100'}`}>
                                                {launcherTab === 'store' ? (
                                                    !isInstalled ? (
                                                        <button onClick={(e) => installApp(e, app.id)} className={`text-[10px] font-bold text-white px-2.5 py-1 rounded-md hover:opacity-90 transition-opacity ${isPaid ? 'bg-slate-900 dark:bg-slate-600' : 'bg-blue-600'}`}>{isPaid ? 'MUA' : 'CÀI'}</button>
                                                    )
                                                        : <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Đã cài</span>
                                                ) : (
                                                    <div className="flex items-center gap-1.5">
                                                        <button onClick={(e) => { e.stopPropagation(); handleOpenApp(app.id); }} className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors ${isDarkMode ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>Mở</button>
                                                        <button onClick={(e) => uninstallApp(e, app.id)} className={`text-[10px] font-bold px-2 py-1 rounded-md transition-colors ${isDarkMode ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}>Gỡ</button>
                                                    </div>
                                                )}
                                                {isInstalled && <button onClick={(e) => togglePinApp(e, app.id)} className={`p-1 rounded-md transition-colors ${isPinned ? 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' : 'text-slate-300 hover:text-slate-500 dark:hover:text-slate-400'}`} title={isPinned ? "Bỏ ghim" : "Ghim"}>{isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}</button>}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
