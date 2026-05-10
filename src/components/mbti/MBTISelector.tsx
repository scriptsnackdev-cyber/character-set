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
      
      <div className="p-4">
        <Select
          label="MBTI Personality"
          value={selectedType || ''}
          onChange={onSelect}
          placeholder="Choose personality..."
          options={MBTI_TYPES.map(mbti => ({
            id: mbti.type,
            label: `${mbti.type} - ${mbti.name}`,
            icon: (
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: mbti.color, boxShadow: `0 0 8px ${mbti.color}66` }} 
              />
            )
          }))}
        />
      </div>
    </div>
  );
}
