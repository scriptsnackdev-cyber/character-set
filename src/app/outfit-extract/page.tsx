'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shirt, User, Sparkles, Info, Download } from 'lucide-react';

import AmbientBackground from '@/components/layout/AmbientBackground';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ImageUploader from '@/components/upload/ImageUploader';
import GenerateButton from '@/components/generate/GenerateButton';
import SimpleCard from '@/components/results/SimpleCard';
import { CardResult } from '@/lib/tarot-data';

export default function OutfitExtractPage() {
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<CardResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateOutfit = async () => {
    if (!characterImage) return;
    setIsGenerating(true);
    setError(null);
    setResult({ loading: true });

    try {
      const res = await fetch('/api/outfit-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterImage }),
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setResult({ url: data.imageUrl, loading: false });
    } catch (err: any) {
      setError(err.message || 'การสกัดชุดล้มเหลว ลองใหม่อีกครั้ง');
      setResult(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = !!characterImage && !isGenerating;
  const stepsDone = [!!characterImage, !!result?.url];

  return (
    <div className="app-shell min-h-screen bg-[#08070c]">
      <AmbientBackground />
      <Navbar stepsDone={stepsDone} />

      <header className="hero pt-20 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <div className="hero__eyebrow inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <Shirt size={12} className="text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Outfit Extractor</span>
          </div>

          <h1 className="hero__title text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            Outfit<span className="hero__title-accent bg-gradient-to-r from-emerald-200 via-teal-400 to-emerald-500 bg-clip-text text-transparent">Extract</span>
          </h1>

          <p className="hero__subtitle max-w-2xl mx-auto text-lg text-white/60 leading-relaxed">
            อัพโหลดรูปตัวละครเพื่อสกัดเอาแค่ชุด เสื้อผ้า และเครื่องประดับออกมา 
            บนพื้นหลังสีขาวสะอาดตา สำหรับนำไปใช้งานต่อได้ทันที
          </p>
        </motion.div>
      </header>

      <main className="main-content container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="grid grid-cols-1 gap-6">
              {/* Character Upload */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="space-y-3"
              >
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">
                  <User size={14} className="text-emerald-400/60" />
                  Character Image (Source)
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/20 to-teal-500/0 rounded-[22px] blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative">
                    <ImageUploader
                      image={characterImage}
                      onUpload={setCharacterImage}
                      onRemove={() => setCharacterImage(null)}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="pt-4">
              <GenerateButton
                canGenerate={canGenerate}
                isGenerating={isGenerating}
                hasImage={!!characterImage}
                hasCards={true}
                onGenerate={generateOutfit}
                accentColor="#10b981"
                label={isGenerating ? "กำลังสกัดชุด..." : "เริ่มการสกัดชุด"}
              />
            </div>

            {/* Info Box */}
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex gap-4">
              <div className="mt-0.5 text-emerald-500">
                <Info size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-emerald-200/80 uppercase tracking-widest">How it works</h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  AI จะวิเคราะห์เสื้อผ้าที่ตัวละครสวมอยู่ และทำการลบตัวละครออกเพื่อสร้างภาพชุดที่จัดวางอย่างสวยงามบนพื้นหลังสีขาว 
                  เหมือนภาพถ่ายสินค้าในสตูดิโอ
                </p>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-7 h-full min-h-[600px]">
            <div className="sticky top-24 h-full">
              <div className="h-full rounded-[32px] bg-white/[0.02] border border-white/5 p-8 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)] pointer-events-none"></div>
                
                {result ? (
                  <div className="w-full h-full flex flex-col items-center">
                    <SimpleCard
                      title="OUTFIT ASSET"
                      subtitle="Extracted clothing items"
                      state={result}
                      characterName="Clothing Set"
                      accentColor="#10b981"
                      isMinimal={true}
                    />
                    
                    {!result.loading && result.url && (
                      <motion.a
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        href={result.url}
                        download="extracted-outfit.png"
                        className="mt-6 flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold transition-all active:scale-95"
                      >
                        <Download size={16} />
                        Download Image
                      </motion.a>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-6 relative z-10">
                    <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                      <Shirt size={40} className="text-white/20 group-hover:text-emerald-500/40 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-medium text-white/80">พร้อมสำหรับการสกัดชุด</p>
                      <p className="text-sm text-white/40">อัพโหลดรูปภาพตัวละครและกดปุ่มเพื่อเริ่ม</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium backdrop-blur-xl z-50 shadow-2xl"
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
