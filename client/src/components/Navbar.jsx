import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mic, ShieldCheck, LogOut, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-sage-100 shadow-nature-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Brand */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-sage-gradient flex items-center justify-center shadow-nature-sm group-hover:scale-105 transition-transform">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-lg font-serif font-semibold text-gradient-sage tracking-tight">
              EchoJournal
            </span>
            <p className="hidden sm:block text-[10px] font-medium text-sage-400 -mt-0.5 leading-none">
              Mindful Voice Journaling
            </p>
          </div>
        </Link>

        {/* Encryption pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-50 border border-sage-100 text-sage-600 text-[11px] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-sage-500" />
          <span>AES-256 Encrypted</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/record" className="btn-terra text-xs px-4 py-2">
                <Mic className="w-4 h-4" />
                <span className="hidden sm:inline">Record</span>
              </Link>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-sage-100 border border-sage-200 flex items-center justify-center text-sage-600 font-bold text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="hidden lg:block text-sm font-medium text-sage-700">{user?.name}</span>
                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  className="p-2 rounded-xl text-sage-400 hover:text-terra-500 hover:bg-terra-50 transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost text-xs px-4 py-2">Log In</Link>
              <Link to="/signup" className="btn-primary text-xs px-4 py-2">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
