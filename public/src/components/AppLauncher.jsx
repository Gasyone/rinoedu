// js/components/AppLauncher.jsx
const { useState, useMemo } = React;
const { LayoutGrid, Search, X, CheckCircle, Pin, PinOff } = window.Icons;

window.Components = window.Components || {};

window.Components.AppLauncher = ({
    myAppIds, pinnedAppIds, isDarkMode,
    handleOpenApp, togglePinApp, installApp, uninstallApp, onClose
}) => {
    const [launcherTab, setLauncherTab] = useState('my_apps');
    const [appSearchQuery, setAppSearchQuery] = useState('');
    const [activeCategories, setActiveCategories] = useState(['Tất cả']);

    const ALL_APP_LIBRARY = window.Data.ALL_APP_LIBRARY;
    const categories = useMemo(() => ['Tất cả', ...new Set(Object.values(ALL_APP_LIBRARY).map(app => app.category))], []);

    const toggleCategory = (category) => {
        if (category === 'Tất cả') {
            setActiveCategories(['Tất cả']); return;
        }
        setActiveCategories(prev => {
            let newCats = prev.includes('Tất cả') ? [] : [...prev];
            if (newCats.includes(category)) newCats = newCats.filter(c => c !== category);
            else newCats.push(category);
            return newCats.length === 0 ? ['Tất cả'] : newCats;
        });
    };

    const displayedLauncherApps = useMemo(() => {
        let apps = launcherTab === 'my_apps'
            ? Object.values(ALL_APP_LIBRARY).filter(app => myAppIds.includes(app.id))
            : Object.values(ALL_APP_LIBRARY);

        if (!activeCategories.includes('Tất cả')) {
            apps = apps.filter(app => activeCategories.includes(app.category));
        }

        if (appSearchQuery) {
            const query = appSearchQuery.toLowerCase();
            apps = apps.filter(app =>
                app.name.toLowerCase().includes(query) ||
                app.desc.toLowerCase().includes(query)
            );
        }
        return apps;
    }, [appSearchQuery, activeCategories, launcherTab, myAppIds, ALL_APP_LIBRARY]);

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/20 backdrop-blur-md flex items-center justify-center animate-fadeIn p-0 md:p-6" onClick={onClose}>
            <div className={`w-full h-full md:max-w-6xl md:h-[85vh] rounded-none md:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slideUp glass-panel ${isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
                <div className={`px-4 md:px-8 py-4 border-b flex flex-col md:flex-row justify-between md:items-center gap-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                        <h2 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'} flex items-center gap-2`}><LayoutGrid className="w-6 h-6 md:w-7 md:h-7 text-blue-600" /> Kho ứng dụng</h2>
                        <div className={`flex gap-1 self-start`}>
                            <button onClick={() => setLauncherTab('my_apps')} className={`px-3 md:px-4 py-1.5 rounded-md text-xs md:text-sm font-bold transition ${launcherTab === 'my_apps' ? (isDarkMode ? 'bg-slate-700 text-white' : 'bg-blue-50 text-blue-600 shadow-sm') : 'text-slate-500 hover:text-slate-700'}`}>Của tôi</button>
                            <button onClick={() => setLauncherTab('store')} className={`px-3 md:px-4 py-1.5 rounded-md text-xs md:text-sm font-bold transition ${launcherTab === 'store' ? (isDarkMode ? 'bg-slate-700 text-white' : 'bg-white text-blue-600 shadow-sm') : 'text-slate-500 hover:text-slate-700'}`}>Khám phá</button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className={`relative flex-1 md:w-64`}>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Tìm ứng dụng..."
                                value={appSearchQuery}
                                onChange={(e) => setAppSearchQuery(e.target.value)}
                                className={`w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none border transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:bg-white'}`}
                            />
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5 text-slate-500" /></button>
                    </div>
                </div>
                <div className={`px-4 md:px-8 py-3 border-b flex gap-2 overflow-x-auto no-scrollbar ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                    {categories.map(cat => (
                        <button key={cat} onClick={() => toggleCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition ${activeCategories.includes(cat) ? 'bg-blue-600 text-white border-blue-600' : (isDarkMode ? 'border-slate-700 text-slate-400 hover:border-slate-500' : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600')}`}>{cat}</button>
                    ))}
                </div>
                <div className={`flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50/50'}`}>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                        {displayedLauncherApps.map(app => {
                            const isInstalled = myAppIds.includes(app.id);
                            const isPinned = pinnedAppIds.includes(app.id);
                            const isPaid = app.price !== 'Free';
                            return (
                                <div key={app.id} onClick={() => handleOpenApp(app.id)} className={`group relative p-4 md:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col h-40 md:h-48 hover:-translate-y-1 hover:shadow-lg ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-blue-300'}`}>
                                    {isPaid && <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">PRO</div>}
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-50 group-hover:bg-blue-50 transition-colors'}`}>
                                        <app.icon className={`w-5 h-5 md:w-6 md:h-6 ${isDarkMode ? 'text-slate-300' : app.color}`} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-bold text-xs md:text-sm truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{app.name}</h3>
                                        <p className="text-[10px] md:text-xs text-slate-400 mt-1 line-clamp-2">{app.desc}</p>
                                    </div>
                                    <div className={`mt-2 md:mt-3 pt-2 md:pt-3 border-t flex justify-between items-center ${isDarkMode ? 'border-slate-700' : 'border-slate-50'}`}>
                                        {launcherTab === 'store' ? (
                                            !isInstalled ? (
                                                <button onClick={(e) => installApp(e, app.id)} className={`text-[10px] font-bold text-white px-2 md:px-3 py-1 md:py-1.5 rounded hover:opacity-90 ${isPaid ? 'bg-slate-900 dark:bg-slate-600' : 'bg-blue-600'}`}>{isPaid ? 'MUA' : 'CÀI'}</button>
                                            )
                                                : <span className="text-[10px] font-bold text-green-500 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> <span className="hidden md:inline">ĐÃ CÀI</span></span>
                                        ) : (
                                            <button onClick={(e) => uninstallApp(e, app.id)} className="text-[10px] font-bold text-slate-400 hover:text-red-500">GỠ</button>
                                        )}
                                        {isInstalled && <button onClick={(e) => togglePinApp(e, app.id)} className={`p-1.5 rounded ${isPinned ? 'text-blue-500 bg-blue-50' : 'text-slate-300 hover:text-slate-500'}`}>{isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}</button>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
