// js/components/GlobalSearch.jsx
const { useState: useSearchState, useEffect: useSearchEffect, useRef: useSearchRef, useMemo: useSearchMemo } = React;
const { Search, X, Plus } = window.Icons || {};

window.Components = window.Components || {};

window.Components.GlobalSearch = ({ showGlobalSearch, onClose, isDarkMode }) => {
    const [query, setQuery] = useSearchState("");
    const [category, setCategory] = useSearchState("all");
    const [selectedIdx, setSelectedIdx] = useSearchState(-1);
    const inputRef = useSearchRef(null);
    const listRef = useSearchRef(null);

    const allAppLibrary = window.Data.ALL_APP_LIBRARY;

    const allItems = useSearchMemo(() => {
        const apps = Object.values(allAppLibrary).map((app) => ({
            id: app.id,
            name: app.name,
            desc: app.desc || app.category,
            icon: app.icon,
            color: app.color,
            type: "apps",
            action: () => {
                if (window.__handleOpenApp) window.__handleOpenApp(app.id);
                onClose();
            },
        }));

        const docs = [
            { id: "d1", name: "BÃ¡o cÃ¡o Q4 2024", desc: "TÃ i liá»‡u Â· Finance", icon: window.Icons.FileText, color: "text-indigo-500", type: "files", action: onClose },
            { id: "d2", name: "HÆ°á»›ng dáº«n onboarding 2025", desc: "TÃ i liá»‡u Â· HR", icon: window.Icons.FileText, color: "text-green-500", type: "files", action: onClose },
            { id: "d3", name: "Káº¿ hoáº¡ch marketing thÃ¡ng 3", desc: "TÃ i liá»‡u Â· Marketing", icon: window.Icons.FileText, color: "text-orange-500", type: "files", action: onClose },
        ];

        const people = [
            { id: "p1", name: "Nguyá»…n VÄƒn An", desc: "HR Â· TrÆ°á»Ÿng phÃ²ng NhÃ¢n sá»±", icon: window.Icons.User, color: "text-blue-500", type: "people", action: onClose },
            { id: "p2", name: "Tráº§n Thá»‹ BÃ¬nh", desc: "Finance Â· Káº¿ toÃ¡n trÆ°á»Ÿng", icon: window.Icons.User, color: "text-purple-500", type: "people", action: onClose },
            { id: "p3", name: "LÃª Minh CÆ°á»ng", desc: "Tech Â· TrÆ°á»Ÿng nhÃ³m Backend", icon: window.Icons.User, color: "text-emerald-500", type: "people", action: onClose },
        ];

        return [...apps, ...docs, ...people];
    }, [allAppLibrary, onClose]);

    const results = useSearchMemo(() => {
        let items = allItems;
        if (category !== "all") {
            items = items.filter((item) => item.type === category);
        }
        if (query.trim()) {
            const normalizedQuery = query.toLowerCase();
            items = items.filter((item) =>
                item.name.toLowerCase().includes(normalizedQuery) ||
                (item.desc && item.desc.toLowerCase().includes(normalizedQuery))
            );
        } else {
            items = items.slice(0, 8);
        }
        return items;
    }, [allItems, category, query]);

    useSearchEffect(() => { setSelectedIdx(-1); }, [results]);

    useSearchEffect(() => {
        if (showGlobalSearch && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
        if (!showGlobalSearch) {
            setQuery("");
            setCategory("all");
        }
    }, [showGlobalSearch]);

    useSearchEffect(() => {
        if (selectedIdx >= 0 && listRef.current) {
            const items = listRef.current.querySelectorAll("[data-result-item]");
            if (items[selectedIdx]) {
                items[selectedIdx].scrollIntoView({ block: "nearest" });
            }
        }
    }, [selectedIdx]);

    const handleKeyDown = (event) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setSelectedIdx((previous) => Math.min(previous + 1, results.length - 1));
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setSelectedIdx((previous) => Math.max(previous - 1, -1));
        } else if (event.key === "Enter") {
            if (selectedIdx >= 0 && results[selectedIdx]) {
                results[selectedIdx].action();
            }
        } else if (event.key === "Escape") {
            onClose();
        }
    };

    if (!showGlobalSearch) return null;

    const tabs = [
        { key: "all", label: "Táº¥t cáº£" },
        { key: "apps", label: "âš¡ á»¨ng dá»¥ng" },
        { key: "files", label: "ðŸ“„ TÃ i liá»‡u" },
        { key: "people", label: "ðŸ‘¤ NhÃ¢n sá»±" },
    ];

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/30 backdrop-blur-md flex items-start justify-center pt-0 md:pt-[12vh] animate-fadeIn p-0 md:p-4" onClick={onClose}>
            <div className={`w-full h-full md:h-auto md:max-w-2xl rounded-none md:rounded-2xl shadow-2xl overflow-hidden animate-scaleIn glass-panel ${isDarkMode ? "bg-slate-900 border border-slate-700" : "bg-white border border-slate-100"}`} onClick={(event) => event.stopPropagation()}>
                <div className={`flex items-center gap-3 px-4 py-3.5 border-b ${isDarkMode ? "border-slate-700" : "border-slate-100"}`}>
                    <button onClick={onClose} className="md:hidden p-1"><X className="w-5 h-5 text-slate-400" /></button>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Search className={`w-5 h-5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`} />
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="TÃ¬m á»©ng dá»¥ng, tÃ i liá»‡u, nhÃ¢n sá»±..."
                        className={`flex-1 text-base md:text-lg bg-transparent outline-none font-medium ${isDarkMode ? "text-white placeholder-slate-600" : "text-slate-800 placeholder-slate-300"}`}
                        autoFocus
                    />
                    {query && <button onClick={() => setQuery("")} className={`p-1 rounded-full ${isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}><X className="w-4 h-4 text-slate-400" /></button>}
                    <div className="hidden md:flex gap-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${isDarkMode ? "bg-slate-800 border-slate-600 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-400"}`}>ESC</span>
                    </div>
                </div>

                <div className={`px-4 py-2 flex gap-1 border-b text-sm font-medium overflow-x-auto no-scrollbar ${isDarkMode ? "border-slate-700 text-slate-400" : "border-slate-100 text-slate-500"}`}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setCategory(tab.key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${category === tab.key
                                ? (isDarkMode ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-800 shadow-sm")
                                : (isDarkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600")
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                    <div className="ml-auto flex items-center gap-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${isDarkMode ? "text-slate-600" : "text-slate-300"}`}>
                            {results.length} káº¿t quáº£
                        </span>
                    </div>
                </div>

                <div ref={listRef} className="overflow-y-auto max-h-[60vh] md:max-h-[380px]">
                    {results.length > 0 ? (
                        <div className="p-2">
                            <p className={`px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                {query ? "Káº¿t quáº£ tÃ¬m kiáº¿m" : "Truy cáº­p nhanh"}
                            </p>
                            {results.map((item, idx) => (
                                <div
                                    key={item.id}
                                    data-result-item
                                    onClick={item.action}
                                    className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${selectedIdx === idx
                                        ? (isDarkMode ? "bg-slate-700" : "bg-blue-50")
                                        : (isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-50")
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isDarkMode ? "bg-slate-700" : "bg-white shadow-sm border border-slate-100"}`}>
                                            <item.icon className={`w-4 h-4 ${item.color}`} />
                                        </div>
                                        <div>
                                            <p className={`font-semibold text-sm ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>{item.name}</p>
                                            <p className="text-xs text-slate-400 capitalize">{item.desc}</p>
                                        </div>
                                    </div>
                                    <div className={`flex items-center gap-2 transition ${selectedIdx === idx ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${isDarkMode ? "bg-slate-800 border-slate-600 text-slate-400" : "bg-white border-slate-200 text-slate-400"}`}>â†µ</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <p className={`text-sm font-medium ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>KhÃ´ng tÃ¬m tháº¥y káº¿t quáº£ cho <strong>"{query}"</strong></p>
                        </div>
                    )}
                </div>

                <div className={`border-t flex items-center gap-2 px-4 py-2.5 ${isDarkMode ? "border-slate-700 bg-slate-900/50" : "border-slate-100 bg-slate-50/80"}`}>
                    <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${isDarkMode ? "bg-slate-800 text-slate-300 hover:text-white" : "bg-white border border-slate-200 text-slate-600 hover:text-blue-600 shadow-sm"}`}>
                        <Plus className="w-3.5 h-3.5" /> Táº¡o má»›i
                    </button>
                    <div className="ml-auto hidden md:flex gap-3 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1"><span className="font-bold">â†‘â†“</span> Ä‘iá»u hÆ°á»›ng</span>
                        <span className="flex items-center gap-1"><span className="font-bold">â†µ</span> chá»n</span>
                        <span className="flex items-center gap-1"><span className="font-bold">esc</span> Ä‘Ã³ng</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
