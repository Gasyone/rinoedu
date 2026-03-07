const { useState } = React;

window.Components = window.Components || {};

/**
 * Webhooks & Integrations Page
 * Core Foundation: Tích hợp dịch vụ bên ngoài.
 */
window.Components.Webhooks = () => {
    const { Webhook, Plus, Server, Edit2, Trash2, Link } = window.Icons || {};

    // Mock Data
    const [hooks, setHooks] = useState([
        { id: 'wh_1', name: 'Gửi SMS Nhắc Lịch Học', endpoint: 'https://api.sms-brand.vn/v1/send', event: 'education.session.start', status: 'active', calls: 145 },
        { id: 'wh_2', name: 'Đồng bộ Zalo ZNS Zalo', endpoint: 'https://openapi.zalo.me/v2.0/oa/message', event: 'crm.lead.new', status: 'active', calls: 32 },
        { id: 'wh_3', name: 'Bot Telegram Cảnh báo Lỗi', endpoint: 'https://api.telegram.org/botXYZ/sendMessage', event: 'system.error.500', status: 'paused', calls: 0 },
        { id: 'wh_4', name: 'Payment Webhook VNPAY', endpoint: 'INTERNAL_RPC', event: 'fintech.payment.success', status: 'active', calls: 89 },
    ]);

    return (
        <div className="p-6 h-full flex flex-col bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        {Webhook && <Webhook className="w-6 h-6 text-indigo-600" />}
                        Webhooks & Integrations
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Cấu hình kết nối API thời gian thực với nền tảng thứ ba (Zalo, SMS, VNPAY...).</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors">
                    {Plus && <Plus className="w-4 h-4" />} Tạo Webhook Mới
                </button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hooks.map(hook => (
                    <div key={hook.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 auto-rows-max shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${hook.status === 'active' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-700'}`}>
                                    {Link ? <Link className="w-5 h-5" /> : '🔗'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate">{hook.name}</h3>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${hook.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 'bg-slate-100 text-slate-500 dark:bg-slate-700'}`}>
                                        {hook.status === 'active' ? 'Đang chạy' : 'Tạm dừng'}
                                    </span>
                                </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-md transition-colors"><Edit2 className="w-4 h-4" /></button>
                                <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 mb-4 font-mono text-xs overflow-hidden">
                            <p className="text-slate-400 mb-1 font-sans text-[10px] uppercase">Payload URL</p>
                            <p className="text-indigo-600 dark:text-indigo-400 truncate">{hook.endpoint}</p>
                        </div>

                        <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-700 pt-3">
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Lắng nghe sự kiện</p>
                                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{hook.event}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Số lần gọi (24h)</p>
                                <p className="text-lg font-extrabold text-slate-800 dark:text-white">{hook.calls}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-xl p-4 flex items-start gap-3">
                <Server className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-bold text-blue-800 dark:text-blue-400 text-sm">Hệ thống đang hoạt động ổn định</h4>
                    <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">RinoEdu Webhooks đang đẩy trung bình 150 requests/phút. Tỉ lệ trễ (latency) &lt; 200ms.</p>
                </div>
            </div>
        </div>
    );
};
