'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import AmbientBackground from '@/components/layout/AmbientBackground';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ImageUploader from '@/components/upload/ImageUploader';
import CharacterNameInput from '@/components/upload/CharacterNameInput';
import GenerateButton from '@/components/generate/GenerateButton';
import DaySelector from '@/components/seven-day/DaySelector';
import OutfitSelector from '@/components/seven-day/OutfitSelector';
import StyleSelector from '@/components/seven-day/StyleSelector';
import SevenDayResultsPanel from '@/components/results/SevenDayResultsPanel';
import { CardResult } from '@/lib/tarot-data';
import { SEVEN_DAYS, OUTFITS, STYLES } from '@/lib/seven-day-data';

export default function SevenDayGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [characterName, setCharacterName] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedOutfits, setSelectedOutfits] = useState<string[]>([]);
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

  const toggleDay = (dayId: string) => {
    setSelectedDays(prev => 
      prev.includes(dayId) ? prev.filter(id => id !== dayId) : [...prev, dayId]
    );
  };

  const toggleOutfit = (outfitId: string) => {
    setSelectedOutfits(prev => 
      prev.includes(outfitId) ? prev.filter(id => id !== outfitId) : [...prev, outfitId]
    );
  };

  const generateSevenDay = async () => {
    if (selectedDays.length === 0 || selectedOutfits.length === 0) return;
    setIsGenerating(true);
    setError(null);

    const pairs: string[] = [];
    selectedDays.forEach(d => {
      selectedOutfits.forEach(o => {
        pairs.push(`${d}:${o}`);
      });
    });

    const newResults = { ...results };
    pairs.forEach(p => { newResults[p] = { loading: true }; });
    setResults(newResults);

    try {
      for (const pair of pairs) {
        const [dayId, outfitId] = pair.split(':');
        try {
          const res = await fetch('/api/generate-seven-day', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              dayId,
              outfitId,
              styleId: 'kawaii_digital', // Default to Chibi style as requested
              characterImage: image,
              characterName: characterName
            }),
          });
          
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          
          setResults(prev => ({ ...prev, [pair]: { url: data.imageUrl, loading: false } }));
        } catch (err: any) {
          setResults(prev => ({ ...prev, [pair]: { error: err.message || 'Error occurred', loading: false } }));
        }
      }
    } catch (err: any) {
      setError(err.message || 'การสร้างล้มเหลว ลองใหม่อีกครั้ง');
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedPairs: string[] = [];
  selectedDays.forEach(d => {
    selectedOutfits.forEach(o => {
      selectedPairs.push(`${d}:${o}`);
    });
  });

  const canGenerate = !!image && selectedDays.length > 0 && selectedOutfits.length > 0 && !isGenerating;
  const stepsDone = [!!image, selectedDays.length > 0 && selectedOutfits.length > 0, selectedPairs.some(p => !!results[p]?.url)];
  const lastSelectedDay = selectedDays.length > 0 ? SEVEN_DAYS.find(d => d.id === selectedDays[selectedDays.length - 1]) : null;

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
            <span className="hero__tag">7-Day Color Generator</span>
            <span className="hero__line hero__line--right" />
          </div>

          <h1 className="hero__title">
            Chibi <span className="hero__title-accent">Cross Style</span> Generator
          </h1>

          <p className="hero__subtitle">
            เลือกวันและชุดที่ต้องการ เพื่อสร้างภาพ Chibi หลากหลายสไตล์ในครั้งเดียว!
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
              <DaySelector
                selectedDays={selectedDays}
                onToggle={toggleDay}
              />
            </div>

            <OutfitSelector 
              selectedOutfits={selectedOutfits}
              onToggle={toggleOutfit}
            />

            <div className="mt-6">
              <GenerateButton
                canGenerate={canGenerate}
                isGenerating={isGenerating}
                hasImage={!!image}
                hasCards={selectedDays.length > 0 && selectedOutfits.length > 0}
                onGenerate={generateSevenDay}
                accentColor={lastSelectedDay?.hexColor}
                label="เนรมิตตัวละคร"
              />
            </div>
            
            {lastSelectedDay && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Latest Day Selected</h4>
                <p className="text-sm text-white/80 leading-relaxed">
                  <span className="font-bold" style={{ color: lastSelectedDay.hexColor }}>{lastSelectedDay.nameTh}</span>: {lastSelectedDay.trait}
                </p>
              </motion.div>
            )}
          </div>

          <div className="results-panel-container">
            <SevenDayResultsPanel
              selectedPairs={selectedPairs}
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
