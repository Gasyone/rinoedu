// js/components/WorkspaceLoader.jsx
const { LayoutGrid } = window.Icons || {};

window.Components = window.Components || {};

window.Components.WorkspaceLoader = ({ visible, targetName }) => {
    if (!visible) return null;
    return (
        <div className="fixed inset-0 z-[9999] bg-white dark:bg-slate-900 flex flex-col items-center justify-center animate-fade-in">
            <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 animate-pulse flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <LayoutGrid className="w-8 h-8 text-white animate-spin-slow" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-700">
                    <div className="loader w-3 h-3"></div>
                </div>
            </div>
            <h3 className="mt-6 text-xl font-bold text-slate-800 dark:text-white">Đang chuyển đổi...</h3>
            <p className="text-sm text-slate-500 mt-1">Đang tải dữ liệu cho <span className="font-semibold text-blue-500">{targetName}</span></p>
        </div>
    );
};
