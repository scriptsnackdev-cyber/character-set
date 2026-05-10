'use client';

import React, { useRef } from 'react';
import { Upload, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import StepLabel from '../ui/StepLabel';

interface ImageUploaderProps {
  image: string | null;
  onUpload: (dataUrl: string) => void;
  onRemove: () => void;
  label?: string;
  step?: number;
}

export default function ImageUploader({ image, onUpload, onRemove, label = "Upload Character", step = 1 }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onUpload(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
    >
      <StepLabel step={step} label={label} done={!!image} />

      <div
        onClick={() => !image && fileInputRef.current?.click()}
        className={`uploader ${image ? 'uploader--has-image' : 'uploader--empty'}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          className="uploader__input"
          accept="image/*"
        />

        {!image ? (
          <div className="uploader__placeholder">
            <div className="uploader__icon-wrapper">
              <Upload size={22} />
            </div>
            <span className="uploader__label">DROP OR CLICK</span>
            <span className="uploader__hint">PNG, JPG up to 10 MB</span>
          </div>
        ) : (
          <div className="uploader__preview">
            <img src={image} alt="Character" className="uploader__image" />

            {/* Hover overlay */}
            <div className="uploader__overlay">
              <button
                className="uploader__btn uploader__btn--primary"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              >
                Replace
              </button>
              <button
                className="uploader__btn"
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
              >
                Remove
              </button>
            </div>

            {/* Success badge */}
            <div className="uploader__badge">
              <Check size={13} color="#fff" strokeWidth={3} />
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
