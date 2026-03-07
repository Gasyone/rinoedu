// src/modules/mdm/Warehouse.jsx
// Standalone Warehouse (Kho tài sản) Module
const { useState, useRef } = React;

window.WarehouseModule = ({ isDarkMode }) => {
    const { Plus, Search, Filter, MoreHorizontal, Download, Edit2, Trash2, ChevronRight, Home, Users, Settings, Package, ShoppingCart, TrendingUp } = window.Icons || {};

    const INITIAL_ITEMS = [
        { id: 'dir1', name: 'Kế hoạch học kỳ 2024', type: 'folder', date: '2 ngày trước', size: '12 files', color: 'text-blue-500', starred: true },
        { id: 'dir2', name: 'Hình ảnh sự kiện', type: 'folder', date: 'Tuần trước', size: '45 files', color: 'text-purple-500', starred: false },
        { id: 'f1', name: 'Báo_cáo_học_phí_Q4_2024.xlsx', type: 'sheet', date: 'Hôm qua', size: '230 KB', color: 'text-green-600', starred: true },
        { id: 'f2', name: 'Danh_sách_học_viên_lớp_ReactJS.csv', type: 'sheet', date: '2 ngày trước', size: '88 KB', color: 'text-teal-600', starred: false },
        { id: 'f3', name: 'System_Architecture_v2.pdf', type: 'pdf', date: '10 ngày trước', size: '2.1 MB', color: 'text-red-500', starred: false },
        { id: 'f4', name: 'RinoEdu_Design_Guidelines.pdf', type: 'pdf', date: '1 tuần trước', size: '4.5 MB', color: 'text-red-500', starred: false },
        { id: 'f5', name: 'Landing_Page_Hero_Section.png', type: 'image', date: '3 ngày trước', size: '1.4 MB', color: 'text-purple-500', starred: false },
        { id: 'f6', name: 'ClassManager_Component.tsx', type: 'code', date: 'Vừa xong', size: '12 KB', color: 'text-cyan-500', starred: false },
    ];

    const [items, setItems] = useState(INITIAL_ITEMS);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [currentPath, setCurrentPath] = useState(['Kho lưu trữ']);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const inputRef = useRef(null);

    // Simulate upload
    const handleUploadClick = () => {
        setIsUploading(true);
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    const newFile = {
                        id: `f_${Date.now()}`,
                        name: `File_tải_lên_${Date.now()}.pdf`,
                        type: 'pdf',
                        date: 'Vừa xong',
                        size: `${Math.floor(Math.random() * 500) + 100} KB`,
                        color: 'text-red-500',
                        starred: false,
                    };
                    setItems(prev => [newFile, ...prev]);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const handleCreateFolder = () => {
        if (!newFolderName.trim()) return;
        const folder = {
            id: `dir_${Date.now()}`,
            name: newFolderName,
            type: 'folder',
            date: 'Vừa xong',
            size: '0 files',
            color: 'text-blue-500',
            starred: false,
        };
        setItems(prev => [folder, ...prev]);
        setNewFolderName('');
        setIsCreatingFolder(false);
    };

    const handleDelete = () => {
        setItems(prev => prev.filter(i => !selectedIds.includes(i.id)));
        setSelectedIds([]);
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const TYPE_FILTER = [
        { id: 'all', label: 'Tất cả' },
        { id: 'folder', label: 'Thư mục' },
        { id: 'image', label: 'Hình ảnh' },
        { id: 'pdf', label: 'PDF' },
        { id: 'sheet', label: 'Bảng tính' },
        { id: 'code', label: 'Code' },
    ];

    const filteredItems = items.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchFilter = activeFilter === 'all' || item.type === activeFilter;
        return matchSearch && matchFilter;
    });

    const STATS = [
        { label: 'Tổng dung lượng', value: '2.4 GB / 10 GB', icon: Database, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Files', value: `${items.filter(i => i.type !== 'folder').length}`, icon: FileText, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20' },
        { label: 'Thư mục', value: `${items.filter(i => i.type === 'folder').length}`, icon: Folder, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        { label: 'Cập nhật gần nhất', value: 'Vừa xong', icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    ];

    const getTypeIcon = (type) => {
        switch (type) {
            case 'folder': return <Folder className="w-6 h-6 fill-current" />;
            case 'image': return <Image className="w-6 h-6" />;
            case 'pdf': return <FileText className="w-6 h-6" />;
            case 'sheet': return <BookOpen className="w-6 h-6" />;
            case 'code': return <Server className="w-6 h-6" />;
            default: return <FileText className="w-6 h-6" />;
        }
    };

    return (
        <div className={`flex flex-col h-full gap-6`}>
            {/* ── HEADER / STATS ── */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-sm">
                                <Server className="w-5 h-5 text-white" />
                            </div>
                            Kho tài sản & Tài nguyên
                        </h1>
                        <p className="text-xs text-slate-400 mt-1 ml-11">Quản lý tài liệu, hình ảnh và tài nguyên của RinoEdu</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Upload Button */}
                        <button
                            onClick={handleUploadClick}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-blue-500/20 hover:shadow-md active:scale-95"
                        >
                            <FileUp className="w-4 h-4" />
                            Tải lên
                        </button>
                        <button
                            onClick={() => { setIsCreatingFolder(true); setTimeout(() => inputRef.current?.focus(), 100); }}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition-all hover:border-blue-300 hover:text-blue-600 active:scale-95"
                        >
                            <FolderPlus className="w-4 h-4" />
                            Thư mục mới
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {STATS.map((stat, i) => (
                        <div key={i} className={`flex items-center gap-3 p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} shadow-sm`}>
                            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                                <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-medium">{stat.label}</p>
                                <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
                <div className={`p-4 rounded-2xl border flex items-center gap-4 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-blue-50 border-blue-200'}`}>
                    <Upload className="w-5 h-5 text-blue-500 flex-shrink-0 animate-bounce" />
                    <div className="flex-1">
                        <p className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-1">Đang tải file lên...</p>
                        <div className="w-full bg-blue-200 dark:bg-blue-900/40 rounded-full h-1.5">
                            <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                        </div>
                    </div>
                    <span className="text-xs font-bold text-blue-600">{uploadProgress}%</span>
                </div>
            )}

            {/* New Folder Input */}
            {isCreatingFolder && (
                <div className={`flex items-center gap-3 p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-800 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                    <Folder className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={newFolderName}
                        onChange={e => setNewFolderName(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleCreateFolder(); if (e.key === 'Escape') setIsCreatingFolder(false); }}
                        placeholder="Tên thư mục mới..."
                        className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400"
                    />
                    <button onClick={handleCreateFolder} className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"><Check className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setIsCreatingFolder(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"><X className="w-3.5 h-3.5" /></button>
                </div>
            )}

            {/* ── TOOLBAR ── */}
            <div className={`flex items-center justify-between gap-3 p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100'} shadow-sm`}>
                {/* Breadcrumb */}
                <div className="flex items-center gap-1 text-sm">
                    {currentPath.map((crumb, idx) => (
                        <React.Fragment key={idx}>
                            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
                            <span className={idx === currentPath.length - 1
                                ? 'font-bold text-slate-700 dark:text-slate-300 text-xs'
                                : 'text-xs text-slate-400 hover:text-blue-600 cursor-pointer hover:underline'
                            }>{crumb}</span>
                        </React.Fragment>
                    ))}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Search */}
                    <div className={`relative flex items-center rounded-xl border px-3 py-1.5 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'} focus-within:border-blue-400 transition-colors`}>
                        <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="ml-2 bg-transparent outline-none text-xs text-slate-700 dark:text-slate-300 placeholder-slate-400 w-40"
                        />
                    </div>
                    {/* View toggle */}
                    <div className={`flex rounded-xl overflow-hidden border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                        <button onClick={() => setViewMode('grid')} className={`p-2 transition ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600'}`}><Grid3x3 className="w-4 h-4" /></button>
                        <button onClick={() => setViewMode('list')} className={`p-2 transition ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600'}`}><List className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>

            {/* ── FILTER TABS ── */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {TYPE_FILTER.map(f => (
                    <button
                        key={f.id}
                        onClick={() => setActiveFilter(f.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition ${activeFilter === f.id ? 'bg-blue-600 text-white border-blue-600' : `${isDarkMode ? 'border-slate-700 text-slate-400 hover:border-slate-500' : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'}`}`}
                    >
                        {f.label}
                    </button>
                ))}

                {selectedIds.length > 0 && (
                    <div className="ml-auto flex items-center gap-2">
                        <span className="text-xs text-blue-600 font-bold">{selectedIds.length} đã chọn</span>
                        <button onClick={handleDelete} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-full text-xs font-bold hover:bg-red-100 transition">
                            <Trash2 className="w-3.5 h-3.5" /> Xóa
                        </button>
                    </div>
                )}
            </div>

            {/* ── FILE GRID / LIST ── */}
            <div className="flex-1 overflow-y-auto">
                {filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <Server className="w-14 h-14 text-slate-200 dark:text-slate-700 mb-4" />
                        <p className="font-semibold text-sm">Không tìm thấy kết quả</p>
                        <p className="text-xs mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {filteredItems.map(item => {
                            const isSelected = selectedIds.includes(item.id);
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => toggleSelect(item.id)}
                                    className={`group relative p-4 rounded-2xl border cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${isSelected
                                        ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                                        : `${isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-slate-500' : 'bg-white border-slate-100 hover:border-blue-200'}`
                                        }`}
                                >
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${item.type === 'folder' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-slate-100 dark:bg-slate-700'} ${item.color}`}>
                                        {getTypeIcon(item.type)}
                                    </div>
                                    <h4 className={`text-xs font-semibold truncate mb-0.5 ${isDarkMode ? 'text-white' : 'text-slate-800'} group-hover:text-blue-600 transition-colors`}>{item.name}</h4>
                                    <p className="text-[10px] text-slate-400">{item.date} • {item.size}</p>
                                    <button
                                        onClick={e => { e.stopPropagation(); }}
                                        className="absolute top-2 right-2 p-1 rounded-lg opacity-0 group-hover:opacity-100 bg-white dark:bg-slate-700 text-slate-400 hover:text-blue-500 shadow-sm transition-all"
                                    >
                                        <MoreHorizontal className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* LIST VIEW */
                    <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                        <table className="w-full text-sm">
                            <thead className={`${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                <tr>
                                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold w-8">
                                        <input type="checkbox" className="rounded" onChange={e => {
                                            if (e.target.checked) setSelectedIds(filteredItems.map(i => i.id));
                                            else setSelectedIds([]);
                                        }} />
                                    </th>
                                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Tên</th>
                                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold hidden md:table-cell">Loại</th>
                                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold hidden md:table-cell">Ngày</th>
                                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Kích cỡ</th>
                                    <th className="w-12"></th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-100'}`}>
                                {filteredItems.map(item => {
                                    const isSelected = selectedIds.includes(item.id);
                                    return (
                                        <tr
                                            key={item.id}
                                            onClick={() => toggleSelect(item.id)}
                                            className={`group cursor-pointer transition-colors ${isSelected
                                                ? 'bg-blue-50 dark:bg-blue-900/20'
                                                : `${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50/80'} bg-white dark:bg-slate-900/30`
                                                }`}
                                        >
                                            <td className="px-4 py-3">
                                                <input type="checkbox" checked={isSelected} readOnly className="rounded" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.type === 'folder' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-slate-100 dark:bg-slate-700'} ${item.color}`}>
                                                        <div className="scale-75">{getTypeIcon(item.type)}</div>
                                                    </div>
                                                    <span className={`font-medium text-xs truncate max-w-[200px] ${isDarkMode ? 'text-white' : 'text-slate-800'} group-hover:text-blue-600 transition-colors`}>{item.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{item.type}</span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-slate-400 hidden md:table-cell">{item.date}</td>
                                            <td className="px-4 py-3 text-xs text-slate-400">{item.size}</td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={e => e.stopPropagation()}
                                                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                                                >
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
