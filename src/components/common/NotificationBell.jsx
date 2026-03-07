const { useState, useEffect } = React;

window.Components = window.Components || {};

/**
 * NotificationBell Component
 * Core Foundation: Tích hợp WebSocket (Real-time) hoặc Polling (Mock).
 */
window.Components.NotificationBell = () => {
    const { Bell } = window.Icons || {};
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Báo cáo doanh thu', body: 'Báo cáo Q3 đã được kế toán tải lên.', time: '1 phút trước', unread: true },
        { id: 2, title: 'Học phí', body: 'Lớp T.A Trẻ em có 2 học viên chưa nộp phí.', time: '2 giờ trước', unread: true },
        { id: 3, title: 'Hệ thống', body: 'Bảo trì hệ thống vào 2H sáng mai.', time: '1 ngày trước', unread: false },
    ]);

    const unreadCount = notifications.filter(n => n.unread).length;

    // Giả lập nhận event SSE/Websocket sau 10s
    useEffect(() => {
        const timer = setTimeout(() => {
            const newNoti = {
                id: Date.now(),
                title: 'RinoEdu AI',
                body: 'Tôi vừa tổ chức xong hệ thống tài liệu thư mục Docs cho bạn!',
                time: 'Vừa xong',
                unread: true
            };
            setNotifications(prev => [newNoti, ...prev]);
        }, 10000);
        return () => clearTimeout(timer);
    }, []);

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
                {Bell ? <Bell className="w-5 h-5" /> : '🔔'}
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 ring-2 ring-white dark:ring-slate-900 rounded-full"></span>
                )}
            </button>

            {isOpen && (
                <>
                    {/* Backdrop for click outside */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>

                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden animate-slide-up">
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/80">
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Thông báo</h3>
                            {unreadCount > 0 && (
                                <button onClick={markAllRead} className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline">
                                    Đánh dấu đã đọc
                                </button>
                            )}
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-6 text-center text-slate-400 text-sm">Không có thông báo nào</div>
                            ) : (
                                notifications.map(noti => (
                                    <div key={noti.id} className={`p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${noti.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`text-sm ${noti.unread ? 'font-bold text-slate-800 dark:text-white' : 'font-medium text-slate-600 dark:text-slate-300'}`}>
                                                {noti.title}
                                            </h4>
                                            {noti.unread && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>}
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{noti.body}</p>
                                        <p className="text-[10px] text-slate-400 mt-2 font-medium">{noti.time}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-2 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    window.dispatchEvent(new CustomEvent('ai-navigate', { detail: { moduleId: 'account_manager' } }));
                                }}
                                className="w-full py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors text-center"
                            >
                                Xem tất cả
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
