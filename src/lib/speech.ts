import { getLanguage, type LanguageCode } from '@/data/languages';

/** Kan deze browser (en deze taal) voorlezen? */
export function canSpeak(code: LanguageCode): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && getLanguage(code).speechLang !== '';
}

/** Leest een woord voor in de juiste taal, met een passende stem als die er is. */
export function speak(text: string, code: LanguageCode): void {
  if (!canSpeak(code)) return;
  const lang = getLanguage(code).speechLang;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  const voices = synth.getVoices();
  const prefix = lang.split('-')[0]!;
  u.voice = voices.find((v) => v.lang === lang) ?? voices.find((v) => v.lang.startsWith(prefix)) ?? null;
  u.rate = 0.9;
  synth.speak(u);
}
