'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SEVEN_DAYS } from '@/lib/seven-day-data';

interface DaySelectorProps {
  selectedDays: string[];
  onToggle: (dayId: string) => void;
}

export default function DaySelector({ selectedDays, onToggle }: DaySelectorProps) {
  return (
    <div className="card-selector">
      <div className="card-selector__header">
        <h3 className="card-selector__title">เลือกวัน (7-Day Color)</h3>
      </div>
      
      <div className="grid grid-cols-4 gap-2 p-4">
        {SEVEN_DAYS.map((day) => {
          const isActive = selectedDays.includes(day.id);
          return (
            <motion.button
              key={day.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onToggle(day.id)}
              className={`
                relative p-3 rounded-xl text-center transition-all duration-300
                flex flex-col items-center justify-center gap-1
                ${isActive 
                  ? 'bg-white/20 ring-2 shadow-lg z-10' 
                  : 'bg-white/5 hover:bg-white/10'}
              `}
              style={{
                borderColor: day.hexColor,
                boxShadow: isActive ? `0 0 15px ${day.hexColor}66` : 'none',
                borderBottom: `4px solid ${day.hexColor}`
              }}
            >
              <div className="text-[10px] font-black uppercase tracking-tighter" style={{ color: day.hexColor }}>{day.id.substring(0, 3)}</div>
              <div className="text-[11px] font-bold text-white leading-tight">{day.nameTh}</div>
              
              {isActive && (
                <motion.div
                  layoutId="day-active"
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{ backgroundColor: `${day.hexColor}22` }}
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
