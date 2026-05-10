'use client';

import React from 'react';

interface StepLabelProps {
  step: number;
  label: string;
  done?: boolean;
  count?: number;
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V'];

/**
 * Section heading with a roman-numeral badge, label, optional count chip,
 * and a fading gradient line.
 */
export default function StepLabel({ step, label, done, count }: StepLabelProps) {
  return (
    <div className="step-label">
      <div className={`step-label__badge ${done ? 'step-label__badge--done' : ''}`}>
        <span>{ROMAN[step - 1]}</span>
      </div>
      <span className="step-label__text">{label}</span>
      {count !== undefined && count > 0 && (
        <span className="step-label__count">{count}</span>
      )}
      <div className="step-label__line" />
    </div>
  );
}
