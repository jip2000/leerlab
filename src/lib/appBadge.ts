/**
 * Je streak als getal op het app-icoon op je beginscherm (zoals bij berichten-apps).
 *
 * Werkt alleen als Woordwerk op je beginscherm staat, en alleen op toestellen die dit
 * ondersteunen: iPhone/iPad (iOS 16.4+, na toestemming voor meldingen), en Chrome/Edge
 * op computers. Android toont geen getal op een web-app-icoon.
 */
import { useSettings } from './settings';

type BadgeNavigator = Navigator & { setAppBadge?: (n?: number) => Promise<void>; clearAppBadge?: () => Promise<void> };

export const appBadgeSupported = () => typeof navigator !== 'undefined' && 'setAppBadge' in navigator;

export async function updateAppBadge(streak: number) {
  const nav = navigator as BadgeNavigator;
  if (!nav.setAppBadge) return;
  try {
    if (useSettings.getState().streakOpIcoon && streak > 0) await nav.setAppBadge(streak);
    else await nav.clearAppBadge?.();
  } catch {
    /* geen toestemming of niet geïnstalleerd */
  }
}

/** Vraagt toestemming (nodig op iPhone) en zet de instelling aan. */
export async function enableAppBadge(): Promise<'aan' | 'geweigerd' | 'niet-mogelijk'> {
  if (!appBadgeSupported()) return 'niet-mogelijk';
  if ('Notification' in window && Notification.permission !== 'granted') {
    const p = await Notification.requestPermission();
    if (p !== 'granted') return 'geweigerd';
  }
  useSettings.getState().update({ streakOpIcoon: true });
  return 'aan';
}
