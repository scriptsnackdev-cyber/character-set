'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import AmbientBackground from '@/components/layout/AmbientBackground';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ImageUploader from '@/components/upload/ImageUploader';
import CharacterNameInput from '@/components/upload/CharacterNameInput';
import GenerateButton from '@/components/generate/GenerateButton';
import SBTISelector from '@/components/sbti/SBTISelector';
import SBTIResultsPanel from '@/components/results/SBTIResultsPanel';
import { CardResult } from '@/lib/tarot-data';
import { SBTI_TYPES } from '@/lib/sbti-data';

export default function SBTIGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [characterName, setCharacterName] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
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

  const generateSBTI = async () => {
    if (!selectedType) return;
    setIsGenerating(true);
    setError(null);

    const sbtiId = selectedType;
    setResults({ [sbtiId]: { loading: true } });

    try {
      const res = await fetch('/api/generate-sbti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sbtiId,
          characterImage: image,
          characterName: characterName,
          genType: genType
        }),
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setResults({ [sbtiId]: { url: data.imageUrl, loading: false } });
    } catch (err: any) {
      setError(err.message || 'การสร้างล้มเหลว ลองใหม่อีกครั้ง');
      setResults({ [sbtiId]: { error: err.message || 'Error occurred', loading: false } });
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = !!image && !!selectedType && !isGenerating;
  const stepsDone = [!!image, !!selectedType, !!results[selectedType || '']?.url];
  const typeData = SBTI_TYPES.find(t => t.id === selectedType);

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
            <span className="hero__tag">SBTI Behavioral Gen</span>
            <span className="hero__line hero__line--right" />
          </div>

          <h1 className="hero__title">
            Your <span className="hero__title-accent">Satirical</span> Persona
          </h1>

          <p className="hero__subtitle">
            แปลงร่างเป็นตัวละคร Chibi ตามพฤติกรรมสุดแสบของคุณในสไตล์ SBTI!
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

            <div className="mt-4">
              <SBTISelector
                selectedType={selectedType}
                onSelect={setSelectedType}
              />
            </div>

            {/* Gen Type Selector */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5 mt-4 mb-2">
              <button 
                onClick={() => setGenType('Chibi')}
                className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${genType === 'Chibi' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/60'}`}
              >
                Chibi Character
              </button>
              <button 
                onClick={() => setGenType('CardBack')}
                className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${genType === 'CardBack' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/60'}`}
              >
                Mystical Card Back
              </button>
            </div>

            <div className="mt-6">
              <GenerateButton
                canGenerate={canGenerate}
                isGenerating={isGenerating}
                hasImage={!!image}
                hasCards={!!selectedType}
                onGenerate={generateSBTI}
                accentColor={typeData?.color}
                label={genType === 'Chibi' ? "เนรมิตนิสัย" : "สร้างการ์ดปริศนา"}
              />
            </div>
            
            {typeData && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Behavioral Insight</h4>
                <p className="text-sm text-white/80 leading-relaxed">
                  <span className="font-bold" style={{ color: typeData.color }}>{typeData.nameEn} ({typeData.nameTh})</span>: {typeData.description}
                </p>
              </motion.div>
            )}
          </div>

          <div className="results-panel-container">
            <SBTIResultsPanel
              selectedTypeId={selectedType}
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
