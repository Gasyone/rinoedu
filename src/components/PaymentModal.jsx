// js/components/PaymentModal.jsx
const { useState } = React;
const { CreditCard, Loader2 } = window.Icons;

window.Components = window.Components || {};

window.Components.PaymentModal = ({ app, isOpen, onClose, onConfirm }) => {
    const [processing, setProcessing] = useState(false);

    if (!isOpen || !app) return null;

    const handlePay = () => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            onConfirm();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[110] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-in border border-slate-100 dark:border-slate-700">
                <div className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto rounded-2xl ${app.color.replace('text', 'bg').replace('500', '100').replace('600', '100')} flex items-center justify-center mb-4`}>
                        <app.icon className={`w-8 h-8 ${app.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Kích hoạt {app.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{app.desc}</p>

                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl mb-6 border border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-slate-500">Gói dịch vụ</span>
                            <span className="text-sm font-bold text-slate-800 dark:text-white">Enterprise Standard</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Tổng thanh toán</span>
                            <span className="text-lg font-bold text-blue-600">{app.price}</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={onClose} disabled={processing} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition">Hủy bỏ</button>
                        <button onClick={handlePay} disabled={processing} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2">
                            {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="flex items-center gap-2"><CreditCard className="w-4 h-4" /> Thanh toán</span>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
