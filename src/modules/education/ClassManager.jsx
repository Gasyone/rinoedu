// js/modules/class_management/ClassManager.jsx

// Extracts the core UI logic from "Course Management.html"
const ClassManager = ({ activeWorkspace, isDarkMode, config }) => {
    const { useState, useMemo } = React;
    const t = (key) => window.i18n.t(key);

    const [mainTab, setMainTab] = useState('classes'); // classes, process, library
    const [viewMode, setViewMode] = useState('grid'); // grid, list, calendar
    const [activeClassTab, setActiveClassTab] = useState('all');
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);

    // Mock Data integration (assuming window.Data holds these, or we inject them)
    // For this module, we will assume the data is available under window.Data
    const MOCK_CLASSES = window.Data?.MOCK_CLASSES || [];
    const MOCK_COURSE_PROCESS = window.Data?.MOCK_COURSE_PROCESS || [];
    const MOCK_CLASS_LIBRARY = window.Data?.MOCK_CLASS_LIBRARY || [];
    const Icons = window.Icons || {};

    const filteredClasses = useMemo(() => {
        if (activeClassTab === 'all') return MOCK_CLASSES.filter(c => c.status !== 'Đã kết thúc');
        if (activeClassTab === 'active') return MOCK_CLASSES.filter(c => c.status === 'Đang diễn ra');
        if (activeClassTab === 'upcoming') return MOCK_CLASSES.filter(c => c.status === 'Sắp bắt đầu');
        if (activeClassTab === 'history') return MOCK_CLASSES.filter(c => c.status === 'Đã kết thúc');
        return MOCK_CLASSES;
    }, [activeClassTab, MOCK_CLASSES]);

    // View Components
    const renderClassesGrid = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClasses.map(cls => (
                <div key={cls.id} onClick={() => setSelectedClass(cls)} className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group flex flex-col`}>
                    <div className={`h-2 bg-${cls.color}-500 w-full`}></div>
                    <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded bg-${cls.color}-50 text-${cls.color}-700 dark:bg-${cls.color}-900/30 dark:text-${cls.color}-400 mb-2 inline-block`}>{cls.code}</span>
                                <h3 className={`font-bold text-lg text-slate-800 dark:text-white group-hover:text-emerald-600 transition-colors line-clamp-2`}>{cls.name}</h3>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{cls.course}</p>
                            </div>
                        </div>
                        <div className="space-y-2 mb-5 flex-1 mt-4">
                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                <Icons.Users className="w-4 h-4 text-slate-400" /> {cls.students} học viên
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                <Icons.Clock className="w-4 h-4 text-slate-400" /> <span className="truncate">{cls.schedule}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                <Icons.MapPin className="w-4 h-4 text-slate-400" /> {cls.room}
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-500 font-medium">Tiến độ</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300">{cls.progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className={`h-full bg-${cls.color}-500 rounded-full ${cls.progress === 100 ? 'bg-slate-400' : ''}`} style={{ width: `${cls.progress}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderProcessTable = () => (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                    <tr><th className="px-6 py-4">Tên Lộ trình (Course Process)</th><th className="px-6 py-4 text-center">Số Cấp độ</th><th className="px-6 py-4 text-center">Tổng thời lượng</th><th className="px-6 py-4 text-center">Tổng số buổi</th><th className="px-6 py-4 text-right">Thao tác</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {MOCK_COURSE_PROCESS.map(cp => (
                        <tr key={cp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer">
                            <td className="px-6 py-4 font-bold text-slate-800 dark:text-white flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><Icons.Book className="w-4 h-4" /></div>
                                {cp.name}
                            </td>
                            <td className="px-6 py-4 text-center font-medium text-slate-600 dark:text-slate-300">{cp.levels} Levels</td>
                            <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-300">{cp.duration}</td>
                            <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-300">{cp.classesCount} Buổi</td>
                            <td className="px-6 py-4 text-right"><button className={`text-sm font-bold text-blue-600 hover:underline`}>Chi tiết</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // Render detailed view if a class is selected
    if (selectedClass) {
        return (
            <div className="p-4 md:p-8 animate-fade-in">
                <button onClick={() => setSelectedClass(null)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white mb-6 transition font-medium">
                    <Icons.ArrowLeft className="w-4 h-4" /> {t('Quay lại danh sách lớp')}
                </button>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedClass.name}</h2>
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-${selectedClass.color}-100 text-${selectedClass.color}-700 dark:bg-${selectedClass.color}-900/30 dark:text-${selectedClass.color}-400`}>{selectedClass.status}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex gap-4">
                        <span>Mã: <strong className="text-slate-800 dark:text-white">{selectedClass.code}</strong></span>
                        <span>Khóa: <strong className="text-slate-800 dark:text-white">{selectedClass.course}</strong></span>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 border-t border-slate-200 dark:border-slate-700 pt-8">
                        <div className={`p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm`}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Icons.Users className="w-4 h-4" /></div>
                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Sĩ số lớp</h4>
                            </div>
                            <div className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{selectedClass.students}</div>
                        </div>
                        <div className={`p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm`}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><Icons.TrendingUp className="w-4 h-4" /></div>
                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Tiến độ</h4>
                            </div>
                            <div className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{selectedClass.progress}%</div>
                        </div>
                    </div>
                    {/* Placeholder for Tabs like Attendance, Sessions, Materials defined in Demo */}
                    <div className="mt-8 text-center text-slate-400 py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                        <Icons.BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50 text-emerald-500" />
                        <p>Chi tiết các buổi học, điểm danh, và học liệu của lớp sẽ hiển thị tại đây.</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col bg-slate-50 overflow-hidden dark:bg-slate-900/50">
            {/* Header Area inside Module */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 md:px-8 py-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Icons.GraduationCap className="w-6 h-6 text-emerald-600" />
                            {t('Quản lý Giảng dạy')}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Hỗ trợ giảng viên lên lớp, điểm danh và quản lý học vụ.</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-4 md:p-8 space-y-6">
                {/* Module Sub-navigation */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                    <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 xl:pb-0">
                        {[
                            { id: 'classes', label: 'Lớp thực tế (Đang chạy)' },
                            { id: 'process', label: 'Khung chương trình (Course Process)' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setMainTab(tab.id)}
                                className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${mainTab === tab.id ? `bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400` : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative hidden sm:block">
                            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" placeholder={t("Tìm kiếm...")} className={`pl-9 pr-4 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-full outline-none focus:border-emerald-500 bg-white dark:bg-slate-800 w-full sm:w-auto`} />
                        </div>
                    </div>
                </div>

                {mainTab === 'classes' && renderClassesGrid()}
                {mainTab === 'process' && renderProcessTable()}
            </div>
        </div>
    );
};

window.ClassManager = ClassManager;
