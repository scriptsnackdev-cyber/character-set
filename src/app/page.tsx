'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import AmbientBackground from '../components/layout/AmbientBackground';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ImageUploader from '../components/upload/ImageUploader';
import CardSelector from '../components/cards/CardSelector';
import CharacterNameInput from '../components/upload/CharacterNameInput';
import GenerateButton from '../components/generate/GenerateButton';
import ResultsPanel from '../components/results/ResultsPanel';
import { CardResult } from '../lib/tarot-data';

export default function FortuneCharacterGen() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [characterName, setCharacterName] = useState('');
  const [activeTab, setActiveTab] = useState<'Major' | 'Minor' | 'Special'>('Major');
  const [activeSuit, setActiveSuit] = useState('Wands');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<Record<string, CardResult>>({});
  const [error, setError] = useState<string | null>(null);

  /* ── Handlers ── */

  const handleImageUpload = (dataUrl: string) => {
    setImage(dataUrl);
    setResults({});
  };

  const handleImageRemove = () => {
    setImage(null);
    setResults({});
  };

  const toggleCard = (card: string) => {
    setSelectedCards(prev =>
      prev.includes(card) ? prev.filter(c => c !== card) : [...prev, card]
    );
  };

  const generateTarot = async () => {
    if (!image || selectedCards.length === 0) return;
    setIsGenerating(true);
    setError(null);

    const newResults = { ...results };
    selectedCards.forEach(c => { newResults[c] = { loading: true }; });
    setResults(newResults);

    try {
      for (const card of selectedCards) {
        try {
          const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ characterImage: image, cardType: card }),
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          setResults(prev => ({ ...prev, [card]: { url: data.imageUrl, loading: false } }));
        } catch (err: any) {
          setResults(prev => ({ ...prev, [card]: { error: err.message || 'Error occurred', loading: false } }));
        }
      }
    } catch (err: any) {
      setError(err.message || 'The spirits could not be reached.');
    } finally {
      setIsGenerating(false);
    }
  };

  /* ── Derived ── */

  const canGenerate = !!image && selectedCards.length > 0 && !isGenerating;
  const stepsDone = [!!image, characterName.trim().length > 0, selectedCards.length > 0];

  return (
    <div className="app-shell">
      <AmbientBackground />
      <Navbar stepsDone={stepsDone} />

      {/* ── Hero ── */}
      <header className="hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero__eyebrow">
            <span className="hero__line hero__line--left" />
            <span className="hero__tag">Fortune Character Generator</span>
            <span className="hero__line hero__line--right" />
          </div>

          <h1 className="hero__title">
            Transform into{' '}
            <span className="hero__title-accent">Tarot Art</span>
          </h1>

          <p className="hero__subtitle">
            Upload a character image, pick your arcana cards, and watch the magic unfold.
          </p>
        </motion.div>
      </header>

      {/* ── Main layout ── */}
      <main className="main-content">
        <div className="main-content__grid">
          {/* Left panel */}
          <div className="sidebar-panel">
            <ImageUploader
              image={image}
              onUpload={handleImageUpload}
              onRemove={handleImageRemove}
            />

            <CharacterNameInput 
              value={characterName} 
              onChange={setCharacterName} 
            />

            <div className="mt-2">
              <CardSelector
                selectedCards={selectedCards}
                onToggle={toggleCard}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                activeSuit={activeSuit}
                onSuitChange={setActiveSuit}
              />
            </div>

            <GenerateButton
              canGenerate={canGenerate}
              isGenerating={isGenerating}
              hasImage={!!image}
              hasCards={selectedCards.length > 0}
              onGenerate={generateTarot}
            />
          </div>

          {/* Right panel */}
          <ResultsPanel
            selectedCards={selectedCards}
            results={results}
            characterName={characterName.trim()}
          />
        </div>

        {/* Global error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="global-error"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}