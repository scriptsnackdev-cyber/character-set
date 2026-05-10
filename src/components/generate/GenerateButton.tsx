'use client';

import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface GenerateButtonProps {
  canGenerate: boolean;
  isGenerating: boolean;
  hasImage: boolean;
  hasCards: boolean;
  onGenerate: () => void;
  accentColor?: string;
  label?: string;
  loadingLabel?: string;
}

export default function GenerateButton({
  canGenerate, isGenerating, hasImage, hasCards, onGenerate, accentColor, label, loadingLabel
}: GenerateButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.24 }}
    >
      <button
        onClick={onGenerate}
        disabled={!canGenerate}
        className={`generate-btn ${canGenerate ? 'generate-btn--active' : 'generate-btn--disabled'}`}
        style={{ '--accent-color': accentColor } as any}
      >
        {canGenerate && <div className="generate-btn__hover-bg" />}
        <span className="generate-btn__content">
          {isGenerating
            ? <><Loader2 size={16} className="generate-btn__spinner" /> {loadingLabel || 'Channeling...'}</>
            : <><Sparkles size={16} /> {label || 'Generate Prophecy'}</>
          }
        </span>
      </button>

      {!hasImage && hasCards && (
        <p className="generate-btn__hint">Upload an image first to begin</p>
      )}
    </motion.div>
  );
}
