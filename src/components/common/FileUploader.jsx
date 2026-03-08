const { useState, useEffect } = React;

window.Components = window.Components || {};

/**
 * FileUploader Component
 * Core Foundation: Dùng chung cho mọi Module (HR up CV, CRM up Hợp đồng, Education up Bảng điểm)
 */
window.Components.FileUploader = ({ onUploadSuccess, accept = "*/*", maxSizeMB = 5 }) => {
    const { FileUp, X, CheckCircle, AlertCircle } = window.Icons || {};
    const runtimeConfig = window.RinoRuntimeConfig || {};
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState('idle'); // idle | uploading | success | error
    const [errorMsg, setErrorMsg] = useState('');

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        validateAndSetFile(droppedFile);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        validateAndSetFile(selectedFile);
    };

    const validateAndSetFile = (f) => {
        if (!f) return;
        if (f.size > maxSizeMB * 1024 * 1024) {
            setErrorMsg(`File quá lớn! Tối đa là ${maxSizeMB}MB.`);
            setStatus('error');
            return;
        }
        setFile(f);
        setStatus('idle');
        setErrorMsg('');
    };

    const handleUpload = () => {
        if (!file) return;
        setStatus('uploading');

        // MOCK API: Giả lập thời gian upload lên Server (Cloudflare R2 / S3)
        setTimeout(() => {
            setStatus('success');
            const uploadBase = runtimeConfig.UPLOAD_BASE || 'https://cdn.apirinoai.gasy.io/uploads';
            const mockUrl = `${uploadBase}/${Date.now()}_${file.name}`;
            if (onUploadSuccess) onUploadSuccess(mockUrl);

            // Xóa file sau 2s để có thể up thẻ mới
            setTimeout(() => {
                setFile(null);
                setStatus('idle');
            }, 2000);
        }, 1500);
    };

    return (
        <div className="w-full">
            <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors 
                ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'}
                ${file ? 'hidden' : 'block'}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                {FileUp ? <FileUp className="w-8 h-8 mx-auto text-slate-400 mb-2" /> : <div className="text-xl mb-2">📁</div>}
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Kéo thả file vào đây hoặc</p>
                <label className="text-sm text-blue-600 dark:text-blue-400 font-bold cursor-pointer hover:underline mt-1 inline-block">
                    Chọn File từ máy
                    <input type="file" className="hidden" accept={accept} onChange={handleFileChange} />
                </label>
                <p className="text-xs text-slate-400 mt-2">Kích thước tối đa: {maxSizeMB}MB</p>
            </div>

            {/* PREVIEW & STATUS */}
            {file && (
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                            {FileUp ? <FileUp className="w-5 h-5 text-blue-500" /> : '📄'}
                        </div>
                        <div className="truncate">
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{file.name}</p>
                            <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>

                    {status === 'idle' && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => setFile(null)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"><X className="w-4 h-4" /></button>
                            <button onClick={handleUpload} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors">Tải lên</button>
                        </div>
                    )}
                    {status === 'uploading' && (
                        <div className="text-xs font-bold text-blue-500 animate-pulse px-2">Đang tải...</div>
                    )}
                    {status === 'success' && (
                        <div className="text-emerald-500 px-2"><CheckCircle className="w-5 h-5" /></div>
                    )}
                </div>
            )}

            {status === 'error' && (
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errorMsg}</p>
            )}
        </div>
    );
};
