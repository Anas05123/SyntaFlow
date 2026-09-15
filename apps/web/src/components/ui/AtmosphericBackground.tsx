import React from 'react';

export const AtmosphericBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* Primary Top Radial Spotlight */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%) translateZ(0)',
          width: 'clamp(600px, 80vw, 1200px)',
          height: 'clamp(400px, 50vw, 700px)',
          background: 'radial-gradient(ellipse at 50% 30%, rgba(37, 99, 235, 0.18), rgba(0, 212, 255, 0.08) 45%, transparent 72%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Mid-page Ambient Glow (Cyan Accent) */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          right: '-10%',
          transform: 'translateZ(0)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.05) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Lower Page Ambient Glow (Cobalt Accent) */}
      <div
        style={{
          position: 'absolute',
          top: '75%',
          left: '-5%',
          transform: 'translateZ(0)',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.06) 0%, transparent 65%)',
          filter: 'blur(90px)',
        }}
      />

      {/* Global Precision Technical Dot Grid */}
      <div
        className="sf-dot-grid"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.45,
          maskImage: 'radial-gradient(ellipse at 50% 30%, black 20%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 30%, black 20%, transparent 85%)',
        }}
      />
    </div>
  );
};
