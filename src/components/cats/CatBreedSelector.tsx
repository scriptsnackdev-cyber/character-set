'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CAT_BREEDS } from '@/lib/cat-data';

interface CatBreedSelectorProps {
  selectedBreed: string | null;
  onSelect: (breedId: string) => void;
}

export default function CatBreedSelector({ selectedBreed, onSelect }: CatBreedSelectorProps) {
  return (
    <div className="card-selector">
      <div className="card-selector__header">
        <h3 className="card-selector__title">เลือกสายพันธุ์แมว (12 สายพันธุ์)</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-2 p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
        {CAT_BREEDS.map((breed) => (
          <motion.button
            key={breed.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(breed.id)}
            className={`
              relative p-3 rounded-xl text-center transition-all duration-300
              flex flex-col items-center justify-center gap-1
              ${selectedBreed === breed.id 
                ? 'bg-white/20 ring-2 shadow-lg z-10' 
                : 'bg-white/5 hover:bg-white/10'}
            `}
            style={{
              borderColor: breed.color,
              boxShadow: selectedBreed === breed.id ? `0 0 15px ${breed.color}44` : 'none',
              borderLeft: `3px solid ${breed.color}`
            }}
          >
            <div className="text-xs font-black tracking-tight" style={{ color: breed.color }}>{breed.nameEn}</div>
            <div className="text-[10px] font-bold text-white/50">{breed.nameTh}</div>
            
            {selectedBreed === breed.id && (
              <motion.div
                layoutId="cat-active"
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{ backgroundColor: `${breed.color}11` }}
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
