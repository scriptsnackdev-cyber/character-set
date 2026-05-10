'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import AmbientBackground from '@/components/layout/AmbientBackground';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ImageUploader from '@/components/upload/ImageUploader';
import CharacterNameInput from '@/components/upload/CharacterNameInput';
import GenerateButton from '@/components/generate/GenerateButton';
import CatBreedSelector from '@/components/cats/CatBreedSelector';
import CatResultsPanel from '@/components/results/CatResultsPanel';
import { CardResult } from '@/lib/tarot-data';
import { CAT_BREEDS } from '@/lib/cat-data';

export default function CatGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [characterName, setCharacterName] = useState('');
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<Record<string, CardResult>>({});
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (dataUrl: string) => {
    setImage(dataUrl);
    setResults({});
  };

  const handleImageRemove = () => {
    setImage(null);
    setResults({});
  };

  const generateCat = async () => {
    if (!selectedBreed) return;
    setIsGenerating(true);
    setError(null);

    const breedId = selectedBreed;
    setResults({ [breedId]: { loading: true } });

    try {
      const res = await fetch('/api/generate-cat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          breedId,
          characterImage: image,
          characterName: characterName
        }),
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setResults({ [breedId]: { url: data.imageUrl, loading: false } });
    } catch (err: any) {
      setError(err.message || 'การสร้างล้มเหลว ลองใหม่อีกครั้ง');
      setResults({ [breedId]: { error: err.message || 'Error occurred', loading: false } });
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = !!image && !!selectedBreed && !isGenerating;
  const stepsDone = [!!image, !!selectedBreed, !!results[selectedBreed || '']?.url];
  const breedData = CAT_BREEDS.find(b => b.id === selectedBreed);

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
            <span className="hero__tag">12 Cat Breeds Generator</span>
            <span className="hero__line hero__line--right" />
          </div>

          <h1 className="hero__title">
            Cute <span className="hero__title-accent">Chibi Cat</span> Breeds
          </h1>

          <p className="hero__subtitle">
            สร้างรูปแมว 12 สายพันธุ์ในสไตล์ Chibi สุดน่ารัก!
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
              <CatBreedSelector
                selectedBreed={selectedBreed}
                onSelect={setSelectedBreed}
              />
            </div>

            <div className="mt-6">
              <GenerateButton
                canGenerate={canGenerate}
                isGenerating={isGenerating}
                hasImage={!!image}
                hasCards={!!selectedBreed}
                onGenerate={generateCat}
                accentColor={breedData?.color}
                label="เนรมิตแมวเหมียว"
              />
            </div>
            
            {breedData && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Breed Insight</h4>
                <p className="text-sm text-white/80 leading-relaxed">{breedData.description}</p>
              </motion.div>
            )}
          </div>

          <div className="results-panel-container">
            <CatResultsPanel
              selectedBreedId={selectedBreed}
              results={results}
              characterName={characterName.trim()}
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
