'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StepLabel from '../ui/StepLabel';
import Select from '../ui/Select';
import {
  MAJOR_ARCANA, MINOR_ARCANA_SUITS, TAROT_CARDS,
  CARD_SYMBOLS, ROMAN, getCardSymbol, SPECIAL_CARDS
} from '../../lib/tarot-data';

interface CardSelectorProps {
  selectedCards: string[];
  onToggle: (card: string) => void;
  activeTab: 'Major' | 'Minor' | 'Special';
  onTabChange: (tab: 'Major' | 'Minor' | 'Special') => void;
  activeSuit: string;
  onSuitChange: (suit: string) => void;
}

export default function CardSelector({
  selectedCards, onToggle,
  activeTab, onTabChange,
  activeSuit, onSuitChange,
}: CardSelectorProps) {
  const filteredCards = activeTab === 'Major'
    ? MAJOR_ARCANA
    : activeTab === 'Minor'
      ? TAROT_CARDS.filter(c => c.includes(activeSuit))
      : SPECIAL_CARDS;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.16 }}
    >
      <StepLabel step={3} label="Choose Arcana" done={selectedCards.length > 0} count={selectedCards.length} />

      <div className="card-selector">
        {/* ── Arcana & Suit Dropdowns ── */}
        <div className="p-4 space-y-4 border-bottom border-white/5">
          <Select
            label="Arcana Category"
            value={activeTab}
            onChange={(val) => onTabChange(val as any)}
            options={[
              { id: 'Major', label: 'Major Arcana' },
              { id: 'Minor', label: 'Minor Arcana' },
              { id: 'Special', label: 'Special Cards' },
            ]}
          />

          <AnimatePresence>
            {activeTab === 'Minor' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <Select
                  label="Minor Suit"
                  value={activeSuit}
                  onChange={onSuitChange}
                  options={MINOR_ARCANA_SUITS.map(suit => ({
                    id: suit,
                    label: suit,
                    icon: <span>{CARD_SYMBOLS[suit]}</span>
                  }))}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Card grid ── */}
        <div className="card-selector__grid-wrap">
          <div className="card-selector__grid">
            {filteredCards.map(card => {
              const selected = selectedCards.includes(card);
              const majorIdx = MAJOR_ARCANA.indexOf(card);
              return (
                <motion.button
                  key={card}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onToggle(card)}
                  className={`card-item ${selected ? 'card-item--selected' : ''}`}
                >
                  <span className={`card-item__symbol ${selected ? '' : 'card-item__symbol--dim'}`}>
                    {getCardSymbol(card)}
                  </span>
                  <div className="card-item__info">
                    <span className="card-item__name">{card}</span>
                    {majorIdx >= 0 && (
                      <span className="card-item__numeral">{majorIdx}</span>
                    )}
                  </div>
                  {selected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="card-item__check"
                    >
                      <Check size={9} color="#08070c" strokeWidth={3} />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Selected chips ── */}
        <AnimatePresence>
          {selectedCards.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="card-selector__chips-wrap"
            >
              <div className="card-selector__chips">
                {selectedCards.map(card => (
                  <motion.span
                    key={card}
                    layout
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    className="card-chip"
                  >
                    {getCardSymbol(card)} {card}
                    <button onClick={() => onToggle(card)} className="card-chip__remove">
                      <X size={9} />
                    </button>
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
