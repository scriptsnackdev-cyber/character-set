'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MBTI_TYPES } from '@/lib/mbti-data';
import Select from '../ui/Select';

interface MBTISelectorProps {
  selectedType: string | null;
  onSelect: (type: string) => void;
}

export default function MBTISelector({ selectedType, onSelect }: MBTISelectorProps) {
  return (
    <div className="card-selector">
      <div className="card-selector__header">
        <h3 className="card-selector__title">Choose MBTI Personality</h3>
      </div>
      
      <div className="grid grid-cols-4 gap-2 p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
        {MBTI_TYPES.map((mbti) => (
          <motion.button
            key={mbti.type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(mbti.type)}
            className={`
              relative p-2 rounded-xl text-center transition-all duration-300
              flex flex-col items-center justify-center gap-1
              ${selectedType === mbti.type 
                ? 'bg-white/20 ring-1 ring-white/30 shadow-lg z-10' 
                : 'bg-white/5 hover:bg-white/10'}
            `}
            style={{
              borderColor: mbti.color,
              boxShadow: selectedType === mbti.type ? `0 0 15px ${mbti.color}44` : 'none',
              borderBottom: `3px solid ${mbti.color}`
            }}
          >
            <div className="text-[10px] font-black tracking-tight" style={{ color: mbti.color }}>{mbti.type}</div>
            <div className="text-[8px] font-bold text-white/50 leading-tight uppercase">{mbti.name}</div>
            
            {selectedType === mbti.type && (
              <motion.div
                layoutId="mbti-active"
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{ backgroundColor: `${mbti.color}11` }}
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
