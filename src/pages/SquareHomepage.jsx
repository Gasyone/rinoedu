const { useState, useEffect, useRef, useMemo } = React;

const SafeIcon = ({ iconName, className = "" }) => {
    const IconComponent = window.Icons && window.Icons[iconName];
    if (IconComponent) return <IconComponent className={className} />;
    return <div className={`w-4 h-4 bg-slate-200 rounded-sm animate-pulse ${className}`} title={`Missing icon: ${iconName}`}></div>;
};

// ────────────────────────────────────────────────
// MOCK DATA
// ────────────────────────────────────────────────
const INITIAL_WAREHOUSE_ITEMS = [
    { id: 'f1', name: 'Landing_Page_V1.tsx', type: 'code', date: 'Vừa xong', size: '12KB', color: 'text-cyan-500' },
    { id: 'f2', name: 'Hero_Section_Image.png', type: 'image', date: '2 phút trước', size: '1.4MB', color: 'text-purple-500' },
    { id: 'f3', name: 'System_Architecture.pdf', type: 'doc', date: '10 phút trước', size: '450KB', color: 'text-orange-500' },
    { id: 'dir1', name: 'Project Alpha', type: 'folder', date: 'Hôm qua', size: '4 items', color: 'text-blue-500' },
    { id: 'f4', name: 'Báo_cáo_học_phí_Q4.xlsx', type: 'doc', date: 'Hôm qua', size: '230KB', color: 'text-green-500' },
    { id: 'f5', name: 'Danh_sách_học_viên.csv', type: 'doc', date: '3 ngày trước', size: '88KB', color: 'text-teal-500' },
];

const SEARCH_RESULTS_MOCK = [
    { id: 1, title: 'RinoEdu Design System', type: 'Tài liệu', source: 'Design Team', url: '/docs/design-system', date: '20/10/2023', iconName: 'FileText' },
    { id: 2, title: 'Nguyễn Văn A', type: 'Mọi người', source: 'Marketing Dept', url: '/user/nguyenvana', date: 'Online', iconName: 'User' },
    { id: 3, title: 'Quản lý Dự án Pro', type: 'Ứng dụng', source: 'System App', url: '/app/project-pro', date: 'Installed', iconName: 'LayoutGrid' },
    { id: 4, title: 'Báo cáo Q3 - 2023.pdf', type: 'Tài liệu', source: 'Finance', url: '/files/report-q3', date: '15/10/2023', iconName: 'FileText' },
    { id: 5, title: 'Trần Thị B', type: 'Mọi người', source: 'HR Dept', url: '/user/tranthib', date: 'Offline', iconName: 'User' },
];

