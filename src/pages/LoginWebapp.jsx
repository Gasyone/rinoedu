// js/components/LoginWebapp.jsx
const { useState, useRef, useEffect } = React;

window.Components.LoginWebapp = ({ onLoginSuccess }) => {
    const [currentStep, setCurrentStep] = useState('email'); // email, password, otp, setup, success
    const [activeTab, setActiveTab] = useState('email'); // email, qr
    const [email, setEmail] = useState('');
    const [isResetFlow, setIsResetFlow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(59);

    const [emailError, setEmailError] = useState('');
    const [passInput, setPassInput] = useState('');
    const [passError, setPassError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState('');
    const otpRefs = useRef([]);

    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [setupError, setSetupError] = useState('');
    const [tcChecked, setTcChecked] = useState(false);
    const [tcError, setTcError] = useState('');

    useEffect(() => {
        let timer;
        if (currentStep === 'otp' && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [currentStep, countdown]);

    const showLoading = (callback) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            if (callback) callback();
        }, 800);
    };

    const handleCheckEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) { setEmailError('⚠ Vui lòng nhập email.'); return; }
        if (!emailRegex.test(email.trim())) { setEmailError('⚠ Email không đúng định dạng (VD: abc@gasy.vn)'); return; }

        setEmailError('');
        setIsResetFlow(false);
        showLoading(() => {
            setCurrentStep('password');
        });
    };

    const handleLoginPassword = async () => {
        if (!passInput) { setPassError('⚠ Vui lòng nhập mật khẩu.'); return; }
        if (passInput.length < 3) { setPassError('⚠ Mật khẩu quá ngắn.'); return; }
        setPassError('');

        setIsLoading(true);
        try {
            // Step 1: Login via Keycloak endpoint
            const authRes = await fetch('https://auth-dev.gasy.one/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    password: passInput,
                    key: "cd1AOxF80tyFz50qIEfw"
                })
            });

            if (!authRes.ok) {
                const errorData = await authRes.json().catch(() => ({}));
                throw new Error(errorData.message || 'Sai thông tin đăng nhập.');
            }

            const authData = await authRes.json();
            const rawToken = authData.data?.accessToken || authData.access_token || authData.token;

            if (!rawToken) throw new Error('Không nhận được token từ hệ thống đăng nhập.');

            // Step 2: Fetch final platform token
            const platformRes = await fetch('https://psvn-api-dev.gasy.one/api/v1/users/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: rawToken })
            });

            if (!platformRes.ok) throw new Error('Lỗi xác thực nền tảng psvn-api.');

            const platformData = await platformRes.json();
            const finalToken = platformData.data?.token || platformData.token || rawToken;

            // Step 3: Save and proceed
            localStorage.setItem('rino_auth_token', finalToken);
            setCurrentStep('success');

            const userProfile = platformData.data?.user || authData.data?.user || {
                name: authData.data?.name || platformData.data?.name || email.split('@')[0],
                email: email
            };

            setTimeout(() => {
                setIsLoading(false);
                onLoginSuccess(userProfile);
            }, 1000);

        } catch (error) {
            setIsLoading(false);
            setPassError(`⚠ ${error.message}`);
        }
    };

    const handleForgotPass = () => {
        setIsResetFlow(true);
        setCurrentStep('otp');
    };

    const handleOtpChange = (index, value) => {
        const newOtp = [...otp];
        newOtp[index] = value.replace(/[^0-9]/g, '');
        setOtp(newOtp);
        if (value && index < 5) {
            otpRefs.current[index + 1].focus();
        }
    };

    const handleValidateOTP = () => {
        if (otp.join('').length < 6) { setOtpError('⚠ Vui lòng nhập đủ 6 số OTP.'); return; }
        setOtpError('');
        showLoading(() => { setCurrentStep('setup'); });
    };

    const handleFinalizeSetup = () => {
        let valid = true;
        if (!isResetFlow && !tcChecked) {
            setTcError('⚠ Bạn phải đồng ý với điều khoản để tiếp tục.');
            valid = false;
        } else { setTcError(''); }

        if (newPass.length < 8 || !/[A-Z]/.test(newPass) || !/[0-9]/.test(newPass) || !/[!@#$%^&*(),.?":{}|<>]/.test(newPass)) {
            setSetupError('⚠ Mật khẩu không hợp lệ (cần 8+ ký tự, Hoa, Số, Đặc biệt).');
            valid = false;
        } else if (newPass !== confirmPass) {
            setSetupError('⚠ Mật khẩu nhập lại không khớp.');
            valid = false;
        } else {
            setSetupError('');
        }

        if (valid) {
            showLoading(() => { setCurrentStep('success'); setTimeout(onLoginSuccess, 1500); });
        }
    };

    const renderButtonContent = (text) => (
        isLoading ? <><span className="spinner border-t-black border-2 border-transparent w-4 h-4 rounded-full animate-spin mr-2 inline-block"></span> Đang xử lý...</> : text
    );

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-900 font-sans overflow-y-auto relative">
            <div className="bg-white dark:bg-slate-800 w-full max-w-5xl min-h-[600px] h-auto max-h-[95vh] flex rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden relative">

                {/* Utility Bar */}
                <div className="absolute top-4 right-4 flex gap-4 z-10 text-sm font-bold text-slate-500 dark:text-slate-400">
                    <button className="hover:text-slate-800 dark:hover:text-slate-200">Trợ giúp</button>
                    <button className="hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1">
                        <span>🇻🇳</span> VI ▼
                    </button>
                </div>

                {/* Left Column (Branding) */}
                <div className="hidden md:flex w-5/12 bg-slate-50 dark:bg-slate-900/50 p-10 flex-col justify-between border-r border-slate-200 dark:border-slate-700">
                    <div>
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-8 shadow-sm">
                            <window.Icons.Zap className="text-white w-7 h-7" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-4 leading-tight">Nền tảng quản lý<br />giáo dục thông minh</h1>
                        <ul className="space-y-3 text-slate-600 dark:text-slate-400 font-medium">
                            <li className="flex items-center gap-2"><window.Icons.Check className="w-4 h-4 text-green-500" /> Trợ lý AI học thuật & vận hành</li>
                            <li className="flex items-center gap-2"><window.Icons.Check className="w-4 h-4 text-green-500" /> Quản lý học viên toàn diện</li>
                            <li className="flex items-center gap-2"><window.Icons.Check className="w-4 h-4 text-green-500" /> Phân tích dữ liệu đa chiều</li>
                        </ul>
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-4">© 2024 RinoEdu AI. v1.0.2</div>
                </div>

                {/* Right Column (Dynamic Content) */}
                <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col relative justify-center overflow-y-auto no-scrollbar">

                    {/* Tabs */}
                    {['email', 'qr'].includes(currentStep) && (
                        <div className="flex mb-8 border-b border-slate-200 dark:border-slate-700 absolute top-12 left-12 right-12 z-0">
                            <button onClick={() => { setActiveTab('email'); setCurrentStep('email'); }} className={`w-1/2 pb-3 font-bold transition-colors ${activeTab === 'email' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>Tài khoản</button>
                            <button onClick={() => { setActiveTab('qr'); setCurrentStep('qr'); }} className={`w-1/2 pb-3 font-bold transition-colors ${activeTab === 'qr' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>Quét mã QR</button>
                        </div>
                    )}

                    <div className="h-16 shrink-0"></div>

                    {/* Step 1: Email */}
                    {currentStep === 'email' && activeTab === 'email' && (
                        <div className="animate-fade-in">
                            <div className="space-y-3 mb-8">
                                <button onClick={() => { setIsResetFlow(false); showLoading(() => setCurrentStep('setup')); }} className="w-full py-3 rounded-lg border border-slate-200 dark:border-slate-700 font-bold flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition dark:text-white">
                                    <span className="font-bold text-blue-500">G</span> Tiếp tục với Google
                                </button>
                                <button className="w-full py-3 rounded-lg border border-slate-200 dark:border-slate-700 font-bold flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition dark:text-white">
                                    <span className="font-bold text-blue-600">O</span> Tiếp tục với Outlook
                                </button>
                            </div>

                            <div className="relative flex items-center mb-6">
                                <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                                <span className="mx-4 text-slate-400 text-xs font-bold uppercase">Hoặc email</span>
                                <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block font-bold text-sm mb-2 dark:text-slate-200">Email hệ thống</label>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="user@rinoedu.com" className={`w-full p-3.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 transition ${emailError ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white'}`} disabled={isLoading} />
                                    {emailError && <p className="text-red-500 text-xs mt-1 font-bold">{emailError}</p>}
                                </div>
                                <button onClick={handleCheckEmail} disabled={isLoading} className="w-full py-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition disabled:opacity-75">
                                    {renderButtonContent('Tiếp tục')}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2A: Password */}
                    {currentStep === 'password' && (
                        <div className="animate-fade-in">
                            <button onClick={() => setCurrentStep('email')} disabled={isLoading} className="text-sm font-bold text-slate-500 mb-6 hover:underline">← Quay lại</button>

                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-lg mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-700 text-blue-700 dark:text-blue-200 flex items-center justify-center font-bold text-xs">AV</div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate dark:text-slate-200">{email}</p>
                                    <p className="text-xs text-blue-600 dark:text-blue-400">Chào mừng trở lại!</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block font-bold text-sm mb-2 dark:text-slate-200">Mật khẩu</label>
                                    <div className="relative flex items-center">
                                        <input type={showPassword ? "text" : "password"} value={passInput} onChange={e => setPassInput(e.target.value)} className={`w-full p-3.5 pr-12 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 transition ${passError ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white'}`} placeholder="••••••••" disabled={isLoading} />
                                        <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none" title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>
                                            {showPassword ? <window.Icons.EyeOff className="w-5 h-5" /> : <window.Icons.Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {passError && <p className="text-red-500 text-xs mt-1 font-bold">{passError}</p>}
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer dark:text-slate-300">
                                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /> Ghi nhớ
                                    </label>
                                    <button onClick={handleForgotPass} className="font-bold text-blue-600 hover:text-blue-700">Quên mật khẩu?</button>
                                </div>

                                <button onClick={handleLoginPassword} disabled={isLoading} className="w-full py-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition disabled:opacity-75">
                                    {renderButtonContent('Đăng nhập')}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2B: OTP */}
                    {currentStep === 'otp' && (
                        <div className="animate-fade-in">
                            <button onClick={() => setCurrentStep('email')} disabled={isLoading} className="text-sm font-bold text-slate-500 mb-6 hover:underline">← Quay lại</button>

                            <h2 className="text-2xl font-bold mb-2 dark:text-white">Xác thực OTP</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-8">Mã 6 số đã gửi đến <b className="text-slate-800 dark:text-slate-200">{email}</b></p>

                            <div className="flex gap-2 mb-4 justify-between">
                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx} type="text" maxLength="1" value={digit}
                                        ref={el => otpRefs.current[idx] = el}
                                        onChange={e => handleOtpChange(idx, e.target.value)}
                                        className="w-12 h-14 text-center text-xl font-bold rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        disabled={isLoading}
                                    />
                                ))}
                            </div>
                            {otpError && <p className="text-red-500 text-xs text-center mb-4 font-bold">{otpError}</p>}

                            <button onClick={handleValidateOTP} disabled={isLoading} className="w-full py-3.5 mt-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition disabled:opacity-75">
                                {renderButtonContent('Xác nhận')}
                            </button>
                            <p
                                className={`mt-6 text-center text-sm font-bold transition ${countdown === 0 ? 'text-blue-600 hover:text-blue-700 cursor-pointer' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 cursor-not-allowed'}`}
                                onClick={() => { if (countdown === 0) { setCountdown(59); showLoading(); } }}
                            >
                                {countdown > 0 ? `Gửi lại mã (${countdown}s)` : 'Gửi lại mã'}
                            </p>
                        </div>
                    )}

                    {/* Step 3: Setup Password / T&C */}
                    {currentStep === 'setup' && (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold mb-2 dark:text-white">{isResetFlow ? 'Đặt lại mật khẩu' : 'Thiết lập tài khoản'}</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">{isResetFlow ? 'Nhập mật khẩu mới để khôi phục quyền truy cập.' : 'Tạo mật khẩu để bảo vệ tài khoản RinoEdu của bạn.'}</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block font-bold text-sm mb-1 dark:text-slate-200">Mật khẩu mới</label>
                                    <div className="relative flex items-center">
                                        <input type={showNewPassword ? "text" : "password"} value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full p-3.5 pr-12 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" disabled={isLoading} />
                                        <button onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none" title={showNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>
                                            {showNewPassword ? <window.Icons.EyeOff className="w-5 h-5" /> : <window.Icons.Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">Yêu cầu: 8+ ký tự, Chữ hoa, Số, Ký tự đặc biệt (!@#...)</p>
                                </div>
                                <div>
                                    <label className="block font-bold text-sm mb-1 dark:text-slate-200">Nhập lại mật khẩu</label>
                                    <div className="relative flex items-center">
                                        <input type={showConfirmPassword ? "text" : "password"} value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className={`w-full p-3.5 pr-12 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 ${setupError ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white'}`} disabled={isLoading} />
                                        <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none" title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>
                                            {showConfirmPassword ? <window.Icons.EyeOff className="w-5 h-5" /> : <window.Icons.Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {setupError && <p className="text-red-500 text-xs mt-1 font-bold">{setupError}</p>}
                                </div>

                                {!isResetFlow && (
                                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm mt-4">
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input type="checkbox" checked={tcChecked} onChange={e => setTcChecked(e.target.checked)} className="mt-1 flex-shrink-0" disabled={isLoading} />
                                            <span className="dark:text-slate-300">Tôi đồng ý với <a href="#" className="font-bold text-blue-600">Điều khoản sử dụng</a> và <a href="#" className="font-bold text-blue-600">Chính sách bảo mật</a> của RinoEdu.</span>
                                        </label>
                                        {tcError && <p className="text-red-500 text-xs mt-2 font-bold">{tcError}</p>}
                                    </div>
                                )}

                                <button onClick={handleFinalizeSetup} disabled={isLoading} className="w-full py-3.5 mt-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition disabled:opacity-75">
                                    {renderButtonContent(isResetFlow ? 'Đổi mật khẩu & Đăng nhập' : 'Hoàn tất & Vào App')}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step QR */}
                    {currentStep === 'qr' && activeTab === 'qr' && (
                        <div className="text-center animate-fade-in pt-4">
                            <div className="w-48 h-48 mx-auto mb-6 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm relative">
                                <window.Icons.QrCode className="w-40 h-40 text-slate-800" />
                                <div className="absolute inset-x-0 bottom-0 py-1 bg-white border-t border-slate-100 text-[10px] font-bold tracking-widest rounded-b-2xl">RINO APP</div>
                            </div>
                            <h2 className="font-bold text-xl mb-2 dark:text-white">Quét mã để đăng nhập</h2>
                            <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 inline-block text-left mb-6">
                                1. Mở app <b>RinoEdu Mobile</b> trên điện thoại<br />
                                2. Chọn icon <b>[Scan]</b> ở góc màn hình<br />
                                3. Hướng camera vào mã QR này
                            </div>
                        </div>
                    )}

                    {/* Step Success */}
                    {currentStep === 'success' && (
                        <div className="text-center animate-scaleIn pt-10">
                            <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-green-500/30 text-white">
                                <window.Icons.Check className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-extrabold mb-2 dark:text-white">Đăng nhập thành công</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-8">Đang đồng bộ dữ liệu vào hệ thống...</p>
                            <div className="w-full max-w-xs mx-auto bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-blue-600 h-full w-1/3 animate-pulse rounded-full"></div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
