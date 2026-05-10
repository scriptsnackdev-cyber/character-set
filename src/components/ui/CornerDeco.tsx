'use client';

import React from 'react';

/**
 * Corner decorations for tarot card frames.
 * Renders L-shaped accents in all four corners.
 */
export default function CornerDeco() {
  return (
    <>
      {/* top-left */}
      <div className="corner-deco corner-deco--tl" />
      {/* top-right */}
      <div className="corner-deco corner-deco--tr" />
      {/* bottom-left */}
      <div className="corner-deco corner-deco--bl" />
      {/* bottom-right */}
      <div className="corner-deco corner-deco--br" />
    </>
  );
}
