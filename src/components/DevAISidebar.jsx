// src/components/DevAISidebar.jsx
const { useState, useEffect, useRef } = React;

window.Components.DevAISidebar = ({ isDarkMode, isDevAIOpen, setIsDevAIOpen }) => {
    const { Sparkles, X, Send, ChevronRight, ChevronLeft, Terminal, Bot, Copy, Check, Link } = window.Icons || {};
    const [query, setQuery] = useState('');
    const [includeContext, setIncludeContext] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'ai',
            content: 'Xin chào Dev! Tôi là trợ lý AI nội bộ.\n\nTôi có thể đọc dữ liệu từ màn hình hiện tại và tìm kiếm thông tin trong tài liệu Confluence để hỗ trợ bạn code nhanh hơn.'
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const [copiedId, setCopiedId] = useState(null);

    // Auto scroll
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const renderMarkdown = (text, messageId) => {
        if (!text) return null;
        const blocks = text.split(/(```[\s\S]*?```)/g);

        return blocks.map((block, index) => {
            if (block.startsWith('```') && block.endsWith('```')) {
                // Code block
                const lines = block.split('\n');
                const lang = lines[0].replace('```', '').trim() || 'javascript';
                const code = lines.slice(1, -1).join('\n');

                return (
                    <div key={index} className="relative mt-2 mb-2 group rounded-md overflow-hidden bg-slate-800 border border-slate-700">
                        <div className="flex items-center justify-between px-3 py-1 bg-slate-900 border-b border-slate-700 text-xs text-slate-400">
                            <span>{lang}</span>
                            <button
                                onClick={() => handleCopy(code, `${messageId}-${index}`)}
                                className="hover:text-white transition-colors flex items-center gap-1"
                            >
                                {copiedId === `${messageId}-${index}` ? (
                                    <><Check size={12} className="text-green-400" /> Copied!</>
                                ) : (
                                    <><Copy size={12} /> Copy</>
                                )}
                            </button>
                        </div>
                        <pre className="p-3 text-xs overflow-x-auto text-green-400 font-mono code-block-custom scrollbar-hide">
                            <code>{code}</code>
                        </pre>
                    </div>
                );
            }

            // Normal text with basic formatting (bold, links, lists)
            return block.split('\n').map((line, i) => {
                if (!line.trim()) return <br key={`${index}-${i}`} />;

                // Parse bold
                const boldParts = line.split(/\*\*(.*?)\*\*/g);
                const formattedLine = boldParts.map((part, j) =>
                    j % 2 === 1 ? <strong key={j} className="font-bold">{part}</strong> : part
                );

                if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                    return <li key={`${index}-${i}`} className="ml-4 list-disc marker:text-slate-400">{formattedLine}</li>;
                }
                if (line.trim().match(/^[0-9]+\./)) {
                    return <li key={`${index}-${i}`} className="ml-4 list-decimal marker:text-slate-400">{formattedLine}</li>;
                }

                return <p key={`${index}-${i}`} className="mb-1">{formattedLine}</p>;
            });
        });
    };

    const handleSend = async () => {
        if (!query.trim() || isTyping) return;

        const currentUrl = window.location.href;
        const currentPath = window.location.pathname;
        const userMsgContent = query;

        const newUserMsg = { id: Date.now(), role: 'user', content: userMsgContent };
        setMessages(prev => [...prev, newUserMsg]);
        setQuery('');
        setIsTyping(true);

        const aiMsgId = Date.now() + 1;
        setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', content: '', isThinking: true }]);

        try {
            // Format previous messages to send to backend (excluding thinking/error objects)
            const messageHistory = messages
                .filter(m => m.content && !m.isThinking && !m.isError)
                .map(m => ({
                    role: m.role,
                    content: m.content
                }));

            // Append the new user message
            messageHistory.push({ role: 'user', content: userMsgContent });

            // Include context in the request to the worker if enabled
            const payload = {
                message: userMsgContent,
                messages: messageHistory, // Send full history for Agent memory
                ...(includeContext && {
                    context: {
                        url: currentUrl,
                        path: currentPath,
                    }
                })
            };

            // Call the newly implemented Cloudflare Worker AI Endpoint
            const response = await fetch('https://rinoapp-mcp.gasy.one/mcp/v1/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok && data.status === "success") {
                setMessages(prev => prev.map(m =>
                    m.id === aiMsgId ? { ...m, content: data.reply, isThinking: false } : m
                ));
            } else {
                setMessages(prev => prev.map(m =>
                    m.id === aiMsgId ? { ...m, content: data.error || data.reply || "Lỗi phản hồi từ máy chủ AI.", isThinking: false, isError: true } : m
                ));
            }
            setIsTyping(false);

        } catch (error) {
            setMessages(prev => prev.map(m =>
                m.id === aiMsgId ? { ...m, content: 'Lỗi kết nối tới AI backend: ' + error.message, isThinking: false, isError: true } : m
            ));
            setIsTyping(false);
        }
    };

    return (
        <div className={`fixed top-0 right-0 h-screen z-[200] transition-transform duration-300 transform ${isDevAIOpen ? 'translate-x-0' : 'translate-x-full'} flex`}>
            {/* Sidebar Content */}
            <div className={`w-[400px] max-w-[90vw] h-full shadow-2xl flex flex-col border-l ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'} relative`}>

                {/* Header */}
                <div className={`px-4 py-3 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm ring-1 ring-indigo-500/20">
                            <Bot size={18} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Dev Assistant</h2>
                            <p className="text-[10px] text-slate-500 font-mono">Context-Aware CLI</p>
                        </div>
                    </div>
                    <button onClick={() => setIsDevAIOpen(false)} className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Info Bar */}
                <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-900/40 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] text-indigo-800 dark:text-indigo-300 font-mono">Current Context: {window.location.pathname}</span>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 font-sans text-sm pb-8">
                    {messages.map((msg, idx) => (
                        <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-slide-up`} style={{ animationDelay: `${idx * 50}ms` }}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${msg.role === 'ai' ? 'bg-gradient-to-br from-slate-800 to-slate-900 text-slate-300 ring-1 ring-slate-700' : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'}`}>
                                {msg.role === 'ai' ? <Sparkles size={14} /> : <span className="text-xs font-bold">ME</span>}
                            </div>

                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed shadow-sm ${msg.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-sm'
                                : isDarkMode
                                    ? 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700'
                                    : 'bg-white text-slate-700 rounded-tl-sm border border-slate-200'
                                }`}>
                                {msg.isThinking ? (
                                    <div className="flex gap-1.5 items-center h-5">
                                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                                    </div>
                                ) : msg.role === 'ai' ? (
                                    <div className={`prose-sm ${msg.isError ? 'text-red-400' : ''}`}>
                                        {renderMarkdown(msg.content, msg.id)}
                                    </div>
                                ) : (
                                    <span>{msg.content}</span>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className={`p-4 border-t flex flex-col gap-2 ${isDarkMode ? 'border-slate-800 bg-slate-900/80 backdrop-blur-md' : 'border-slate-200 bg-white/80 backdrop-blur-md'}`}>
                    {/* Context Toggle */}
                    <div className="flex items-center justify-between px-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input type="checkbox" className="sr-only" checked={includeContext} onChange={() => setIncludeContext(!includeContext)} />
                                <div className={`block w-8 h-5 rounded-full transition-colors ${includeContext ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${includeContext ? 'transform translate-x-3' : ''}`}></div>
                            </div>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                                Đính kèm bối cảnh trang hiện tại
                            </span>
                        </label>
                    </div>

                    <div className={`relative flex items-end gap-2 rounded-xl border p-1 shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500/50 ${isDarkMode ? 'bg-slate-950 border-slate-700 focus-within:border-indigo-500' : 'bg-slate-50 border-slate-300 focus-within:border-indigo-500'}`}>
                        <div className="flex-1 py-1 px-3 min-h-[44px] flex items-center">
                            <textarea
                                rows={1}
                                className="w-full bg-transparent outline-none resize-none max-h-32 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 font-sans"
                                placeholder="Hỏi Dev AI về file hiện tại..."
                                value={query}
                                onChange={e => {
                                    setQuery(e.target.value);
                                    e.target.style.height = 'auto';
                                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                                }}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                            />
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={isTyping || !query.trim()}
                            className={`p-2.5 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors mb-0.5 mr-0.5 ${isTyping || !query.trim()
                                ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                                }`}
                        >
                            <Send size={16} className={isTyping || !query.trim() ? '' : 'translate-x-[-1px] translate-y-[1px]'} />
                        </button>
                    </div>
                    <div className="mt-2 text-[10px] text-center text-slate-500 flex items-center justify-center gap-1.5 focus:outline-none focus:ring-none">
                        <span>Nhấn <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[9px] font-mono">Enter</kbd> để gửi</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
