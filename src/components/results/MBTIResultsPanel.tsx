'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StepLabel from '../ui/StepLabel';
import MBTICard from './MBTICard';
import { CardResult } from '../../lib/tarot-data';

interface MBTIResultsPanelProps {
  selectedType: string | null;
  results: Record<string, CardResult>;
  characterName: string;
  isCardBack?: boolean;
}

export default function MBTIResultsPanel({ selectedType, results, characterName, isCardBack }: MBTIResultsPanelProps) {
  return (
    <div className="results-panel">
      <StepLabel step={3} label="Manifestation" />

      {!selectedType ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="results-empty">
          <div className="results-empty__icon">
            <Heart size={24} className="text-pink-400" />
          </div>
          <p className="results-empty__title">No MBTI selected</p>
          <p className="results-empty__subtitle">
            Choose your personality type to see the magic
          </p>
        </motion.div>
      ) : (
        <div className="results-grid results-grid--1">
          <AnimatePresence mode="popLayout">
            <MBTICard 
              key={selectedType} 
              mbtiType={selectedType} 
              state={results[selectedType]} 
              characterName={characterName} 
              isCardBack={isCardBack}
            />
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
