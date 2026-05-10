'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CornerDeco from '../ui/CornerDeco';
import { CardResult } from '../../lib/tarot-data';
import { CAT_BREEDS } from '../../lib/cat-data';

interface CatCardProps {
  breedId: string;
  state?: CardResult;
  characterName?: string;
}

export default function CatCard({ breedId, state, characterName }: CatCardProps) {
  const loading = state?.loading;
  const resImg = state?.url;
  
  const breed = CAT_BREEDS.find(b => b.id === breedId);
  const accentColor = breed?.color || '#ff69b4';

  const handleDownload = () => {
    if (!resImg) return;
    const a = document.createElement('a');
    a.href = resImg;
    const filename = characterName 
      ? `Chibi_${characterName}_${breed?.nameEn}.png` 
      : `Chibi_Cat_${breed?.nameEn || 'Breed'}.png`;
    a.download = filename;
    a.click();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className="tarot-card-wrapper"
    >
      <div className={`tarot-frame ${resImg ? 'tarot-frame--complete' : ''}`} style={{ borderColor: `${accentColor}44` }}>
        <div className="tarot-frame__inner-border" style={{ borderColor: `${accentColor}22` }} />
        <CornerDeco />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="load"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="tarot-loading"
            >
              <div className="tarot-loading__spinner">
                <div className="tarot-loading__ring tarot-loading__ring--outer" style={{ borderTopColor: accentColor }} />
                <div className="tarot-loading__ring tarot-loading__ring--inner" style={{ borderBottomColor: accentColor }} />
              </div>
              <span className="tarot-loading__label">Generaring Cute {breed?.nameEn}</span>
              <span className="tarot-loading__card-name" style={{ color: accentColor }}>{breed?.nameTh}</span>
            </motion.div>

          ) : resImg ? (
            <motion.div
              key="img"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="tarot-result"
            >
              <img src={resImg} alt={breed?.nameEn} className="tarot-result__image" />
              {characterName && (
                <div className="tarot-result__watermark">{characterName}</div>
              )}
              <div className="tarot-result__gradient" />
              <div className="tarot-result__label-wrap">
                <div className="tarot-result__label" style={{ backgroundColor: `${accentColor}22`, backdropFilter: 'blur(8px)' }}>
                  <span className="tarot-result__symbol">🐾</span>
                  <span className="tarot-result__name">{breed?.nameEn} - {breed?.nameTh}</span>
                </div>
              </div>
            </motion.div>

          ) : (
            <motion.div
              key="ph"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="tarot-placeholder"
            >
              <span className="tarot-placeholder__symbol">✨</span>
              <span className="tarot-placeholder__name">{breed?.nameEn}</span>
              {state?.error && (
                <span className="tarot-placeholder__error">{state.error}</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {resImg && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="tarot-actions"
        >
          <button onClick={handleDownload} className="tarot-actions__btn" style={{ '--accent': accentColor } as any}>
            <Download size={12} /> Download Photo
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
