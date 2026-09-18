import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Dummy login logic
    setTimeout(() => {
      setIsLoading(false);
      // For now, just navigate to orders on successful login
      try { localStorage.setItem('is_authenticated', 'true'); } catch {}
      navigate('/menu');
    }, 1000);
  };

  const handleGoogleLogin = () => {
    // Dummy Google login - navigate to orders
    try { localStorage.setItem('is_authenticated', 'true'); } catch {}
    navigate('/menu');
  };

  return (
    <div className="max-w-md mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
        <p className="text-slate-500 text-lg font-medium">Sign in to your burger account</p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold transition-all placeholder:text-slate-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative group">
              <input
                type="password"
                placeholder="Password"
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold transition-all placeholder:text-slate-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-black rounded-3xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-orange-100 active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-400 font-bold uppercase tracking-widest">or</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-5 bg-white border-2 border-slate-100 hover:border-slate-200 text-slate-700 font-black rounded-3xl transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95"
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

      <div className="text-center">
        <p className="text-slate-500 font-medium">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-orange-600 hover:text-orange-700 font-black transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};