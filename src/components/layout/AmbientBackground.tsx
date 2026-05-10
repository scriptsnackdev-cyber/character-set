'use client';

import React from 'react';

/**
 * Animated floating orbs and a central glow that sits behind all content.
 */
export default function AmbientBackground() {
  return (
    <div className="ambient-bg" aria-hidden="true">
      <div className="ambient-orb ambient-orb--pink" />
      <div className="ambient-orb ambient-orb--purple" />
      <div className="ambient-orb ambient-orb--center" />
    </div>
  );
}
