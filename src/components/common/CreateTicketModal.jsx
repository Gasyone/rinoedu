// src/components/common/CreateTicketModal.jsx

const { useState: useTicketState } = React;
const { X, AlertCircle, CheckCircle, Loader } = window.Icons || {};

window.Components = window.Components || {};

window.Components.CreateTicketModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useTicketState({
        title: '',
        role: 'End User',
        type: 'Bug',
        description: ''
    });
    const [status, setStatus] = useTicketState('idle'); // idle | loading | success | error
    const [errorMessage, setErrorMessage] = useTicketState('');

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.description.trim()) {
            setStatus('error');
            setErrorMessage('Vui lòng nhập đầy đủ tiêu đề và nội dung mô tả.');
            return;
        }

        setStatus('loading');
        try {
            // Mock API delay
            await new Promise(resolve => setTimeout(resolve, 800));

            const newTicket = {
                id: "TICK-" + Math.floor(Math.random() * 9000 + 1000),
                title: formData.title,
                description: formData.description,
                type: formData.type,
                status: "Open",
                source: "Manual",
                senderRole: formData.role,
                createdAt: new Date().toISOString()
            };

            const response = await fetch('http://localhost:3001/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTicket)
            });

            if (!response.ok) throw new Error("Không thể kết nối đến server. Ticket DB chưa khởi tạo?");

            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setFormData({ title: '', role: 'End User', type: 'Bug', description: '' });
            }, 2000);

        } catch (error) {
            setStatus('error');
            setErrorMessage(error.message || 'Có lỗi xảy ra khi tạo Ticket.');
        }
    };

    return (
        <div className="fixed inset-0 z-[999] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-slide-up border border-slate-200 dark:border-slate-700">

                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        Tạo Phiếu Yêu Cầu (Ticket)
                    </h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {status === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center animate-fadeIn">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 text-green-600 dark:text-green-500">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Gửi Ticket Thành Công!</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Cảm ơn bạn. Yêu cầu của bạn đã được ghi nhận và sẽ được xử lý sớm nhất.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {status === 'error' && (
                                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl border border-red-100 dark:border-red-900/30 text-sm flex items-start gap-2 animate-fadeIn">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Tiêu đề *</label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Tóm tắt ngắn gọn vấn đề..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Vai trò gửi</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    >
                                        <option value="End User">Người dùng cuối</option>
                                        <option value="Dev Team">Đội phát triển (Dev)</option>
                                        <option value="Admin">Quản trị viên hệ thống</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Loại Ticket</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    >
                                        <option value="Bug">Lỗi phần mềm (Bug)</option>
                                        <option value="Feature">Tính năng mới (Feature)</option>
                                        <option value="Question">Yêu cầu hỗ trợ (Support)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Mô tả chi tiết *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Mô tả cụ thể bạn muốn thêm/sửa gì? Vấn đề xảy ra ở đâu?"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                                ></textarea>
                            </div>

                            <div className="pt-2 flex justify-end gap-3">
                                <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                >
                                    {status === 'loading' ? (
                                        <><Loader className="w-4 h-4 animate-spin" /> Đang gửi...</>
                                    ) : (
                                        'Tạo Ticket'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
