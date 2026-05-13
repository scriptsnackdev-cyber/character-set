'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Image as ImageIcon, Sparkles, Info, MessageSquare } from 'lucide-react';

import AmbientBackground from '@/components/layout/AmbientBackground';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ImageUploader from '@/components/upload/ImageUploader';
import GenerateButton from '@/components/generate/GenerateButton';
import SimpleCard from '@/components/results/SimpleCard';
import { CardResult } from '@/lib/tarot-data';

export default function ImageEditPage() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<CardResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = async () => {
    if (!sourceImage || !prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    setResult({ loading: true });

    try {
      const res = await fetch('/api/image-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: sourceImage,
          prompt: prompt.trim()
        }),
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setResult({ url: data.imageUrl, loading: false });
    } catch (err: any) {
      setError(err.message || 'การแก้ไขภาพล้มเหลว ลองใหม่อีกครั้ง');
      setResult(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = !!sourceImage && !!prompt.trim() && !isGenerating;
  const stepsDone = [!!sourceImage, !!prompt.trim(), !!result?.url];

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
            <Wand2 size={12} className="text-violet-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Magic Image Editor</span>
          </div>

          <h1 className="hero__title text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            Image<span className="hero__title-accent bg-gradient-to-r from-violet-200 via-purple-400 to-fuchsia-500 bg-clip-text text-transparent">Editor</span>
          </h1>

          <p className="hero__subtitle max-w-2xl mx-auto text-lg text-white/60 leading-relaxed">
            อัพโหลดรูปภาพและพิมพ์คำสั่งที่ต้องการแก้ไข 
            AI จะจัดการเปลี่ยนภาพของคุณตามคำสั่งโดยยังคงรายละเอียดเดิมไว้ให้มากที่สุด
          </p>
        </motion.div>
      </header>

      <main className="main-content container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="grid grid-cols-1 gap-6">
              {/* Image Upload */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="space-y-3"
              >
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">
                  <ImageIcon size={14} className="text-violet-400/60" />
                  Source Image
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-violet-500/20 to-purple-500/0 rounded-[22px] blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative">
                    <ImageUploader
                      image={sourceImage}
                      onUpload={setSourceImage}
                      onRemove={() => setSourceImage(null)}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Prompt Input */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">
                  <MessageSquare size={14} className="text-violet-400/60" />
                  What to edit?
                </label>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="เช่น เปลี่ยนสีผมเป็นสีแดง, เพิ่มแว่นตา, เปลี่ยนพื้นหลังเป็นชายหาด..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all min-h-[120px] resize-none"
                  />
                  <div className="absolute bottom-4 right-4 pointer-events-none opacity-20">
                    <Sparkles size={18} className="text-violet-400" />
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="pt-4">
              <GenerateButton
                canGenerate={canGenerate}
                isGenerating={isGenerating}
                hasImage={!!sourceImage}
                hasCards={true}
                onGenerate={handleEdit}
                accentColor="#8b5cf6"
                label={isGenerating ? "กำลังแก้ไขภาพ..." : "เริ่มการแก้ไข"}
              />
            </div>

            {/* Info Box */}
            <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/10 flex gap-4">
              <div className="mt-0.5 text-violet-500">
                <Info size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-violet-200/80 uppercase tracking-widest">Editing Tips</h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  ระบุสิ่งที่ต้องการเปลี่ยนให้ชัดเจน เช่น "เปลี่ยนสีเสื้อเป็นสีฟ้า" หรือ "เพิ่มหมวกแก๊ปสีดำ" 
                  เพื่อให้ AI เข้าใจและแก้ไขได้ตรงจุดที่สุด
                </p>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-7 h-full min-h-[600px]">
            <div className="sticky top-24 h-full">
              <div className="h-full rounded-[32px] bg-white/[0.02] border border-white/5 p-8 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_70%)] pointer-events-none"></div>
                
                {result ? (
                  <div className="w-full h-full flex flex-col items-center">
                    <SimpleCard
                      title="EDITED RESULT"
                      subtitle={prompt}
                      state={result}
                      characterName="Magic Edit"
                      accentColor="#8b5cf6"
                      isMinimal={true}
                    />
                  </div>
                ) : (
                  <div className="text-center space-y-6 relative z-10">
                    <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                      <Wand2 size={40} className="text-white/20 group-hover:text-violet-500/40 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-medium text-white/80">พร้อมสำหรับการแก้ไขภาพ</p>
                      <p className="text-sm text-white/40">อัพโหลดรูปภาพและพิมพ์คำสั่งเพื่อดูความมหัศจรรย์</p>
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
