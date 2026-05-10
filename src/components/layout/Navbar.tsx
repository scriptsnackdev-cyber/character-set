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
      {/* Consolidated Menu Button */}
      <div className="navbar__brand">
        <NavMenu />
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
