'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Sparkles, User, Cat, Calendar, Brain, Heart, MessageSquare, Image, Zap, Layout, Star, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/actions/auth';

const MENU_ITEMS = [
  { name: 'Tarot Art', href: '/', icon: Star, color: '#ff8eb3' },
  { name: 'MBTI Chibi', href: '/mbti', icon: Brain, color: '#c78bf5' },
  { name: '12 Cats', href: '/cats', icon: Cat, color: '#fb923c' },
  { name: '7-Day Color', href: '/seven-day', icon: Calendar, color: '#fbbf24' },
  { name: 'SBTI Behavioral', href: '/sbti', icon: Zap, color: '#3b82f6' },
  { name: 'Birthday Cake', href: '/birthday', icon: Sparkles, color: '#f472b6' },
  { name: 'Uke/Seme Poll', href: '/chibi-poll', icon: Heart, color: '#ec4899' },
  { name: 'Chibi Talk', href: '/chibi-talk', icon: MessageSquare, color: '#2dd4bf' },
  { name: 'Character Talk', href: '/character-talk', icon: MessageSquare, color: '#10b981' },
  { name: 'Meme Generator', href: '/chibi-meme', icon: Image, color: '#f87171' },
  { name: 'PureWare', href: '/pureware', icon: Layout, color: '#6366f1' },
  { name: 'Character+', href: '/character-plus', icon: User, color: '#a855f7' },
  { name: 'Profile Show', href: '/profile-show', icon: User, color: '#3b82f6' },
];

export default function NavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Use usePathname to avoid hydration mismatch
  const pathname = usePathname();
  const activeItem = MENU_ITEMS.find(item => item.href === pathname) || MENU_ITEMS[0];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group active:scale-95 shadow-lg shadow-black/20"
      >
        {/* Brand Logo in Button */}
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-tr from-[#ff8eb3] to-[#c78bf5] group-hover:scale-110 transition-transform">
          <Star size={14} strokeWidth={2.5} color="#08070c" fill="#08070c" />
        </div>
        
        <div className="flex flex-col items-start leading-tight">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">PurrPaw</span>
          <span className="text-xs font-bold text-white tracking-wide">
            {activeItem.name}
          </span>
        </div>

        <ChevronDown 
          size={16} 
          className={`text-white/40 ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 mt-2 w-64 p-2 rounded-2xl bg-[#0e0d15]/95 backdrop-blur-xl border border-white/10 shadow-2xl z-[999] overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-1 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {MENU_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 p-2.5 rounded-xl transition-all group
                    ${pathname === item.href ? 'bg-white/10' : 'hover:bg-white/5'}
                  `}
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    <item.icon size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold ${pathname === item.href ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                      {item.name}
                    </span>
                    {pathname === item.href && (
                      <span className="text-[9px] text-white/30 uppercase tracking-widest font-medium">Current Page</span>
                    )}
                  </div>
                </a>
              ))}
            </div>
            
            <div className="mt-2 pt-2 border-t border-white/5 px-2 pb-1">
              <button
                onClick={() => logout()}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl transition-all hover:bg-red-500/10 group mb-1"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/10 text-red-400 group-hover:scale-110">
                  <LogOut size={16} />
                </div>
                <span className="text-xs font-bold text-red-400/80 group-hover:text-red-400">Logout</span>
              </button>
              
              <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-bold text-center mt-1">
                Magic Universe
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
