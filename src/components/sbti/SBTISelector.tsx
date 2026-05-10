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
        <h3 className="card-selector__title">เลือกประเภท SBTI (16 แบบ)</h3>
      </div>
      
      <div className="p-4">
        <Select
          label="SBTI Personality Type"
          value={selectedType || ''}
          onChange={onSelect}
          placeholder="Choose a personality..."
          options={SBTI_TYPES.map(type => ({
            id: type.id,
            label: `${type.id} - ${type.nameTh}`,
            icon: (
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: type.color, boxShadow: `0 0 8px ${type.color}66` }} 
              />
            )
          }))}
        />
      </div>
    </div>
  );
}
