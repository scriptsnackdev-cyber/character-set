'use client';

import React from 'react';
import { Star, Check } from 'lucide-react';
import NavMenu from './NavMenu';

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
          <NavMenu />
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
