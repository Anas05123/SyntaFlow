/**
 * Real local time for the entry footer.
 *
 * A desktop application runs where the user is, so a clock on the chrome should
 * read the user's own clock. The previous version printed a hard-coded
 * "Wednesday 10 September / 09:20 CET", which was a prop standing in for a fact.
 *
 * Formatting is delegated to Intl so the label matches the user's locale rather
 * than an English-only guess, and the zone is resolved from the runtime.
 */

import { useEffect, useState } from 'react';

export interface LocalTime {
  /** "09:20", locale-formatted, 24-hour where the locale prefers it. */
  time: string;
  /** "CET", "GMT+2", "EST" — whatever the runtime reports. */
  zone: string;
  /** Full ISO instant, for a <time dateTime> attribute. */
  iso: string;
}

function read(now: Date): LocalTime {
  const time = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);

  /* The short zone name is the most human-readable option, but some runtimes
     return "GMT+2" and some return an empty string; fall back to the offset. */
  const parts = new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' }).formatToParts(now);
  const named = parts.find((p) => p.type === 'timeZoneName')?.value;
  const zone =
    named ||
    `UTC${now.getTimezoneOffset() <= 0 ? '+' : '-'}${Math.abs(now.getTimezoneOffset() / 60)}`;

  return { time, zone, iso: now.toISOString() };
}

export function useLocalTime(): LocalTime {
  const [value, setValue] = useState(() => read(new Date()));

  useEffect(() => {
    /* Tick on the minute boundary rather than every second: the display has no
       seconds, so a per-second timer would be pure waste in an idle window. */
    let timer: number;
    const schedule = () => {
      const now = new Date();
      const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
      timer = window.setTimeout(() => {
        setValue(read(new Date()));
        schedule();
      }, msToNextMinute);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, []);

  return value;
}
