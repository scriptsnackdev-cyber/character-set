'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SBTI_TYPES } from '@/lib/sbti-data';

interface SBTISelectorProps {
  selectedType: string | null;
  onSelect: (typeId: string) => void;
}

export default function SBTISelector({ selectedType, onSelect }: SBTISelectorProps) {
  return (
    <div className="card-selector">
      <div className="card-selector__header">
        <h3 className="card-selector__title">เลือกประเภท SBTI (16 แบบ)</h3>
      </div>
      
      <div className="grid grid-cols-4 gap-2 p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
        {SBTI_TYPES.map((type) => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(type.id)}
            className={`
              relative p-2 rounded-xl text-center transition-all duration-300
              flex flex-col items-center justify-center gap-1
              ${selectedType === type.id 
                ? 'bg-white/20 ring-2 shadow-lg z-10' 
                : 'bg-white/5 hover:bg-white/10'}
              ${type.id === 'MYSTERY' ? 'bg-black/40 border-dashed' : ''}
            `}
            style={{
              borderColor: type.id === 'MYSTERY' ? '#555' : type.color,
              boxShadow: selectedType === type.id ? `0 0 15px ${type.id === 'MYSTERY' ? '#888' : type.color}44` : 'none',
              borderBottom: `3px solid ${type.id === 'MYSTERY' ? '#333' : type.color}`
            }}
          >
            {type.id === 'MYSTERY' ? (
              <span className="text-xl mb-1">❓</span>
            ) : (
              <div className="text-[10px] font-black tracking-tight" style={{ color: type.color }}>{type.id}</div>
            )}
            <div className="text-[10px] font-bold text-white/50 leading-none">{type.nameTh}</div>
            
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
