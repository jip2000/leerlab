/**
 * Laat zien wat er anders is tussen jouw antwoord en het goede antwoord (per letter).
 * Gebruikt de langste gemeenschappelijke deelreeks (LCS).
 */
export interface DiffPart {
  text: string;
  kind: 'zelfde' | 'mist' | 'teveel';
}

export function diffChars(given: string, expected: string): DiffPart[] {
  const a = [...given];
  const b = [...expected];
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      dp[i]![j] = a[i] === b[j] ? dp[i + 1]![j + 1]! + 1 : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!);
    }
  }
  const parts: DiffPart[] = [];
  const push = (text: string, kind: DiffPart['kind']) => {
    const last = parts[parts.length - 1];
    if (last && last.kind === kind) last.text += text;
    else parts.push({ text, kind });
  };
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      push(a[i]!, 'zelfde');
      i++;
      j++;
    } else if (j < b.length && (i >= a.length || dp[i]![j + 1]! >= dp[i + 1]![j]!)) {
      push(b[j]!, 'mist');
      j++;
    } else {
      push(a[i]!, 'teveel');
      i++;
    }
  }
  return parts;
}
