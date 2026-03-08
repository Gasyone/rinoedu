const { useState, useEffect, useRef } = React;

window.Modules = window.Modules || {};

/**
 * DocumentCenter - Trung tâm tri thức & Tài liệu (Whitepaper) với AI Tích hợp
 */
window.Modules.DocumentCenter = () => {
    const {
        Search, FileText, ChevronRight, User, Calendar, Download,
        MessageSquare, Send, Bot, RefreshCw, Paperclip, X, Plus, Filter, Edit, Trash2, Maximize2, BookOpen, Bookmark, Settings, Globe, Share2, Mail, Printer, Star, Clock, Layers, BarChart3, TrendingUp, Users
    } = window.Icons || {};

    const [articles, setArticles] = useState(window.Data?.MOCK_WHITEPAPERS || []);
    const [viewMode, setViewMode] = useState('list');
    const [activeView, setActiveView] = useState('general');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('content');
    const [aiMessages, setAiMessages] = useState([]);
    const [aiInput, setAiInput] = useState('');
    const [isAiTyping, setIsAiTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Admin Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newArticle, setNewArticle] = useState({ title: '', category: 'Development', content: '' });
    const [aiGenPrompt, setAiGenPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // Ticket Modal State
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [ticketData, setTicketData] = useState({ subject: '', type: 'error/bug', message: '' });
    const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);

    const categories = [
        { name: 'All', icon: '🌟' },
        { name: 'Architecture', icon: '🏗️' },
        { name: 'Development', icon: '💻' },
        { name: 'Process', icon: '🔄' },
        { name: 'Security', icon: '🛡️' },
        { name: 'General', icon: '📁' }
    ];

    // Reset AI chat when opening drawer
    useEffect(() => {
        if (isAiDrawerOpen) {
            if (selectedArticle) {
                setAiMessages([
                    {
                        role: 'system',
                        content: `Chào bạn, tôi là trợ lý AI chuyên môn về tài liệu **"${selectedArticle.title}"**. Bạn cần hỏi gì về tải liệu này?`
                    }
                ]);
            } else {
                setAiMessages([
                    {
                        role: 'system',
                        content: `Chào bạn, tôi là RinoEdu AI - Trợ lý của Trung tâm Tri thức. Bạn cần hỏi gì về các tài liệu hướng dẫn hay hệ thống RinoEdu không?`
                    }
                ]);
            }
            setAiInput('');
        }
    }, [isAiDrawerOpen, selectedArticle]);

    // Cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [aiMessages]);

    const filteredArticles = articles.filter(article => {
        const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.content.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesView = true;
        if (activeView === 'mine') matchesView = article.isFavorite;
        // In real app, admin would filter by permissions, here we show all or status
        if (activeView === 'admin') matchesView = true;

        return matchesCategory && matchesSearch && matchesView;
    });

    const handleOpenReader = (article) => {
        setSelectedArticle(article);
        setViewMode('reader');
        setIsAiDrawerOpen(false); // Close AI drawer if opening reader fresh
    };

    const handleOpenAiDrawer = (e, article = null) => {
        if (e) e.stopPropagation();
        setSelectedArticle(article);
        setIsAiDrawerOpen(true);
    };

    const handleBackToList = () => {
        setViewMode('list');
        setSelectedArticle(null);
        setIsAiDrawerOpen(false);
        setIsTicketModalOpen(false);
    };

    const handleOpenTicketModal = (e) => {
        if (e) e.stopPropagation();
        setTicketData(prev => ({
            ...prev,
            subject: selectedArticle ? `[${selectedArticle.category}] ${selectedArticle.title}` : 'Góp ý chung cho Hub'
        }));
        setIsTicketModalOpen(true);
    };

    const handleSendTicket = async () => {
        if (!ticketData.subject || !ticketData.message) return;
        setIsSubmittingTicket(true);
        try {
            // Mock API call
            await new Promise(r => setTimeout(r, 1000));
            alert('Cảm ơn bạn! Ticket đã được gửi cho quản trị viên.');
            setIsTicketModalOpen(false);
            setTicketData({ subject: '', type: 'error/bug', message: '' });
        } finally {
            setIsSubmittingTicket(false);
        }
    };

    const handleSendAiMessage = async () => {
        if (!aiInput.trim()) return;

        const userMsg = { role: 'user', content: aiInput };
        setAiMessages(prev => [...prev, userMsg]);
        setAiInput('');
        setIsAiTyping(true);

        try {
            const contextPayload = selectedArticle ? {
                articleId: selectedArticle.id,
                articleTitle: selectedArticle.title,
                articleContent: selectedArticle.content
            } : {
                currentModule: 'Trung tâm Tri thức',
                screenName: 'Document Center'
            };

            const payload = {
                message: userMsg.content,
                context: contextPayload,
                messages: aiMessages.slice(1)
            };

            const response = await fetch('https://apirinoai.gasy.io/mcp/v1/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Lỗi kết nối tới AI Backend');

            const data = await response.json();
            setAiMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Xin lỗi, tôi không thể trả lời lúc này.' }]);

            // Handle tool-call actions returned by AI Backend
            if (data.action && data.action.type === 'ADD_DOCUMENT' && data.action.data) {
                const args = data.action.data;
                const newDoc = {
                    id: 'wp_' + Date.now(),
                    title: args.title || 'Untitled AI Document',
                    category: args.category || 'General',
                    author: 'RinoEdu AI',
                    date: new Date().toISOString().split('T')[0],
                    content: args.content || ''
                };
                setArticles(prev => [newDoc, ...prev]);
            }

        } catch (error) {
            console.error("AI Chat Error:", error);
            setAiMessages(prev => [...prev, { role: 'system', content: `(Lỗi: Không thể kết nối tới AI. ${error.message})` }]);
        } finally {
            setIsAiTyping(false);
        }
    };

    // --- ADMIN ACTIONS ---
    const handleSaveNewArticle = () => {
        if (!newArticle.title || !newArticle.content) return;

        const art = {
            id: 'wp_' + Date.now(),
            title: newArticle.title,
            category: newArticle.category,
            author: 'Admin',
            date: new Date().toISOString().split('T')[0],
            content: newArticle.content
        };

        setArticles([art, ...articles]);
        setIsCreateModalOpen(false);
        setNewArticle({ title: '', category: 'Development', content: '' });
    };

    const handleAiGenerateDoc = async () => {
        if (!aiGenPrompt) return;
        setIsGenerating(true);
        try {
            // Re-use logic to chat with AI to generate markdown content
            const payload = {
                message: `Tạo một tài liệu guideline/whitepaper với tiêu đề/yêu cầu: "${aiGenPrompt}". Trả về nội dung hoàn toàn bằng định dạng Markdown. Bao gồm Tiêu đề chính, các sections.`,
                context: { role: 'admin_doc_generator' },
                messages: []
            };
            const response = await fetch('https://apirinoai.gasy.io/mcp/v1/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('Lỗi backend AI');
            const data = await response.json();

            setNewArticle(prev => ({
                ...prev,
                title: aiGenPrompt,
                content: data.reply
            }));
        } catch (error) {
            alert("Lỗi AI Generator: " + error.message);
        } finally {
            setIsGenerating(false);
            setAiGenPrompt('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 relative overflow-hidden">

            {/* CLEAN PREMIUM HEADER (h-12) */}
            <div className="h-12 shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between z-50 sticky top-0 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        {viewMode === 'reader' && (
                            <button onClick={handleBackToList} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all">
                                <ChevronRight className="w-4 h-4 rotate-180" />
                            </button>
                        )}
                        <div className="w-7 h-7 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-lg flex items-center justify-center shadow-md">
                            <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                            <h1 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">Tri thức</h1>
                        </div>
                    </div>

                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

                    {viewMode === 'list' && (
                        <nav className="flex items-center gap-1">
                            {[
                                { id: 'general', label: 'Tài liệu chung', icon: Globe },
                                { id: 'mine', label: 'Của tôi', icon: Bookmark },
                                { id: 'admin', label: 'Quản trị', icon: Settings }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveView(tab.id)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${activeView === tab.id ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                                </button>
                            ))}
                        </nav>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text" placeholder="Tìm kiếm tài liệu..."
                            className="w-48 xl:w-64 pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:w-80 transition-all outline-none"
                            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={(e) => handleOpenAiDrawer(e, selectedArticle)}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${isAiDrawerOpen ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:shadow-md'}`}
                    >
                        <Bot className="w-4 h-4" /> Trợ lý AI
                    </button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-lg shadow-md transition-all active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* VIEW MODE: LIST */}
                {viewMode === 'list' && (
                    <div className="flex-1 flex overflow-hidden">
                        {/* LEFT SUB-SIDEBAR (Categories) */}
                        <div className="w-56 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-4 animate-slideRight">
                            <div className="mb-4">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Danh mục tri thức</h3>
                                <div className="space-y-1">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.name}
                                            onClick={() => setSelectedCategory(cat.name)}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all group ${selectedCategory === cat.name
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`text-sm transition-transform group-hover:scale-125 ${selectedCategory === cat.name ? '' : 'filter grayscale'}`}>
                                                    {cat.icon}
                                                </span>
                                                <span className="text-xs font-semibold">{cat.name}</span>
                                            </div>
                                            {selectedCategory === cat.name && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={(e) => handleOpenTicketModal(e)}
                                    className="w-full flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-blue-600 text-[11px] font-bold hover:shadow-md transition-all active:scale-95"
                                >
                                    <MessageSquare className="w-4 h-4" /> Báo lỗi / Góp ý
                                </button>
                            </div>
                        </div>

                        {/* RIGHT MAIN CONTENT AREA */}
                        <div className="flex-1 overflow-y-auto w-full flex flex-col bg-slate-50/50 dark:bg-slate-900/50 p-6 scrollbar-hide">
                            {/* ADMIN ANALYTICS - Clean Inline Bar */}
                            {activeView === 'admin' && (
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fadeIn">
                                    <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white shadow-lg shadow-blue-500/10">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-blue-100 text-[10px] font-bold uppercase tracking-wider mb-1">Tổng tài liệu</p>
                                                <h4 className="text-2xl font-black">{articles.length}</h4>
                                            </div>
                                            <div className="p-2 bg-white/20 rounded-xl"><Globe className="w-5 h-5" /></div>
                                        </div>
                                    </div>
                                    {[
                                        { label: 'Lượt đọc tuần', val: '2.4k', icon: TrendingUp, color: 'text-blue-500' },
                                        { label: 'Đánh giá TB', val: '4.9/5', icon: Star, color: 'text-amber-500' },
                                        { label: 'Tác giả active', val: '12', icon: Users, color: 'text-purple-500' }
                                    ].map((stat, i) => (
                                        <div key={i} className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm flex items-center justify-between">
                                            <div>
                                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                                                <h4 className="text-xl font-bold text-slate-800 dark:text-white">{stat.val}</h4>
                                            </div>
                                            <div className={`p-2 bg-slate-50 dark:bg-slate-900 rounded-xl ${stat.color}`}>
                                                <stat.icon className="w-5 h-5" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* GRID HEADER */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                                        {selectedCategory === 'All' ? 'Tất cả tài liệu' : `Chuyên mục: ${selectedCategory}`}
                                        <span className="ml-3 text-xs font-semibold text-slate-400">({filteredArticles.length})</span>
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 hover:shadow-sm transition-all">
                                        <Filter className="w-3.5 h-3.5" /> Lọc bài
                                    </button>
                                </div>
                            </div>

                            {/* GRID - HIGH DENSITY */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                                {filteredArticles.map(article => (
                                    <div
                                        key={article.id}
                                        onClick={() => handleOpenReader(article)}
                                        className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col relative overflow-hidden"
                                    >
                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                            <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                {article.icon || '📄'}
                                            </div>
                                            <div className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase">
                                                <Star className="w-2.5 h-2.5 fill-current" /> {article.rating || '5.0'}
                                            </div>
                                        </div>

                                        <h3 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors tracking-tight mb-2 h-8">{article.title}</h3>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium mb-5 tracking-tight opacity-80">
                                            {article.category} • {article.readTime}m • {article.views} lượt đọc
                                        </p>

                                        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between relative z-10">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white font-bold shadow-md">
                                                    {article.author?.charAt(0)}
                                                </div>
                                                <span className="text-[9px] font-semibold text-slate-500 tracking-tight">{article.author}</span>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-[7px] font-bold uppercase tracking-widest border ${article.status === 'published' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                                {article.status === 'published' ? 'Public' : 'Draft'}
                                            </span>
                                        </div>

                                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-600/0 group-hover:bg-blue-600/5 rounded-bl-[4rem] transition-all"></div>
                                    </div>
                                ))}
                            </div>

                            {filteredArticles.length === 0 && (
                                <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700 animate-fadeIn">
                                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Search className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <h4 className="text-lg font-black text-slate-400 uppercase tracking-widest mb-2">Không có tài liệu</h4>
                                    <p className="text-slate-400 text-sm mb-6">Không tìm thấy tài liệu phù hợp trong danh mục này.</p>
                                    <button onClick={() => setSelectedCategory('All')} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-black text-xs uppercase shadow-lg shadow-blue-500/20 active:scale-95 transition-all">Xem tất cả</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* VIEW MODE: READER */}
                {viewMode === 'reader' && selectedArticle && (
                    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900">
                        {/* READER TOP BAR */}
                        <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-slate-50/50 dark:bg-slate-900/50">
                            <button onClick={handleBackToList} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
                                <X className="w-4 h-4" /> Đóng
                            </button>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition" title="Chia sẻ"><Share2 className="w-4 h-4" /></button>
                                <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition" title="Gửi Email"><Mail className="w-4 h-4" /></button>
                                <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition" title="In tài liệu"><Printer className="w-4 h-4" /></button>
                                <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-2"></div>
                                <button className="px-5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition shadow-sm active:scale-95" onClick={(e) => handleOpenAiDrawer(e, selectedArticle)}>Hỏi Rino AI</button>
                            </div>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                            {/* LEFT SIDEBAR: TOC - Compact */}
                            <div className="hidden lg:block w-56 h-full border-r border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 overflow-y-auto p-5 scrollbar-thin">
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-1 h-3 bg-blue-600 rounded-full"></div>
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mục lục</h4>
                                </div>
                                <nav className="space-y-0.5">
                                    {selectedArticle.content.split('\\n')
                                        .filter(line => line.startsWith('# ') || line.startsWith('## '))
                                        .map((line, i) => {
                                            const isH1 = line.startsWith('# ');
                                            const text = line.replace(/^#+ /, '');
                                            return (
                                                <a
                                                    key={i}
                                                    href={`#toc-${i}`}
                                                    className={`block py-1.5 text-[11px] transition-all border-l-2 pl-3 -ml-px ${isH1
                                                        ? 'font-black text-slate-800 dark:text-slate-200 border-transparent hover:border-blue-400'
                                                        : 'text-slate-500 border-transparent hover:border-slate-300 dark:hover:text-slate-300 pl-5'}`}
                                                >
                                                    {text}
                                                </a>
                                            );
                                        })
                                    }
                                </nav>
                            </div>

                            {/* MAIN CONTENT CENTER */}
                            <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
                                <div className="max-w-3xl mx-auto px-6 md:px-10 py-10">
                                    <div className="mb-10">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-100 dark:border-blue-800">
                                                {selectedArticle.category}
                                            </span>
                                            {selectedArticle.status === 'published' && (
                                                <span className="flex items-center gap-1 text-green-500 text-[10px] font-bold">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                                    Phát hành
                                                </span>
                                            )}
                                        </div>
                                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-5 tracking-tight">
                                            {selectedArticle.title}
                                        </h1>
                                        <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed italic mb-6 border-l-4 border-blue-500/20 pl-5">
                                            {selectedArticle.summary || "Khám phá kiến thức nền tảng và hướng dẫn thực thi chuyên sâu."}
                                        </p>
                                    </div>

                                    <div className="prose prose-slate dark:prose-invert max-w-none">
                                        {selectedArticle.content.split('\\n').map((paragraph, idx) => {
                                            if (!paragraph.trim()) return <div key={idx} className="h-2"></div>;

                                            const isH1 = paragraph.startsWith('# ');
                                            const isH2 = paragraph.startsWith('## ');
                                            const headerId = (isH1 || isH2) ? `toc-${selectedArticle.content.split('\\n').slice(0, idx).filter(l => l.startsWith('# ') || l.startsWith('## ')).length}` : null;

                                            if (isH1) return <h1 key={idx} id={headerId} className="text-xl font-bold mt-10 mb-5 text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 tracking-tight">{paragraph.replace('# ', '')}</h1>;
                                            if (isH2) return <h2 key={idx} id={headerId} className="text-lg font-bold mt-8 mb-4 text-slate-800 dark:text-slate-200 flex items-center gap-3">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                {paragraph.replace('## ', '')}
                                            </h2>;
                                            if (paragraph.startsWith('- ')) return <li key={idx} className="ml-4 mb-2 text-slate-700 dark:text-slate-300 leading-relaxed list-disc text-sm">{paragraph.replace('- ', '').replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')}</li>;
                                            if (paragraph.startsWith('> ')) return <blockquote key={idx} className="border-l-4 border-blue-600 pl-6 italic bg-blue-50/30 dark:bg-blue-900/10 py-4 my-8 rounded-r-2xl text-slate-700 dark:text-slate-300 text-sm">{paragraph.replace('> ', '')}</blockquote>;

                                            const parsedHTML = paragraph
                                                .replace(/\\*\\*(.*?)\\*\\*/g, '<strong class="text-slate-900 dark:text-white font-black">$1</strong>')
                                                .replace(/\\`(.*?)\\`/g, '<code class="bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-[11px] text-pink-600 dark:text-amber-400 font-mono font-bold">$1</code>');

                                            return <p key={idx} className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm antialiased" dangerouslySetInnerHTML={{ __html: parsedHTML }}></p>;
                                        })}
                                    </div>

                                    {/* BOTTOM INTERACTION TABS */}
                                    <div className="mt-24 border-t border-slate-200 dark:border-slate-800 pt-8">
                                        <div className="flex gap-8 border-b border-slate-100 dark:border-slate-800 mb-8">
                                            {[
                                                { id: 'content', label: 'Bài viết', icon: FileText },
                                                { id: 'discussion', label: `Thảo luận (${selectedArticle.comments?.length || 0})`, icon: MessageSquare },
                                                { id: 'history', label: 'Lịch sử', icon: Clock },
                                                { id: 'variants', label: 'Biến thể', icon: Layers }
                                            ].map(t => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => setActiveTab(t.id)}
                                                    className={`pb-4 text-sm font-semibold flex items-center gap-2 transition-all relative ${activeTab === t.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                                                >
                                                    <t.icon className="w-4 h-4" /> {t.label}
                                                    {activeTab === t.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full animate-grow-x"></div>}
                                                </button>
                                            ))}
                                        </div>

                                        {activeTab === 'discussion' && (
                                            <div className="space-y-6 animate-fadeIn">
                                                <div className="flex gap-4 mb-8">
                                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0"></div>
                                                    <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                                                        <textarea placeholder="Viết phản hồi hoặc đặt câu hỏi..." className="w-full bg-transparent border-none outline-none text-sm resize-none" rows="2"></textarea>
                                                        <div className="flex justify-end mt-2"><button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm">Gửi bình luận</button></div>
                                                    </div>
                                                </div>
                                                {(selectedArticle.comments || []).map(comment => (
                                                    <div key={comment.id} className="flex gap-4">
                                                        <img src={comment.avatar} className="w-10 h-10 rounded-full flex-shrink-0" />
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{comment.user}</span>
                                                                <span className="text-[10px] text-slate-400 font-medium uppercase">{comment.date}</span>
                                                            </div>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{comment.text}</p>
                                                            <button className="text-[10px] font-black text-blue-500 mt-2 uppercase tracking-tighter hover:underline">Phản hồi</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {activeTab === 'history' && (
                                            <div className="space-y-6 animate-fadeIn">
                                                {(selectedArticle.history || []).map((h, i) => (
                                                    <div key={i} className="flex gap-6 relative">
                                                        <div className="w-px h-full bg-slate-100 dark:bg-slate-800 absolute left-2 top-4"></div>
                                                        <div className="w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 relative z-10 mt-1"></div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{h.action}</p>
                                                            <p className="text-xs text-slate-500 mt-1">Cập nhật bởi <span className="font-bold text-blue-500">{h.user}</span> vào lúc {h.date}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {activeTab === 'variants' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                                                {(selectedArticle.variants || []).map(v => (
                                                    <div key={v.id} className={`p-4 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${v.active ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-800 hover:border-blue-300'}`}>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-lg ${v.active ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}><Layers className="w-5 h-5" /></div>
                                                            <span className={`text-sm font-bold ${v.active ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}>{v.name}</span>
                                                        </div>
                                                        {v.active ? <div className="text-[10px] font-black text-blue-600 bg-white px-2 py-0.5 rounded-full shadow-sm">HIỆN TẠI</div> : <button className="text-xs font-bold text-slate-400 hover:text-blue-500 transition">Chuyển sang</button>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT SIDEBAR: METADATA & ASSETS */}
                            <div className="hidden xl:block w-80 h-full border-l border-slate-200 dark:border-slate-800 bg-slate-50/10 dark:bg-slate-900/10 overflow-y-auto p-8 scrollbar-thin">
                                <div className="space-y-10">
                                    {/* Author Info */}
                                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Người soạn thảo</h4>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                                                {selectedArticle.author?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{selectedArticle.author}</p>
                                                <p className="text-[10px] text-blue-500 font-semibold uppercase tracking-wider mt-1">Technical Admin</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center justify-center gap-1 text-amber-500 mb-1"><Star className="w-3.5 h-3.5 fill-current" /><span className="text-sm font-bold">{selectedArticle.rating || '5.0'}</span></div>
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight">Đánh giá</p>
                                        </div>
                                        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center justify-center gap-1 text-blue-500 mb-1"><RefreshCw className="w-3.5 h-3.5" /><span className="text-sm font-bold">{selectedArticle.views || 0}</span></div>
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight">Lượt đọc</p>
                                        </div>
                                    </div>

                                    {/* Version & Info */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chi tiết tài liệu</h4>
                                        <div className="space-y-3 bg-slate-50/50 dark:bg-slate-800/50 p-4 rounded-xl">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-slate-400 font-medium">Phiên bản</span>
                                                <span className="font-bold text-slate-800 dark:text-slate-200">v{selectedArticle.version}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-slate-400 font-medium">Đối tượng</span>
                                                <span className="font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded shadow-sm">{selectedArticle.audience}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-slate-400 font-medium">Lớp nhãn</span>
                                                <div className="flex gap-1">
                                                    {(selectedArticle.tags || []).slice(0, 2).map(t => <span key={t} className="text-[9px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">#{t}</span>)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Attachments */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">Tài liệu đính kèm <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 px-1.5 py-0.5 rounded text-[10px] font-bold">{selectedArticle.attachments?.length || 0}</span></h4>
                                        <div className="space-y-2">
                                            {(selectedArticle.attachments || []).map(att => (
                                                <div key={att.id} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center gap-3 hover:border-blue-400 transition-colors cursor-pointer group">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 flex-shrink-0 group-hover:scale-110 transition-transform"><Paperclip className="w-4 h-4" /></div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">{att.name}</p>
                                                        <p className="text-[9px] text-slate-400 font-medium uppercase">{att.size}</p>
                                                    </div>
                                                    <Download className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                                </div>
                                            ))}
                                            {(selectedArticle.attachments?.length === 0 || !selectedArticle.attachments) && <p className="text-[10px] text-slate-400 italic">Không có tệp đính kèm.</p>}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                                        <button
                                            onClick={(e) => handleOpenTicketModal(e)}
                                            className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-xs font-black shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Edit className="w-4 h-4" /> Báo lỗi / Góp ý nội dung
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                }

                {/* AI SLIDE-OVER DRAWER - Fixed Absolute Overlay */}
                <div
                    className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-l border-slate-200 dark:border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.1)] transform transition-transform duration-500 ease-in-out z-[100] flex flex-col ${isAiDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    style={{ top: '64px' }} // Start below the unified header
                >
                    <div className="h-14 flex items-center justify-between px-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xs text-slate-900 dark:text-white tracking-tight">
                                    {selectedArticle ? 'Phân tích tài liệu' : 'Hệ thống Tri thức'}
                                </h3>
                                <p className="text-[10px] text-blue-500 font-semibold uppercase tracking-tight italic">Rino AI Assistant</p>
                            </div>
                        </div>
                        <button onClick={() => setIsAiDrawerOpen(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-all">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
                        {aiMessages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                                <div className={`max-w-[85%] rounded-[1.5rem] px-4 py-3 text-xs leading-relaxed font-medium ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-sm shadow-xl shadow-blue-500/10'
                                    : msg.role === 'system'
                                        ? 'bg-slate-100/50 dark:bg-white/5 text-slate-400 italic text-[10px]'
                                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-sm shadow-sm'
                                    }`}>
                                    <div className="prose prose-xs dark:prose-invert max-w-none break-words" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\\n/g, '<br/>') }} />
                                </div>
                            </div>
                        ))}
                        {isAiTyping && (
                            <div className="flex justify-start animate-pulse">
                                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-2 flex gap-1">
                                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                        <div className="relative flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-1 shadow-sm focus-within:border-blue-500 transition-all">
                            <textarea
                                disabled={isAiTyping}
                                value={aiInput}
                                onChange={(e) => setAiInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendAiMessage(); } }}
                                placeholder="Gửi câu hỏi cho AI..."
                                className="flex-1 bg-transparent border-none py-2 px-3 text-xs resize-none focus:ring-0 max-h-24 font-medium"
                                rows="1"
                            />
                            <button
                                disabled={!aiInput.trim() || isAiTyping}
                                onClick={handleSendAiMessage}
                                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-xl transition-all shadow-md active:scale-95"
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

            </div >

            {/* CREATE MODAL (ADMIN) */}
            {
                isCreateModalOpen && (
                    <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">

                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                                <h2 className="text-xl font-bold flex items-center gap-2"><FileText className="w-6 h-6 text-indigo-600" /> Thêm Tài liệu (Whitepaper)</h2>
                                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition"><X className="w-5 h-5" /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6">

                                {/* Editor Area */}
                                <div className="flex-1 flex flex-col gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Tiêu đề</label>
                                        <input
                                            type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 font-medium focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Nhập tiêu đề tài liệu..."
                                            value={newArticle.title} onChange={e => setNewArticle({ ...newArticle, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Danh mục</label>
                                        <select
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 font-medium focus:ring-2 focus:ring-indigo-500"
                                            value={newArticle.category} onChange={e => setNewArticle({ ...newArticle, category: e.target.value })}
                                        >
                                            <option value="Architecture">Architecture</option>
                                            <option value="Development">Development</option>
                                            <option value="Process">Process</option>
                                            <option value="Security">Security</option>
                                            <option value="General">General</option>
                                        </select>
                                    </div>
                                    <div className="flex-1 flex flex-col min-h-[300px]">
                                        <div className="flex justify-between items-end mb-1">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Nội dung (Markdown)</label>
                                            <span className="text-xs text-slate-500">Hỗ trợ # H1, ## H2, - List, **Bold**</span>
                                        </div>
                                        <textarea
                                            className="w-full flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 resize-none"
                                            placeholder="# Bắt đầu viết nội dung ở đây..."
                                            value={newArticle.content} onChange={e => setNewArticle({ ...newArticle, content: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* AI Generator Tools */}
                                <div className="w-full lg:w-72 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-5 border border-indigo-100 dark:border-indigo-800/50 flex flex-col h-fit">
                                    <div className="flex items-center gap-2 mb-4 text-indigo-800 dark:text-indigo-300">
                                        <Bot className="w-5 h-5" />
                                        <h3 className="font-bold">AI Tự động viết</h3>
                                    </div>
                                    <p className="text-xs text-indigo-600/80 dark:text-indigo-400/80 mb-4">
                                        Mô tả ngắn gọn nội dung bạn muốn truyền tải, AI sẽ sinh ra khung sườn Markdown hoàn chỉnh.
                                    </p>
                                    <textarea
                                        className="w-full bg-white dark:bg-slate-800 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 min-h-[100px] resize-none shadow-sm mb-4"
                                        placeholder="VD: Viết guideline quy tắc đặt tên biến trong dự án..."
                                        value={aiGenPrompt} onChange={e => setAiGenPrompt(e.target.value)}
                                        disabled={isGenerating}
                                    />
                                    <button
                                        onClick={handleAiGenerateDoc}
                                        disabled={isGenerating || !aiGenPrompt.trim()}
                                        className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-lg font-bold text-sm shadow-md transition disabled:opacity-50 flex justify-center items-center gap-2"
                                    >
                                        {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                                        {isGenerating ? "Đang viết..." : "Viết bằng AI"}
                                    </button>
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex justify-end gap-3">
                                <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition">Hủy bỏ</button>
                                <button onClick={handleSaveNewArticle} disabled={!newArticle.title || !newArticle.content} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-md transition disabled:opacity-50">Lưu Tài liệu</button>
                            </div>

                        </div>
                    </div>
                )
            }
            {/* TICKETING MODAL */}
            {
                isTicketModalOpen && (
                    <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-bounce-in">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                                <h2 className="font-bold flex items-center gap-2"><MessageSquare className="w-5 h-5 text-blue-600" /> Gửi Báo cáo/Góp ý</h2>
                                <button onClick={() => setIsTicketModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition"><X className="w-4 h-4" /></button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Chủ đề tóm tắt</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        value={ticketData.subject}
                                        onChange={e => setTicketData({ ...ticketData, subject: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Loại yêu cầu</label>
                                    <select
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        value={ticketData.type}
                                        onChange={e => setTicketData({ ...ticketData, type: e.target.value })}
                                    >
                                        <option value="error/bug">Lỗi nội dung/Bug</option>
                                        <option value="missing">Thiếu thông tin</option>
                                        <option value="suggestion">Đề xuất cải tiến</option>
                                        <option value="other">Khác</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nội dung chi tiết</label>
                                    <textarea
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                                        placeholder="Vui lòng mô tả vấn đề hoặc góp ý của bạn..."
                                        value={ticketData.message}
                                        onChange={e => setTicketData({ ...ticketData, message: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex justify-end gap-3">
                                <button onClick={() => setIsTicketModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition">Hủy</button>
                                <button
                                    onClick={handleSendTicket}
                                    disabled={isSubmittingTicket || !ticketData.message}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSubmittingTicket ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    Gửi Ticket
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};
