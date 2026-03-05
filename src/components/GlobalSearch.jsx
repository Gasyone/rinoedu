// js/components/GlobalSearch.jsx
const { useState } = React;
const { Search, X, Plus } = window.Icons;

window.Components = window.Components || {};

window.Components.GlobalSearch = ({ showGlobalSearch, onClose, isDarkMode }) => {
    const [searchCategory, setSearchCategory] = useState('all');
    const SEARCH_RESULTS_MOCK = window.Data.SEARCH_RESULTS_MOCK;

    if (!showGlobalSearch) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/30 backdrop-blur-md flex items-start justify-center pt-0 md:pt-[15vh] animate-fadeIn p-0 md:p-4" onClick={onClose}>
            <div className={`w-full h-full md:h-auto md:max-w-2xl rounded-none md:rounded-2xl shadow-2xl overflow-hidden animate-scaleIn glass-panel ${isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
                {/* Search Header & Input */}
                <div className={`flex items-center gap-4 p-5 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                    <button onClick={onClose} className="md:hidden"><X className="w-6 h-6 text-slate-500" /></button>
                    <Search className={`w-6 h-6 hidden md:block ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`} />
                    <input type="text" placeholder="Tìm kiếm ứng dụng, tài liệu, nhân sự..." className={`flex-1 text-lg md:text-xl bg-transparent outline-none font-medium ${isDarkMode ? 'text-white placeholder-slate-600' : 'text-slate-800 placeholder-slate-300'}`} autoFocus />
                    <div className="hidden md:flex gap-2">
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500 font-bold border border-slate-200 dark:border-slate-600">ESC</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className={`px-5 py-3 flex gap-4 border-b text-sm font-medium overflow-x-auto no-scrollbar ${isDarkMode ? 'border-slate-700 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                    <button onClick={() => setSearchCategory('all')} className={`pb-2 border-b-2 transition whitespace-nowrap ${searchCategory === 'all' ? 'border-blue-500 text-blue-600 dark:text-white' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-200'}`}>Tất cả</button>
                    <button onClick={() => setSearchCategory('apps')} className={`pb-2 border-b-2 transition whitespace-nowrap ${searchCategory === 'apps' ? 'border-blue-500 text-blue-600 dark:text-white' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-200'}`}>Ứng dụng</button>
                    <button onClick={() => setSearchCategory('files')} className={`pb-2 border-b-2 transition whitespace-nowrap ${searchCategory === 'files' ? 'border-blue-500 text-blue-600 dark:text-white' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-200'}`}>Tài liệu</button>
                    <button onClick={() => setSearchCategory('people')} className={`pb-2 border-b-2 transition whitespace-nowrap ${searchCategory === 'people' ? 'border-blue-500 text-blue-600 dark:text-white' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-200'}`}>Nhân sự</button>
                </div>

                {/* Results Area */}
                <div className="p-2 h-full md:h-auto overflow-y-auto">
                    <div className="px-4 py-3">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Gợi ý tìm kiếm</h4>
                        <div className="space-y-1">
                            {SEARCH_RESULTS_MOCK.map((item) => (
                                <div key={item.id} className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-sm border border-slate-100'}`}>
                                            <item.icon className={`w-5 h-5 ${item.color}`} />
                                        </div>
                                        <div>
                                            <h5 className={`font-semibold text-sm ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{item.name}</h5>
                                            <p className="text-xs text-slate-400">{item.desc}</p>
                                        </div>
                                    </div>
                                    <div className="hidden group-hover:flex items-center gap-2">
                                        <span className="text-[10px] text-slate-400 font-bold bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">↵ Enter</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions Footer */}
                    <div className={`mt-2 mx-2 p-3 rounded-xl flex gap-2 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition"><Plus className="w-3.5 h-3.5" /> Tạo mới...</button>
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition"><Search className="w-3.5 h-3.5" /> Tìm nâng cao</button>
                    </div>
                </div>

                {/* Footer Hint */}
                <div className={`hidden md:flex px-5 py-2.5 border-t text-[10px] text-slate-400 justify-between items-center ${isDarkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-100 bg-slate-50'}`}>
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1"><span className="font-bold">↑↓</span> để điều hướng</span>
                        <span className="flex items-center gap-1"><span className="font-bold">↵</span> để chọn</span>
                        <span className="flex items-center gap-1"><span className="font-bold">esc</span> để đóng</span>
                    </div>
                    <span>RinoEdu Search</span>
                </div>
            </div>
        </div>
    );
};
