import {
  BookOpen, Camera, CalendarDays, ChartColumn, CircleUserRound, House, Layers, Library, Settings, SquarePlay,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  group: 'leren' | 'hulp' | 'jij';
  /** Staat in de tabbalk onderaan op mobiel. De rest zit onder "Meer". */
  tab?: boolean;
  /** Pagina's met een eigen adres die bij dit menu-item horen (een tabblad binnen de pagina). */
  sub?: { path: string; label: string }[];
}

export const navItems: NavItem[] = [
  { path: '/', label: 'Home', icon: House, group: 'leren', tab: true },
  { path: '/lijsten', label: 'Mijn lijsten', icon: Library, group: 'leren', tab: true },
  { path: '/oefenen', label: 'Oefenen', icon: Layers, group: 'leren', tab: true },
  // De werkwoordtrainer is een tabblad van Grammatica: één knop voor alles wat met grammatica te maken heeft.
  { path: '/grammatica', label: 'Grammatica', icon: BookOpen, group: 'leren', tab: true, sub: [{ path: '/werkwoorden', label: 'Werkwoorden' }] },
  { path: '/scannen', label: 'Foto scannen', icon: Camera, group: 'hulp' },
  { path: '/videos', label: "Video's", icon: SquarePlay, group: 'hulp' },
  { path: '/planner', label: 'Planner', icon: CalendarDays, group: 'hulp' },
  { path: '/statistieken', label: 'Statistieken', icon: ChartColumn, group: 'jij' },
  { path: '/instellingen', label: 'Instellingen', icon: Settings, group: 'jij' },
  { path: '/account', label: 'Account', icon: CircleUserRound, group: 'jij' },
];

export const navGroups: { id: NavItem['group']; label: string }[] = [
  { id: 'leren', label: 'Leren' },
  { id: 'hulp', label: 'Hulpmiddelen' },
  { id: 'jij', label: 'Jij' },
];

/** Is `pathname` deze pagina zelf of een pagina eronder? ("/oefenen/abc" hoort bij "/oefenen".) */
const under = (base: string, pathname: string) => pathname === base || pathname.startsWith(`${base}/`);

/** Moet dit menu-item oplichten op de pagina waar je nu bent? */
export function isNavActive(item: NavItem, pathname: string): boolean {
  if (item.path === '/') return pathname === '/';
  return under(item.path, pathname) || (item.sub ?? []).some((s) => under(s.path, pathname));
}

/** Naam van de pagina voor de titel van het browsertabblad. Home en losse pagina's hebben er geen. */
export function pageLabel(pathname: string): string | undefined {
  for (const item of navItems) {
    const sub = item.sub?.find((s) => under(s.path, pathname));
    if (sub) return sub.label;
    if (item.path !== '/' && under(item.path, pathname)) return item.label;
  }
  return undefined;
}

/** Alle pagina's waar de zoekbalk je naartoe kan sturen, ook de tabbladen binnen een pagina. */
export const searchPages: { path: string; label: string }[] = navItems.flatMap((i) => [{ path: i.path, label: i.label }, ...(i.sub ?? [])]);
