'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shirt, User, Sparkles, Wand2, Info } from 'lucide-react';

import AmbientBackground from '@/components/layout/AmbientBackground';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ImageUploader from '@/components/upload/ImageUploader';
import GenerateButton from '@/components/generate/GenerateButton';
import SimpleCard from '@/components/results/SimpleCard';
import { CardResult } from '@/lib/tarot-data';

export default function PureWarePage() {
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [outfitImage, setOutfitImage] = useState<string | null>(null);
  const [additionalRequests, setAdditionalRequests] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<CardResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generatePureWare = async () => {
    if (!characterImage || !outfitImage) return;
    setIsGenerating(true);
    setError(null);
    setResult({ loading: true });

    try {
      const res = await fetch('/api/pureware', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterImage,
          outfitImage,
          additionalRequests: additionalRequests.trim()
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

  const canGenerate = !!characterImage && !!outfitImage && !isGenerating;
  const stepsDone = [!!characterImage, !!outfitImage, !!result?.url];

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
            <Sparkles size={12} className="text-amber-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">PureWare Virtual Dressing</span>
          </div>

          <h1 className="hero__title text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            Pure<span className="hero__title-accent bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Ware</span>
          </h1>

          <p className="hero__subtitle max-w-2xl mx-auto text-lg text-white/60 leading-relaxed">
            อัพโหลดรูปตัวละครและชุดที่คุณต้องการ เปลี่ยนลุคใหม่ให้ตัวละครของคุณได้ทันที 
            ด้วยเทคโนโลยี AI ที่เนียนที่สุด ไม่ใช่แค่การตัดแปะ
          </p>
        </motion.div>
      </header>

      <main className="main-content container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
              {/* Character Upload */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="space-y-3"
              >
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">
                  <User size={14} className="text-amber-400/60" />
                  Character Image
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-500/20 to-yellow-500/0 rounded-[22px] blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative">
                    <ImageUploader
                      image={characterImage}
                      onUpload={setCharacterImage}
                      onRemove={() => setCharacterImage(null)}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Outfit Upload */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="space-y-3"
              >
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">
                  <Shirt size={14} className="text-amber-400/60" />
                  Outfit Image
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-yellow-500/20 to-amber-500/0 rounded-[22px] blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative">
                    <ImageUploader
                      image={outfitImage}
                      onUpload={setOutfitImage}
                      onRemove={() => setOutfitImage(null)}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Additional Requests */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">
                <Wand2 size={14} className="text-amber-400/60" />
                Additional Details (Optional)
              </label>
              <div className="relative">
                <textarea
                  value={additionalRequests}
                  onChange={(e) => setAdditionalRequests(e.target.value)}
                  placeholder="เช่น อยากให้ใส่หมวกเพิ่ม, เสื้อข้างในสีขาว, หรือฉากหลังเป็นสวนดอกไม้..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all min-h-[120px] resize-none"
                />
                <div className="absolute bottom-4 right-4 pointer-events-none opacity-20">
                  <Sparkles size={18} className="text-amber-400" />
                </div>
              </div>
            </motion.div>

            <div className="pt-4">
              <GenerateButton
                canGenerate={canGenerate}
                isGenerating={isGenerating}
                hasImage={!!characterImage && !!outfitImage}
                hasCards={true}
                onGenerate={generatePureWare}
                accentColor="#f59e0b"
                label={isGenerating ? "กำลังเปลี่ยนชุด..." : "เริ่มการเปลี่ยนชุด"}
              />
            </div>

            {/* Info Box */}
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-4">
              <div className="mt-0.5 text-amber-500">
                <Info size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-200/80 uppercase tracking-widest">How it works</h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  AI จะทำการวิเคราะห์โครงสร้างร่างกายจากรูปตัวละคร และนำรายละเอียดของชุดมาสวมใส่ให้อย่างเป็นธรรมชาติ 
                  โดยยังคงเอกลักษณ์ของใบหน้าและสีผมเดิมไว้
                </p>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-7 h-full min-h-[600px]">
            <div className="sticky top-24 h-full">
              <div className="h-full rounded-[32px] bg-white/[0.02] border border-white/5 p-8 flex flex-col items-center justify-center relative overflow-hidden group">
                {/* Decorative background for result area */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.05),transparent_70%)] pointer-events-none"></div>
                
                {result ? (
                  <div className="w-full h-full flex flex-col items-center">
                    <SimpleCard
                      title="PUREWARE"
                      subtitle={additionalRequests || "Custom Outfit Swap"}
                      state={result}
                      characterName="Fashion Model"
                      accentColor="#f59e0b"
                      isMinimal={true}
                    />
                  </div>
                ) : (
                  <div className="text-center space-y-6 relative z-10">
                    <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                      <Shirt size={40} className="text-white/20 group-hover:text-amber-500/40 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-medium text-white/80">พร้อมสำหรับการเปลี่ยนโฉม</p>
                      <p className="text-sm text-white/40">อัพโหลดรูปภาพและกดปุ่มด้านซ้ายเพื่อดูผลลัพธ์</p>
                    </div>
                    
                    {/* Placeholder skeletons */}
                    <div className="flex gap-4 justify-center opacity-30 mt-8">
                      <div className="w-20 h-28 rounded-xl bg-white/5 animate-pulse"></div>
                      <div className="w-20 h-28 rounded-xl bg-white/5 animate-pulse delay-75"></div>
                      <div className="w-20 h-28 rounded-xl bg-white/5 animate-pulse delay-150"></div>
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
