'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Star, Sparkles } from 'lucide-react';

import AmbientBackground from '@/components/layout/AmbientBackground';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ImageUploader from '@/components/upload/ImageUploader';
import CharacterNameInput from '@/components/upload/CharacterNameInput';
import GenerateButton from '@/components/generate/GenerateButton';
import SimpleCard from '@/components/results/SimpleCard';
import { CardResult } from '@/lib/tarot-data';

export default function ChibiTalkGenerator() {
  const [images, setImages] = useState<string[]>([]);
  const [characterName, setCharacterName] = useState('');
  const [talkText, setTalkText] = useState('');
  const [theme, setTheme] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<CardResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateChibiTalk = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);
    setError(null);
    setResult({ loading: true });

    try {
      const res = await fetch('/api/generate-chibi-talk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images,
          characterName,
          talkText: talkText.trim(),
          theme: theme.trim()
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

  const canGenerate = images.length > 0 && !isGenerating;
  const stepsDone = [images.length > 0, talkText.trim().length > 0, !!result?.url];

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
            <span className="hero__tag">Chibi Talk System</span>
            <span className="hero__line hero__line--right" />
          </div>

          <h1 className="hero__title">
            Chibi <span className="hero__title-accent">Talk</span>
          </h1>

          <p className="hero__subtitle">
            เนรมิตรูป Chibi จากรูปถ่าย พร้อมใส่คำพูดในใจที่คุณต้องการบอกโลก!
          </p>
        </motion.div>
      </header>

      <main className="main-content">
        <div className="main-content__grid">
          <div className="sidebar-panel">
            <div className="mb-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3 ml-1 block">
                Upload Characters (Max 3)
              </label>
              <div className="grid grid-cols-1 gap-4">
                {[0, 1, 2].map((idx) => (
                  <div key={idx} className={idx > 0 && images.length < idx ? 'opacity-30 pointer-events-none' : ''}>
                    <ImageUploader
                      image={images[idx] || null}
                      onUpload={(url) => {
                        const newImages = [...images];
                        newImages[idx] = url;
                        setImages(newImages.filter(Boolean));
                      }}
                      onRemove={() => {
                        const newImages = images.filter((_, i) => i !== idx);
                        setImages(newImages);
                      }}
                    />
                  </div>
                ))}
              </div>
              {images.length === 0 && (
                <p className="text-[10px] text-white/30 mt-2 ml-1 italic">
                  * อัปโหลดได้สูงสุด 3 รูปเพื่อสร้างภาพกลุ่ม
                </p>
              )}
            </div>

            <CharacterNameInput
              value={characterName}
              onChange={setCharacterName}
            />

            <div className="mt-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3 ml-1 block">
                ธีมภาพ (เช่น วันเกิด, ไปเที่ยว, คริสต์มาส)
              </label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="ระบุธีมภาพ (ไม่ใส่ก็ได้)..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all"
              />
            </div>

            <div className="mt-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3 ml-1 block">
                สิ่งที่อยากพูด (Sticker Style)
              </label>
              <div className="relative">
                <textarea
                  value={talkText}
                  onChange={(e) => setTalkText(e.target.value)}
                  placeholder="พิมพ์ข้อความที่นี่..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all min-h-[100px] resize-none"
                />
                <div className="absolute bottom-3 right-3 opacity-20">
                  <MessageSquare size={16} />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <GenerateButton
                canGenerate={canGenerate}
                isGenerating={isGenerating}
                hasImage={images.length > 0}
                hasCards={true}
                onGenerate={generateChibiTalk}
                accentColor="#a855f7"
                label={isGenerating ? "กำลังเนรมิต..." : "สร้างรูป Chibi"}
              />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-purple-400" />
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Sticker Text</h4>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                ข้อความของคุณจะถูกสร้างเป็นสไตล์ Sticker (ตัวหนังสือขอบขาว ไส้แดง) สุดน่ารักทับลงบนรูป Chibi
              </p>
            </motion.div>
          </div>

          <div className="results-panel-container">
            <div className="results-panel">
              <div className="results-grid results-grid--1">
                {result ? (
                  <SimpleCard
                    title="CHIBI TALK"
                    subtitle={talkText}
                    state={result}
                    characterName={characterName.trim()}
                    accentColor="#a855f7"
                    isMinimal={true}
                  />
                ) : (
                  <div className="results-empty">
                    <div className="results-empty__icon">
                      <MessageSquare size={24} className="text-purple-400" />
                    </div>
                    <p className="results-empty__title">รอกระซิบคำพูด...</p>
                    <p className="results-empty__subtitle">อัพโหลดรูปภาพและพิมพ์ข้อความ เพื่อเริ่มการเนรมิต</p>
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
