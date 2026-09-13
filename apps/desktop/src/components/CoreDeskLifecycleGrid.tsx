import React, { useState } from 'react';

export interface LifecycleStation {
  id: string;
  num: string;
  label: string;
  description: string;
  statusBadge?: string;
  icon: (color: string) => React.ReactNode;
}

const STATIONS: LifecycleStation[] = [
  {
    id: 'client',
    num: '01',
    label: 'Client',
    description: 'The relationship',
    icon: (color) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="6.8" r="3.2" stroke={color} strokeWidth="1.7" />
        <path
          d="M4.5 16.2c0-3 2.5-4.8 5.5-4.8s5.5 1.8 5.5 4.8"
          stroke={color}
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'proposal',
    num: '02',
    label: 'Proposal',
    description: 'A shared direction',
    statusBadge: 'Active',
    icon: (color) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M6 3.5h5.5l4 4V16.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1Z"
          stroke={color}
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path d="M11.5 3.5v4h4" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M8 11.2h4M8 13.8h3" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'agreement',
    num: '03',
    label: 'Agreement',
    description: 'Scope, settled',
    statusBadge: 'Signed',
    icon: (color) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M6 3.5h5.5l4 4V16.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1Z"
          stroke={color}
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path d="M11.5 3.5v4h4" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
        <path
          d="M7.8 13.8c1-1 2.2-.4 3-.9s1.8.4 2.4-.6"
          stroke={color}
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'project',
    num: '04',
    label: 'Project',
    description: 'Work in motion',
    icon: (color) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M3.5 6.5A1.2 1.2 0 0 1 4.7 5.3h3l1.5 1.7h6a1.2 1.2 0 0 1 1.2 1.2v6.6a1.2 1.2 0 0 1-1.2 1.2H4.7a1.2 1.2 0 0 1-1.2-1.2Z"
          stroke={color}
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'review',
    num: '05',
    label: 'Review',
    description: 'Every version, kept',
    icon: (color) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="9.2" cy="9.2" r="4.8" stroke={color} strokeWidth="1.7" />
        <path d="m12.8 12.8 3.8 3.8" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'delivery',
    num: '06',
    label: 'Delivery',
    description: 'The approved work',
    icon: (color) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 3.2 16.5 6.8v6.4L10 16.8 3.5 13.2V6.8Z"
          stroke={color}
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M3.5 6.8 10 10.4l6.5-3.6M10 10.4v6.4"
          stroke={color}
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export interface CoreDeskLifecycleGridProps {
  onSelectStage?: (id: string) => void;
  activeStageId?: string;
}

export const CoreDeskLifecycleGrid: React.FC<CoreDeskLifecycleGridProps> = ({
  onSelectStage,
  activeStageId = 'proposal',
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="cd-sided-grid-wrap">
      {/* Header Info Tag */}
      <div className="cd-sided-grid-meta">
        <span className="cd-sided-meta-left">SIDED 6-NODE ARCHITECTURE</span>
        <span className="cd-sided-meta-right">
          <span className="cd-sided-pulse-dot" />
          Active Stage: Proposal → Agreement
        </span>
      </div>

      {/* 2x3 Grid Container */}
      <div className="cd-sided-grid">
        {STATIONS.map((station) => {
          const isActive = station.id === 'proposal' || station.id === 'agreement' || station.id === activeStageId;
          const isHovered = hoveredId === station.id;

          const iconColor = isHovered
            ? '#FFFFFF'
            : isActive
            ? '#38BDF8'
            : '#94A3B8';

          return (
            <div
              key={station.id}
              className={`cd-sided-card ${isActive ? 'is-active' : ''} ${isHovered ? 'is-hovered' : ''}`}
              onMouseEnter={() => setHoveredId(station.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectStage?.(station.id)}
              role="button"
              tabIndex={0}
            >
              {/* Card Icon Badge */}
              <div className="cd-sided-badge">
                {station.icon(iconColor)}
              </div>

              {/* Station Details */}
              <div className="cd-sided-details">
                <div className="cd-sided-title-row">
                  <span className="cd-sided-num">{station.num}</span>
                  <span className="cd-sided-label">{station.label}</span>
                  {station.statusBadge && (
                    <span className="cd-sided-status-pill">{station.statusBadge}</span>
                  )}
                </div>
                <div className="cd-sided-desc">{station.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
