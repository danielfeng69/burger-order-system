import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowRight } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto text-center space-y-12 py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-orange-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="relative bg-gradient-to-br from-orange-400 to-orange-600 text-white p-12 rounded-full shadow-2xl">
          <span className="text-8xl font-black">404</span>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-5xl font-black text-slate-900">Page Not Found</h2>
        <p className="text-xl text-slate-500 font-medium max-w-md mx-auto">
          Looks like this burger joint doesn't exist in our menu. Let's get you back to the good stuff!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <button
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-orange-600 text-white font-black rounded-3xl hover:bg-orange-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-orange-100"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </button>
        <button
          onClick={() => navigate('/menu')}
          className="px-8 py-4 bg-slate-900 text-white font-black rounded-3xl hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl"
        >
          View Menu
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};