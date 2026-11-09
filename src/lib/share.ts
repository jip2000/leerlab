/**
 * Een lijst delen via een link, zonder server: de hele lijst wordt
 * ingepakt (gecomprimeerd) en in de link zelf gezet.
 */
import type { LanguageCode } from '@/data/languages';
import type { BookInfo } from '@/db/types';

export interface SharedList {
  v: 1;
  title: string;
  langLeft: LanguageCode;
  langRight: LanguageCode;
  book?: BookInfo;
  /** [links, rechts, lidwoord?, extraVormen?, voorbeeldzin?, notitie?] — kort gehouden voor een kortere link. */
  words: [string, string, ...string[]][];
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text: string): Uint8Array {
  const b64 = text.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const out = new Blob([bytes as BlobPart]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(out).arrayBuffer());
}

export async function encodeSharedList(list: SharedList): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(list));
  return toBase64Url(await pipe(json, new CompressionStream('deflate-raw')));
}

export async function decodeSharedList(code: string): Promise<SharedList> {
  const bytes = await pipe(fromBase64Url(code), new DecompressionStream('deflate-raw'));
  const data = JSON.parse(new TextDecoder().decode(bytes)) as SharedList;
  if (data.v !== 1 || !Array.isArray(data.words) || typeof data.title !== 'string') {
    throw new Error('Deze link bevat geen geldige woordenlijst.');
  }
  return data;
}
