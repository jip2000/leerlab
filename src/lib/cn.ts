/** Plakt CSS-klassen aan elkaar en slaat lege waarden over. */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}
