export type SiteIconName = 'comment' | 'document' | 'shield-check' | 'paper-plane' | 'folder' |
  'check-circle' | 'credit-card' | 'menu-burger' | 'cross' | 'arrow-small-right' |
  'angle-small-down' | 'sparkles' | 'video-camera' | 'code-simple' | 'users-alt' | 'palette' | 'megaphone';

export function SiteIcon({ name, size = 20 }: { name: SiteIconName; size?: number }) {
  return (
    <svg className="site-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <use href={`/brand/uicons.svg#${name}`} />
    </svg>
  );
}
