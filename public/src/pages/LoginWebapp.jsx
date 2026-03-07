// js/components/LoginWebapp.jsx
const { useState, useRef, useEffect } = React;

window.Components.LoginWebapp = ({ onLoginSuccess }) => {
    const [currentStep, setCurrentStep] = useState('email'); // email, password, otp, setup, success, qr
    const [activeTab, setActiveTab] = useState('email'); // email, qr
    const [email, setEmail] = useState('');
    const [isResetFlow, setIsResetFlow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [countdown, setCountdown] = useState(59);
    const [rememberMe, setRememberMe] = useState(true);
    const [isRegisterFlow, setIsRegisterFlow] = useState(false);
    const [resetToken, setResetToken] = useState('');

    const [emailError, setEmailError] = useState('');
    const [passInput, setPassInput] = useState('');
    const [passError, setPassError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // OTP
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState('');
    const otpRefs = useRef([]);

    // Setup (Register / Reset Pass)
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

    const handleGoogleLogin = async () => {
        setEmailError('');
        setIsGoogleLoading(true);
        try {
            // Sử dụng Fake Google SDK thay vì Popup bị chặn CORS
            const res = await window.API.MockAuth.loginGoogleMock();

            // Xử lý thành công
            saveSession(res.token, res.user);
            setCurrentStep('success');
            setTimeout(() => onLoginSuccess(res.user), 1500);

        } catch (e) {
            setEmailError(`⚠ Lỗi máy chủ Google: ${e.message}`);
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const handleCheckEmail = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) { setEmailError('⚠ Vui lòng nhập email.'); return; }
        if (!emailRegex.test(email.trim())) { setEmailError('⚠ Email không đúng định dạng (VD: abc@gasy.vn)'); return; }

        setEmailError('');
        setIsResetFlow(false);
        setIsRegisterFlow(false);
        setIsLoading(true);

        try {
            // Intelligent Flow: Check User Exist
            const res = await window.API.MockAuth.checkEmail(email.trim());

            if (res.isExist) {
                // Flow Đăng nhập
                setCurrentStep('password');
            } else {
                // Flow Đăng ký (Setup Password)
                setIsRegisterFlow(true);
                setCurrentStep('setup');
            }
        } catch (err) {
            setEmailError('⚠ Không thể kết nối đến máy chủ xác thực.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginPassword = async () => {
        if (!passInput) { setPassError('⚠ Vui lòng nhập mật khẩu.'); return; }
        setPassError('');
        setIsLoading(true);

        try {
            const res = await window.API.MockAuth.login(email.trim(), passInput);

            // PBAC Data Extraction
            saveSession(res.token, res.user);

            setCurrentStep('success');
            setTimeout(() => {
                setIsLoading(false);
                onLoginSuccess(res.user);
            }, 1500);

        } catch (error) {
            setIsLoading(false);
            setPassError(`⚠ ${error.message}`);
        }
    };

    const saveSession = (token, userProfile) => {
        if (rememberMe) {
            const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
            localStorage.setItem('rino_auth_session', JSON.stringify({ token, expiry }));
        } else {
            localStorage.setItem('rino_auth_token', token);
        }
        localStorage.setItem('rino_user_profile', JSON.stringify(userProfile)); // PBAC attached

        // In reality, redux dispatch or API.setAuthHeader should be called here
    };

    const handleForgotPass = async () => {
        setIsResetFlow(true);
        setIsLoading(true);
        try {
            await window.API.MockAuth.sendOTP(email);
            setCurrentStep('otp');
            setCountdown(59);
        } catch (e) {
            setPassError(`⚠ ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        const newOtp = [...otp];
        newOtp[index] = value.replace(/[^0-9]/g, '');
        setOtp(newOtp);

        // Auto focus next
        if (value && index < 5) {
            otpRefs.current[index + 1].focus();
        }

        // Auto submit if full
        if (value && index === 5 && newOtp.join('').length === 6) {
            handleValidateOTP(newOtp.join(''));
        }
    };

    const handleValidateOTP = async (otpCodeString) => {
        const enteredOtp = otpCodeString || otp.join('');
        if (enteredOtp.length < 6) { setOtpError('⚠ Vui lòng nhập đủ 6 số OTP.'); return; }
        setOtpError('');
        setIsLoading(true);

        try {
            const res = await window.API.MockAuth.verifyOTP(email, enteredOtp);
            setResetToken(res.resetToken);
            setCurrentStep('setup');
        } catch (e) {
            setOtpError(`⚠ ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinalizeSetup = async () => {
        let valid = true;
        if (isRegisterFlow && !tcChecked) {
            setTcError('⚠ Bạn phải đồng ý với điều khoản để tiếp tục.');
            valid = false;
        } else { setTcError(''); }

        if (newPass.length < 8) {
            setSetupError('⚠ Mật khẩu quá ngắn (Ít nhất 8 ký tự).');
            valid = false;
        } else if (newPass !== confirmPass) {
            setSetupError('⚠ Mật khẩu nhập lại không khớp.');
            valid = false;
        } else {
            setSetupError('');
        }

        if (!valid) return;
        setIsLoading(true);

        try {
            if (isResetFlow) {
                // Flow Quên MK
                await window.API.MockAuth.resetPassword(resetToken, newPass);
                setPassInput(newPass);
                setCurrentStep('password');
            } else if (isRegisterFlow) {
                // Flow Đăng ký (Setup Password)
                const res = await window.API.MockAuth.register(email, newPass);
                saveSession(res.token, res.user);

                setCurrentStep('success');
                setTimeout(() => {
                    setIsLoading(false);
                    onLoginSuccess(res.user);
                }, 1500);
            }
        } catch (e) {
            setSetupError(`⚠ ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Component Buttons Mượt
    const renderButtonContent = (text) => (
        isLoading ? <><span className="spinner border-t-white border-2 border-transparent w-4 h-4 rounded-full animate-spin mr-2 inline-block"></span> Đang xử lý...</> : text
    );

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-900 font-sans overflow-y-auto relative transition-colors duration-500">
            <div className="bg-white dark:bg-slate-800 w-full max-w-5xl h-[600px] flex rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden relative">

                {/* Utility Bar */}
                <div className="absolute top-4 right-4 flex gap-4 z-10 text-sm font-bold text-slate-500 dark:text-slate-400">
                    <button className="hover:text-slate-800 dark:hover:text-slate-200 transition">Trợ giúp</button>
                    <button className="hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition">
                        <span>🇻🇳</span> VI ▼
                    </button>
                </div>

                {/* Left Column (Branding) */}
                <div className="hidden md:flex w-5/12 bg-slate-50 dark:bg-slate-900/50 p-10 flex-col justify-between border-r border-slate-200 dark:border-slate-700 relative overflow-hidden">
                    {/* Abstract shapes */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-blue-500/30 ring-4 ring-blue-100 dark:ring-blue-900/30">
                            <window.Icons.Zap className="text-white w-8 h-8" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-6 leading-tight">Nền tảng vận hành<br />RinoEdu Enterprise</h1>
                        <ul className="space-y-4 text-slate-600 dark:text-slate-400 font-medium text-sm">
                            <li className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><window.Icons.Check className="w-4 h-4 text-green-600 dark:text-green-400" /></div> Phân quyền PBAC đa chi nhánh</li>
                            <li className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><window.Icons.Check className="w-4 h-4 text-green-600 dark:text-green-400" /></div> Identity Center Bảo mật & Caching</li>
                            <li className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><window.Icons.Check className="w-4 h-4 text-green-600 dark:text-green-400" /></div> Trợ lý AI học thuật toàn diện</li>
                        </ul>
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-4 relative z-10 font-medium">© {new Date().getFullYear()} RinoEdu Ecosystem. PBAC v1.5</div>
                </div>

                {/* Right Column (Dynamic Content) */}
                <div className="w-full md:w-7/12 p-8 md:p-14 flex flex-col relative justify-center">

                    {/* Tabs */}
                    {['email', 'qr'].includes(currentStep) && (
                        <div className="flex mb-8 border-b border-slate-200 dark:border-slate-700 absolute top-12 left-12 right-12 z-0">
                            <button onClick={() => { setActiveTab('email'); setCurrentStep('email'); }} className={`w-1/2 pb-3 font-bold transition-all ${activeTab === 'email' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>Tài khoản</button>
                            <button onClick={() => { setActiveTab('qr'); setCurrentStep('qr'); }} className={`w-1/2 pb-3 font-bold transition-all ${activeTab === 'qr' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>Quét mã QR</button>
                        </div>
                    )}

                    <div className="h-4 shrink-0 mt-8"></div>

                    {/* Step 1: Email */}
                    {currentStep === 'email' && activeTab === 'email' && (
                        <div className="animate-fade-in transition-all duration-300 transform scale-100">
                            <div className="mb-7">
                                <button onClick={handleGoogleLogin} disabled={isGoogleLoading || isLoading} className="w-full py-3.5 rounded-xl border border-slate-300 dark:border-slate-600 font-bold flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition dark:text-white text-sm shadow-sm active:scale-[0.98]">
                                    {isGoogleLoading ? (
                                        <><span className="spinner border-t-slate-800 dark:border-t-white border-2 border-transparent w-4 h-4 rounded-full animate-spin inline-block"></span> Đang kết nối...</>
                                    ) : (
                                        <>
                                            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" /><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.08 24.08 0 0 0 0 21.56l7.98-6.19z" /><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" /></svg>
                                            Đăng nhập với Google
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="relative flex items-center mb-7">
                                <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                                <span className="mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">Hoặc sử dụng</span>
                                <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block font-bold text-sm mb-2 dark:text-slate-200">Email Truy cập nội bộ / Khách hàng</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleCheckEmail(); }}
                                        placeholder="Tên truy cập của bạn..."
                                        className={`w-full p-4 rounded-xl border outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${emailError ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white hover:border-blue-400'}`}
                                        disabled={isLoading} />
                                    {emailError && <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1"><window.Icons.AlertCircle className="w-3 h-3" /> {emailError}</p>}
                                </div>
                                <button onClick={handleCheckEmail} disabled={isLoading} className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-600/30 active:scale-[0.98] disabled:opacity-75 disabled:active:scale-100 flex items-center justify-center">
                                    {renderButtonContent('Tiếp tục')}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2A: Password */}
                    {currentStep === 'password' && (
                        <div className="animate-fade-in transition-all duration-300 transform scale-100">
                            <button onClick={() => setCurrentStep('email')} disabled={isLoading} className="text-sm font-bold text-slate-500 mb-6 hover:text-slate-800 dark:hover:text-slate-300 flex items-center gap-1 transition-colors"><window.Icons.ArrowLeft className="w-4 h-4" /> Quay lại</button>

                            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-xl mb-7 flex items-center gap-4 shadow-sm">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
                                    {email.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate dark:text-slate-200">{email}</p>
                                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">Đã xác minh tài khoản</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block font-bold text-sm mb-2 dark:text-slate-200">Mật khẩu</label>
                                    <div className="relative flex items-center focus-within:ring-4 focus-within:ring-blue-500/20 rounded-xl transition-all">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={passInput}
                                            onChange={e => setPassInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') handleLoginPassword(); }}
                                            className={`w-full p-4 pr-12 rounded-xl border outline-none ${passError ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white hover:border-blue-400'}`}
                                            placeholder="Nhập mật khẩu của bạn"
                                            disabled={isLoading} />
                                        <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none transition-colors" title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>
                                            {showPassword ? <window.Icons.EyeOff className="w-5 h-5" /> : <window.Icons.Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {passError && <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1"><window.Icons.AlertCircle className="w-3 h-3" /> {passError}</p>}
                                </div>

                                <div className="flex justify-between items-center text-sm px-1">
                                    <label className="flex items-center gap-2 cursor-pointer dark:text-slate-300 group">
                                        <div className="relative flex items-center justify-center">
                                            <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="peer w-4 h-4 opacity-0 absolute cursor-pointer" />
                                            <div className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-500 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors flex items-center justify-center">
                                                <window.Icons.Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                        <span className="group-hover:text-slate-800 dark:group-hover:text-white transition-colors">Ghi nhớ phiên (30 ngày)</span>
                                    </label>
                                    <button onClick={handleForgotPass} className="font-bold text-blue-600 hover:text-blue-700 transition-colors">Quên mật khẩu?</button>
                                </div>

                                <button onClick={handleLoginPassword} disabled={isLoading} className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-600/30 active:scale-[0.98] disabled:opacity-75 disabled:active:scale-100 flex items-center justify-center mt-2">
                                    {renderButtonContent('Đăng nhập (Secure)')}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2B: OTP */}
                    {currentStep === 'otp' && (
                        <div className="animate-fade-in transition-all duration-300">
                            <button onClick={() => setCurrentStep('email')} disabled={isLoading} className="text-sm font-bold text-slate-500 mb-6 hover:text-slate-800 flex items-center gap-1"><window.Icons.ArrowLeft className="w-4 h-4" /> Quay lại</button>

                            <h2 className="text-2xl font-extrabold mb-2 dark:text-white text-slate-800">Xác thực Email</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Mã 6 số đã được gửi tới hộp thư <b className="text-slate-800 dark:text-slate-200">{email}</b></p>

                            <div className="flex gap-3 mb-6 justify-between">
                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx} type="text" maxLength="1" value={digit}
                                        ref={el => otpRefs.current[idx] = el}
                                        onChange={e => handleOtpChange(idx, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Backspace' && !digit && idx > 0) otpRefs.current[idx - 1].focus();
                                        }}
                                        className="w-12 h-16 text-center text-2xl font-bold rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                                        disabled={isLoading}
                                    />
                                ))}
                            </div>
                            {otpError && <p className="text-red-500 text-xs text-center mb-4 font-bold"><window.Icons.AlertCircle className="w-3 h-3 inline mr-1" />{otpError}</p>}

                            <button onClick={() => handleValidateOTP(null)} disabled={isLoading} className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-600/30 active:scale-[0.98] disabled:opacity-75 disabled:active:scale-100 flex items-center justify-center mt-2">
                                {renderButtonContent('Xác nhận OTP')}
                            </button>

                            <div className="mt-6 text-center">
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mr-2">Không nhận được mã?</span>
                                <button
                                    disabled={countdown > 0 || isLoading}
                                    className={`text-sm font-bold transition-colors ${countdown === 0 ? 'text-blue-600 hover:text-blue-700' : 'text-slate-400 cursor-not-allowed'}`}
                                    onClick={() => { if (countdown === 0) { setCountdown(59); handleForgotPass(); } }}
                                >
                                    {countdown > 0 ? `Chờ ${countdown}s` : 'Gửi lại mã'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Setup Password / T&C (Register & Reset flow) */}
                    {currentStep === 'setup' && (
                        <div className="animate-fade-in transition-all duration-300">
                            <h2 className="text-2xl font-extrabold mb-2 dark:text-white text-slate-800">
                                {isResetFlow ? 'Tạo mật khẩu hoàn toàn mới' : 'Thiết lập Tài khoản'}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">
                                {isResetFlow ? 'Nhập mật khẩu đủ mạnh để bảo vệ tài khoản của bạn.' : 'Xin chào Người mới, vui lòng tạo Mật khẩu cho RinoEdu.'}
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block font-bold text-sm mb-1 dark:text-slate-200">Mật khẩu mới</label>
                                    <div className="relative flex items-center focus-within:ring-4 focus-within:ring-blue-500/20 rounded-xl transition-all">
                                        <input type={showNewPassword ? "text" : "password"} value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full p-3.5 pr-12 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white outline-none hover:border-blue-400 transition-colors" disabled={isLoading} />
                                        <button onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none" title={showNewPassword ? 'Ẩn' : 'Hiện'}>
                                            {showNewPassword ? <window.Icons.EyeOff className="w-5 h-5" /> : <window.Icons.Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <div className={`h-1.5 flex-1 rounded-full ${newPass.length > 3 ? 'bg-red-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                                        <div className={`h-1.5 flex-1 rounded-full ${newPass.length > 5 ? 'bg-yellow-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                                        <div className={`h-1.5 flex-1 rounded-full ${(newPass.length >= 8 && /[A-Z]/.test(newPass)) ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-bold text-sm mb-1 dark:text-slate-200">Nhập lại Mật khẩu</label>
                                    <div className="relative flex items-center focus-within:ring-4 focus-within:ring-blue-500/20 rounded-xl transition-all">
                                        <input type={showConfirmPassword ? "text" : "password"} value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className={`w-full p-3.5 pr-12 rounded-xl border outline-none ${setupError ? 'border-red-500 bg-red-50' : 'border-slate-300 hover:border-blue-400 dark:border-slate-600 dark:bg-slate-900 dark:text-white'}`} disabled={isLoading} />
                                        <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none" title={showConfirmPassword ? 'Ẩn' : 'Hiện'}>
                                            {showConfirmPassword ? <window.Icons.EyeOff className="w-5 h-5" /> : <window.Icons.Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {setupError && <p className="text-red-500 text-xs mt-2 font-bold"><window.Icons.AlertCircle className="w-3 h-3 inline mr-1" />{setupError}</p>}
                                </div>

                                {!isResetFlow && (
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm mt-4">
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center mt-0.5">
                                                <input type="checkbox" checked={tcChecked} onChange={e => setTcChecked(e.target.checked)} className="peer w-4 h-4 opacity-0 absolute cursor-pointer" disabled={isLoading} />
                                                <div className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-500 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors flex items-center justify-center bg-white dark:bg-slate-800">
                                                    <window.Icons.Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                                </div>
                                            </div>
                                            <span className="dark:text-slate-300 leading-snug">Tôi đã đọc và đồng ý với <a href="#" className="font-bold text-blue-600 hover:underline">Điều khoản Dịch vụ</a> và <a href="#" className="font-bold text-blue-600 hover:underline">Chính sách Bảo mật</a> PBAC của hệ thống RinoEdu.</span>
                                        </label>
                                        {tcError && <p className="text-red-500 text-xs mt-2 font-bold ml-8">{tcError}</p>}
                                    </div>
                                )}

                                <button onClick={handleFinalizeSetup} disabled={isLoading} className="w-full py-4 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-600/30 active:scale-[0.98] disabled:opacity-75 disabled:active:scale-100 flex items-center justify-center">
                                    {renderButtonContent(isResetFlow ? 'Hoàn tất & Cập nhật' : 'Đồng ý & Đăng ký Nội bộ')}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step QR */}
                    {currentStep === 'qr' && activeTab === 'qr' && (
                        <div className="text-center animate-fade-in pt-4">
                            <div className="w-48 h-48 mx-auto mb-6 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200/50 relative">
                                <window.Icons.QrCode className="w-40 h-40 text-slate-800" />
                                <div className="absolute inset-x-0 bottom-0 py-1.5 bg-blue-50 border-t border-blue-100 text-[10px] text-blue-800 font-bold tracking-widest rounded-b-2xl">SCAN WITH RINO APP</div>
                            </div>
                            <h2 className="font-extrabold text-2xl mb-2 dark:text-white text-slate-800">Quét mã QR để Đăng nhập</h2>
                            <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                Sử dụng App Mobile trên <span className="font-bold text-slate-800 dark:text-slate-200">iOS</span> hoặc <span className="font-bold text-slate-800 dark:text-slate-200">Android</span> để trải nghiệm nhanh.
                            </div>
                        </div>
                    )}

                    {/* Step Success */}
                    {currentStep === 'success' && (
                        <div className="text-center animate-fade-in pt-10 flex flex-col items-center justify-center h-full">
                            <div className="w-24 h-24 bg-gradient-to-tr from-green-400 to-green-500 rounded-full mb-8 flex items-center justify-center shadow-xl shadow-green-500/30 text-white transform hover:scale-105 transition-transform">
                                <window.Icons.Check className="w-12 h-12" />
                            </div>
                            <h2 className="text-3xl font-extrabold mb-3 text-slate-800 dark:text-white">Truy cập hợp lệ</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Hệ thống đang nạp Dữ liệu và Phân quyền PBAC...</p>
                            <div className="w-full max-w-xs mx-auto bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden shadow-inner">
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full w-2/3 animate-pulse rounded-full"></div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
