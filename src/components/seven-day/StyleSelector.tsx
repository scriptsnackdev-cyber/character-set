'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { STYLES } from '@/lib/seven-day-data';

interface StyleSelectorProps {
  selectedStyle: string;
  onSelect: (styleId: string) => void;
}

export default function StyleSelector({ selectedStyle, onSelect }: StyleSelectorProps) {
  return (
    <div className="card-selector mt-4">
      <div className="card-selector__header">
        <h3 className="card-selector__title">เลือกสไตล์ภาพ (Art Style)</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-2 p-4">
        {STYLES.map((style) => (
          <motion.button
            key={style.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(style.id)}
            className={`
              relative p-3 rounded-xl text-center transition-all duration-300
              flex flex-col items-center justify-center gap-1
              ${selectedStyle === style.id 
                ? 'bg-white/20 ring-1 ring-white/30 shadow-lg' 
                : 'bg-white/5 hover:bg-white/10'}
            `}
          >
            <div className="text-[11px] font-bold text-white">{style.nameTh}</div>
            <div className="text-[9px] font-medium text-white/40 uppercase tracking-tight">{style.nameEn}</div>
            
            {selectedStyle === style.id && (
              <motion.div
                layoutId="style-active"
                className="absolute inset-0 rounded-xl border border-white/20 pointer-events-none"
                initial={false}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
