// js/components/AccountManager.jsx
const { useState, useMemo } = React;

window.Components = window.Components || {};
window.Components.AccountManager = ({ currentUser, isDarkMode, setIsDarkMode, isExpandedMode, setIsExpandedMode }) => {
    const { ACCOUNT_TABS } = window.Data;
    const [activeTab, setActiveTab] = useState('profile');

    const visibleTabs = ACCOUNT_TABS;

    const categories = useMemo(() => [...new Set(visibleTabs.map(t => t.category))], [visibleTabs]);

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return window.Components.AccountProfile ? <window.Components.AccountProfile currentUser={currentUser} isDarkMode={isDarkMode} /> : <div className="p-8 text-center text-slate-400">Đang tải Hồ sơ cá nhân...</div>;
            case 'security':
                return window.Components.AccountSecurity ? <window.Components.AccountSecurity isDarkMode={isDarkMode} /> : <div className="p-8 text-center text-slate-400">Đang tải Bảo mật...</div>;
            case 'general':
                return window.Components.AccountSettings ? <window.Components.AccountSettings isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} isExpandedMode={isExpandedMode} setIsExpandedMode={setIsExpandedMode} /> : <div className="p-8 text-center text-slate-400">Đang tải Cài đặt chung...</div>;
            case 'org_settings':
                return window.Components.OrgSettings ? <window.Components.OrgSettings isDarkMode={isDarkMode} /> : <div className="p-8 text-center text-slate-400">Đang tải Cài đặt nền tảng...</div>;
            case 'sys_users':
                return window.Components.SysUsers ? <window.Components.SysUsers isDarkMode={isDarkMode} /> : <div className="p-8 text-center text-slate-400">Đang tải Người dùng hệ thống...</div>;
            case 'sys_logs':
                return window.Components.SystemLogs ? <window.Components.SystemLogs /> : <div className="p-8 text-center text-slate-400">Đang tải Nhật ký hệ thống...</div>;
            case 'webhooks':
                return window.Components.Webhooks ? <window.Components.Webhooks /> : <div className="p-8 text-center text-slate-400">Đang tải cấu hình Webhooks...</div>;
            default:
                return <div className="p-8 text-center text-slate-400">Đang phát triển module: {activeTab}</div>;
        }
    };

    return (
        <div className="flex h-full w-full bg-slate-50 dark:bg-[#0f172a] overflow-hidden">
            {/* Internal Sidebar - Fixed Left - DESKTOP ONLY */}
            <div className={`w-64 border-r flex-col flex-shrink-0 h-full overflow-y-auto custom-scrollbar bg-white dark:bg-[#111827] dark:border-slate-800 hidden md:flex`}>
                <div className="flex-1 py-4 px-3 space-y-6">
                    {categories.map(group => (
                        <div key={group}>
                            <div className="px-3 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">{group}</div>
                            <ul className="space-y-1">
                                {visibleTabs.filter(t => t.category === group).map(tab => {
                                    const TabIcon = window.Icons[tab.iconName] || window.Icons.Box;
                                    return (
                                        <li key={tab.id}>
                                            <div
                                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${activeTab === tab.id ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:hover:bg-slate-800'}`}
                                                onClick={() => setActiveTab(tab.id)}
                                            >
                                                <TabIcon className="w-4 h-4" />
                                                <span>{tab.label}</span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content - Independent Scroll */}
            <div className="flex-1 h-full overflow-y-auto hover-scroll">
                <div className="p-4 md:p-8 min-h-full">
                    <div className="max-w-4xl mx-auto h-full">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};
