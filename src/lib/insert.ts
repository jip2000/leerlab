/**
 * Zet tekst op de plek van de cursor in een invoerveld, op een manier die
 * React ook "ziet" (zodat de state meeverandert).
 */
export function insertAtCursor(el: HTMLInputElement | HTMLTextAreaElement, text: string) {
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? el.value.length;
  const value = el.value.slice(0, start) + text + el.value.slice(end);
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, 'value')!.set!.call(el, value);
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.setSelectionRange(start + text.length, start + text.length);
  el.focus();
}
