'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StepLabel from '../ui/StepLabel';
import CatCard from './CatCard';
import { CardResult } from '../../lib/tarot-data';

interface CatResultsPanelProps {
  selectedBreedId: string | null;
  results: Record<string, CardResult>;
  characterName: string;
}

export default function CatResultsPanel({ selectedBreedId, results, characterName }: CatResultsPanelProps) {
  return (
    <div className="results-panel">
      <StepLabel step={3} label="Manifestation" />

      {!selectedBreedId ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="results-empty">
          <div className="results-empty__icon">
            <Heart size={24} className="text-pink-400" />
          </div>
          <p className="results-empty__title">ยังไม่ได้เลือกสายพันธุ์</p>
          <p className="results-empty__subtitle">
            เลือกสายพันธุ์แมวที่คุณต้องการ เพื่อเริ่มการสร้างรูปสุดน่ารัก
          </p>
        </motion.div>
      ) : (
        <div className="results-grid results-grid--1">
          <AnimatePresence mode="popLayout">
            <CatCard 
              key={selectedBreedId} 
              breedId={selectedBreedId} 
              state={results[selectedBreedId]} 
              characterName={characterName}
            />
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
