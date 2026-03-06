// js/modules/center_ops/CenterOps.jsx

// Extracts the core UI logic from "Station Managenement.html"
const CenterOps = ({ activeWorkspace, isDarkMode, config }) => {
    const { useState } = React;
    const t = (key) => window.i18n.t(key);
    const Icons = window.Icons;

    // Use Mock Data from window.Data if available, fallback to empty arrays
    const MOCK_BRANCHES = window.Data?.MOCK_BRANCHES || [];
    const MOCK_TEACHERS = window.Data?.MOCK_TEACHERS || [];

    const [mainTab, setMainTab] = useState('branches'); // branches, resources, crm
    const [selectedBranch, setSelectedBranch] = useState(null);

    const renderBranchesGrid = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
            {MOCK_BRANCHES.map(branch => (
                <div key={branch.id} onClick={() => setSelectedBranch(branch)} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-lg transition cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 flex items-center justify-center`}><Icons.MapPin className="w-5 h-5" /></div>
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${branch.status === 'Hoạt động tốt' ? 'bg-green-100 text-green-700' : branch.status === 'Tăng trưởng' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}>{branch.status}</span>
                    </div>
                    <h3 className={`text-lg font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors`}>{branch.name}</h3>
                    <p className="text-xs text-slate-500 mb-4">{branch.location}</p>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-700 pt-4">
                        <div>
                            <p className="text-xs text-slate-500 font-medium mb-1">Học viên (Active)</p>
                            <p className="text-lg font-bold text-slate-800 dark:text-white">{branch.activeStudents}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium mb-1">Doanh thu (Tháng)</p>
                            <p className="text-lg font-bold text-slate-800 dark:text-white">{branch.revenue}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderResourcesTable = () => (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm mt-6">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                        <th className="px-6 py-4">Nhân sự</th>
                        <th className="px-6 py-4">Bộ môn</th>
                        <th className="px-6 py-4">Cơ sở chính</th>
                        <th className="px-6 py-4 text-center">Giờ dạy (Tuần)</th>
                        <th className="px-6 py-4 text-right">Chi tiết</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {MOCK_TEACHERS.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer">
                            <td className="px-6 py-4 font-bold text-slate-800 dark:text-white flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">{t.name ? t.name.charAt(0) : '?'}</div>
                                <div>{t.name} <span className="block text-[10px] font-normal text-slate-500">{t.status}</span></div>
                            </td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{t.subject}</td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{t.branch}</td>
                            <td className="px-6 py-4 text-center font-bold text-blue-600 dark:text-blue-400">{t.hours}h</td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-slate-400 hover:text-blue-600"><Icons.Eye className="w-4 h-4 inline-block" /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    if (selectedBranch) {
        return (
            <div className="p-4 md:p-8 animate-fade-in flex flex-col h-full space-y-6">
                <button onClick={() => setSelectedBranch(null)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white mb-2 transition font-medium self-start">
                    <Icons.ArrowLeft className="w-4 h-4" /> Quay lại cơ sở
                </button>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Icons.Building className="w-6 h-6" /></div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedBranch.name}</h2>
                            <p className="text-sm text-slate-500">{selectedBranch.location}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Học viên Active</h4>
                            <div className="text-2xl font-bold text-slate-800 dark:text-white">{selectedBranch.activeStudents}</div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Doanh thu tháng</h4>
                            <div className="text-2xl font-bold text-slate-800 dark:text-white">{selectedBranch.revenue}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col bg-slate-50 overflow-hidden dark:bg-slate-900/50">
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 md:px-8 py-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Icons.Building className="w-6 h-6 text-blue-600" />
                            {t('Quản lý Đào tạo')}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Hệ thống vận hành cơ sở vật chất, nhân sự và kinh doanh.</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-4 md:p-8">
                <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
                    {[
                        { id: 'branches', label: 'Quản lý Cơ sở (Branches)' },
                        { id: 'resources', label: 'Nhân sự & Tài nguyên' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setMainTab(tab.id)}
                            className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${mainTab === tab.id ? `bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400` : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {mainTab === 'branches' && renderBranchesGrid()}
                {mainTab === 'resources' && renderResourcesTable()}

            </div>
        </div>
    );
};

window.CenterOps = CenterOps;
