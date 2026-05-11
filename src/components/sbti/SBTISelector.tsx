'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SBTI_TYPES } from '@/lib/sbti-data';
import Select from '../ui/Select';

interface SBTISelectorProps {
  selectedType: string | null;
  onSelect: (typeId: string) => void;
}

export default function SBTISelector({ selectedType, onSelect }: SBTISelectorProps) {
  return (
    <div className="card-selector">
      <div className="card-selector__header">
        <h3 className="card-selector__title">เลือกประเภท SBTI (28 แบบ)</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-2 p-4 max-h-[480px] overflow-y-auto custom-scrollbar">
        {SBTI_TYPES.map((type) => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(type.id)}
            className={`
              relative p-3 rounded-xl text-center transition-all duration-300
              flex flex-col items-center justify-center gap-1
              ${selectedType === type.id 
                ? 'bg-white/20 ring-1 ring-white/30 shadow-lg z-10' 
                : 'bg-white/5 hover:bg-white/10'}
            `}
            style={{
              borderColor: type.color,
              boxShadow: selectedType === type.id ? `0 0 15px ${type.color}44` : 'none',
              borderLeft: `3px solid ${type.color}`
            }}
          >
            <div className="text-[10px] font-black tracking-tight" style={{ color: type.color }}>{type.id}</div>
            <div className="text-[9px] font-bold text-white/60 leading-tight">{type.nameTh}</div>
            
            {selectedType === type.id && (
              <motion.div
                layoutId="sbti-active"
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{ backgroundColor: `${type.color}11` }}
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
