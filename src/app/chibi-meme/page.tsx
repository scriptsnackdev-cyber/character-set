'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Sparkles, Smile } from 'lucide-react';

import AmbientBackground from '@/components/layout/AmbientBackground';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ImageUploader from '@/components/upload/ImageUploader';
import CharacterNameInput from '@/components/upload/CharacterNameInput';
import GenerateButton from '@/components/generate/GenerateButton';
import SimpleCard from '@/components/results/SimpleCard';
import { CardResult } from '@/lib/tarot-data';

export default function ChibiMemeGenerator() {
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [memeImage, setMemeImage] = useState<string | null>(null);
  const [characterName, setCharacterName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<CardResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateChibiMeme = async () => {
    if (!characterImage || !memeImage) return;
    setIsGenerating(true);
    setError(null);
    setResult({ loading: true });

    try {
      const res = await fetch('/api/generate-chibi-meme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterImage,
          memeImage,
        }),
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setResult({ url: data.imageUrl, loading: false });
    } catch (err: any) {
      setError(err.message || 'การสร้างล้มเหลว ลองใหม่อีกครั้ง');
      setResult(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = !!characterImage && !!memeImage && !isGenerating;
  const stepsDone = [!!characterImage, !!memeImage, !!result?.url];

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
            <span className="hero__tag">Chibi Meme System</span>
            <span className="hero__line hero__line--right" />
          </div>

          <h1 className="hero__title">
            Meme <span className="hero__title-accent">Generator</span>
          </h1>

          <p className="hero__subtitle">
            เปลี่ยนคุณให้เป็นมีม! อัปโหลดรูปตัวละครและรูปมีมที่ชอบ ระบบจะพาคุณไปอยู่ในโลกของมีมนั้นทันที
          </p>
        </motion.div>
      </header>

      <main className="main-content">
        <div className="main-content__grid">
          <div className="sidebar-panel">
            <div className="space-y-6">
              <ImageUploader
                image={characterImage}
                onUpload={setCharacterImage}
                onRemove={() => setCharacterImage(null)}
                label="รูปตัวละครของคุณ"
                step={1}
              />

              <ImageUploader
                image={memeImage}
                onUpload={setMemeImage}
                onRemove={() => setMemeImage(null)}
                label="รูปมีมต้นฉบับ"
                step={2}
              />
            </div>

            <div className="mt-6">
              <CharacterNameInput
                value={characterName}
                onChange={setCharacterName}
              />
            </div>

            <div className="mt-6">
              <GenerateButton
                canGenerate={canGenerate}
                isGenerating={isGenerating}
                hasImage={!!characterImage && !!memeImage}
                hasCards={true}
                onGenerate={generateChibiMeme}
                accentColor="#f59e0b"
                label={isGenerating ? "กำลังสร้างมีม..." : "สร้างรูป Meme"}
              />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <Smile size={16} className="text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Meme Magic</h4>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                ระบบจะวิเคราะห์ท่าทาง แสง และอารมณ์จากมีมต้นฉบับ และเปลี่ยนตัวละครให้เข้าไปอยู่ในนั้นอย่างแนบเนียน
              </p>
            </motion.div>
          </div>

          <div className="results-panel-container">
            <div className="results-panel">
              <div className="results-grid results-grid--1">
                {result ? (
                  <SimpleCard
                    title="MEME GENERATOR"
                    subtitle="Meme Generated"
                    state={result}
                    characterName={characterName.trim()}
                    accentColor="#f59e0b"
                    isMinimal={true}
                  />
                ) : (
                  <div className="results-empty">
                    <div className="results-empty__icon">
                      <ImageIcon size={24} className="text-amber-400" />
                    </div>
                    <p className="results-empty__title">รอกลายร่างเป็นมีม...</p>
                    <p className="results-empty__subtitle">อัปโหลดรูปตัวละครและรูปมีมต้นฉบับ เพื่อเริ่มการเนรมิต</p>
                  </div>
                )}
              </div>
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
