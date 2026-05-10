'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { OUTFITS } from '@/lib/seven-day-data';

interface OutfitSelectorProps {
  selectedOutfits: string[];
  onToggle: (outfitId: string) => void;
}

export default function OutfitSelector({ selectedOutfits, onToggle }: OutfitSelectorProps) {
  return (
    <div className="card-selector mt-4">
      <div className="card-selector__header">
        <h3 className="card-selector__title">เลือกชุดแต่งกาย (Outfit)</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-2 p-4">
        {OUTFITS.map((outfit) => {
          const isActive = selectedOutfits.includes(outfit.id);
          return (
            <motion.button
              key={outfit.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onToggle(outfit.id)}
              className={`
                relative p-3 rounded-xl text-center transition-all duration-300
                flex flex-col items-center justify-center gap-1 min-h-[60px]
                ${isActive 
                  ? 'bg-white/20 ring-1 ring-white/30 shadow-lg' 
                  : 'bg-white/5 hover:bg-white/10'}
              `}
            >
              <div className="text-[11px] font-bold text-white">{outfit.nameTh}</div>
              <div className="text-[9px] font-medium text-white/40 uppercase tracking-tight">{outfit.nameEn}</div>
              
              {isActive && (
                <motion.div
                  layoutId="outfit-active-grid"
                  className="absolute inset-0 rounded-xl border border-white/20 pointer-events-none"
                  initial={false}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
