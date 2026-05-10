'use client';

import React from 'react';
import { Star } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__divider">
        <span className="site-footer__line site-footer__line--left" />
        <Star size={8} />
        <span className="site-footer__line site-footer__line--right" />
      </div>
      <span className="site-footer__text">Powered by PurrPaw</span>
    </footer>
  );
}
