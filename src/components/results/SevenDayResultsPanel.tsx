'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StepLabel from '../ui/StepLabel';
import SevenDayCard from './SevenDayCard';
import { CardResult } from '../../lib/tarot-data';

interface SevenDayResultsPanelProps {
  selectedPairs: string[]; // Format: "dayId:outfitId"
  results: Record<string, CardResult>;
  characterName: string;
}

export default function SevenDayResultsPanel({ selectedPairs, results, characterName }: SevenDayResultsPanelProps) {
  return (
    <div className="results-panel">
      <StepLabel step={3} label="Manifestation" />

      {selectedPairs.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="results-empty">
          <div className="results-empty__icon">
            <Sparkles size={24} className="text-yellow-400" />
          </div>
          <p className="results-empty__title">ยังไม่ได้เลือกวันหรือชุด</p>
          <p className="results-empty__subtitle">
            เลือกวันและชุดแต่งกายที่ต้องการ เพื่อเริ่มการสร้างตัวละคร Chibi
          </p>
        </motion.div>
      ) : (
        <div className={`results-grid ${
          selectedPairs.length >= 4 ? 'results-grid--3' :
          selectedPairs.length >= 2 ? 'results-grid--2' :
          'results-grid--1'
        }`}>
          <AnimatePresence mode="popLayout">
            {selectedPairs.map(pair => {
              const [dayId, outfitId] = pair.split(':');
              return (
                <SevenDayCard 
                  key={pair} 
                  dayId={dayId} 
                  outfitId={outfitId}
                  state={results[pair]} 
                  characterName={characterName}
                />
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
