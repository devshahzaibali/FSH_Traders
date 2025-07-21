'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login, loginWithGoogle, forgotPassword, role, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loadingLocal, setLoadingLocal] = useState(false);

  useEffect(() => {
    if (user && role && !loading) {
      if (role === 'admin') router.replace('/admin');
      else router.replace('/account');
    }
  }, [user, role, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoadingLocal(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      setLoadingLocal(false); // Stop loading on error
      if (err instanceof Error) {
        if (err.message.includes('user-not-found') || err.message.includes('wrong-password')) {
          setError('❌ Wrong email or password. Please check your credentials and try again.');
          setEmail('');
          setPassword('');
        } else {
          setError(err.message);
        }
      } else {
        setError('Login failed');
      }
      // Auto-reset error and loading after 3 seconds
      setTimeout(() => {
        setError('');
        setLoadingLocal(false);
      }, 3000);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoadingLocal(true);
    try {
      await loginWithGoogle();
    } catch (err: unknown) {
      setLoadingLocal(false);
      if (err instanceof Error) {
        setError(err.message || 'Google login failed');
      } else {
        setError('Google login failed');
      }
      setTimeout(() => {
        setError('');
        setLoadingLocal(false);
      }, 3000);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await forgotPassword(email);
      setSuccess(`Password reset link sent to ${email}! Please check your inbox and spam folder.`);
      // Keep the forgot password form visible for 3 seconds to show the success message
      setTimeout(() => {
        setIsForgotPassword(false);
        setSuccess('');
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to send reset email');
      } else {
        setError('Failed to send reset email');
      }
    }
  };

  if (user && role && !loading) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            {isForgotPassword ? 'Reset Password' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600">
            {isForgotPassword 
              ? 'Enter your email to receive a password reset link'
              : 'Sign in to your account to continue'
            }
          </p>
        </div>

        {!isForgotPassword ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575m2.122-2.122A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.402 3.22-1.125 4.575m-2.122 2.122A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.828-2.828A9.956 9.956 0 0121 12c0 5.523-4.477 10-10 10S1 17.523 1 12c0-1.657.402-3.22 1.125-4.575" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}
              
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors" 
                disabled={loadingLocal}
              >
                {loadingLocal ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="mt-4 w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loadingLocal}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>

            <p className="mt-6 text-center text-gray-600">
              Don&apos;t have an account?{' '}
              <a href="/signup" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                Sign up
              </a>
            </p>
          </>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}
            {success && (
              <div className="text-green-700 text-sm bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-green-800 mb-1">Reset link sent successfully!</p>
                    <p className="text-green-700">{success}</p>
                    <p className="text-green-600 text-xs mt-2">
                      💡 <strong>Tip:</strong> If you don&apos;t see the email, check your spam/junk folder
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors" 
              disabled={loadingLocal}
            >
              {loadingLocal ? 'Sending...' : 'Send Reset Link'}
            </button>

            <button
              type="button"
              onClick={() => setIsForgotPassword(false)}
              className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </main>
  );
} 