const SYSTEM_GLOBAL_APPS = [
    { id: 'education', name: 'Đào tạo', iconName: 'BookOpen', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'hr', name: 'Nhân sự', iconName: 'Users', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { id: 'crm', name: 'CRM', iconName: 'Target', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { id: 'assets', name: 'Kho tài sản', iconName: 'Database', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { id: 'account_manager', name: 'Quản lý tài khoản', iconName: 'User', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
];

// ────────────────────────────────────────────────
// WAREHOUSE MODAL
// ────────────────────────────────────────────────
const WarehouseModal = ({ isOpen, onClose }) => {
    const { Server, X, ChevronRight, FolderPlus, Folder, FileText, Image, BookOpen, MoreHorizontal, FileUp, Plus } = window.Icons;
    const [items, setItems] = useState(INITIAL_WAREHOUSE_ITEMS);
    const [currentPath, setCurrentPath] = useState(['Kho lưu trữ']);

    const handleCreateFolder = () => {
        const newFolder = {
            id: `dir_${Date.now()}`,
            name: 'Thư mục mới',
            type: 'folder',
            date: 'Vừa xong',
            size: '0 items',
            color: 'text-blue-500'
        };
        setItems([newFolder, ...items]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white dark:bg-slate-800 w-[640px] max-w-[95vw] h-[75vh] rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Server className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Kho AI &amp; Tài nguyên</h3>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Quản lý tài liệu và dữ liệu cho RinoEdu AI</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-slate-700 transition text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                        {currentPath.map((crumb, idx) => (
                            <React.Fragment key={idx}>
                                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
                                <span className={idx === currentPath.length - 1 ? 'font-semibold text-slate-700 dark:text-slate-300 text-xs' : 'text-xs hover:underline cursor-pointer text-slate-400'}>{crumb}</span>
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                            <FileUp className="w-3.5 h-3.5" /> Tải lên
                        </button>
                        <button onClick={handleCreateFolder} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors">
                            <FolderPlus className="w-3.5 h-3.5" /> Thư mục mới
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-3">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                            <Server className="w-12 h-12 text-slate-200 dark:text-slate-700" />
                            <p className="text-sm font-medium">Kho trống</p>
                            <p className="text-xs text-center">Tải file lên hoặc tạo thư mục để bắt đầu</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-1">
                            {items.map(item => (
                                <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 group cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.type === 'folder' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-slate-100 dark:bg-slate-700/50'} ${item.color}`}>
                                        {item.type === 'folder' ? <Folder className="w-5 h-5 fill-current" /> :
                                            item.type === 'code' ? <FileText className="w-5 h-5" /> :
                                                item.type === 'image' ? <Image className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-medium text-slate-800 dark:text-white truncate group-hover:text-blue-600 transition-colors">{item.name}</h4>
                                            <span className="text-xs text-slate-400 ml-2 flex-shrink-0">{item.size}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{item.date} • {item.type.toUpperCase()}</p>
                                    </div>
                                    <button className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-blue-500 hover:bg-white dark:hover:bg-slate-600 rounded-lg shadow-sm transition-all">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-2.5 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                    <span className="text-[10px] text-slate-400">{items.length} mục • 14.2 MB tổng cộng</span>
                    <span className="text-[10px] text-slate-400">Kho RinoEdu AI v1.0</span>
                </div>
            </div>
        </div>
    );
};

// ────────────────────────────────────────────────
// CODE CANVAS — only shown when coding mode active
// ────────────────────────────────────────────────
const CodeCanvas = ({ onClose, onOpenWarehouse }) => {
    const { X, Server, Maximize2, Sparkles } = window.Icons;
    const [viewTab, setViewTab] = useState('preview');
    return (
        <div className="flex flex-col bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-inner mt-3">
            <div className="h-10 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between px-3">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-0.5 rounded-lg">
                    <button onClick={() => setViewTab('preview')} className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition ${viewTab === 'preview' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>Preview</button>
                    <button onClick={() => setViewTab('code')} className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition ${viewTab === 'code' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>Code</button>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mr-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> Live
                    </span>
                    <button onClick={onOpenWarehouse} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-blue-500 transition-colors" title="Kho tài nguyên">
                        <Server className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={onClose} className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-slate-400 hover:text-red-500 transition-colors" title="Đóng canvas">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
            <div className="h-56 overflow-y-auto relative flex items-center justify-center p-3">
                {viewTab === 'preview' ? (
                    <div className="w-full h-full bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center gap-3 text-slate-400">
                        <Sparkles className="w-8 h-8 text-slate-200 dark:text-slate-600" />
                        <p className="text-xs text-center">Kết quả sẽ xuất hiện ở đây khi AI tạo code</p>
                    </div>
                ) : (
                    <div className="w-full h-full bg-[#1e1e1e] rounded-xl p-4 overflow-auto font-mono text-xs text-green-400">
                        <p>{'// RinoEdu AI Code Output'}</p>
                        <p>{'// Nhập yêu cầu và AI sẽ tạo code tại đây'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// ────────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────────
window.Components.SquareHomepage = ({
    isAuthenticated, currentUser, onNavigateLogin, onNavigateDashboard, onLogout,
    showUserMenu, setShowUserMenu, showAppLauncher, setShowAppLauncher
}) => {
    const {
        Zap, Search, Paperclip, FileUp, ImagePlus, Database, Headphones, StopCircle,
        Send, Sparkles, User, Server, Globe, Image, Code, ArrowUpRight,
        LayoutGrid, X, Bot, MessageSquare, Check, Copy
    } = window.Icons || {};

    const [activeMode, setActiveMode] = useState('search'); // 'search' | 'ai'
    const [searchTab, setSearchTab] = useState('all');
    const [query, setQuery] = useState('');
    const [hasActiveSearch, setHasActiveSearch] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isWarehouseOpen, setIsWarehouseOpen] = useState(false);
    const [isVoiceMode, setIsVoiceMode] = useState(false);

    // ----- AI Chat History: Lưu theo User ID -----
    const WELCOME_MSG = { id: 1, role: 'ai', content: 'Xin chào! Tôi là **RinoEdu AI** – trợ lý thông minh của hệ thống giáo dục RinoEdu.\n\nTôi có thể giúp bạn:\n• Tìm kiếm thông tin về học viên, lớp học, giáo viên\n• Giải đáp thắc mắc về các tính năng của hệ thống\n• Hỗ trợ quản lý lịch học và báo cáo\n• Trả lời câu hỏi liên quan đến học phí và vận hành trung tâm\n\nBạn cần hỗ trợ gì hôm nay?' };

    const getChatKey = () => {
        try {
            const profile = JSON.parse(localStorage.getItem('rino_user_profile') || '{}');
            return `rino_chat_history_${profile.id || profile.email || 'guest'}`;
        } catch { return 'rino_chat_history_guest'; }
    };

    const [aiMessages, setAiMessages] = useState(() => {
        try {
            const key = getChatKey();
            const saved = localStorage.getItem(key);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch { /* ignore */ }
        return [WELCOME_MSG];
    });

    // Persist chat history whenever messages change
    useEffect(() => {
        try {
            const key = getChatKey();
            // Only keep last 50 messages to avoid quota
            const toSave = aiMessages.filter(m => !m.isThinking).slice(-50);
            localStorage.setItem(key, JSON.stringify(toSave));
        } catch { /* ignore quota */ }
    }, [aiMessages]);
    // -----------------------------------------------

    const [isAiTyping, setIsAiTyping] = useState(false);
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const [activeTools, setActiveTools] = useState({ search: false, image: false, code: false });
    const [showCodeCanvas, setShowCodeCanvas] = useState(false);
    const [includeContext, setIncludeContext] = useState(false);
    const aiChatBottomRef = useRef(null);
    const aiInputRef = useRef(null);

    // Auto-scroll AI chat to bottom
    useEffect(() => {
        if (aiChatBottomRef.current) {
            aiChatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [aiMessages]);

    // When switching to AI mode, focus input
    useEffect(() => {
        if (activeMode === 'ai' && aiInputRef.current) {
            setTimeout(() => aiInputRef.current && aiInputRef.current.focus(), 100);
        }
    }, [activeMode]);

    // Open code canvas when code tool toggled on
    useEffect(() => {
        setShowCodeCanvas(activeTools.code);
    }, [activeTools.code]);

    const handleGoHome = () => {
        setHasActiveSearch(false);
        setQuery('');
        setActiveMode('search');
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && query.trim()) {
            setHasActiveSearch(true);
            setIsSearching(true);
            setTimeout(() => setIsSearching(false), 800);
        }
    };

    const handleAiSend = async () => {
        if (!query.trim() || isAiTyping) return;
        setHasActiveSearch(true);
        const userMsgContent = query;
        const userMsg = { id: Date.now(), role: 'user', content: userMsgContent };
        const aiMsgId = Date.now() + 1;
        setAiMessages(prev => [...prev, userMsg]);
        setQuery('');
        setIsAiTyping(true);
        setAiMessages(prev => [...prev, { id: aiMsgId, role: 'ai', content: '', isThinking: true }]);

        try {
            const currentUrl = window.location.href;
            const currentPath = window.location.pathname;

            // Format previous messages to send to backend (excluding thinking/error objects)
            const messageHistory = aiMessages
                .filter(m => m.content && !m.isThinking && !m.isError)
                .map(m => ({
                    role: m.role,
                    content: m.content
                }));

            // Append the new user message
            messageHistory.push({ role: 'user', content: userMsgContent });

            const payload = {
                message: userMsgContent,
                messages: messageHistory, // Send full history for Agent memory
                context: includeContext ? {
                    url: currentUrl,
                    path: currentPath,
                } : {}
            };

            const response = await fetch('https://rinoapp-mcp.gasy.one/mcp/v1/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok && data.status === "success") {
                setAiMessages(prev => prev.map(m =>
                    m.id === aiMsgId ? { ...m, content: data.reply, isThinking: false } : m
                ));
            } else {
                setAiMessages(prev => prev.map(m =>
                    m.id === aiMsgId ? { ...m, content: data.error || data.reply || "Lỗi phản hồi từ máy chủ AI.", isThinking: false, isError: true } : m
                ));
            }
        } catch (error) {
            setAiMessages(prev => prev.map(m =>
                m.id === aiMsgId ? { ...m, content: 'Lỗi kết nối tới AI backend: ' + error.message, isThinking: false, isError: true } : m
            ));
        } finally {
            setIsAiTyping(false);
        }
    };

    const toggleTool = (tool) => {
        setActiveTools(prev => ({ ...prev, [tool]: !prev[tool] }));
    };

    // Full markdown renderer: code blocks, headers, bold/italic, lists
    const renderAiText = (text) => {
        if (!text) return null;
        const [copiedCode, setCopiedCode] = React.useState(null);

        const handleCopyCode = (code, idx) => {
            navigator.clipboard.writeText(code);
            setCopiedCode(idx);
            setTimeout(() => setCopiedCode(null), 2000);
        };

        // Split by code blocks first
        const segments = text.split(/(```[\s\S]*?```)/g);

        return segments.map((segment, segIdx) => {
            if (segment.startsWith('```') && segment.endsWith('```')) {
                const lines = segment.split('\n');
                const lang = lines[0].replace('```', '').trim() || 'code';
                const code = lines.slice(1, -1).join('\n');
                return (
                    <div key={segIdx} className="relative my-3 rounded-xl overflow-hidden border border-slate-700 group">
                        <div className="flex items-center justify-between px-4 py-1.5 bg-slate-800 text-slate-400 text-[10px] font-mono">
                            <span className="uppercase tracking-wider">{lang}</span>
                            <button
                                onClick={() => handleCopyCode(code, segIdx)}
                                className="flex items-center gap-1 hover:text-white transition-colors"
                            >
                                {copiedCode === segIdx ? <><Check size={11} className="text-green-400" /> Copied!</> : <><Copy size={11} /> Copy</>}
                            </button>
                        </div>
                        <pre className="bg-slate-900 text-green-400 text-xs p-4 overflow-x-auto font-mono leading-relaxed"><code>{code}</code></pre>
                    </div>
                );
            }

            // Inline render function for a line (bold, italic)
            const renderInline = (line) => {
                const tokens = line.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
                return tokens.map((token, ti) => {
                    if (token.startsWith('**') && token.endsWith('**')) return <strong key={ti} className="font-semibold">{token.slice(2, -2)}</strong>;
                    if (token.startsWith('*') && token.endsWith('*')) return <em key={ti}>{token.slice(1, -1)}</em>;
                    if (token.startsWith('`') && token.endsWith('`')) return <code key={ti} className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[11px] font-mono text-rose-500 dark:text-rose-300">{token.slice(1, -1)}</code>;
                    return token;
                });
            };

            return segment.split('\n').map((line, li) => {
                if (!line.trim()) return <div key={`${segIdx}-${li}`} className="h-2" />;

                // Headers
                if (line.startsWith('### ')) return <h3 key={`${segIdx}-${li}`} className="text-sm font-bold text-slate-800 dark:text-white mt-3 mb-1">{renderInline(line.slice(4))}</h3>;
                if (line.startsWith('## ')) return <h2 key={`${segIdx}-${li}`} className="text-sm font-bold text-slate-900 dark:text-white mt-4 mb-1.5 border-b border-slate-200 dark:border-slate-700 pb-1">{renderInline(line.slice(3))}</h2>;
                if (line.startsWith('# ')) return <h1 key={`${segIdx}-${li}`} className="text-base font-extrabold text-slate-900 dark:text-white mt-4 mb-2">{renderInline(line.slice(2))}</h1>;

                // Bullet list
                if (line.match(/^[-*•]\s/)) return <li key={`${segIdx}-${li}`} className="ml-4 list-disc marker:text-violet-400 text-sm leading-relaxed">{renderInline(line.slice(2).trim())}</li>;

                // Numbered list
                if (line.match(/^\d+\.\s/)) {
                    const content = line.replace(/^\d+\.\s/, '');
                    return <li key={`${segIdx}-${li}`} className="ml-4 list-decimal marker:text-violet-400 text-sm leading-relaxed">{renderInline(content)}</li>;
                }

                // Horizontal rule
                if (line.match(/^---+$/)) return <hr key={`${segIdx}-${li}`} className="my-2 border-slate-200 dark:border-slate-700" />;

                return <p key={`${segIdx}-${li}`} className="text-sm leading-relaxed">{renderInline(line)}</p>;
            });
        });
    };

    const switchToAI = () => {
        setActiveMode('ai');
        setHasActiveSearch(true);
    };

    return (
        <div className="flex flex-col h-screen bg-[#f8fafc] dark:bg-[#0f172a] overflow-hidden w-full relative text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300" onClick={() => { setShowUserMenu(false); setShowAppLauncher(false); }}>

            {/* ── STICKY HEADER ── */}
            <div className={`flex items-center justify-between px-5 py-3 sticky top-0 z-50 bg-[#f8fafc]/90 dark:bg-[#0f172a]/90 backdrop-blur-md border-b transition-colors ${hasActiveSearch ? 'border-slate-200 dark:border-slate-800' : 'border-transparent'}`}>

                {/* LEFT: Logo (always clickable → home) */}
                <button
                    onClick={handleGoHome}
                    className="flex items-center gap-2.5 group flex-shrink-0"
                    title="Về trang chủ"
                >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-blue-500/30 group-hover:scale-105 transition-all">
                        <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 tracking-tight">
                        RinoEdu
                    </span>
                </button>

                {/* CENTER: Search bar (only in search mode with results) */}
                {hasActiveSearch && activeMode === 'search' && (
                    <div className="flex-1 max-w-xl mx-4">
                        <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow">
                            <Search className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <input
                                type="text"
                                className="flex-1 ml-3 bg-transparent outline-none text-slate-800 dark:text-white text-sm"
                                placeholder="RinoEdu: Tìm kiếm toàn hệ thống..."
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                autoFocus
                            />
                            {query && (
                                <button onClick={() => { setQuery(''); setHasActiveSearch(false); }} className="p-1 rounded-full text-slate-400 hover:text-slate-600 ml-2 transition-colors">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* CENTER: Switch to AI button (search mode) */}
                {activeMode === 'search' && hasActiveSearch && (
                    <button
                        onClick={switchToAI}
                        className="flex items-center gap-2 px-3 py-2 bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs font-bold rounded-xl transition-colors border border-violet-200 dark:border-violet-800 flex-shrink-0 ml-2"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Hỏi AI
                    </button>
                )}

                {/* RIGHT: Auth actions */}
                <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    {!isAuthenticated && (
                        <button onClick={onNavigateLogin} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-sm">
                            Đăng nhập
                        </button>
                    )}
                    {isAuthenticated && (
                        <>
                            <button
                                onClick={e => { e.stopPropagation(); setShowAppLauncher(!showAppLauncher); setShowUserMenu(false); }}
                                className={`p-2 rounded-full transition-colors ${showAppLauncher ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-blue-600'}`}
                                title="Ứng dụng"
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                            <button onClick={onNavigateDashboard} className="hidden md:block px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors text-xs">
                                Dashboard
                            </button>
                            <button
                                onClick={e => { e.stopPropagation(); setShowUserMenu(!showUserMenu); setShowAppLauncher(false); }}
                                className={`w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden cursor-pointer transition-all ${showUserMenu ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-[#0f172a]' : ''}`}
                            >
                                {currentUser?.name
                                    ? <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center font-bold text-white text-xs">{currentUser.name.substring(0, 2).toUpperCase()}</div>
                                    : <User className="w-5 h-5 text-slate-400" />}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* ── CONTENT ── */}
            <div className="flex-1 overflow-hidden flex flex-col">

                {/* ════ HOMEPAGE (idle state) ════ */}
                {!hasActiveSearch && (
                    <div className="flex flex-col flex-1 overflow-y-auto">
                        {/* Hero */}
                        <div className="flex flex-col items-center justify-center pt-16 pb-8 px-4">
                            <div className="p-5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[2rem] shadow-2xl shadow-blue-500/30 mb-6 animate-float">
                                <Zap className="w-14 h-14 text-white" />
                            </div>
                            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 tracking-tight mb-2">
                                RinoEdu
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-10">Nền tảng quản lý giáo dục thông minh</p>

                            {/* Smart Action Bar */}
                            <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 flex gap-2">
                                {/* Search side */}
                                <div className="flex-[3] flex items-center bg-slate-50 dark:bg-slate-900/50 rounded-xl px-4 h-12">
                                    <Search className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                    <input
                                        type="text"
                                        className="flex-1 ml-3 bg-transparent outline-none text-slate-800 dark:text-white placeholder-slate-400 text-sm w-full"
                                        placeholder="Tìm kiếm toàn bộ hệ thống..."
                                        value={query}
                                        onChange={e => setQuery(e.target.value)}
                                        onKeyDown={handleSearch}
                                        autoFocus
                                    />
                                </div>
                                {/* Divider */}
                                <div className="w-px bg-slate-200 dark:bg-slate-700 self-stretch my-1"></div>
                                {/* AI side */}
                                <button
                                    onClick={switchToAI}
                                    className="flex items-center gap-2 px-4 rounded-xl text-sm font-bold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    <span className="hidden sm:inline">Hỏi AI</span>
                                </button>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="max-w-lg mx-auto w-full px-4 pb-16">
                            <p className="text-[10px] font-bold text-slate-400 uppercase text-center mb-4 tracking-wider">Truy cập nhanh</p>
                            <div className="flex flex-wrap justify-center gap-6">
                                {SYSTEM_GLOBAL_APPS.map(app => {
                                    const AppIcon = window.Icons[app.iconName];
                                    return (
                                        <button
                                            key={app.id}
                                            onClick={() => {
                                                // Store which module should open, then navigate to workspace
                                                sessionStorage.setItem('rino_pending_module', app.id);
                                                onNavigateDashboard();
                                            }}
                                            className="flex flex-col items-center gap-2 group transition hover:-translate-y-1 w-20"
                                        >
                                            <div className={`w-12 h-12 rounded-2xl ${app.bg} flex items-center justify-center shadow-sm group-hover:shadow-md transition-all`}>
                                                <SafeIcon iconName={app.iconName} className={`w-6 h-6 ${app.color}`} />
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-center leading-tight">{app.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* ════ SEARCH RESULTS ════ */}
                {hasActiveSearch && activeMode === 'search' && (
                    <div className="flex-1 overflow-y-auto px-4 py-4">
                        <div className="max-w-3xl mx-auto">
                            {/* Filter tabs */}
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-3">
                                {[
                                    { id: 'all', label: 'Tất cả' },
                                    { id: 'apps', label: 'Ứng dụng' },
                                    { id: 'docs', label: 'Tài liệu' },
                                    { id: 'people', label: 'Mọi người' }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setSearchTab(tab.id)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${searchTab === tab.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {isSearching ? (
                                <div className="flex justify-center py-10 text-slate-400 text-sm">Đang tìm kiếm...</div>
                            ) : searchTab === 'all' ? (
                                <div className="space-y-3 animate-fade-in">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Kết quả hàng đầu</p>
                                    {SEARCH_RESULTS_MOCK.map(item => {
                                        const ItemIcon = window.Icons[item.iconName];
                                        return (
                                            <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group">
                                                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors flex-shrink-0">
                                                    <SafeIcon iconName={item.iconName} className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">{item.title}</h3>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-500 font-medium">{item.type}</span>
                                                        <span className="text-xs text-slate-400">• {item.source}</span>
                                                    </div>
                                                </div>
                                                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 flex-shrink-0" />
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-16 text-slate-400">
                                    <Search className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
                                    <p className="text-sm">Danh mục: <span className="font-bold text-slate-600 dark:text-slate-300">{searchTab}</span></p>
                                    <p className="text-xs mt-1">Chưa có kết quả trong danh mục này</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ════ AI CHAT MODE ════ */}
                {activeMode === 'ai' && (
                    <div className="flex-1 flex flex-col overflow-hidden">

                        {/* TOOL TOGGLES */}
                        <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 bg-[#f8fafc]/50 dark:bg-[#0f172a]/50">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chế độ:</span>
                            {[
                                { key: 'search', label: 'Tìm kiếm', icon: Globe, active: 'bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-800' },
                                { key: 'image', label: 'Tạo Ảnh', icon: Image, active: 'bg-purple-100 text-purple-600 border-purple-200 dark:bg-purple-900/40 dark:text-purple-400 dark:border-purple-800' },
                                { key: 'code', label: 'Coding', icon: Code, active: 'bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800' },
                            ].map(tool => {
                                const Icon = tool.icon;
                                return (
                                    <button
                                        key={tool.key}
                                        onClick={() => toggleTool(tool.key)}
                                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all border ${activeTools[tool.key] ? tool.active : 'bg-white text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 hover:border-slate-300'}`}
                                    >
                                        <Icon size={11} /> {tool.label}
                                    </button>
                                );
                            })}
                            {/* Context Toggle */}
                            <label className="flex items-center gap-1.5 px-2 py-1 ml-2 cursor-pointer bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 hover:border-blue-300 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={includeContext}
                                    onChange={(e) => setIncludeContext(e.target.checked)}
                                    className="w-3 h-3 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                                />
                                <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 select-none">Đính kèm bối cảnh (URL)</span>
                            </label>

                            <button
                                onClick={() => setIsWarehouseOpen(true)}
                                className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all border bg-white text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 hover:border-slate-300 hover:text-blue-600"
                            >
                                <Server size={11} /> Kho tài sản
                            </button>
                        </div>

                        {/* MESSAGES AREA (scrollable) */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                            {/* Code Canvas - only when coding mode on */}
                            {showCodeCanvas && (
                                <CodeCanvas
                                    onClose={() => { setShowCodeCanvas(false); setActiveTools(p => ({ ...p, code: false })); }}
                                    onOpenWarehouse={() => setIsWarehouseOpen(true)}
                                />
                            )}

                            {/* AI Messages */}
                            <div className="max-w-3xl mx-auto space-y-4">
                                {aiMessages.map(msg => (
                                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${msg.role === 'ai' ? 'bg-gradient-to-br from-violet-500 to-blue-600 text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                            {msg.role === 'ai' ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4 text-slate-500" />}
                                        </div>
                                        <div className={`max-w-[80%] rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-sm px-4 py-3'
                                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm px-4 py-3 space-y-1'
                                            }`}>
                                            {msg.isThinking ? (
                                                <div className="flex gap-1 h-4 items-center py-1">
                                                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"></span>
                                                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                                </div>
                                            ) : msg.role === 'ai' ? (
                                                <div className={`${msg.isError ? 'text-red-400' : ''}`}>
                                                    {renderAiText(msg.content)}
                                                    {isAiTyping && msg.id === Math.max(...aiMessages.filter(m => m.role === 'ai').map(m => m.id)) && (
                                                        <span className="inline-block w-0.5 h-[1em] bg-violet-400 ml-0.5 animate-pulse align-middle"></span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span>{msg.content}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div ref={aiChatBottomRef} />
                            </div>
                        </div>

                        {/* INPUT BAR (pinned to bottom with floating effect) */}
                        <div className="flex-shrink-0 bg-transparent px-4 pb-6 pt-2">
                            <div className="max-w-3xl mx-auto relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[1.25rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative flex items-end gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                                    {/* Attachment */}
                                    <div className="relative self-end mb-0.5">
                                        <button
                                            onClick={e => { e.stopPropagation(); setShowAttachMenu(!showAttachMenu); }}
                                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-blue-500 transition-colors"
                                        >
                                            <Paperclip className="w-4 h-4" />
                                        </button>
                                        {showAttachMenu && (
                                            <div className="absolute bottom-full mb-2 left-0 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
                                                <div className="p-1">
                                                    <button className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-left">
                                                        <FileUp className="w-4 h-4 text-blue-500" /> Tải file lên
                                                    </button>
                                                    <button className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-left">
                                                        <ImagePlus className="w-4 h-4 text-purple-500" /> Dán ảnh
                                                    </button>
                                                    <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                                                    <button className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-left">
                                                        <Database className="w-4 h-4 text-emerald-500" /> Kết nối dữ liệu
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Text input */}
                                    {isVoiceMode ? (
                                        <div className="flex-1 flex items-center gap-3 px-2 py-1">
                                            <span className="text-sm font-bold text-indigo-500 animate-pulse">Đang nghe...</span>
                                            <button onClick={() => setIsVoiceMode(false)} className="ml-auto p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded text-slate-400 hover:text-red-500 transition-colors">
                                                <StopCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <textarea
                                            ref={aiInputRef}
                                            rows={1}
                                            className="flex-1 bg-transparent outline-none text-slate-800 dark:text-white placeholder-slate-400 text-base py-1.5 resize-none max-h-32 overflow-y-auto leading-relaxed"
                                            placeholder="Hỏi RinoEdu AI bất cứ điều gì..."
                                            value={query}
                                            onChange={e => {
                                                setQuery(e.target.value);
                                                e.target.style.height = 'auto';
                                                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                                            }}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAiSend(); }
                                            }}
                                        />
                                    )}

                                    {/* Right actions */}
                                    <div className="flex items-center gap-1 self-end mb-0.5">
                                        {!isVoiceMode && (
                                            <button onClick={() => setIsVoiceMode(true)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-indigo-500 transition-colors" title="Giọng nói">
                                                <Headphones className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={handleAiSend}
                                            disabled={isAiTyping || !query.trim()}
                                            className={`p-2 rounded-xl text-white transition-all ${isAiTyping || !query.trim() ? 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-blue-500/20'}`}
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-400 text-center mt-2">Enter để gửi &nbsp;•&nbsp; Shift+Enter để xuống dòng &nbsp;•&nbsp; RinoEdu AI có thể mắc lỗi, hãy kiểm tra thông tin quan trọng</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* MODALS */}
            <WarehouseModal isOpen={isWarehouseOpen} onClose={() => setIsWarehouseOpen(false)} />
        </div>
    );
};
