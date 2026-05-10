'use client';

import React from 'react';
import { User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StepLabel from '../ui/StepLabel';
import SBTICard from './SBTICard';
import { CardResult } from '../../lib/tarot-data';

interface SBTIResultsPanelProps {
  selectedTypeId: string | null;
  results: Record<string, CardResult>;
  characterName: string;
  isCardBack?: boolean;
}

export default function SBTIResultsPanel({ selectedTypeId, results, characterName, isCardBack }: SBTIResultsPanelProps) {
  return (
    <div className="results-panel">
      <StepLabel step={3} label="Manifestation" />

      {!selectedTypeId ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="results-empty">
          <div className="results-empty__icon">
            <User size={24} className="text-blue-400" />
          </div>
          <p className="results-empty__title">ยังไม่ได้เลือกประเภท SBTI</p>
          <p className="results-empty__subtitle">
            เลือกประเภทพฤติกรรมของคุณ เพื่อเริ่มการสร้างตัวละคร Chibi สุดปั่น
          </p>
        </motion.div>
      ) : (
        <div className="results-grid results-grid--1">
          <AnimatePresence mode="popLayout">
            <SBTICard 
              key={selectedTypeId} 
              typeId={selectedTypeId} 
              state={results[selectedTypeId]} 
              characterName={characterName}
              isCardBack={isCardBack}
            />
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
