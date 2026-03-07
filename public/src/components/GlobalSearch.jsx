// js/components/GlobalSearch.jsx
const { useState: useSearchState, useEffect: useSearchEffect, useRef: useSearchRef, useMemo: useSearchMemo } = React;
const { Search, X, Plus, Sparkles, ArrowRight, Command } = window.Icons;

window.Components = window.Components || {};

window.Components.GlobalSearch = ({ showGlobalSearch, onClose, isDarkMode, setIsDevAIOpen }) => {
    const [query, setQuery] = useSearchState('');
    const [category, setCategory] = useSearchState('all');
    const [selectedIdx, setSelectedIdx] = useSearchState(-1);
    const [aiMode, setAiMode] = useSearchState(false);
    const inputRef = useSearchRef(null);
    const listRef = useSearchRef(null);

    const ALL_APP_LIBRARY = window.Data.ALL_APP_LIBRARY;

    // Build searchable items
    const allItems = useSearchMemo(() => {
        const apps = Object.values(ALL_APP_LIBRARY).map(app => ({
            id: app.id, name: app.name, desc: app.desc || app.category,
            icon: app.icon, color: app.color, type: 'apps',
            action: () => {
                if (window.__handleOpenApp) window.__handleOpenApp(app.id);
                onClose();
            }
        }));

        const docs = [
            { id: 'd1', name: 'Báo cáo Q4 2024', desc: 'Tài liệu · Finance', icon: window.Icons.FileText, color: 'text-indigo-500', type: 'files', action: onClose },
            { id: 'd2', name: 'Hướng dẫn onboarding 2025', desc: 'Tài liệu · HR', icon: window.Icons.FileText, color: 'text-green-500', type: 'files', action: onClose },
            { id: 'd3', name: 'Kế hoạch marketing tháng 3', desc: 'Tài liệu · Marketing', icon: window.Icons.FileText, color: 'text-orange-500', type: 'files', action: onClose },
        ];

        const people = [
            { id: 'p1', name: 'Nguyễn Văn An', desc: 'HR · Trưởng phòng Nhân sự', icon: window.Icons.User, color: 'text-blue-500', type: 'people', action: onClose },
            { id: 'p2', name: 'Trần Thị Bình', desc: 'Finance · Kế toán trưởng', icon: window.Icons.User, color: 'text-purple-500', type: 'people', action: onClose },
            { id: 'p3', name: 'Lê Minh Cường', desc: 'Tech · Trưởng nhóm Backend', icon: window.Icons.User, color: 'text-emerald-500', type: 'people', action: onClose },
        ];

        return [...apps, ...docs, ...people];
    }, [ALL_APP_LIBRARY]);

    const results = useSearchMemo(() => {
        let items = allItems;
        if (category !== 'all') {
            items = items.filter(i => i.type === category);
        }
        if (query.trim()) {
            const q = query.toLowerCase();
            items = items.filter(i =>
                i.name.toLowerCase().includes(q) ||
                (i.desc && i.desc.toLowerCase().includes(q))
            );
        } else {
            // Show recent/popular (first 8) when no query
            items = items.slice(0, 8);
        }
        return items;
    }, [query, category, allItems]);

    // Reset selection when results change
    useSearchEffect(() => { setSelectedIdx(-1); }, [results]);

    // Focus input on open
    useSearchEffect(() => {
        if (showGlobalSearch && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
        if (!showGlobalSearch) { setQuery(''); setCategory('all'); setAiMode(false); }
    }, [showGlobalSearch]);

    // Keyboard navigation
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIdx(prev => Math.min(prev + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIdx(prev => Math.max(prev - 1, -1));
        } else if (e.key === 'Enter') {
            if (selectedIdx >= 0 && results[selectedIdx]) {
                results[selectedIdx].action();
            } else if (aiMode && query.trim()) {
                handleAISearch();
            }
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const handleAISearch = () => {
        if (setIsDevAIOpen) setIsDevAIOpen(true);
        // Pass query to AI
        if (window.__devAIQuery) window.__devAIQuery(query);
        onClose();
    };

    // Scroll selected into view
    useSearchEffect(() => {
        if (selectedIdx >= 0 && listRef.current) {
            const items = listRef.current.querySelectorAll('[data-result-item]');
            if (items[selectedIdx]) {
                items[selectedIdx].scrollIntoView({ block: 'nearest' });
            }
        }
    }, [selectedIdx]);

    if (!showGlobalSearch) return null;

    const TABS = [
        { key: 'all', label: 'Tất cả' },
        { key: 'apps', label: '⚡ Ứng dụng' },
        { key: 'files', label: '📄 Tài liệu' },
        { key: 'people', label: '👤 Nhân sự' },
    ];

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/30 backdrop-blur-md flex items-start justify-center pt-0 md:pt-[12vh] animate-fadeIn p-0 md:p-4" onClick={onClose}>
            <div className={`w-full h-full md:h-auto md:max-w-2xl rounded-none md:rounded-2xl shadow-2xl overflow-hidden animate-scaleIn glass-panel ${isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-100'}`} onClick={e => e.stopPropagation()}>

                {/* Search Header */}
                <div className={`flex items-center gap-3 px-4 py-3.5 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                    <button onClick={onClose} className="md:hidden p-1"><X className="w-5 h-5 text-slate-400" /></button>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${aiMode ? 'bg-indigo-100 dark:bg-indigo-900/40' : 'bg-transparent'}`}>
                        {aiMode
                            ? <Sparkles className="w-5 h-5 text-indigo-500" />
                            : <Search className={`w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                        }
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={aiMode ? 'Hỏi RinoAI bất cứ điều gì...' : 'Tìm ứng dụng, tài liệu, nhân sự...'}
                        className={`flex-1 text-base md:text-lg bg-transparent outline-none font-medium ${isDarkMode ? 'text-white placeholder-slate-600' : 'text-slate-800 placeholder-slate-300'}`}
                        autoFocus
                    />
                    {/* AI Toggle */}
                    <button
                        onClick={() => setAiMode(m => !m)}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all ${aiMode
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900'
                            : (isDarkMode ? 'border-slate-700 text-slate-400 hover:border-indigo-500 hover:text-indigo-400' : 'border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600')
                            }`}
                        title="Chuyển sang AI Search"
                    >
                        <Sparkles className="w-3.5 h-3.5" /> AI
                    </button>
                    {query && <button onClick={() => setQuery('')} className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}><X className="w-4 h-4 text-slate-400" /></button>}
                    <div className="hidden md:flex gap-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${isDarkMode ? 'bg-slate-800 border-slate-600 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>ESC</span>
                    </div>
                </div>

                {/* AI Mode Banner */}
                {aiMode && (
                    <div className={`px-4 py-2.5 flex items-center gap-2 text-xs border-b ${isDarkMode ? 'bg-indigo-900/20 border-slate-700 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-700'}`}>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Chế độ AI — Nhập câu hỏi bằng tiếng Việt, nhấn <strong>Enter</strong> để hỏi RinoAI</span>
                    </div>
                )}

                {/* Category Tabs (hidden in AI mode) */}
                {!aiMode && (
                    <div className={`px-4 py-2 flex gap-1 border-b text-sm font-medium overflow-x-auto no-scrollbar ${isDarkMode ? 'border-slate-700 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                        {TABS.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setCategory(tab.key)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${category === tab.key
                                    ? (isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-800 shadow-sm')
                                    : (isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                        <div className="ml-auto flex items-center gap-1">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>
                                {results.length} kết quả
                            </span>
                        </div>
                    </div>
                )}

                {/* Results */}
                <div ref={listRef} className={`overflow-y-auto ${aiMode ? 'max-h-[50vh] md:max-h-[320px]' : 'max-h-[60vh] md:max-h-[380px]'}`}>
                    {aiMode ? (
                        <div className="p-4 space-y-2">
                            <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Gợi ý câu hỏi</p>
                            {[
                                'Có bao nhiêu nhân viên chưa chấm công tuần này?',
                                'Tổng doanh thu tháng 2 là bao nhiêu?',
                                'Lịch họp nào sắp đến trong tuần này?',
                                'Hiển thị danh sách task quá hạn',
                            ].map((suggestion, i) => (
                                <button key={i} onClick={() => setQuery(suggestion)} className={`w-full text-left flex items-center gap-3 p-3 rounded-xl text-sm transition group ${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>
                                    <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                                    <span className="flex-1">{suggestion}</span>
                                    <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition" />
                                </button>
                            ))}
                            {query.trim() && (
                                <button onClick={handleAISearch} className="w-full mt-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-200 dark:shadow-indigo-900">
                                    <Sparkles className="w-4 h-4" /> Hỏi RinoAI: "{query}"
                                </button>
                            )}
                        </div>
                    ) : results.length > 0 ? (
                        <div className="p-2">
                            <p className={`px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                {query ? 'Kết quả tìm kiếm' : 'Truy cập nhanh'}
                            </p>
                            {results.map((item, idx) => (
                                <div
                                    key={item.id}
                                    data-result-item
                                    onClick={item.action}
                                    className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${selectedIdx === idx
                                        ? (isDarkMode ? 'bg-slate-700' : 'bg-blue-50')
                                        : (isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50')
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isDarkMode ? 'bg-slate-700' : 'bg-white shadow-sm border border-slate-100'}`}>
                                            <item.icon className={`w-4 h-4 ${item.color}`} />
                                        </div>
                                        <div>
                                            <p className={`font-semibold text-sm ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{item.name}</p>
                                            <p className="text-xs text-slate-400 capitalize">{item.desc}</p>
                                        </div>
                                    </div>
                                    <div className={`flex items-center gap-2 transition ${selectedIdx === idx ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${isDarkMode ? 'bg-slate-800 border-slate-600 text-slate-400' : 'bg-white border-slate-200 text-slate-400'}`}>↵</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Không tìm thấy kết quả cho <strong>"{query}"</strong></p>
                            <button onClick={() => setAiMode(true)} className="mt-3 text-xs text-indigo-500 hover:underline flex items-center gap-1 mx-auto"><Sparkles className="w-3.5 h-3.5" /> Thử hỏi RinoAI</button>
                        </div>
                    )}
                </div>

                {/* Quick Actions Footer */}
                {!aiMode && (
                    <div className={`border-t flex items-center gap-2 px-4 py-2.5 ${isDarkMode ? 'border-slate-700 bg-slate-900/50' : 'border-slate-100 bg-slate-50/80'}`}>
                        <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-white border border-slate-200 text-slate-600 hover:text-blue-600 shadow-sm'}`}>
                            <Plus className="w-3.5 h-3.5" /> Tạo mới
                        </button>
                        <button onClick={() => setAiMode(true)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${isDarkMode ? 'bg-slate-800 text-indigo-400 hover:text-indigo-300' : 'bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50 shadow-sm'}`}>
                            <Sparkles className="w-3.5 h-3.5" /> Tìm nâng cao (AI)
                        </button>
                        <div className="ml-auto hidden md:flex gap-3 text-[10px] text-slate-400">
                            <span className="flex items-center gap-1"><span className="font-bold">↑↓</span> điều hướng</span>
                            <span className="flex items-center gap-1"><span className="font-bold">↵</span> chọn</span>
                            <span className="flex items-center gap-1"><span className="font-bold">esc</span> đóng</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
