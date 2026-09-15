import React, { useRef, useState, useCallback } from 'react';

export interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: string;
  className?: string;
  interactive?: boolean;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  glowColor = 'rgba(0, 212, 255, 0.12)',
  className = '',
  interactive = true,
  style,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setCoords({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [interactive]
  );

  const handleMouseEnter = useCallback(() => {
    if (interactive) setIsHovered(true);
  }, [interactive]);

  const handleMouseLeave = useCallback(() => {
    if (interactive) {
      setIsHovered(false);
      setCoords({ x: -1000, y: -1000 });
    }
  }, [interactive]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`sf-glass-panel ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color var(--duration-normal) var(--ease-spring), transform var(--duration-normal) var(--ease-spring), box-shadow var(--duration-normal) var(--ease-spring)',
        borderColor: isHovered ? 'rgba(0, 212, 255, 0.35)' : 'var(--color-border)',
        transform: isHovered && interactive ? 'translateY(-2px)' : 'none',
        boxShadow: isHovered && interactive ? '0 20px 48px -12px rgba(0, 0, 0, 0.75), 0 0 24px rgba(0, 212, 255, 0.1)' : undefined,
        ...style,
      }}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Layer */}
      {interactive && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity var(--duration-normal) ease',
            background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 70%)`,
            zIndex: 1,
          }}
        />
      )}

      {/* Content wrapper */}
      <div style={{ position: 'relative', zIndex: 2, height: '100%' }}>{children}</div>
    </div>
  );
};
