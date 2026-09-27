import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, X } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const { login, loginWithGoogle, forgotPassword } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setMessage('');
    const result = await loginWithGoogle();
    if (result.error) {
      setError(result.error);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!resetEmail) {
      setError('Please enter your official college email address.');
      return;
    }
    setResetLoading(true);
    const result = await forgotPassword(resetEmail);
    setResetLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setMessage(`Password reset email sent to ${resetEmail}. Please check your inbox.`);
      setShowForgotModal(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gray-900">
      {/* SRM TRP Campus Background Image with dark-blue overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/bg.png')" }}
      >
        <div className="absolute inset-0 bg-blue-950/65"></div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 z-10 px-6 py-8">

        {/* Left Side: Branding */}
        <div className="flex flex-col justify-center text-white space-y-4">
          {/* Official SRM TRP Logo */}
          <div className="flex items-center space-x-4 mb-4">
            <img
              src="/logo.png"
              alt="SRM TRP Engineering College Logo"
              className="w-20 h-20 object-contain drop-shadow-lg"
            />
            <div>
              <p className="text-sm uppercase tracking-wider font-semibold opacity-90">TRP Engineering College, Trichy</p>
            </div>
          </div>
          <h1 className="text-5xl font-bold leading-tight">On-Duty<br/>Management System</h1>
          <p className="text-xl font-light opacity-90 tracking-wide">Apply • Approve • Stay Informed</p>
        </div>

        {/* Right Side: Login Card */}
        <div className="flex justify-end">
          <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
            <div className="flex justify-end mb-6">
              <a href="#" className="text-sm text-blue-600 hover:underline">Need help?</a>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500 mb-8">Login to your OD Portal</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-start space-x-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg flex items-start space-x-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="Enter your email"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="input-field pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => { setShowForgotModal(true); setResetEmail(email); setError(''); setMessage(''); }}
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-lg mt-4 shadow-md disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">OR</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full btn-secondary py-3 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Login with Google</span>
              </button>
            </form>

            <div className="mt-8 bg-blue-50 text-blue-800 p-4 rounded-xl flex items-start space-x-3 text-sm border border-blue-100">
              <div className="mt-0.5 text-blue-600 bg-white p-1 rounded-full shadow-sm shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                <p className="font-semibold text-blue-900 mb-0.5">Authorized Access Only</p>
                <p className="text-blue-700/80 leading-snug">This portal is for students, faculty and administrators of TRP Engineering College, Trichy.</p>
              </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-400">
              TRP Engineering College Trichy • Institutional Portal
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Reset Your Password</h3>
            <p className="text-sm text-gray-500 mb-4">
              Enter your official college email address. We will send you a link to reset your password.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">College Email</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="e.g. 814723105003@trp.srmtrichy.edu.in"
                  className="input-field"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="btn-secondary py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="btn-primary py-2 px-4 disabled:opacity-50"
                >
                  {resetLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
