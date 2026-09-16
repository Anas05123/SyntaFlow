import React from 'react';

/**
 * Authentic SVG Brand Marks for External Integrations Directory.
 * Accurate vendor brand colors, geometry, and proportions.
 */

export type ServiceLogoName =
  | 'gmail'
  | 'google-calendar'
  | 'google-drive'
  | 'github'
  | 'slack'
  | 'notion'
  | 'figma'
  | 'outlook'
  | 'dropbox'
  | 'linear'
  | 'calendly'
  | 'zoom'
  | 'onedrive'
  | 'google-docs'
  | 'google-sheets';

export interface ServiceLogoProps {
  name: ServiceLogoName | string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ServiceLogo: React.FC<ServiceLogoProps> = ({
  name,
  size = 28,
  className,
  style,
}) => {
  switch (name) {
    case 'gmail':
      return (
        <svg width={size} height={size} viewBox="0 0 512 512" className={className} style={style} fill="none" aria-hidden="true">
          <path fill="#4285F4" d="M34.91 448.818h81.454V251L0 163.727V413.91c0 19.287 15.622 34.91 34.91 34.91z" />
          <path fill="#34A853" d="M395.636 448.818h81.455c19.287 0 34.909-15.622 34.909-34.909V163.727L395.636 251z" />
          <path fill="#FBBC04" d="M395.636 99.727V251L512 163.727v-46.545c0-43.142-49.25-67.782-83.782-41.891z" />
          <path fill="#EA4335" d="M116.364 251V99.727L256 204.455 395.636 99.727V251L256 355.727z" />
          <path fill="#C5221F" d="M0 117.182v46.545L116.364 251V99.727L83.782 75.291C49.25 49.4 0 74.04 0 117.18z" />
        </svg>
      );

    case 'google-calendar':
      return (
        <svg width={size} height={size} viewBox="0 0 512 512" className={className} style={style} fill="none" aria-hidden="true">
          <path d="M390.736 121.264H121.264V390.736H390.736V121.264Z" fill="white" />
          <path d="M390.736 512L512 390.736L451.368 380.392L390.736 390.736L379.67 446.196L390.736 512Z" fill="#EA4335" />
          <path d="M0 390.736V471.578C0 493.912 18.088 512 40.42 512H121.264L133.714 451.368L121.264 390.736L55.198 380.392L0 390.736Z" fill="#188038" />
          <path d="M512 121.264V40.42C512 18.088 493.912 0 471.58 0H390.736C383.36 30.072 379.671 52.2027 379.67 66.392C379.67 80.58 383.359 98.8707 390.736 121.264C417.556 128.944 437.767 132.784 451.368 132.784C464.969 132.784 485.18 128.945 512 121.264Z" fill="#1967D2" />
          <path d="M512 121.264H390.736V390.736H512V121.264Z" fill="#FBBC04" />
          <path d="M390.736 390.736H121.264V512H390.736V390.736Z" fill="#34A853" />
          <path d="M390.736 0H40.422C18.088 0 0 18.088 0 40.42V390.736H121.264V121.264H390.736V0Z" fill="#4285F4" />
          <path d="M176.54 330.308C166.468 323.504 159.494 313.568 155.688 300.428L179.066 290.796C181.186 298.88 184.891 305.145 190.182 309.592C195.436 314.038 201.836 316.228 209.314 316.228C216.959 316.228 223.527 313.903 229.018 309.254C234.51 304.606 237.272 298.678 237.272 291.504C237.272 284.16 234.375 278.164 228.582 273.516C222.788 268.868 215.512 266.544 206.822 266.544H193.314V243.404H205.44C212.917 243.404 219.216 241.382 224.336 237.338C229.456 233.298 232.016 227.772 232.016 220.732C232.016 214.468 229.726 209.482 225.146 205.744C220.566 202.004 214.77 200.118 207.73 200.118C200.858 200.118 195.402 201.938 191.36 205.608C187.319 209.289 184.282 213.937 182.534 219.116L159.394 209.482C162.458 200.792 168.084 193.112 176.336 186.476C184.588 179.84 195.132 176.506 207.932 176.506C217.398 176.506 225.92 178.326 233.466 181.996C241.01 185.668 246.938 190.754 251.216 197.222C255.496 203.722 257.616 210.998 257.616 219.082C257.616 227.334 255.63 234.308 251.656 240.034C247.682 245.76 242.796 250.138 237.002 253.204V254.584C244.483 257.669 250.982 262.735 255.798 269.238C260.682 275.806 263.142 283.654 263.142 292.818C263.142 301.978 260.816 310.164 256.168 317.338C251.52 324.514 245.088 330.172 236.934 334.282C228.75 338.392 219.554 340.482 209.348 340.482C197.524 340.514 186.612 337.112 176.54 330.308ZM320.132 214.298L294.466 232.858L281.632 213.39L327.678 180.176H345.328V336.842H320.132V214.298Z" fill="#4285F4" />
        </svg>
      );

    case 'google-drive':
      return (
        <svg width={size} height={size} viewBox="0 0 87.3 78" className={className} style={style} fill="none" aria-hidden="true">
          <path fill="#0066DA" d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L27.5 53H0c0 1.55.4 3.1 1.2 4.5z" />
          <path fill="#00AC47" d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44C.4 49.9 0 51.45 0 53h27.5z" />
          <path fill="#EA4335" d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 11.7z" />
          <path fill="#00832D" d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.4-4.5 1.2z" />
          <path fill="#2684FC" d="M59.8 53H87.3c0-1.55-.4-3.1-1.2-4.5l-25.4-44c-.8-1.4-1.95-2.5-3.3-3.3z" />
          <path fill="#FFBA00" d="m73.55 76.8-13.75-23.8H27.5l13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h23.3c1.6 0 3.15-.4 4.5-1.2z" />
        </svg>
      );

    case 'github':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>
      );

    case 'slack':
      return (
        <svg width={size} height={size} viewBox="0 0 127 127" className={className} style={style} fill="none" aria-hidden="true">
          <path d="M27.2 79.9a13.6 13.6 0 1 1-13.6-13.6h13.6v13.6zm6.8 0a13.6 13.6 0 0 1 27.2 0v34a13.6 13.6 0 1 1-27.2 0v-34z" fill="#E01E5A" />
          <path d="M47.6 27.2a13.6 13.6 0 1 1-13.6-13.6v13.6h13.6zm0 6.8a13.6 13.6 0 0 1 0 27.2h-34a13.6 13.6 0 1 1 0-27.2h34z" fill="#36C5F0" />
          <path d="M99.8 47.6a13.6 13.6 0 1 1 13.6 13.6H99.8V47.6zm-6.8 0a13.6 13.6 0 0 1-27.2 0v-34a13.6 13.6 0 1 1 27.2 0v34z" fill="#2EB67D" />
          <path d="M79.4 99.8a13.6 13.6 0 1 1 13.6 13.6v-13.6H79.4zm0-6.8a13.6 13.6 0 0 1 0-27.2h34a13.6 13.6 0 1 1 0 27.2h-34z" fill="#ECB22E" />
        </svg>
      );

    case 'notion':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className} style={style} fill="currentColor" aria-hidden="true">
          <path d="M6.3 16.5l56.5-7.3c4.7-.6 7 .6 9.8 3.5l19.5 19.3c2.4 2.4 3 4.1 3 7.1v48.6c0 4.7-2.4 7.7-7.7 8.3l-60 5.3c-4.1.4-6.5-.6-8.9-3.5L3.9 76.5C1.5 73.5.9 71.7.9 68.2V24.8c0-4.7 1.8-7.7 5.4-8.3zm12.4 14.1v44.3c0 2.4 1.2 3.5 3.5 3.5h3.5l37.2-4.1c2.4-.2 3.5-1.8 3.5-4.1V26c0-2.4-1.2-3.5-3.5-3.5l-40.7 4.1c-2.4.2-3.5 1.8-3.5 4zm36.6 3.5c.6 0 1.2.6 1.2 1.2v30.7c0 .6-.6 1.2-1.2 1.2h-4.7c-.6 0-1.2-.6-1.2-1.2V44.4l-14.7 20.7c-.6.8-1.2 1.2-2.4 1.2h-2.4c-.6 0-1.2-.6-1.2-1.2V35.3c0-.6.6-1.2 1.2-1.2h4.7c.6 0 1.2.6 1.2 1.2v20.7l14.7-20.7c.6-.8 1.2-1.2 2.4-1.2h2.4z" />
        </svg>
      );

    case 'figma':
      return (
        <svg width={size} height={size} viewBox="0 0 200 300" className={className} style={style} fill="none" aria-hidden="true">
          <path d="M50 300c27.6 0 50-22.4 50-50v-50H50c-27.6 0-50 22.4-50 50s22.4 50 50 50z" fill="#0ACF83" />
          <path d="M0 150c0-27.6 22.4-50 50-50h50v100H50c-27.6 0-50-22.4-50-50z" fill="#A259FF" />
          <path d="M0 50C0 22.4 22.4 0 50 0h50v100H50C22.4 100 0 77.6 0 50z" fill="#F24E1E" />
          <path d="M100 0h50c27.6 0 50 22.4 50 50s-22.4 50-50 50h-50V0z" fill="#FF7262" />
          <path d="M200 150c0 27.6-22.4 50-50 50s-50-22.4-50-50 22.4-50 50-50 50 22.4 50 50z" fill="#1ABCFE" />
        </svg>
      );

    case 'outlook':
      return (
        <svg width={size} height={size} viewBox="0 0 512 512" className={className} style={style} fill="none" aria-hidden="true">
          <rect width="512" height="512" rx="100" fill="#0078D4" />
          <path d="M280 140v232l152-40V180l-152-40z" fill="#005A9E" />
          <path d="M280 140l-140 30v172l140 30V140z" fill="#106EBE" />
          <circle cx="210" cy="256" r="45" fill="white" />
        </svg>
      );

    case 'dropbox':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} fill="#0061FE" aria-hidden="true">
          <path d="M6.033 2.5L0 6.643l5.05 4.143L12 6.643 6.033 2.5zm11.934 0L12 6.643l6.95 4.143 5.05-4.143-6.033-4.143zM0 14.929l6.033 4.143L12 14.929l-6.95-4.143L0 14.929zm24 0l-6.033-4.143-6.95 4.143 6.033 4.143L24 14.929zM12 16.029l-5.967 4.1-1.05-.729v1.65l7.017 4.45 7.017-4.45v-1.65l-1.05.729L12 16.029z" />
        </svg>
      );

    case 'linear':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className} style={style} fill="currentColor" aria-hidden="true">
          <path d="M12.4 43.8c-2.3 4.2-3.6 8.9-3.7 13.9-.2 9.2 4.1 17.5 11 22.8L63.5 36.7c-5.4-7-13.6-11.4-22.8-11.6-4.9-.1-9.7 1.2-13.9 3.5l-14.4 15.2zm2.1 27.6c-4.4-6.4-7-14.1-7-22.4 0-21.5 17.5-39 39-39 8.3 0 16 2.6 22.4 7L14.5 71.4zM85.5 28.6c4.4 6.4 7 14.1 7 22.4 0 21.5-17.5 39-39 39-8.3 0-16-2.6-22.4-7l54.4-54.4zm2.1 27.6c.1-5-.1-9.9-2.3-14.1L41.5 85.9c4.2 2.3 9.1 3.5 14.1 3.5 9.2 0 17.5-4.3 22.8-11.3l7.2-21.9z" />
        </svg>
      );

    case 'calendly':
      return (
        <svg width={size} height={size} viewBox="0 0 128 128" className={className} style={style} fill="none" aria-hidden="true">
          <path d="M64 0C28.65 0 0 28.65 0 64s28.65 64 64 64 64-28.65 64-64S99.35 0 64 0zm0 104c-22.09 0-40-17.91-40-40s17.91-40 40-40 40 17.91 40 40-17.91 40-40 40z" fill="#006BFF" />
          <path d="M80 48H48v32h32V48z" fill="#006BFF" />
        </svg>
      );

    case 'zoom':
      return (
        <svg width={size} height={size} viewBox="0 0 256 256" className={className} style={style} fill="none" aria-hidden="true">
          <rect width="256" height="256" rx="60" fill="#2D8CFF" />
          <path d="M50 90c0-11 9-20 20-20h76c11 0 20 9 20 20v76c0 11-9 20-20 20H70c-11 0-20-9-20-20V90z" fill="white" />
          <path d="M166 112l40-28v88l-40-28v-32z" fill="white" />
        </svg>
      );

    case 'onedrive':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} style={style} fill="none" aria-hidden="true">
          <path d="M37.5 18c-7.5 0-13.8 5-15.8 12-.7-.1-1.4-.2-2.2-.2-6.6 0-12 5.4-12 12s5.4 12 12 12h38c5.5 0 10-4.5 10-10 0-4.8-3.4-8.8-8-9.8.3-1.4.5-2.8.5-4.2 0-9.9-8-18-18-18z" fill="#0078D4" />
        </svg>
      );

    default:
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '6px',
            backgroundColor: 'var(--surface-raised)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${size * 0.45}px`,
            fontFamily: 'var(--font-mono)',
            color: 'var(--cyan)',
            ...style,
          }}
          className={className}
        >
          {name.slice(0, 2).toUpperCase()}
        </div>
      );
  }
};
