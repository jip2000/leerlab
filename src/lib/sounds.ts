/**
 * Korte geluidjes, gemaakt met de Web Audio API (geen geluidsbestanden nodig).
 */
import { useSettings } from './settings';

let ctx: AudioContext | null = null;

function tone(freq: number, start: number, duration: number, type: OscillatorType, volume: number) {
  if (!ctx) ctx = new AudioContext();
  const t = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

export type Sound = 'goed' | 'fout' | 'klaar' | 'beloning';

export function play(sound: Sound) {
  if (!useSettings.getState().geluid) return;
  try {
    switch (sound) {
      case 'goed':
        tone(660, 0, 0.12, 'sine', 0.18);
        tone(990, 0.08, 0.18, 'sine', 0.16);
        break;
      case 'fout':
        tone(220, 0, 0.22, 'triangle', 0.16);
        break;
      case 'klaar':
        [523, 659, 784].forEach((f, i) => tone(f, i * 0.1, 0.2, 'sine', 0.15));
        break;
      case 'beloning':
        [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.25, 'triangle', 0.14));
        break;
    }
  } catch {
    /* geen geluid mogelijk in deze browser */
  }
}
