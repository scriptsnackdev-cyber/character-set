'use client';

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StepLabel from '../ui/StepLabel';
import TarotCard from './TarotCard';
import { CardResult } from '../../lib/tarot-data';

interface ResultsPanelProps {
  selectedCards: string[];
  results: Record<string, CardResult>;
  characterName: string;
}

export default function ResultsPanel({ selectedCards, results, characterName }: ResultsPanelProps) {
  return (
    <div className="results-panel">
      <StepLabel step={4} label="Manifestation" />

      {selectedCards.length === 0 ? (
        /* Empty state */
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="results-empty">
          <div className="results-empty__icon">
            <ImageIcon size={24} />
          </div>
          <p className="results-empty__title">No cards selected</p>
          <p className="results-empty__subtitle">
            Choose cards from the left panel to see previews here
          </p>
        </motion.div>
      ) : (
        /* Card results grid */
        <div className={`results-grid ${
          selectedCards.length >= 4 ? 'results-grid--3' :
          selectedCards.length >= 2 ? 'results-grid--2' :
          'results-grid--1'
        }`}>
          <AnimatePresence mode="popLayout">
            {selectedCards.map(card => (
              <TarotCard key={card} card={card} state={results[card]} characterName={characterName} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
