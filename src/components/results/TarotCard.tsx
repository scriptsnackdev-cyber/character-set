'use client';

import React from 'react';
import { Download, Frame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CornerDeco from '../ui/CornerDeco';
import { getCardSymbol, CardResult, MAJOR_ARCANA } from '../../lib/tarot-data';
import { downloadWithFrame, downloadRawWithWatermark } from '../../lib/frame-renderer';

interface TarotCardProps {
  card: string;
  state?: CardResult;
  characterName?: string;
}

export default function TarotCard({ card, state, characterName }: TarotCardProps) {
  const loading = state?.loading;
  const resImg = state?.url;

  const majorIdx = MAJOR_ARCANA.indexOf(card);
  const displayCardName = majorIdx >= 0 ? `${majorIdx}. ${card}` : card;

  const handleDownloadRaw = () => {
    if (!resImg) return;
    if (characterName) {
      downloadRawWithWatermark(resImg, card, characterName);
    } else {
      const a = document.createElement('a');
      a.href = resImg;
      const fileName = displayCardName.replace(/\./g, "").replace(/ /g, "_").toUpperCase();
      a.download = `${fileName}.png`;
      a.click();
    }
  };

  const handleDownloadFramed = () => {
    if (!resImg) return;
    downloadWithFrame(resImg, card, characterName);
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
      {/* ── Card frame ── */}
      <div className={`tarot-frame ${resImg ? 'tarot-frame--complete' : ''}`}>
        {/* Inner border */}
        <div className="tarot-frame__inner-border" />

        {/* Corner accents */}
        <CornerDeco />

        <AnimatePresence mode="wait">
          {loading ? (
            /* Loading state */
            <motion.div
              key="load"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="tarot-loading"
            >
              <div className="tarot-loading__spinner">
                <div className="tarot-loading__ring tarot-loading__ring--outer" />
                <div className="tarot-loading__ring tarot-loading__ring--inner" />
              </div>
              <span className="tarot-loading__label">Summoning</span>
              <span className="tarot-loading__card-name">{card}</span>
            </motion.div>

          ) : resImg ? (
            /* Generated image */
            <motion.div
              key="img"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="tarot-result"
            >
              <img src={resImg} alt={card} className="tarot-result__image" />
              {characterName && (
                <div className="tarot-result__watermark">{characterName}</div>
              )}
              <div className="tarot-result__gradient" />
              <div className="tarot-result__label-wrap">
                <div className="tarot-result__label">
                  <span className="tarot-result__symbol">{getCardSymbol(card)}</span>
                  <span className="tarot-result__name">{displayCardName}</span>
                </div>
              </div>
            </motion.div>

          ) : (
            /* Placeholder */
            <motion.div
              key="ph"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="tarot-placeholder"
            >
              <span className="tarot-placeholder__symbol">{getCardSymbol(card)}</span>
              <span className="tarot-placeholder__name">{card}</span>
              {state?.error && (
                <span className="tarot-placeholder__error">{state.error}</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Download buttons ── */}
      {resImg && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="tarot-actions"
        >
          <button onClick={handleDownloadRaw} className="tarot-actions__btn">
            <Download size={12} /> Save
          </button>
          <button onClick={handleDownloadFramed} className="tarot-actions__btn tarot-actions__btn--frame">
            <Frame size={12} /> With Frame
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
