'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cake, Sparkles } from 'lucide-react';

import AmbientBackground from '@/components/layout/AmbientBackground';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ImageUploader from '@/components/upload/ImageUploader';
import CharacterNameInput from '@/components/upload/CharacterNameInput';
import GenerateButton from '@/components/generate/GenerateButton';
import SimpleCard from '@/components/results/SimpleCard';
import { CardResult } from '@/lib/tarot-data';

export default function BirthdayGenerator() {
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [characterName, setCharacterName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<Record<string, CardResult>>({});
  const [error, setError] = useState<string | null>(null);

  const generateBirthday = async () => {
    if (!image1 && !image2) return;
    setIsGenerating(true);
    setError(null);

    const resultId = 'birthday-result';
    setResults({ [resultId]: { loading: true } });

    try {
      const res = await fetch('/api/generate-birthday', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image1,
          image2,
          characterName: characterName
        }),
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setResults({ [resultId]: { url: data.imageUrl, loading: false } });
    } catch (err: any) {
      setError(err.message || 'การสร้างล้มเหลว ลองใหม่อีกครั้ง');
      setResults({ [resultId]: { error: err.message || 'Error occurred', loading: false } });
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = (!!image1 || !!image2) && !isGenerating;
  const stepsDone = [!!image1 || !!image2, characterName.length > 0, !!results['birthday-result']?.url];

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
            <span className="hero__tag">Birthday Celebration</span>
            <span className="hero__line hero__line--right" />
          </div>

          <h1 className="hero__title">
            Birthday <span className="hero__title-accent">Magic</span>
          </h1>

          <p className="hero__subtitle">
            ใส่รูปตัวละคร (1 หรือ 2 ตัว) เพื่อฉลองวันเกิดด้วยเค้กสุดน่ารัก!
          </p>
        </motion.div>
      </header>

      <main className="main-content">
        <div className="main-content__grid">
          <div className="sidebar-panel">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3 ml-1">Character 1</h3>
                <ImageUploader
                  image={image1}
                  onUpload={setImage1}
                  onRemove={() => setImage1(null)}
                />
              </div>
              
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3 ml-1">Character 2 (Optional)</h3>
                <ImageUploader
                  image={image2}
                  onUpload={setImage2}
                  onRemove={() => setImage2(null)}
                />
              </div>
            </div>

            <CharacterNameInput 
              value={characterName} 
              onChange={setCharacterName} 
            />

            <div className="mt-6">
              <GenerateButton
                canGenerate={canGenerate}
                isGenerating={isGenerating}
                hasImage={!!image1 || !!image2}
                hasCards={true}
                onGenerate={generateBirthday}
                accentColor="#ff85a1"
                label="เป่าเค้กวันเกิด"
              />
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <Cake size={16} className="text-pink-400" />
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Birthday Wish</h4>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                สร้างภาพตัวละครของคุณถือเค้กวันเกิดสุดคาวาอี้ พร้อมบรรยากาศเฉลิมฉลองแสนอบอุ่น
              </p>
            </motion.div>
          </div>

          <div className="results-panel-container">
            <div className="results-panel">
              <SimpleCard
                title="Happy Birthday"
                subtitle="Birthday Celebration"
                state={results['birthday-result']}
                characterName={characterName.trim()}
                accentColor="#ff85a1"
              />
            </div>
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
