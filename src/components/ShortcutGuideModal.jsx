// js/components/ShortcutGuideModal.jsx
const { X, Command, Search, MessageSquare, Menu, LayoutGrid } = window.Icons || {};

window.Components = window.Components || {};

window.Components.ShortcutGuideModal = ({ isOpen, onClose, isDarkMode }) => {
    if (!isOpen) return null;

    const shortcuts = [
        {
            category: "Tìm kiếm & Điều hướng",
            items: [
                { keys: ['Ctrl', 'K'], label: 'Mở tìm kiếm toàn cục' },
                { keys: ['Ctrl', 'Space'], label: 'Hỏi AI Assistant' },
                { keys: ['esc'], label: 'Đóng popup/modal' },
            ]
        },
        {
            category: "Quản lý Ứng dụng",
            items: [
                { keys: ['Shift', '/'], label: 'Mở bảng phím tắt này' },
                { keys: ['Alt', 'A'], label: 'Mở kho ứng dụng' },
                { keys: ['Ctrl', 'M'], label: 'Mở/đóng Sidebar' },
            ]
        }
    ];

    const Keycap = ({ children }) => (
        <kbd className={`inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>
            {children}
        </kbd>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
            <div
                className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-slideUp ${isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}
                onClick={e => e.stopPropagation()}
            >
                <div className={`flex items-center justify-between px-6 py-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                            <Command className="w-5 h-5" />
                        </div>
                        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Phím tắt hệ thống</h2>
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {shortcuts.map((group, idx) => (
                        <div key={idx}>
                            <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                {group.category}
                            </h3>
                            <div className="space-y-3">
                                {group.items.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                            {item.label}
                                        </span>
                                        <div className="flex gap-1">
                                            {item.keys.map((k, ki) => (
                                                <Keycap key={ki}>{k}</Keycap>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className={`px-6 py-4 border-t text-sm text-center ${isDarkMode ? 'border-slate-800 bg-slate-800/50 text-slate-400' : 'border-slate-100 bg-slate-50 text-slate-500'}`}>
                    Pro tip: Bạn có thể nhấn <Keycap>?</Keycap> bất cứ lúc nào để gọi bảng này lên.
                </div>
            </div>
        </div>
    );
};
