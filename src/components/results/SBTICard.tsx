'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CornerDeco from '../ui/CornerDeco';
import { CardResult } from '../../lib/tarot-data';
import { SBTI_TYPES } from '../../lib/sbti-data';
import { downloadSBTIWithFrame } from '../../lib/sbti-frame-renderer';

interface SBTICardProps {
  typeId: string;
  state?: CardResult;
  characterName?: string;
  isCardBack?: boolean;
}

export default function SBTICard({ typeId, state, characterName, isCardBack }: SBTICardProps) {
  const loading = state?.loading;
  const resImg = state?.url;
  
  const type = SBTI_TYPES.find(t => t.id === typeId);
  const accentColor = typeId === 'MYSTERY' ? '#8b5cf6' : (type?.color || '#ff69b4');

  const handleDownload = () => {
    if (!resImg) return;
    const a = document.createElement('a');
    a.href = resImg;
    const safeId = type?.id.replace(/[^a-zA-Z0-9]/g, '_') || 'TYPE';
    const filename = characterName 
      ? `Chibi_SBTI_${characterName}_${safeId}.png` 
      : `Chibi_SBTI_${safeId}.png`;
    a.download = filename;
    a.click();
  };

  const handleDownloadFrame = async () => {
    if (!resImg) return;
    await downloadSBTIWithFrame(resImg, typeId, characterName);
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
              <span className="tarot-loading__label">Generaring {type?.nameEn}</span>
              <span className="tarot-loading__card-name" style={{ color: accentColor }}>{type?.nameTh}</span>
            </motion.div>

          ) : resImg ? (
            <motion.div
              key="img"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="tarot-result"
            >
              <img src={resImg} alt={type?.nameEn} className="tarot-result__image" />
              {characterName && (
                <div className="tarot-result__watermark">{characterName}</div>
              )}
              <div className="tarot-result__gradient" />
              <div className="tarot-result__label-wrap">
                <div className="tarot-result__label" style={{ backgroundColor: `${accentColor}22`, backdropFilter: 'blur(8px)' }}>
                  <span className="tarot-result__symbol">{isCardBack ? '🔮' : '🎭'}</span>
                  <span className="tarot-result__name">{type?.id} - {isCardBack ? 'Mystery Back' : type?.nameTh}</span>
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
              <span className="tarot-placeholder__symbol">{isCardBack ? '🔮' : '✨'}</span>
              <span className="tarot-placeholder__name">{type?.id} {isCardBack ? 'Mystery' : ''}</span>
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
            Photo
          </button>
          <button onClick={handleDownloadFrame} className="tarot-actions__btn" style={{ '--accent': accentColor } as any}>
            Frame
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
