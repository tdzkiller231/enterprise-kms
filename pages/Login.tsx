import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string, password: string) => void;
  error?: string;
}

export function Login({ onLogin, error }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate async login
    setTimeout(() => {
      onLogin(username, password);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-sky-200 via-blue-100 to-cyan-100">
      {/* Background Image - Refinery */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2070')`,
          backgroundPosition: 'center bottom'
        }}
      ></div>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-sky-100/70 via-transparent to-white/50"></div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="w-full px-4 sm:px-6 lg:px-16 xl:px-24 py-12">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-16">
            
            {/* Left Side - Branding & Message */}
            <div className="flex-1 text-left max-w-3xl">
              {/* BSR Logo */}
              <div className="mb-8">
                <svg className="h-24 w-auto" viewBox="0 0 200 100" fill="none">
                  {/* Green flame icon */}
                  <g transform="translate(70, 10)">
                    <path d="M 20 45 Q 15 35 20 25 Q 25 15 25 5 Q 25 15 30 20 Q 35 25 30 35 Q 28 40 25 45 Q 23 50 20 45 Z" fill="#4ADE80"/>
                    <path d="M 30 50 Q 25 40 30 30 Q 33 25 35 20 Q 37 25 40 30 Q 43 35 40 42 Q 38 48 35 52 Q 32 55 30 50 Z" fill="#4ADE80"/>
                  </g>
                  {/* PETROVIETNAM text */}
                  <text x="10" y="70" fill="#1e40af" fontSize="16" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="1">PETROVIETNAM</text>
                  {/* BSR text */}
                  <text x="85" y="90" fill="#22c55e" fontSize="20" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="2">BSR</text>
                </svg>
              </div>

              {/* Robot illustration placeholder */}
              <div className="mb-8 opacity-40">
                <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="30" r="15" fill="#64748b" opacity="0.8"/>
                  <rect x="35" y="45" width="30" height="35" rx="3" fill="#64748b" opacity="0.8"/>
                  <rect x="30" y="50" width="8" height="20" rx="2" fill="#64748b" opacity="0.8"/>
                  <rect x="62" y="50" width="8" height="20" rx="2" fill="#64748b" opacity="0.8"/>
                  <circle cx="45" cy="28" r="3" fill="#e0f2fe"/>
                  <circle cx="55" cy="28" r="3" fill="#e0f2fe"/>
                </svg>
              </div>

              {/* Main Message */}
              <div className="space-y-6">
                <h1 className="text-5xl font-bold leading-tight tracking-tight text-blue-700">
                  TRI THỨC<br />
                  NĂNG LƯỢNG VẬN HÀNH<br />
                  DOANH NGHIỆP
                </h1>
              </div>
            </div>

            {/* Right Side - Floating Login Card */}
            <div className="w-full max-w-md">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 sm:p-10 border border-slate-200">
                {/* HiStaff Logo */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-4xl font-bold text-slate-800" style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '-0.02em' }}>
                      Hi
                    </span>
                    <span className="text-4xl font-bold text-slate-900" style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '-0.02em' }}>
                      Staff
                    </span>
                    <svg className="w-8 h-8 -mt-1" viewBox="0 0 40 40" fill="none">
                      <path d="M 10 20 L 18 30 L 30 10" stroke="#FF6B35" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Username Field */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                      Tên đăng nhập
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                        placeholder="Nhập tên đăng nhập"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                        placeholder="Nhập mật khẩu"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-slate-900 focus:ring-slate-500 border-slate-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                        Ghi nhớ đăng nhập
                      </label>
                    </div>

                    <button
                      type="button"
                      className="text-sm font-medium text-slate-700 hover:text-slate-900"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý...
                      </span>
                    ) : (
                      'Đăng nhập'
                    )}
                  </button>
                </form>

                {/* Support Info */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <p className="text-xs text-center text-slate-500">
                    Cần hỗ trợ? Liên hệ{' '}
                    <a href="#" className="font-medium text-slate-700 hover:text-slate-900">
                      Bộ phận CNTT
                    </a>
                  </p>
                </div>
              </div>

              {/* Footer */}
              <p className="mt-8 text-center text-xs text-slate-400">
                © 2026 BSR HiStaff KMS
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
