/**
 * CoreDesk Authentication Hero Visual
 *
 * Centered compact lifecycle orbit emblem matching the reference design:
 * - Exact center: CoreDesk 3D ribbon mark with radiating water concentric waves
 * - Compact circular lifecycle orbit (R = 96px)
 * - Six lifecycle nodes evenly spaced with symmetric geometry (Client 248°, Proposal 292°, Agreement 0°, Project 68°, Review 112°, Delivery 180°)
 * - Sleek circular container badges with custom line icons
 * - Active arc: Glowing cobalt/cyan section with traveling signal particle and directional chevron
 * - Persistent shiny nodes for active signal (Proposal & Agreement) with interactive hover focus and tooltips
 */

import React, { useId, useState } from 'react';

import { BRAND_MARK_SRC } from '../ui/brandAssets';

export interface LifecycleNode {
  id: string;
  angleDeg: number;
  label: string;
  description: string;
  icon: (color: string) => React.ReactNode;
}

const NODES: LifecycleNode[] = [
  {
    id: 'client',
    angleDeg: 248,
    label: 'Client',
    description: 'The relationship',
    icon: (color) => (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="6.8" r="3.2" stroke={color} strokeWidth="1.6" />
        <path
          d="M4.5 16.2c0-3 2.5-4.8 5.5-4.8s5.5 1.8 5.5 4.8"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'proposal',
    angleDeg: 292,
    label: 'Proposal',
    description: 'A shared direction',
    icon: (color) => (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
        <path
          d="M6 3.5h5.5l4 4V16.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1Z"
          stroke={color}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M11.5 3.5v4h4" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M8 11.2h4M8 13.8h3" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'agreement',
    angleDeg: 0,
    label: 'Agreement',
    description: 'Scope, settled',
    icon: (color) => (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
        <path
          d="M6 3.5h5.5l4 4V16.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1Z"
          stroke={color}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M11.5 3.5v4h4" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
        <path
          d="M7.8 13.8c1-1 2.2-.4 3-.9s1.8.4 2.4-.6"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'project',
    angleDeg: 68,
    label: 'Project',
    description: 'Work in motion',
    icon: (color) => (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
        <path
          d="M3.5 6.5A1.2 1.2 0 0 1 4.7 5.3h3l1.5 1.7h6a1.2 1.2 0 0 1 1.2 1.2v6.6a1.2 1.2 0 0 1-1.2 1.2H4.7a1.2 1.2 0 0 1-1.2-1.2Z"
          stroke={color}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'review',
    angleDeg: 112,
    label: 'Review',
    description: 'Every version, kept',
    icon: (color) => (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
        <circle cx="9.2" cy="9.2" r="4.8" stroke={color} strokeWidth="1.6" />
        <path d="m12.8 12.8 3.8 3.8" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'delivery',
    angleDeg: 180,
    label: 'Delivery',
    description: 'The approved work',
    icon: (color) => (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 3.2 16.5 6.8v6.4L10 16.8 3.5 13.2V6.8Z"
          stroke={color}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M3.5 6.8 10 10.4l6.5-3.6M10 10.4v6.4"
          stroke={color}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

// Coordinate system for grand spacious orbit: 660 x 560 (fills the full left pane)
const CX = 330;
const CY = 270;
const R = 215;

export interface CoreDeskHeroOrbitProps {
  animate?: boolean;
  activeStage?: 'proposal-agreement' | string;
}

export function CoreDeskHeroOrbit({
  animate = true,
  activeStage = 'proposal-agreement',
}: CoreDeskHeroOrbitProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const gradActive = useId();
  const centerGrad = useId();
  const idleBadgeFill = useId();
  const idleBadgeStroke = useId();

  const isNodeActive = (nodeId: string) => {
    const isDefaultActive =
      activeStage === 'proposal-agreement'
        ? nodeId === 'proposal' || nodeId === 'agreement'
        : activeStage === nodeId;
    return isDefaultActive || hoveredNode === nodeId;
  };

  const isNodeHovered = (nodeId: string) => hoveredNode === nodeId;

  // Helper to compute (x, y) on the circle
  const getNodeCoord = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x: CX + R * Math.cos(rad),
      y: CY + R * Math.sin(rad),
    };
  };

  // The active arc is between Proposal (292°) and Agreement (360°)
  const proposalCoord = getNodeCoord(292);
  const agreementCoord = getNodeCoord(360);

  // Position for the direction arrow on the active arc (~338°)
  const arrowRad = (338 * Math.PI) / 180;
  const arrowX = CX + R * Math.cos(arrowRad);
  const arrowY = CY + R * Math.sin(arrowRad);
  const arrowAngle = 338 + 90;

  // Signal particle position (~316°)
  const signalRad = (316 * Math.PI) / 180;
  const signalX = CX + R * Math.cos(signalRad);
  const signalY = CY + R * Math.sin(signalRad);

  return (
    <div className="cd-hero-orbit-wrap" data-animate={animate}>
      {/* Background subtle directional ambient lighting */}
      <div className="cd-hero-ambient" aria-hidden="true" />

      <svg
        className="cd-hero-svg"
        viewBox="0 0 660 560"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          {/* Active arc crisp gradient (Proposal -> Agreement) */}
          <linearGradient id={gradActive} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
            <stop offset="45%" stopColor="#38BDF8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#BAE6FD" stopOpacity="1" />
          </linearGradient>

          {/* Tangible dark glass badge gradient for idle nodes */}
          <linearGradient id={idleBadgeFill} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Crisp, clearly visible border gradient for idle nodes */}
          <linearGradient id={idleBadgeStroke} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          {/* Center ambient glow */}
          <radialGradient id={centerGrad} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.08" />
            <stop offset="55%" stopColor="#2563EB" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#080A0D" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient center light wash */}
        <circle cx={CX} cy={CY} r={R * 0.75} fill={`url(#${centerGrad})`} />

        {/* ================================================================= */}
        {/* CONCENTRIC WATER RIPPLE WAVES (Scaled up to R=215)                */}
        {/* ================================================================= */}
        <g className="cd-hero-ripples">
          <circle
            className="cd-hero-wave"
            cx={CX}
            cy={CY}
            r="38"
            fill="none"
            style={{ animationDelay: '0s' }}
          />
          <circle
            className="cd-hero-wave"
            cx={CX}
            cy={CY}
            r="38"
            fill="none"
            style={{ animationDelay: '1.8s' }}
          />
          <circle
            className="cd-hero-wave"
            cx={CX}
            cy={CY}
            r="38"
            fill="none"
            style={{ animationDelay: '3.6s' }}
          />
          <circle
            className="cd-hero-wave"
            cx={CX}
            cy={CY}
            r="38"
            fill="none"
            style={{ animationDelay: '5.4s' }}
          />
        </g>

        {/* Subtle inner concentric guide track */}
        <circle
          cx={CX}
          cy={CY}
          r={R - 50}
          fill="none"
          stroke="rgba(255, 255, 255, 0.04)"
          strokeWidth="1"
          strokeDasharray="2 4"
        />

        {/* ================================================================= */}
        {/* MAIN ORBIT TRACK (R = 215px)                                      */}
        {/* ================================================================= */}
        <circle
          className="cd-hero-base-track"
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="#1E293B"
          strokeWidth="1.5"
        />

        {/* Active crisp arc from Proposal to Agreement */}
        <path
          className="cd-hero-active-arc"
          d={`M ${proposalCoord.x} ${proposalCoord.y} A ${R} ${R} 0 0 1 ${agreementCoord.x} ${agreementCoord.y}`}
          stroke={`url(#${gradActive})`}
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Direction Marker Chevron */}
        <g
          className="cd-hero-direction-arrow"
          transform={`translate(${arrowX}, ${arrowY}) rotate(${arrowAngle})`}
        >
          <path
            d="M -4 -3.4 L 0 0 L -4 3.4"
            stroke="#BAE6FD"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>

        {/* Precision Beacon Signal */}
        <g className="cd-hero-signal-g" transform={`translate(${signalX}, ${signalY})`}>
          <circle className="cd-hero-signal-ping" cx="0" cy="0" r="4" fill="none" stroke="#38BDF8" strokeWidth="1.2" />
          <circle className="cd-hero-signal-core" cx="0" cy="0" r="3.5" fill="#38BDF8" />
          <circle cx="0" cy="0" r="1.8" fill="#FFFFFF" />
        </g>

        {/* ================================================================= */}
        {/* SIX LIFECYCLE NODE BADGES WITH CLEAR TEXTS BELOW EACH ONE         */}
        {/* ================================================================= */}
        {NODES.map((node) => {
          const coord = getNodeCoord(node.angleDeg);
          const isActive = isNodeActive(node.id);
          const isHovered = isNodeHovered(node.id);

          return (
            <g
              key={node.id}
              className={`cd-hero-node-g ${isActive ? 'is-active' : ''} ${isHovered ? 'is-hovered' : ''}`}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: 'default' }}
            >
              <title>{`${node.label} — ${node.description}`}</title>

              {/* Active precision concentric dashed indicator ring */}
              {isActive && (
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r="30"
                  fill="none"
                  stroke={isHovered ? 'rgba(56, 189, 248, 0.75)' : 'rgba(56, 189, 248, 0.4)'}
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                  style={{ transition: 'stroke 200ms ease' }}
                />
              )}

              {/* Node container circular badge (R = 23px) */}
              <circle
                cx={coord.x}
                cy={coord.y}
                r="23"
                fill={isActive ? '#0B1626' : `url(#${idleBadgeFill})`}
                stroke={isHovered ? '#38BDF8' : isActive ? '#38BDF8' : `url(#${idleBadgeStroke})`}
                strokeWidth={isHovered ? '2.2' : isActive ? '2' : '1.5'}
                style={{ transition: 'all 200ms ease' }}
              />

              {/* Active status indicator pip on top-right of active badges */}
              {isActive && (
                <g>
                  <circle cx={coord.x + 16} cy={coord.y - 16} r="3.8" fill="#38BDF8" />
                  <circle cx={coord.x + 16} cy={coord.y - 16} r="1.8" fill="#FFFFFF" />
                </g>
              )}

              {/* Centered Node Icon (22x22, centered at -11) */}
              <g transform={`translate(${coord.x - 11}, ${coord.y - 11})`}>
                {node.icon(isHovered ? '#FFFFFF' : isActive ? '#FFFFFF' : '#94A3B8')}
              </g>

              {/* PERMANENT TEXTS BELOW EACH NODE */}
              <text
                x={coord.x}
                y={coord.y + 37}
                textAnchor="middle"
                className="cd-node-label"
                fill={isHovered ? '#FFFFFF' : isActive ? '#BAE6FD' : '#E2E8F0'}
                fontSize="13"
                fontWeight="600"
                letterSpacing="-0.01em"
                style={{ transition: 'fill 180ms ease' }}
              >
                {node.label}
              </text>
              <text
                x={coord.x}
                y={coord.y + 53}
                textAnchor="middle"
                className="cd-node-sub"
                fill={isHovered ? '#93C5FD' : isActive ? 'rgba(186, 230, 253, 0.85)' : '#64748B'}
                fontSize="10.8"
                fontWeight="500"
                letterSpacing="0.01em"
                style={{ transition: 'fill 180ms ease' }}
              >
                {node.description}
              </text>
            </g>
          );
        })}

        {/* =================================================================== */}
        {/* CENTER 3D BRAND MARK (Anchored directly at SVG center CX, CY)       */}
        {/* =================================================================== */}
        <foreignObject
          x={CX - 38}
          y={CY - 38}
          width="76"
          height="76"
          style={{ overflow: 'visible', pointerEvents: 'none' }}
        >
          <div className="cd-hero-center-mark-wrap">
            <img
              src={BRAND_MARK_SRC}
              alt="Syntaflow"
              className="cd-hero-mark-img"
              draggable={false}
            />
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}
