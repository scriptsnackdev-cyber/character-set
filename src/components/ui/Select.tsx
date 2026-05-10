'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  id: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (id: string) => void;
  label?: string;
  placeholder?: string;
}

export default function Select({ options, value, onChange, label, placeholder }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.id === value);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block ml-1">
          {label}
        </label>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between px-4 py-3 rounded-2xl
          bg-white/5 border transition-all active:scale-[0.98]
          ${isOpen ? 'border-pink-500/50 bg-white/10' : 'border-white/10 hover:bg-white/8'}
        `}
      >
        <div className="flex items-center gap-3">
          {selectedOption?.icon && (
            <div className="text-pink-400">{selectedOption.icon}</div>
          )}
          <span className={`text-sm font-bold ${selectedOption ? 'text-white' : 'text-white/40'}`}>
            {selectedOption ? selectedOption.label : placeholder || 'Select option...'}
          </span>
        </div>
        <ChevronDown 
          size={18} 
          className={`text-white/20 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            className="absolute top-full left-0 right-0 mt-2 p-1.5 rounded-2xl bg-[#1a1825] border border-white/10 shadow-2xl z-[100] overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-xl transition-all
                    ${value === option.id ? 'bg-pink-500/20 text-pink-300' : 'hover:bg-white/5 text-white/60 hover:text-white'}
                  `}
                >
                  {option.icon && <div className="text-current">{option.icon}</div>}
                  <span className="text-sm font-bold">{option.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
