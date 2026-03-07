// js/components/SocialFeed.jsx
const { Plus, ImageIcon, Smile, Globe, MoreHorizontal, ThumbsUp, MessageCircle, Share2 } = window.Icons || {};

window.Components = window.Components || {};

window.Components.SocialFeed = ({ isExpandedMode }) => {
    const SOCIAL_FEED_MOCK = window.Data.SOCIAL_FEED_MOCK;

    const PINNED_ANNOUNCEMENTS = [
        { id: 1, title: 'Quyết định bổ nhiệm Giám đốc Vận hành (COO) mới', tag: 'QUYẾT ĐỊNH', color: 'bg-blue-100 text-blue-700', date: 'Hôm nay' },
        { id: 2, title: 'Hướng dẫn quy trình Đánh giá năng lực Khối Đào tạo Q4', tag: 'HƯỚNG DẪN', color: 'bg-emerald-100 text-emerald-700', date: 'Hôm qua' }
    ];

    return (
        <div className={`mx-auto space-y-6 pb-24 md:pb-0 ${isExpandedMode ? 'w-full px-4 md:px-8' : 'max-w-4xl px-4 md:px-6'}`}>

            {/* PINNED ANNOUNCEMENTS */}
            <div className="w-full relative">
                <h3 className="text-sm font-bold text-slate-500 mb-3 px-1 uppercase tracking-wider">Tin tức nội bộ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PINNED_ANNOUNCEMENTS.map(ann => (
                        <div key={ann.id} className="relative overflow-hidden rounded-2xl p-5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                            <div className="flex justify-between items-start mb-2 relative z-10">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-white/20 ${ann.color}`}>{ann.tag}</span>
                                <span className="text-xs font-medium text-slate-400">{ann.date}</span>
                            </div>
                            <h4 className="font-bold text-slate-800 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors relative z-10 line-clamp-2">{ann.title}</h4>
                            <div className="absolute right-[-10%] bottom-[-20%] w-24 h-24 bg-gradient-to-tl from-slate-100 to-transparent dark:from-slate-700 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CREATE POST */}
            <div className="rounded-2xl shadow-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 flex-shrink-0">
                        Me
                    </div>
                    <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors border border-transparent dark:border-slate-700 rounded-full px-5 flex items-center cursor-text relative">
                        <input type="text" placeholder="Chia sẻ với đồng nghiệp nội bộ..." className="w-full bg-transparent text-sm outline-none dark:text-white" />
                    </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                    <div className="flex gap-1 md:gap-2">
                        <button className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"><ImageIcon className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" /><span>Ảnh<span className="hidden sm:inline">/Video</span></span></button>
                        <button className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"><MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-indigo-500" /><span>Tạo bình chọn</span></button>
                        <button className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"><Smile className="w-4 h-4 md:w-5 md:h-5 text-amber-500" /><span>Khen thưởng</span></button>
                    </div>
                    <button className="px-5 md:px-6 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition shadow-sm">Đăng</button>
                </div>
            </div>

            {/* FEED */}
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-2 px-1">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Bài viết mới nhất</h3>
                </div>
                {SOCIAL_FEED_MOCK.map(post => (
                    <div key={post.id} className="rounded-2xl shadow-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden animate-slide-up">
                        <div className="p-4 flex gap-3 items-center border-b border-transparent dark:border-slate-700/50">
                            <div className={`w-10 h-10 rounded-full ${post.avatar} flex items-center justify-center font-bold flex-shrink-0 border border-black/5 dark:border-white/10`}>{post.user.charAt(0)}</div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1 truncate">
                                    {post.user}
                                    {post.user === 'Ban Truyền Thông' && <window.Icons.BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                                </h4>
                                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">{post.time} <span className="text-[10px]">•</span> <Globe className="w-3 h-3" /></p>
                            </div>
                            <button className="text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 p-1.5 rounded-lg transition"><MoreHorizontal className="w-5 h-5" /></button>
                        </div>
                        <div className="px-4 py-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                            {post.content}
                        </div>
                        {post.image && (
                            <div className="mt-1 w-full bg-slate-100 dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800/50">
                                <img src={post.image} className="w-full h-auto max-h-[500px] object-cover" />
                            </div>
                        )}
                        <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <div className="flex gap-2 text-[11px] md:text-xs font-medium text-slate-500">
                                <span className="flex items-center gap-1 bg-white/50 dark:bg-slate-800 px-2 py-1 rounded-full"><ThumbsUp className="w-3 h-3 text-blue-500" /> {post.likes}</span>
                                <span className="flex items-center gap-1 bg-white/50 dark:bg-slate-800 px-2 py-1 rounded-full">{post.comments} bình luận</span>
                            </div>
                            <div className="flex gap-1 md:gap-2">
                                <button className="flex items-center gap-1.5 md:gap-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded-lg text-sm font-medium transition"><ThumbsUp className="w-4 h-4" /><span className="hidden sm:inline">Thích</span></button>
                                <button className="flex items-center gap-1.5 md:gap-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-3 py-1.5 rounded-lg text-sm font-medium transition"><MessageCircle className="w-4 h-4" /><span className="hidden sm:inline">Bình luận</span></button>
                                <button className="flex items-center gap-1.5 md:gap-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-3 py-1.5 rounded-lg text-sm font-medium transition"><Share2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
