'use client';

import React from 'react';
import { Download, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CornerDeco from '../ui/CornerDeco';
import { CardResult } from '../../lib/tarot-data';
import { SEVEN_DAYS, OUTFITS } from '../../lib/seven-day-data';
import { download7DayWithFrame } from '../../lib/seven-day-renderer';

interface SevenDayCardProps {
  dayId: string;
  outfitId: string;
  state?: CardResult;
  characterName?: string;
}

export default function SevenDayCard({ dayId, outfitId, state, characterName }: SevenDayCardProps) {
  const loading = state?.loading;
  const resImg = state?.url;
  
  const day = SEVEN_DAYS.find(d => d.id === dayId);
  const outfit = OUTFITS.find(o => o.id === outfitId);
  const accentColor = day?.hexColor || '#ff69b4';

  const handleDownload = () => {
    if (!resImg) return;
    const a = document.createElement('a');
    a.href = resImg;
    const filename = characterName 
      ? `Chibi_${characterName}_${day?.nameEn}_${outfit?.id}.png` 
      : `Chibi_7Day_${day?.nameEn}_${outfit?.id}.png`;
    a.download = filename;
    a.click();
  };

  const handleDownloadFrame = async () => {
    if (!resImg) return;
    await download7DayWithFrame(resImg, dayId, outfitId, characterName);
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
              <span className="tarot-loading__label">Generating {day?.nameEn} Style</span>
              <span className="tarot-loading__card-name" style={{ color: accentColor }}>{day?.nameTh}</span>
            </motion.div>

          ) : resImg ? (
            <motion.div
              key="img"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="tarot-result"
            >
              <img src={resImg} alt={day?.nameEn} className="tarot-result__image" />
              {characterName && (
                <div className="tarot-result__watermark">{characterName}</div>
              )}
              <div className="tarot-result__gradient" />
              <div className="tarot-result__label-wrap">
                <div className="tarot-result__label" style={{ backgroundColor: `${accentColor}22`, backdropFilter: 'blur(8px)' }}>
                  <span className="tarot-result__symbol">✨</span>
                  <span className="tarot-result__name">{day?.nameEn} - {outfit?.nameTh}</span>
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
              <span className="tarot-placeholder__symbol">📅</span>
              <span className="tarot-placeholder__name">{day?.nameEn} - {outfit?.nameEn}</span>
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
            <Download size={12} /> Photo
          </button>
          <button onClick={handleDownloadFrame} className="tarot-actions__btn" style={{ '--accent': '#c78bf5' } as any}>
            <ImageIcon size={12} /> Frame
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
