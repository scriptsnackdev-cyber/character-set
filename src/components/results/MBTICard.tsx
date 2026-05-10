'use client';

import React from 'react';
import { Download, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CornerDeco from '../ui/CornerDeco';
import { CardResult } from '../../lib/tarot-data';
import { MBTI_TYPES } from '../../lib/mbti-data';
import { downloadRawWithWatermark } from '../../lib/frame-renderer';

import { downloadMBTIWithFrame } from '../../lib/mbti-frame-renderer';

interface MBTICardProps {
  mbtiType: string;
  state?: CardResult;
  characterName?: string;
  isCardBack?: boolean;
}

export default function MBTICard({ mbtiType, state, characterName, isCardBack }: MBTICardProps) {
  const loading = state?.loading;
  const resImg = state?.url;
  
  const mbtiData = MBTI_TYPES.find(m => m.type === mbtiType);
  const displayCardName = isCardBack ? `${mbtiType}? - Mystery Back` : (mbtiData ? `${mbtiData.type} - ${mbtiData.name}` : mbtiType);
  const accentColor = mbtiData?.color || '#ff69b4';

  const handleDownloadRaw = () => {
    if (!resImg) return;
    if (characterName) {
      downloadRawWithWatermark(resImg, mbtiType, characterName);
    } else {
      const a = document.createElement('a');
      a.href = resImg;
      a.download = `MBTI_${mbtiType}_${characterName || 'Chibi'}.png`;
      a.click();
    }
  };

  const handleDownloadFramed = () => {
    if (!resImg) return;
    downloadMBTIWithFrame(resImg, mbtiType, characterName);
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
              <span className="tarot-loading__label">Creating Chibi</span>
              <span className="tarot-loading__card-name" style={{ color: accentColor }}>{mbtiType}</span>
            </motion.div>

          ) : resImg ? (
            <motion.div
              key="img"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="tarot-result"
            >
              <img src={resImg} alt={mbtiType} className="tarot-result__image" />
              {characterName && (
                <div className="tarot-result__watermark">{characterName}</div>
              )}
              <div className="tarot-result__gradient" />
              <div className="tarot-result__label-wrap">
                <div className="tarot-result__label" style={{ backgroundColor: `${accentColor}22`, backdropFilter: 'blur(8px)' }}>
                  <span className="tarot-result__symbol">🐾</span>
                  <span className="tarot-result__name">{displayCardName}</span>
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
              <span className="tarot-placeholder__name">{mbtiType}</span>
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
          <button onClick={handleDownloadRaw} className="tarot-actions__btn" style={{ '--accent': accentColor } as any}>
            <Download size={12} /> Save
          </button>
          <button onClick={handleDownloadFramed} className="tarot-actions__btn tarot-actions__btn--frame" style={{ '--accent': accentColor } as any}>
            <Download size={12} /> With Frame
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
