import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeChoice = 'systeem' | 'licht' | 'donker';

export interface CheckRules {
  ignoreCase: boolean;
  ignoreAccents: boolean;
  ignorePunctuation: boolean;
  allowTypos: boolean;
  countArticle: boolean;
}

export interface Settings {
  thema: ThemeChoice;
  geluid: boolean;
  voorlezen: boolean;
  /** Streak als getal op het app-icoon (als het toestel dat kan). */
  streakOpIcoon: boolean;
  /** Anoniem meetellen in de bezoekersteller. */
  meetellen: boolean;
  dagdoel: { type: 'minuten' | 'woorden'; aantal: number };
  nakijkregels: CheckRules;
}

interface SettingsStore extends Settings {
  setThema: (thema: ThemeChoice) => void;
  update: (patch: Partial<Settings>) => void;
}

export const defaultSettings: Settings = {
  thema: 'systeem',
  geluid: true,
  voorlezen: false,
  streakOpIcoon: false,
  meetellen: true,
  dagdoel: { type: 'minuten', aantal: 10 },
  nakijkregels: {
    ignoreCase: true,
    ignoreAccents: false,
    ignorePunctuation: true,
    allowTypos: true,
    countArticle: true,
  },
};

/** Instellingen worden in localStorage bewaard onder 'woordwerk-instellingen'. */
export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,
      setThema: (thema) => set({ thema }),
      update: (patch) => set(patch),
    }),
    { name: 'woordwerk-instellingen', version: 1 },
  ),
);
