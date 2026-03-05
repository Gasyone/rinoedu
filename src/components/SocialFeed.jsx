// js/components/SocialFeed.jsx
const { Plus, ImageIcon, Smile, Globe, MoreHorizontal, ThumbsUp, MessageCircle, Share2 } = window.Icons;

window.Components = window.Components || {};

window.Components.SocialFeed = ({ isExpandedMode }) => {
    const SOCIAL_FEED_MOCK = window.Data.SOCIAL_FEED_MOCK;

    return (
        <div className={`mx-auto space-y-6 pb-24 md:pb-0 ${isExpandedMode ? 'w-full px-4 md:px-8' : 'max-w-3xl px-4 md:px-6'}`}>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                <div className="w-28 h-40 md:w-32 md:h-48 flex-shrink-0 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition group bg-white dark:bg-slate-800 dark:border-slate-600">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform"><Plus className="w-6 h-6" /></div>
                    <span className="font-bold text-xs md:text-sm text-slate-600 dark:text-slate-300">Tạo tin</span>
                </div>
                {[1, 2, 3].map(i => (
                    <div key={i} className="w-28 h-40 md:w-32 md:h-48 flex-shrink-0 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden group cursor-pointer">
                        <img src={`https://placehold.co/150x250/cbd5e1/64748b?text=Story ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute top-3 left-3 w-8 h-8 md:w-9 md:h-9 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-800"></div>
                    </div>
                ))}
            </div>
            <div className="rounded-2xl shadow-card bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4">
                <div className="flex gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500"></div>
                    <input type="text" placeholder="Bạn đang nghĩ gì thế?" className="flex-1 rounded-full px-5 text-sm outline-none transition bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-100" />
                </div>
                <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-700 pt-3">
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition"><ImageIcon className="w-5 h-5 text-green-500" /><span className="hidden sm:inline">Ảnh/Video</span></button>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition"><Smile className="w-5 h-5 text-yellow-500" /><span className="hidden sm:inline">Cảm xúc</span></button>
                    </div>
                    <button className="px-6 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-200 dark:shadow-none">Đăng</button>
                </div>
            </div>
            {SOCIAL_FEED_MOCK.map(post => (
                <div key={post.id} className="rounded-2xl shadow-card bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 overflow-hidden animate-slide-up">
                    <div className="p-4 flex gap-3 items-center">
                        <div className={`w-10 h-10 rounded-full ${post.avatar} flex items-center justify-center font-bold`}>{post.user.charAt(0)}</div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm text-slate-800 dark:text-white">{post.user}</h4>
                            <p className="text-xs text-slate-400">{post.time} • <Globe className="w-3 h-3 inline align-text-top" /></p>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-5 h-5" /></button>
                    </div>
                    <div className="px-4 pb-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{post.content}</div>
                    {post.image && <div className="mt-2 w-full h-80 bg-slate-100"><img src={post.image} className="w-full h-full object-cover" /></div>}
                    <div className="p-2 border-t border-slate-100 dark:border-slate-700 flex justify-between px-8">
                        <button className="flex items-center gap-2 text-slate-500 hover:text-blue-600 py-2 text-sm font-medium transition"><ThumbsUp className="w-4 h-4" /> {post.likes}</button>
                        <button className="flex items-center gap-2 text-slate-500 hover:text-blue-600 py-2 text-sm font-medium transition"><MessageCircle className="w-4 h-4" /> {post.comments}</button>
                        <button className="flex items-center gap-2 text-slate-500 hover:text-blue-600 py-2 text-sm font-medium transition"><Share2 className="w-4 h-4" /></button>
                    </div>
                </div>
            ))}
        </div>
    );
};
