'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Baby, Sparkles, Wand2 } from 'lucide-react';

import AmbientBackground from '@/components/layout/AmbientBackground';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ImageUploader from '@/components/upload/ImageUploader';
import GenerateButton from '@/components/generate/GenerateButton';
import StepLabel from '@/components/ui/StepLabel';

export default function CharacterPlusPage() {
  const [fatherImage, setFatherImage] = useState<string | null>(null);
  const [motherImage, setMotherImage] = useState<string | null>(null);
  const [age, setAge] = useState('7 Years');
  const [gender, setGender] = useState<'Boy' | 'Girl' | 'Random'>('Random');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateChild = async () => {
    if (!fatherImage || !motherImage) return;
    setIsGenerating(true);
    setError(null);
    setResultImage(null);

    try {
      const res = await fetch('/api/generate-character-plus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fatherImage,
          motherImage,
          age,
          gender: gender === 'Random' ? undefined : gender,
          additionalDetails,
        }),
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setResultImage(data.imageUrl);
    } catch (err: any) {
      setError(err.message || 'การสร้างล้มเหลว ลองใหม่อีกครั้ง');
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = !!fatherImage && !!motherImage && !isGenerating;
  const stepsDone = [!!fatherImage && !!motherImage, !!age, !!resultImage];

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
            <span className="hero__tag">Genetics Evolution</span>
            <span className="hero__line hero__line--right" />
          </div>

          <h1 className="hero__title">
            Character <span className="hero__title-accent">Plus+</span>
          </h1>

          <p className="hero__subtitle">
            ผสมผสานตัวละคร พ่อ และ แม่ เพื่อเนรมิตรูปลูกน้อยในสไตล์ที่เหมือนกันเป๊ะ!
          </p>
        </motion.div>
      </header>

      <main className="main-content">
        <div className="main-content__grid">
          <div className="sidebar-panel">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="space-y-2">
                <ImageUploader
                  image={fatherImage}
                  onUpload={setFatherImage}
                  onRemove={() => setFatherImage(null)}
                  label="Father (พ่อ)"
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <ImageUploader
                  image={motherImage}
                  onUpload={setMotherImage}
                  onRemove={() => setMotherImage(null)}
                  label="Mother (แม่)"
                  step={1}
                />
              </div>
            </div>

            <section className="mb-6">
              <StepLabel step={2} label="Character Details" done={!!age} />
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2 block ml-1">
                    Age / อายุ (e.g. 7 Years)
                  </label>
                  <div className="watermark-input">
                    <input
                      type="text"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 7 Years, Baby, Teenager"
                      className="watermark-input__field"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2 block ml-1">
                    Gender / เพศ
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Boy', 'Girl', 'Random'] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={`py-2 px-1 rounded-xl border text-[10px] font-bold transition-all ${
                          gender === g
                            ? 'bg-purple-500/20 border-purple-500 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                            : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                        }`}
                      >
                        {g === 'Boy' ? 'เด็กชาย' : g === 'Girl' ? 'เด็กหญิง' : 'สุ่ม'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2 block ml-1">
                    Additional Details / รายละเอียดเพิ่มเติม
                  </label>
                  <div className="watermark-input">
                    <textarea
                      value={additionalDetails}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                      placeholder="เช่น ใส่แว่น, ผมสีชมพู, กำลังยิ้ม..."
                      className="watermark-input__field min-h-[100px] py-3 resize-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className="mt-6">
              <GenerateButton
                canGenerate={canGenerate}
                isGenerating={isGenerating}
                hasImage={!!fatherImage && !!motherImage}
                hasCards={true}
                onGenerate={generateChild}
                accentColor="#a855f7"
                label="สร้างรูปลูกน้อย"
                loadingLabel="กำลังให้กำเนิด..."
              />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-purple-400" />
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Style Preservation</h4>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                ระบบจะวิเคราะห์ลายเส้นและสไตล์จากทั้งพ่อและแม่ เพื่อสร้างลูกที่มีลักษณะผสมผสานและคงสไตล์เดิมไว้อย่างสมบูรณ์แบบ
              </p>
            </motion.div>
          </div>

          <div className="results-panel-container">
            <div className="results-panel">
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full min-h-[400px] text-center"
                  >
                    <div className="relative w-24 h-24 mb-6">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-dashed border-purple-500/30 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Baby size={40} className="text-purple-400" />
                      </motion.div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">กำลังถอดรหัสพันธุกรรม...</h3>
                    <p className="text-white/50 text-sm max-w-xs">
                      กำลังผสมผสานลักษณะเด่นจากพ่อและแม่ เพื่อเนรมิตลูกน้อยที่น่ารักที่สุด
                    </p>
                  </motion.div>
                ) : resultImage ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group"
                  >
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-purple-500/10">
                      <img
                        src={resultImage}
                        alt="Generated Child"
                        className="w-full h-auto aspect-[3/4] object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                         <div className="flex items-center gap-3 mb-2">
                           <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                             <Baby size={16} className="text-white" />
                           </div>
                           <div>
                             <h3 className="text-white font-bold text-lg">ลูกน้อย ({age})</h3>
                             <p className="text-white/60 text-xs">ผสมผสานอย่างลงตัว</p>
                           </div>
                         </div>
                      </div>
                    </div>
                    
                    <div className="absolute -top-4 -right-4 bg-purple-500 text-white p-3 rounded-2xl shadow-xl shadow-purple-500/40 z-10">
                      <Sparkles size={20} />
                    </div>
                    
                    <div className="mt-6 flex justify-center">
                      <a
                        href={resultImage}
                        download="character-plus-child.png"
                        className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-white font-bold transition-all"
                      >
                        <Wand2 size={18} />
                        Download Image
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    className="results-empty"
                  >
                    <div className="results-empty__icon">
                      <Users size={24} className="text-purple-400" />
                    </div>
                    <p className="results-empty__title">รอยลโฉมลูกน้อย</p>
                    <p className="results-empty__subtitle">อัพโหลดรูปพ่อและแม่ เพื่อเริ่มกระบวนการเนรมิตลูกน้อยของคุณ</p>
                  </motion.div>
                )}
              </AnimatePresence>
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
