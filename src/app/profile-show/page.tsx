'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Camera, Sparkles, Download, ArrowRight, CheckCircle2, FolderOpen, Loader2, Play, Pause, X, FileCheck, Archive } from 'lucide-react';
import JSZip from 'jszip';

import AmbientBackground from '@/components/layout/AmbientBackground';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ImageUploader from '@/components/upload/ImageUploader';
import GenerateButton from '@/components/generate/GenerateButton';
import StepLabel from '@/components/ui/StepLabel';

interface BulkItem {
  file: File;
  path: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  resultUrl?: string;
  error?: string;
}

export default function ProfileShowPage() {
  // Mode Selection
  const [mode, setMode] = useState<'single' | 'bulk'>('single');

  // Single Mode State
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Bulk Mode State
  const [bulkItems, setBulkItems] = useState<BulkItem[]>([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Single Mode Generator
  const generateProfile = async () => {
    if (!characterImage) return;
    setIsGenerating(true);
    setError(null);
    setResultImage(null);

    try {
      const res = await fetch('/api/generate-profile-show', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterImage,
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

  // Bulk Mode Handlers
  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newItems: BulkItem[] = Array.from(files)
      .filter(file => file.type.startsWith('image/'))
      .map(file => ({
        file,
        path: (file as any).webkitRelativePath || file.name,
        status: 'pending',
      }));

    setBulkItems(newItems);
    setBulkProgress(0);
  };

  const processBulk = async () => {
    if (isBulkProcessing) return;
    setIsBulkProcessing(true);

    const itemsToProcess = [...bulkItems];
    
    for (let i = 0; i < itemsToProcess.length; i++) {
      const item = itemsToProcess[i];
      if (item.status === 'done') continue;

      setBulkItems(prev => prev.map((it, idx) => 
        idx === i ? { ...it, status: 'processing' } : it
      ));

      try {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(item.file);
        });

        const res = await fetch('/api/generate-profile-show', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ characterImage: base64 }),
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setBulkItems(prev => prev.map((it, idx) => 
          idx === i ? { ...it, status: 'done', resultUrl: data.imageUrl } : it
        ));
      } catch (err: any) {
        setBulkItems(prev => prev.map((it, idx) => 
          idx === i ? { ...it, status: 'error', error: err.message } : it
        ));
      }

      setBulkProgress(Math.round(((i + 1) / itemsToProcess.length) * 100));
      await new Promise(r => setTimeout(r, 1000));
    }

    setIsBulkProcessing(false);
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    const doneItems = bulkItems.filter(item => item.status === 'done' && item.resultUrl);

    for (const item of doneItems) {
      const response = await fetch(item.resultUrl!);
      const blob = await response.blob();
      
      const lastDotIndex = item.path.lastIndexOf('.');
      const nameWithoutExt = item.path.substring(0, lastDotIndex);
      const ext = item.path.substring(lastDotIndex);
      const finalPath = `${nameWithoutExt}_PROFILE${ext}`;
      
      zip.file(finalPath, blob);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = "profile_show_results.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const canGenerate = mode === 'single' ? (!!characterImage && !isGenerating) : (bulkItems.length > 0 && !isBulkProcessing);
  const stepsDone = [
    mode === 'single' ? !!characterImage : bulkItems.length > 0,
    true,
    mode === 'single' ? !!resultImage : bulkItems.some(i => i.status === 'done')
  ];

  return (
    <div className="app-shell">
      {/* Custom blue ambient background for this page */}
      <div className="ambient-bg">
        <div className="ambient-orb absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="ambient-orb absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-500/5 rounded-full blur-[100px] animate-pulse" />
      </div>
      
      <Navbar stepsDone={stepsDone} />

      <header className="hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="hero__eyebrow">
            <span className="hero__line hero__line--left" />
            <span className="hero__tag">Official ID Photo</span>
            <span className="hero__line hero__line--right" />
          </div>

          <h1 className="hero__title">
            Profile <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Show</span>
          </h1>

          <p className="hero__subtitle">
            เปลี่ยนตัวละครของคุณให้เป็นภาพถ่ายหน้าตรง 100% ในชุดเชิ้ตขาวและเนกไทสีดำสุดพรีเมียม
          </p>
        </motion.div>
      </header>

      <main className="main-content">
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <div className="flex p-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl w-fit mx-auto">
            <button
              onClick={() => setMode('single')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'single' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-white/40 hover:text-white/60'}`}
            >
              Single Photo
            </button>
            <button
              onClick={() => setMode('bulk')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'bulk' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-white/40 hover:text-white/60'}`}
            >
              Bulk Processing (@FOLDER)
            </button>
          </div>
        </div>

        <div className="main-content__grid">
          <div className="sidebar-panel">
            {mode === 'single' ? (
              <section className="mb-6">
                <StepLabel step={1} label="Upload Character" done={!!characterImage} />
                <div className="mt-4">
                  <ImageUploader
                    image={characterImage}
                    onUpload={setCharacterImage}
                    onRemove={() => setCharacterImage(null)}
                    label="Character Image"
                  />
                </div>
              </section>
            ) : (
              <section className="mb-6">
                <StepLabel step={1} label="Upload Folder" done={bulkItems.length > 0} />
                <div className="mt-4">
                  <div 
                    onClick={() => folderInputRef.current?.click()}
                    className="group relative h-48 rounded-[2rem] border-2 border-dashed border-white/10 hover:border-blue-500/50 bg-white/5 hover:bg-blue-500/5 flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
                  >
                    <input
                      type="file"
                      ref={folderInputRef}
                      className="hidden"
                      // @ts-ignore
                      webkitdirectory=""
                      // @ts-ignore
                      directory=""
                      multiple
                      onChange={handleFolderUpload}
                    />
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <FolderOpen size={24} className="text-white/40 group-hover:text-blue-400" />
                    </div>
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest group-hover:text-blue-200">
                      Select Project Folder
                    </span>
                    <p className="text-[10px] text-white/20 mt-2">Will process all images recursively</p>
                  </div>
                  {bulkItems.length > 0 && (
                    <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Found {bulkItems.length} Images</span>
                        <button onClick={() => setBulkItems([])} className="text-white/20 hover:text-red-400">
                          <X size={14} />
                        </button>
                      </div>
                      <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                        {bulkItems.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[10px] text-white/40">
                            <span className="truncate max-w-[150px]">{item.path}</span>
                            {item.status === 'processing' && <Loader2 size={10} className="animate-spin text-blue-400" />}
                            {item.status === 'done' && <FileCheck size={10} className="text-green-400" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            <section className="mb-6">
              <StepLabel step={2} label="AI Processing" done={true} />
              <div className="space-y-4 mt-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                       <Sparkles size={16} className="text-blue-400" />
                     </div>
                     <span className="text-xs font-bold text-blue-200 uppercase tracking-widest">Automatic Detection</span>
                   </div>
                   <p className="text-white/40 text-xs leading-relaxed">
                     {mode === 'single' 
                       ? "ระบบจะวิเคราะห์เพศและลักษณะนิสัยของตัวละครโดยอัตโนมัติ เพื่อสร้างภาพที่ถ่ายทอดความเป็นตัวเองออกมาได้ดีที่สุด"
                       : "ระบบจะค่อยๆ ประมวลผลทีละรูปตามลำดับ ไม่ต้องรีบ เพื่อรักษาคุณภาพและความละมุนของงาน"}
                   </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-white/40">
                    <CheckCircle2 size={14} className="text-blue-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">100% Identical Face & Style</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/40">
                    <CheckCircle2 size={14} className="text-blue-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">HQ 4K Resolution</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/40">
                    <CheckCircle2 size={14} className="text-blue-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">White Shirt & Black Tie</span>
                  </div>
                </div>
              </div>
            </section>

            <div className="mt-6">
              <GenerateButton
                canGenerate={canGenerate}
                isGenerating={mode === 'single' ? isGenerating : isBulkProcessing}
                hasImage={mode === 'single' ? !!characterImage : bulkItems.length > 0}
                hasCards={true}
                onGenerate={mode === 'single' ? generateProfile : processBulk}
                accentColor="#3b82f6"
                label={mode === 'single' ? "Generate Profile" : "Start Bulk Processing"}
                loadingLabel={mode === 'single' ? "Creating Magic..." : `Processing ${bulkItems.filter(i => i.status === 'done').length}/${bulkItems.length}`}
              />
            </div>
          </div>

          <div className="results-panel-container">
            <div className="results-panel min-h-[500px] flex items-center justify-center p-8 bg-black/20 backdrop-blur-sm border border-white/5 rounded-[2.5rem]">
              <AnimatePresence mode="wait">
                {mode === 'single' ? (
                  isGenerating ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center text-center"
                    >
                      <div className="relative w-32 h-32 mb-8">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 border-t-2 border-r-2 border-blue-500 rounded-full"
                        />
                        <motion.div
                          animate={{ rotate: -360 }}
                          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-2 border-b-2 border-l-2 border-indigo-500/30 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [0.9, 1.1, 0.9] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Camera size={40} className="text-blue-400/50" />
                        </motion.div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">กำลังเตรียมสตูดิโอ...</h3>
                      <p className="text-white/50 text-sm max-w-xs leading-relaxed">
                        AI กำลังจัดท่าทางและสวมชุดนักเรียนเกาหลีให้กับตัวละครของคุณอย่างพิถีพิถัน
                      </p>
                    </motion.div>
                  ) : resultImage ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full max-w-md mx-auto"
                    >
                      <div className="relative group perspective-1000">
                        <motion.div 
                          whileHover={{ rotateY: 2, rotateX: -2 }}
                          className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-white"
                        >
                          <img
                            src={resultImage}
                            alt="Generated Profile"
                            className="w-full h-auto aspect-[3/4] object-cover"
                          />
                          
                          {/* ID Overlay Label */}
                          <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-black/10 backdrop-blur-md rounded-full border border-white/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-black/60 uppercase tracking-widest">Official ID</span>
                          </div>
                        </motion.div>
                        
                        {/* Floating Decorative Elements */}
                        <div className="absolute -top-6 -right-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-4 rounded-2xl shadow-xl shadow-blue-500/20 z-10 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                          <Sparkles size={24} />
                        </div>
                      </div>
                      
                      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                          href={resultImage}
                          download="profile-show-korean.png"
                          className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                        >
                          <Download size={20} />
                          Download Photo
                        </a>
                        <button
                          onClick={() => {
                            setResultImage(null);
                          }}
                          className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold transition-all"
                        >
                          Create Another
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-[2rem]"
                    >
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 text-white/20">
                        <User size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-white/40 mb-2">Studio Empty</h3>
                      <p className="text-white/20 text-sm max-w-[200px]">
                        Upload your character to see them in a professional ID photo.
                      </p>
                    </motion.div>
                  )
                ) : (
                  <motion.div key="bulk-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-white">Bulk Studio</h3>
                        <p className="text-white/40 text-sm">Processing project folder...</p>
                      </div>
                      {bulkItems.some(i => i.status === 'done') && !isBulkProcessing && (
                        <button
                          onClick={downloadZip}
                          className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-green-600/20 active:scale-95"
                        >
                          <Archive size={20} />
                          Download All (.zip)
                        </button>
                      )}
                    </div>

                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto pr-2 custom-scrollbar max-h-[600px]">
                      {bulkItems.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-white/20">
                          <FolderOpen size={48} className="mb-4" />
                          <p>No images uploaded yet</p>
                        </div>
                      ) : (
                        bulkItems.map((item, idx) => (
                          <div key={idx} className="relative group">
                            <div className={`aspect-[3/4] rounded-2xl overflow-hidden border transition-all duration-500 ${
                              item.status === 'processing' ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 
                              item.status === 'done' ? 'border-green-500/50' : 'border-white/5'
                            }`}>
                              {item.resultUrl ? (
                                <img src={item.resultUrl} className="w-full h-full object-cover" alt={item.path} />
                              ) : (
                                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                  {item.status === 'processing' ? (
                                    <Loader2 size={24} className="animate-spin text-blue-400" />
                                  ) : item.status === 'error' ? (
                                    <X size={24} className="text-red-400" />
                                  ) : (
                                    <Camera size={24} className="text-white/10" />
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-[9px] font-bold text-white/40 truncate w-[80%]">{item.path.split('/').pop()}</span>
                              {item.status === 'done' && <CheckCircle2 size={10} className="text-green-500" />}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {isBulkProcessing && (
                      <div className="mt-8 p-6 rounded-[2rem] bg-blue-600/10 border border-blue-500/20">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Global Progress</span>
                          <span className="text-xs font-bold text-blue-400">{bulkProgress}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${bulkProgress}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-white/40 mt-3 text-center italic">
                          "ค่อยๆ สร้างรูปทีละตัวตามลำดับ ไม่ต้องรีบ เพื่อคุณภาพที่ดีที่สุด"
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Promotional Banner */}
            <div className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-blue-600/10 to-transparent border border-blue-500/20 flex items-center justify-between group">
              <div>
                <h4 className="text-blue-400 font-bold text-sm mb-1">AI Character Consistency</h4>
                <p className="text-white/40 text-xs">Our model preserves your character's unique traits while applying the ID photo style.</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <ArrowRight size={20} />
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
              className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-red-500 text-white rounded-full font-bold shadow-2xl z-50 flex items-center gap-3"
            >
              <span className="w-2 h-2 bg-white rounded-full animate-ping" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
