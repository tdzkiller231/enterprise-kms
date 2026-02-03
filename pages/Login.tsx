import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, Droplet } from 'lucide-react';

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
    <div className="min-h-screen flex">
      {/* Left Panel - Knowledge Energy Visualization (70%) */}
      <div className="hidden lg:flex lg:w-[70%] bg-slate-950 relative overflow-hidden">
        {/* Deep Dark Background with subtle texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(30,58,138,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(15,23,42,0.3),transparent_50%)]"></div>
        
        {/* Animated Pipeline Network - representing data flow */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          {/* Horizontal pipes */}
          <line x1="0" y1="20%" x2="100%" y2="20%" stroke="rgba(59,130,246,0.4)" strokeWidth="2" strokeDasharray="10,5" />
          <line x1="0" y1="40%" x2="100%" y2="45%" stroke="rgba(59,130,246,0.3)" strokeWidth="3" />
          <line x1="0" y1="60%" x2="100%" y2="58%" stroke="rgba(148,163,184,0.3)" strokeWidth="2" />
          <line x1="0" y1="80%" x2="100%" y2="82%" stroke="rgba(59,130,246,0.2)" strokeWidth="2" strokeDasharray="15,10" />
          
          {/* Vertical pipes */}
          <line x1="20%" y1="0" x2="18%" y2="100%" stroke="rgba(148,163,184,0.25)" strokeWidth="2" />
          <line x1="50%" y1="0" x2="52%" y2="100%" stroke="rgba(59,130,246,0.3)" strokeWidth="3" strokeDasharray="8,8" />
          <line x1="75%" y1="0" x2="73%" y2="100%" stroke="rgba(148,163,184,0.2)" strokeWidth="2" />
          
          {/* Connection nodes - knowledge points */}
          <circle cx="20%" cy="20%" r="6" fill="rgba(59,130,246,0.6)" />
          <circle cx="50%" cy="40%" r="8" fill="rgba(59,130,246,0.8)" />
          <circle cx="75%" cy="60%" r="5" fill="rgba(148,163,184,0.6)" />
          <circle cx="30%" cy="75%" r="7" fill="rgba(59,130,246,0.7)" />
          <circle cx="65%" cy="85%" r="6" fill="rgba(148,163,184,0.5)" />
        </svg>

        {/* Glowing energy nodes */}
        <div className="absolute top-[20%] left-[20%] w-16 h-16 bg-blue-500 rounded-full filter blur-2xl opacity-40 animate-pulse"></div>
        <div className="absolute top-[40%] left-[50%] w-24 h-24 bg-blue-400 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[60%] left-[75%] w-20 h-20 bg-slate-400 rounded-full filter blur-2xl opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[75%] left-[30%] w-28 h-28 bg-blue-500 rounded-full filter blur-3xl opacity-35 animate-pulse" style={{ animationDelay: '0.5s' }}></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-20 text-white">
          {/* HiStaff Logo - Full Brand */}
          <div className="mb-12">
            <div className="inline-block">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-6xl font-bold text-slate-200" style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '-0.02em' }}>
                  Hi
                </span>
                <span className="text-6xl font-bold text-slate-300" style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '-0.02em' }}>
                  Staff
                </span>
                <svg className="w-12 h-12 -mt-2" viewBox="0 0 40 40" fill="none">
                  <path d="M 10 20 L 18 30 L 30 10" stroke="#FF6B35" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-sm font-semibold tracking-[0.3em] text-slate-400 uppercase">
                Professional HRM Solution
              </div>
            </div>
          </div>

          {/* Main Message - Large, Bold, Strategic */}
          <div className="space-y-8 max-w-2xl">
            <h1 className="text-6xl font-bold leading-tight tracking-tight">
              TRI THỨC –<br />
              NĂNG LƯỢNG VẬN HÀNH<br />
              DOANH NGHIỆP
            </h1>
            
            <div className="w-24 h-1.5 bg-blue-500"></div>
            
            <p className="text-xl text-slate-300 leading-relaxed font-light">
              Kết nối – kế thừa – khai thác tri thức nội bộ BSR
            </p>
          </div>

          {/* Minimal data flow indicators */}
          <div className="mt-24 flex items-center gap-4 opacity-40">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-16 h-px bg-blue-500"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-24 h-px bg-blue-400"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="w-12 h-px bg-slate-400"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Floating Login Card (30%) */}
      <div className="flex-1 lg:w-[30%] flex items-center justify-center bg-slate-900 px-4 sm:px-6 lg:px-8 relative">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]"></div>
        
        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-block mb-4">
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="text-3xl font-bold text-white" style={{ fontFamily: 'Arial, sans-serif' }}>
                  Hi
                </span>
                <span className="text-3xl font-bold text-slate-200" style={{ fontFamily: 'Arial, sans-serif' }}>
                  Staff
                </span>
                <svg className="w-6 h-6 -mt-1" viewBox="0 0 40 40" fill="none">
                  <path d="M 10 20 L 18 30 L 30 10" stroke="#FF6B35" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Professional HRM Solution
              </div>
            </div>
            <h2 className="text-lg font-semibold text-white mt-4">
              Hệ thống Quản trị Tri thức
            </h2>
          </div>

          {/* Floating Login Card - Clean & Minimal */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 sm:p-10 border border-slate-200">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Đăng nhập
              </h2>
              <p className="text-sm text-slate-600">
                Truy cập hệ thống quản trị tri thức
              </p>
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
  );
}
