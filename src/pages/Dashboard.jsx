// js/components/Dashboard.jsx
const { Cloud, Plus, CreditCard, CheckCircle, Briefcase, FileText, Activity } = window.Icons;

window.Components = window.Components || {};

window.Components.Dashboard = ({
    dailyFocus, handleFocusChange, handleFocusKeyDown, getGreeting,
    shortcuts, handleOpenApp
}) => {
    return (
        <div className="space-y-6 animate-slide-up pb-24 md:pb-10 w-full animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
                <div className="md:col-span-8 rounded-3xl p-6 md:p-8 bg-white dark:bg-slate-800 shadow-card border border-slate-100 dark:border-slate-700 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">👋</span>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">{getGreeting()}, Administrator!</h2>
                    </div>
                    <div className="mt-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Tâm điểm hôm nay</label>
                        <div className="flex items-center gap-3 relative z-10 p-1">
                            <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 flex-shrink-0 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"></div>
                            <input type="text" placeholder="Nhập mục tiêu chính của bạn..." value={dailyFocus} onChange={handleFocusChange} onKeyDown={handleFocusKeyDown} className="flex-1 bg-transparent text-lg md:text-xl text-slate-700 dark:text-slate-200 placeholder-slate-300 border-none outline-none focus:ring-0" />
                        </div>
                    </div>
                </div>
                <div className="md:col-span-4 rounded-3xl p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-xl group-hover:scale-110 transition-transform duration-700"></div>
                    <div>
                        <div className="flex justify-between items-start">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"><Cloud className="w-6 h-6 text-white" /></div>
                            <span className="text-xs font-medium bg-white/10 px-2 py-1 rounded">Hà Nội</span>
                        </div>
                        <div className="mt-4">
                            <span className="text-4xl font-bold">28°C</span>
                            <p className="text-sm opacity-90">Nắng nhẹ, thích hợp ra ngoài.</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
                        <span className="text-sm font-medium">Thứ Sáu, 25/10</span>
                        <span className="text-sm font-bold bg-white text-indigo-600 px-2 py-0.5 rounded">09:41</span>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <h3 className="text-sm font-bold text-slate-500 mb-3 px-1 uppercase tracking-wider">Truy cập nhanh</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 w-full">
                    {shortcuts.map(sc => (
                        <div key={sc.id} onClick={() => handleOpenApp(sc.id)} className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group">
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-colors ${sc.bg} group-hover:scale-110 duration-300`}>
                                <sc.icon className={`w-5 h-5 md:w-6 md:h-6 ${sc.color}`} />
                            </div>
                            <span className="text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-300 text-center">{sc.name}</span>
                        </div>
                    ))}
                    <div className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition cursor-pointer text-slate-400 hover:text-blue-500">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-700"><Plus className="w-5 h-5 md:w-6 md:h-6" /></div>
                        <span className="text-xs md:text-sm font-medium">Thêm mới</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { label: 'Số dư ví', value: '15.000.000', sub: '+2.5% so với tháng trước', icon: CreditCard, color: 'text-violet-600', bg: 'bg-violet-50' },
                        { label: 'Task cần làm', value: '04', sub: '2 task quá hạn', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Dự án active', value: '03', sub: 'Deadline sắp tới: T5', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Yêu cầu chờ duyệt', value: '12', sub: 'Từ team Marketing', icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' },
                    ].map((stat, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-32">
                            <div className="flex justify-between items-start">
                                <div className={`p-2.5 rounded-xl ${stat.bg} dark:bg-slate-700`}><stat.icon className={`w-5 h-5 ${stat.color} dark:text-slate-200`} /></div>
                                <span className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{stat.label}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">{stat.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-card p-6">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-500" /> Hoạt động gần đây</h3>
                    <div className="space-y-4 relative">
                        <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-700"></div>
                        {[
                            { time: '10:30', title: 'Đã duyệt PO-2024-001', type: 'success' },
                            { time: '09:15', title: 'Meeting team Tech', type: 'info' },
                            { time: 'Hôm qua', title: 'Cập nhật hồ sơ nhân sự', type: 'default' },
                            { time: 'Hôm qua', title: 'Gửi báo cáo tuần', type: 'default' },
                        ].map((act, i) => (
                            <div key={i} className="flex gap-4 relative z-10">
                                <div className={`w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 flex-shrink-0 mt-0.5 ${act.type === 'success' ? 'bg-green-500' : act.type === 'info' ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                                <div>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{act.title}</p>
                                    <p className="text-xs text-slate-400">{act.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
