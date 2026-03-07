const { useState } = React;

window.Components = window.Components || {};

/**
 * SystemLogs Page (Audit Trail)
 * Core Foundation: Lưu vết mọi hành động hệ thống.
 */
window.Components.SystemLogs = () => {
    const { Activity, Search, Filter, ShieldAlert } = window.Icons || {};

    // Mock Data
    const [logs, setLogs] = useState([
        { id: 'LOG001', time: '10:45 07/03/2026', user: 'Admin Tran', action: 'XÓA', target: 'Học viên Nguyễn Văn X', module: 'Education', ip: '192.168.1.1', status: 'Thành công' },
        { id: 'LOG002', time: '10:30 07/03/2026', user: 'Teacher A', action: 'SỬA', target: 'Điểm số môn Math Basic', module: 'Education', ip: '113.114.115.116', status: 'Bị từ chối (403)' },
        { id: 'LOG003', time: '09:00 07/03/2026', user: 'System Worker', action: 'TỰ ĐỘNG', target: 'Quét nợ học phí', module: 'Fintech', ip: 'localhost', status: 'Thành công' },
        { id: 'LOG004', time: '18:15 06/03/2026', user: 'Sales B', action: 'THÊM', target: 'Lead Mới: Chị Lan', module: 'CRM', ip: 'Khách vãng lai', status: 'Thành công' },
    ]);

    const getActionColor = (action) => {
        switch (action) {
            case 'XÓA': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'SỬA': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'THÊM': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
        }
    };

    return (
        <div className="p-6 h-full flex flex-col bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        {Activity && <Activity className="w-6 h-6 text-blue-600" />}
                        Nhật ký Hệ thống (Audit Trail)
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Theo dõi, truy vết mọi thay đổi dữ liệu trên toàn bộ các module.</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex gap-4 mb-4 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center bg-slate-100 dark:bg-slate-900/50 rounded-lg px-3 py-2 flex-1 border border-transparent focus-within:border-blue-500 transition-colors">
                    {Search && <Search className="w-4 h-4 text-slate-400" />}
                    <input type="text" placeholder="Tìm theo người dùng, IP, thao tác..." className="bg-transparent border-none outline-none text-sm w-full ml-2 text-slate-800 dark:text-slate-100" />
                </div>
                <button className="flex items-center gap-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                    {Filter && <Filter className="w-4 h-4" />} Lọc: Hôm nay
                </button>
                <button className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                    {ShieldAlert && <ShieldAlert className="w-4 h-4" />} Xuất báo cáo Security
                </button>
            </div>

            {/* Table */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                                <th className="p-4 font-bold">Thời gian</th>
                                <th className="p-4 font-bold">Người dùng</th>
                                <th className="p-4 font-bold">Hành động</th>
                                <th className="p-4 font-bold">Mục tiêu</th>
                                <th className="p-4 font-bold">Module</th>
                                <th className="p-4 font-bold">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-sm p-4">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group">
                                    <td className="p-4 text-slate-500 font-mono text-xs">{log.time}</td>
                                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
                                        <div className="flex flex-col">
                                            <span>{log.user}</span>
                                            <span className="text-[10px] text-slate-400">{log.ip}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${getActionColor(log.action)}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-600 dark:text-slate-300 max-w-[200px] truncate" title={log.target}>{log.target}</td>
                                    <td className="p-4">
                                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[10px] font-semibold tracking-wide">
                                            {log.module}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-2 h-2 rounded-full ${log.status.includes('Thành công') ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                            <span className={`text-xs ${log.status.includes('Thành công') ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                                {log.status}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
