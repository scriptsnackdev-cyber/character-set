'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star } from 'lucide-react';

import AmbientBackground from '@/components/layout/AmbientBackground';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ImageUploader from '@/components/upload/ImageUploader';
import CharacterNameInput from '@/components/upload/CharacterNameInput';
import GenerateButton from '@/components/generate/GenerateButton';
import SimpleCard from '@/components/results/SimpleCard';
import { CardResult } from '@/lib/tarot-data';

const ROLES = ['Seme', 'Uke', 'Switch'] as const;
type RoleType = typeof ROLES[number];

export default function ChibiPollGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [characterName, setCharacterName] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<RoleType[]>(['Uke']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<Record<string, CardResult>>({});
  const [error, setError] = useState<string | null>(null);

  const toggleRole = (role: RoleType) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role) 
        : [...prev, role]
    );
  };

  const generateChibiPoll = async () => {
    if (!image || selectedRoles.length === 0) return;
    setIsGenerating(true);
    setError(null);

    // Initial loading state for all selected roles
    const initialResults = { ...results };
    selectedRoles.forEach(role => {
      initialResults[role] = { loading: true };
    });
    setResults(initialResults);

    try {
      // Sequential generation like 7-day project
      for (const role of selectedRoles) {
        try {
          const res = await fetch('/api/generate-chibi-poll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image,
              characterName: characterName,
              role: role
            }),
          });
          
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          
          setResults(prev => ({ 
            ...prev, 
            [role]: { url: data.imageUrl, loading: false } 
          }));
        } catch (err: any) {
          setResults(prev => ({ 
            ...prev, 
            [role]: { error: err.message || 'Error occurred', loading: false } 
          }));
        }
      }
    } catch (err: any) {
      setError(err.message || 'การสร้างล้มเหลว ลองใหม่อีกครั้ง');
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = !!image && selectedRoles.length > 0 && !isGenerating;
  const stepsDone = [!!image, selectedRoles.length > 0, Object.values(results).some(r => r.url)];

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
            <span className="hero__tag">Chibi Poll System</span>
            <span className="hero__line hero__line--right" />
          </div>

          <h1 className="hero__title">
            Uke / Seme <span className="hero__title-accent">Poll</span>
          </h1>

          <p className="hero__subtitle">
            แปลงร่างเป็น Chibi พร้อมเฟรมชมพูสุดน่ารักและระบุสถานะ เมะ/เคะ ของคุณ!
          </p>
        </motion.div>
      </header>

      <main className="main-content">
        <div className="main-content__grid">
          <div className="sidebar-panel">
            <ImageUploader
              image={image}
              onUpload={setImage}
              onRemove={() => setImage(null)}
            />

            <CharacterNameInput
              value={characterName}
              onChange={setCharacterName}
            />

            <div className="mt-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3 ml-1">Select Roles (Multi-select)</h3>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => toggleRole(role)}
                    className={`py-3 px-2 rounded-xl border text-[10px] font-bold transition-all ${
                      selectedRoles.includes(role)
                        ? 'bg-pink-500/20 border-pink-500 text-pink-200 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                        : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                    }`}
                  >
                    {role === 'Seme' ? 'เมะ (Seme)' : role === 'Uke' ? 'เคะ (Uke)' : 'รับ/รุก (Switch)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <GenerateButton
                canGenerate={canGenerate}
                isGenerating={isGenerating}
                hasImage={!!image}
                hasCards={selectedRoles.length > 0}
                onGenerate={generateChibiPoll}
                accentColor="#ec4899"
                label={isGenerating ? "กำลังเนรมิต..." : "เนรมิตสถานะ"}
              />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <Heart size={16} className="text-pink-400" />
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Pink Aesthetic</h4>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                สร้างรูป Chibi ในเฟรมสีชมพูสุดหวาน สามารถเลือกได้หลายสถานะเพื่อเปรียบเทียบความน่ารัก!
              </p>
            </motion.div>
          </div>

          <div className="results-panel-container">
            <div className="results-panel">
              <div className={`results-grid ${selectedRoles.length > 1 ? 'results-grid--2' : 'results-grid--1'}`}>
                {selectedRoles.map((role) => (
                  <SimpleCard
                    key={role}
                    title={role === 'Seme' ? 'SEME (เมะ)' : role === 'Uke' ? 'UKE (เคะ)' : 'SWITCH (รับ/รุก)'}
                    subtitle=""
                    state={results[role]}
                    characterName={characterName.trim()}
                    accentColor="#ec4899"
                  />
                ))}
                
                {selectedRoles.length === 0 && (
                   <div className="results-empty">
                    <div className="results-empty__icon">
                      <Heart size={24} className="text-pink-400" />
                    </div>
                    <p className="results-empty__title">ยังไม่ได้เลือกสถานะ</p>
                    <p className="results-empty__subtitle">เลือกสถานะที่คุณต้องการ เพื่อเริ่มการเนรมิตรูป Chibi</p>
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
