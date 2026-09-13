/**
 * Icon set — 20x20 stroke icons, no dependency.
 * Stroke width 1.5 to match the weight used in the Figma screens.
 */

export type IconName =
  | 'home' | 'tasks' | 'clients' | 'projects' | 'documents' | 'activity' | 'archive' | 'settings'
  | 'search' | 'plus' | 'bell' | 'sun' | 'moon' | 'chevronRight' | 'chevronDown' | 'chevronLeft'
  | 'dots' | 'close' | 'external' | 'download' | 'upload' | 'clock' | 'alert' | 'check'
  | 'checkCircle' | 'message' | 'link' | 'eye' | 'edit' | 'trash' | 'calendar' | 'lock'
  | 'mail' | 'send' | 'refresh' | 'filter' | 'file' | 'package' | 'shield' | 'history'
  | 'arrowLeft' | 'arrowRight' | 'grid' | 'list' | 'undo' | 'sparkle' | 'folder' | 'user' | 'building'
  | 'share' | 'info' | 'attachment' | 'sidebar' | 'users';

const PATHS: Record<IconName, string> = {
  home: '<path d="M3.5 10.2 10 4.6l6.5 5.6V17a1 1 0 0 1-1 1h-3v-5h-5v5h-3a1 1 0 0 1-1-1z"/>',
  clients:
    '<path d="M7.2 9.3a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z"/><path d="M2.8 16.4c0-2.5 2-4.2 4.4-4.2s4.4 1.7 4.4 4.2"/><path d="M13.4 9.1a2.3 2.3 0 1 0 0-4.6"/><path d="M13.9 12.3c1.9.2 3.3 1.7 3.3 4.1"/>',
  projects:
    '<path d="M3 6.2A1.2 1.2 0 0 1 4.2 5h3.1l1.5 1.8h6A1.2 1.2 0 0 1 16 8v6.8A1.2 1.2 0 0 1 14.8 16H4.2A1.2 1.2 0 0 1 3 14.8z"/>',
  tasks: '<rect x="3.2" y="3.6" width="13.6" height="12.8" rx="1.8"/><path d="m6.6 10 2.2 2.2 4.6-4.6"/>',
  documents:
    '<path d="M5.4 3h5.2l4 4v10a1 1 0 0 1-1 1H5.4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M10.4 3v4.2h4.2"/><path d="M7.2 11.4h6M7.2 14.2h4"/>',
  activity: '<circle cx="10" cy="10" r="2.4"/><path d="M10 3.4v3.2M10 13.4v3.2M3.4 10h3.2M13.4 10h3.2"/>',
  archive:
    '<rect x="3" y="4.2" width="14" height="3.4" rx="1"/><path d="M4.3 7.6V16h11.4V7.6"/><path d="M8.2 11.2h3.6"/>',
  settings: '<circle cx="10" cy="10" r="2.6"/><path d="M10 2.6v2.1M10 15.3v2.1M3.8 6.3l1.8 1M14.4 12.7l1.8 1M3.8 13.7l1.8-1M14.4 7.3l1.8-1"/>',
  search: '<circle cx="9" cy="9" r="4.6"/><path d="m12.6 12.6 3.4 3.4"/>',
  plus: '<path d="M10 4.6v10.8M4.6 10h10.8"/>',
  bell: '<path d="M6 8.2a4 4 0 0 1 8 0c0 3.2 1.1 4.3 1.1 4.3H4.9S6 11.4 6 8.2Z"/><path d="M8.6 15.2a1.7 1.7 0 0 0 2.8 0"/>',
  sun: '<circle cx="10" cy="10" r="3.1"/><path d="M10 2.8v1.6M10 15.6v1.6M3.4 10h1.6M15 10h1.6M5.3 5.3l1.1 1.1M13.6 13.6l1.1 1.1M5.3 14.7l1.1-1.1M13.6 6.4l1.1-1.1"/>',
  moon: '<path d="M15.4 11.6A5.8 5.8 0 0 1 8.4 4.6a5.9 5.9 0 1 0 7 7Z"/>',
  chevronRight: '<path d="m8 5.6 4.4 4.4L8 14.4"/>',
  chevronDown: '<path d="m5.6 8 4.4 4.4L14.4 8"/>',
  chevronLeft: '<path d="M12 5.6 7.6 10l4.4 4.4"/>',
  dots: '<circle cx="5" cy="10" r="1.2"/><circle cx="10" cy="10" r="1.2"/><circle cx="15" cy="10" r="1.2"/>',
  close: '<path d="m5.6 5.6 8.8 8.8M14.4 5.6l-8.8 8.8"/>',
  external:
    '<path d="M11.6 4.4H16v4.4"/><path d="M16 4.4 9.4 11"/><path d="M13.4 11.4V15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7.6a1 1 0 0 1 1-1h3.6"/>',
  download: '<path d="M10 3.6v8.2"/><path d="m6.6 8.8 3.4 3.4 3.4-3.4"/><path d="M4.2 15.6h11.6"/>',
  upload: '<path d="M10 16.2V7.8"/><path d="m6.6 11 3.4-3.4L13.4 11"/><path d="M4.2 4.6h11.6"/>',
  clock: '<circle cx="10" cy="10" r="6.4"/><path d="M10 6.4V10l2.6 1.6"/>',
  alert: '<path d="M10 3.4 17 16H3z"/><path d="M10 8v3.4M10 13.6v.1"/>',
  check: '<path d="m4.8 10.4 3.4 3.4 7-7"/>',
  checkCircle: '<circle cx="10" cy="10" r="6.6"/><path d="m7.2 10.2 2 2 3.6-3.8"/>',
  message:
    '<path d="M4.2 5.4A1.2 1.2 0 0 1 5.4 4.2h9.2A1.2 1.2 0 0 1 15.8 5.4v6a1.2 1.2 0 0 1-1.2 1.2H8.6L5 15.4v-2.8H5.4a1.2 1.2 0 0 1-1.2-1.2z"/>',
  link: '<path d="M8.6 11.4 11.4 8.6"/><path d="M9.6 6.4 11 5a3 3 0 0 1 4.2 4.2l-1.4 1.4"/><path d="M10.4 13.6 9 15a3 3 0 0 1-4.2-4.2l1.4-1.4"/>',
  eye: '<path d="M2.6 10S5.2 5.6 10 5.6 17.4 10 17.4 10 14.8 14.4 10 14.4 2.6 10 2.6 10Z"/><circle cx="10" cy="10" r="2.2"/>',
  edit: '<path d="M12.8 4.2 15.8 7.2 8.4 14.6H5.4v-3z"/>',
  trash: '<path d="M4.6 6.4h10.8"/><path d="M6.2 6.4V16h7.6V6.4"/><path d="M8.2 6.4V4.4h3.6v2"/>',
  calendar: '<rect x="3.4" y="4.8" width="13.2" height="11.2" rx="1.4"/><path d="M3.4 8.6h13.2M7.4 3.4v2.6M12.6 3.4v2.6"/>',
  lock: '<rect x="4.6" y="8.8" width="10.8" height="7" rx="1.4"/><path d="M7.2 8.8V6.8a2.8 2.8 0 0 1 5.6 0v2"/>',
  mail: '<rect x="3" y="4.8" width="14" height="10.4" rx="1.4"/><path d="m3.6 6 6.4 4.6L16.4 6"/>',
  send: '<path d="M16.6 3.6 9.2 11"/><path d="M16.6 3.6 11.6 16.4l-2.4-5.4-5.4-2.4z"/>',
  refresh: '<path d="M16.2 10a6.2 6.2 0 1 1-1.9-4.4"/><path d="M16.4 3.6v3.6H12.8"/>',
  filter: '<path d="M3.6 5.4h12.8L11.6 11v4.4l-3.2 1.4V11z"/>',
  file: '<path d="M5.4 3h5.2l4 4v10a1 1 0 0 1-1 1H5.4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M10.4 3v4.2h4.2"/>',
  package: '<path d="M10 2.8 16.8 6v8L10 17.2 3.2 14V6z"/><path d="M3.2 6 10 9.2 16.8 6M10 9.2v8"/>',
  shield: '<path d="M10 3.2 15.6 5v4.6c0 3.2-2.2 5.6-5.6 6.8-3.4-1.2-5.6-3.6-5.6-6.8V5z"/>',
  history: '<path d="M3.6 10a6.4 6.4 0 1 0 2-4.7"/><path d="M3.4 3.6v3.8h3.8"/><path d="M10 6.8V10l2.6 1.6"/>',
  arrowLeft: '<path d="M16 10H4.6"/><path d="m9.4 4.6-5.4 5.4 5.4 5.4"/>',
  grid: '<rect x="3.4" y="3.4" width="5.4" height="5.4" rx="1"/><rect x="11.2" y="3.4" width="5.4" height="5.4" rx="1"/><rect x="3.4" y="11.2" width="5.4" height="5.4" rx="1"/><rect x="11.2" y="11.2" width="5.4" height="5.4" rx="1"/>',
  list: '<path d="M6.6 5.4h9.8M6.6 10h9.8M6.6 14.6h9.8"/><circle cx="3.8" cy="5.4" r="1"/><circle cx="3.8" cy="10" r="1"/><circle cx="3.8" cy="14.6" r="1"/>',
  undo: '<path d="M7.6 5.6 4 9.2l3.6 3.6"/><path d="M4 9.2h7.2a4 4 0 0 1 0 8H8"/>',
  sparkle: '<path d="M10 3.2l1.5 4.3 4.3 1.5-4.3 1.5L10 14.8l-1.5-4.3L4.2 9l4.3-1.5z"/>',
  folder: '<path d="M3 6.2A1.2 1.2 0 0 1 4.2 5h3.1l1.5 1.8h6A1.2 1.2 0 0 1 16 8v6.8A1.2 1.2 0 0 1 14.8 16H4.2A1.2 1.2 0 0 1 3 14.8z"/>',
  user: '<circle cx="10" cy="7.4" r="2.8"/><path d="M4.6 16.4c0-2.9 2.4-4.8 5.4-4.8s5.4 1.9 5.4 4.8"/>',
  building: '<rect x="4.4" y="3.2" width="11.2" height="13.6" rx="1.2"/><path d="M7.4 6.6h1.4M11.2 6.6h1.4M7.4 9.8h1.4M11.2 9.8h1.4M8.6 16.8v-3.4h2.8v3.4"/>',
  arrowRight: '<path d="M4 10h11.4"/><path d="m10.6 4.6 5.4 5.4-5.4 5.4"/>',
  share: '<circle cx="15.2" cy="5.2" r="2.2"/><circle cx="5.2" cy="10" r="2.2"/><circle cx="15.2" cy="14.8" r="2.2"/><path d="m7.2 11.2 6.2 2.6M13.4 6.2 7.2 8.8"/>',
  info: '<circle cx="10" cy="10" r="6.6"/><path d="M10 9.2v4.4M10 6.6h.01"/>',
  attachment: '<path d="m15.2 9.2-5.7 5.7a3.5 3.5 0 0 1-5-5l6.4-6.4a2.4 2.4 0 0 1 3.4 3.4L7.9 13.3a1.2 1.2 0 0 1-1.7-1.7l5.6-5.6"/>',
  sidebar: '<rect x="3" y="3.5" width="14" height="13" rx="1.8"/><path d="M7.5 3.5v13"/>',
  users: '<path d="M13.5 16.5v-1.5a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3v1.5"/><circle cx="8.5" cy="7.5" r="2.5"/><path d="M16.8 16.5v-1a2.4 2.4 0 0 0-1.8-2.3"/><path d="M13.5 5.5a2.4 2.4 0 0 1 0 4.4"/>',
};

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 16, className }: IconProps) {
  return (
    <svg
      className={className ? `icon ${className}` : 'icon'}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: PATHS[name] ?? PATHS.file }}
    />
  );
}
