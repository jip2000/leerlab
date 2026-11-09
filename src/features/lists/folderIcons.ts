import { BookOpen, Calculator, FlaskConical, Folder, Globe, Landmark, Languages, Music, Palette, type LucideIcon } from 'lucide-react';

/** Iconen die je voor een map kunt kiezen. */
export const folderIcons: Record<string, LucideIcon> = {
  map: Folder,
  talen: Languages,
  boek: BookOpen,
  wereld: Globe,
  geschiedenis: Landmark,
  wiskunde: Calculator,
  biologie: FlaskConical,
  muziek: Music,
  kunst: Palette,
};

export const folderColors = ['#2F6FDB', '#D33F3F', '#5B5BD6', '#AD5C08', '#08805F', '#7A4FB5', '#C23A6B', '#5A6C8F'];

export function folderIcon(name: string): LucideIcon {
  return folderIcons[name] ?? Folder;
}
