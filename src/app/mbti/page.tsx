'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import AmbientBackground from '@/components/layout/AmbientBackground';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ImageUploader from '@/components/upload/ImageUploader';
import CharacterNameInput from '@/components/upload/CharacterNameInput';
import GenerateButton from '@/components/generate/GenerateButton';
import MBTIResultsPanel from '@/components/results/MBTIResultsPanel';
import MBTISelector from '@/components/mbti/MBTISelector';
import { CardResult } from '@/lib/tarot-data';
import { MBTI_TYPES } from '@/lib/mbti-data';

export default function MBTIGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [characterName, setCharacterName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<Record<string, CardResult>>({});
  const [error, setError] = useState<string | null>(null);
  const [genType, setGenType] = useState<'Chibi' | 'CardBack'>('Chibi');

  const handleImageUpload = (dataUrl: string) => {
    setImage(dataUrl);
    setResults({});
  };

  const handleImageRemove = () => {
    setImage(null);
    setResults({});
  };

  const generateMBTI = async () => {
    if (!image || !selectedType) return;
    setIsGenerating(true);
    setError(null);

    const typeKey = selectedType;
    const mbtiData = MBTI_TYPES.find(m => m.type === selectedType);
    setResults({ [typeKey]: { loading: true } });

    try {
      const res = await fetch('/api/generate-mbti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          characterImage: image, 
          mbtiType: selectedType,
          characterName: characterName,
          houseColor: mbtiData?.color,
          houseColorName: mbtiData?.house === 'Analysts' ? 'purple' : 
                          mbtiData?.house === 'Diplomats' ? 'green' : 
                          mbtiData?.house === 'Sentinels' ? 'blue' : 'yellow',
          genType: genType
        }),
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setResults({ [typeKey]: { url: data.imageUrl, loading: false } });
    } catch (err: any) {
      setError(err.message || 'The magic failed to materialize.');
      setResults({ [typeKey]: { error: err.message || 'Error occurred', loading: false } });
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = !!image && !!selectedType && !isGenerating;
  const stepsDone = [!!image, !!selectedType, !!characterName];
  const selectedMBTIData = MBTI_TYPES.find(m => m.type === selectedType);

  return (
    <div className="app-shell">
      <AmbientBackground />
      <Navbar stepsDone={stepsDone} />

      <header className="hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="hero__eyebrow">
            <span className="hero__line hero__line--left" />
            <span className="hero__tag">MBTI Chibi Generator</span>
            <span className="hero__line hero__line--right" />
          </div>

          <h1 className="hero__title">
            Cute <span className="hero__title-accent">MBTI Chibi</span> Cat
          </h1>

          <p className="hero__subtitle">
            Turn yourself into a cute Chibi character or a mysterious Card Back!
          </p>
        </motion.div>
      </header>

      <main className="main-content">
        <div className="main-content__grid">
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
              <MBTISelector
                selectedType={selectedType}
                onSelect={setSelectedType}
              />
            </div>

            {/* Gen Type Selector */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5 mb-2">
              <button 
                onClick={() => setGenType('Chibi')}
                className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${genType === 'Chibi' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
              >
                Chibi Character
              </button>
              <button 
                onClick={() => setGenType('CardBack')}
                className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${genType === 'CardBack' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
              >
                Mystical Card Back
              </button>
            </div>

            <GenerateButton
              canGenerate={canGenerate}
              isGenerating={isGenerating}
              hasImage={!!image}
              hasCards={!!selectedType}
              onGenerate={generateMBTI}
              accentColor={selectedMBTIData?.color}
              label={genType === 'Chibi' ? "Generate Chibi" : "Generate Card Back"}
            />
          </div>

          <div className="results-panel-container">
            <MBTIResultsPanel
              selectedType={selectedType}
              results={results}
              characterName={characterName.trim()}
              isCardBack={genType === 'CardBack'}
            />
          </div>
        </div>

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
