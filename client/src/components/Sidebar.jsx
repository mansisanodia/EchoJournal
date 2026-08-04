import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Mic, BookOpen,
  TrendingUp, Search, Bot, Settings, Leaf, ShieldCheck
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard',      path: '/dashboard', icon: LayoutDashboard },
  { label: 'Record Voice',   path: '/record',    icon: Mic,    badge: 'Live' },
  { label: 'Journal History',path: '/history',   icon: BookOpen },
  { label: 'Mood Analytics', path: '/analytics', icon: TrendingUp },
  { label: 'Smart Search',   path: '/search',    icon: Search },
  { label: 'AI Reflection',  path: '/chat',      icon: Bot,    badge: 'AI' },
  { label: 'Settings',       path: '/settings',  icon: Settings },
];

const Sidebar = () => (
  <aside className="w-64 min-h-[calc(100vh-4rem)] bg-white/60 backdrop-blur-sm border-r border-sage-100 p-5 hidden md:flex flex-col gap-6">

    {/* Nav Links */}
    <div className="space-y-1">
      <p className="section-label px-3 mb-3">Navigation</p>
      {navItems.map(({ label, path, icon: Icon, badge }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `flex items-center justify-between px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-sage-400 text-white shadow-nature-sm'
                : 'text-sage-600 hover:bg-sage-50 hover:text-sage-800'
            }`
          }
        >
          <div className="flex items-center gap-2.5">
            <Icon className="w-4 h-4 shrink-0" />
            <span>{label}</span>
          </div>
          {badge && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white/30 text-current border border-current/20">
              {badge}
            </span>
          )}
        </NavLink>
      ))}
    </div>

    {/* Security Pill */}
    <div className="mt-auto p-4 rounded-2xl bg-sage-50 border border-sage-100">
      <div className="flex items-center gap-2 text-sage-600 font-semibold text-xs mb-1.5">
        <ShieldCheck className="w-4 h-4 text-sage-500" />
        <span>Zero-Knowledge Security</span>
      </div>
      <p className="text-[11px] text-sage-500 leading-relaxed">
        Your thoughts are AES-256 encrypted before saving. Only your session can decrypt them.
      </p>
    </div>
  </aside>
);

export default Sidebar;
