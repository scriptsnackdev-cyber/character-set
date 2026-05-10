'use client';

import React from 'react';
import StepLabel from '../ui/StepLabel';

interface CharacterNameInputProps {
  value: string;
  onChange: (val: string) => void;
}

export default function CharacterNameInput({ value, onChange }: CharacterNameInputProps) {
  return (
    <section>
      <StepLabel step={2} label="Enter Character Name" done={value.trim().length > 0} />
      <div className="watermark-input">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. PurrPaw (appears on top left)"
          className="watermark-input__field"
        />
      </div>
    </section>
  );
}
