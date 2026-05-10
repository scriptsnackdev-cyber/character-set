'use client';

import React from 'react';
import { Star, Check } from 'lucide-react';

interface NavbarProps {
  /** Which steps are completed */
  stepsDone: boolean[];
}

const STEPS = ['Upload', 'Select', 'Generate'];

export default function Navbar({ stepsDone }: NavbarProps) {
  const doneCount = stepsDone.filter(Boolean).length;

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar__brand">
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-2 group">
            <div className="navbar__logo group-hover:scale-110 transition-transform">
              <Star size={14} strokeWidth={2.5} color="#08070c" fill="#08070c" />
            </div>
            <span className="navbar__title">PurrPaw Tarot</span>
          </a>
          <div className="h-4 w-[1px] bg-white/10" />
          <a href="/mbti" className="text-xs font-medium text-white/50 hover:text-white transition-colors">
            MBTI Chibi
          </a>
          <div className="h-4 w-[1px] bg-white/10" />
          <a href="/cats" className="text-xs font-medium text-white/50 hover:text-white transition-colors">
            12 Cats
          </a>
          <div className="h-4 w-[1px] bg-white/10" />
          <a href="/seven-day" className="text-xs font-medium text-white/50 hover:text-white transition-colors">
            7-Day Color
          </a>
          <div className="h-4 w-[1px] bg-white/10" />
          <a href="/sbti" className="text-xs font-medium text-white/50 hover:text-white transition-colors">
            SBTI Behavioral
          </a>
          <div className="h-4 w-[1px] bg-white/10" />
          <a href="/birthday" className="text-xs font-medium text-white/50 hover:text-white transition-colors">
            Birthday Cake
          </a>
          <div className="h-4 w-[1px] bg-white/10" />
          <a href="/chibi-poll" className="text-xs font-medium text-white/50 hover:text-white transition-colors">
            Uke/Seme Poll
          </a>
          <div className="h-4 w-[1px] bg-white/10" />
          <a href="/chibi-talk" className="text-xs font-medium text-white/50 hover:text-white transition-colors">
            Chibi Talk
          </a>
          <div className="h-4 w-[1px] bg-white/10" />
          <a href="/character-talk" className="text-xs font-medium text-white/50 hover:text-white transition-colors">
            Character Talk
          </a>
          <div className="h-4 w-[1px] bg-white/10" />
          <a href="/chibi-meme" className="text-xs font-medium text-white/50 hover:text-white transition-colors">
            Meme Generator
          </a>
          <div className="h-4 w-[1px] bg-white/10" />
          <a href="/pureware" className="text-xs font-medium text-white/50 hover:text-white transition-colors">
            PureWare
          </a>
          <div className="h-4 w-[1px] bg-white/10" />
          <a href="/character-plus" className="text-xs font-medium text-white/50 hover:text-white transition-colors">
            Character+
          </a>
          <div className="h-4 w-[1px] bg-white/10" />
          <a href="/profile-show" className="text-xs font-medium text-white/50 hover:text-white transition-colors">
            Profile Show
          </a>
        </div>
      </div>

      {/* Progress */}
      <div className="navbar__progress">
        {STEPS.map((label, i) => {
          const done = i < doneCount;
          return (
            <React.Fragment key={label}>
              <div className={`navbar__pill ${done ? 'navbar__pill--done' : ''}`}>
                {done && <Check size={10} />}
                <span>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`navbar__connector ${done ? 'navbar__connector--done' : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}
