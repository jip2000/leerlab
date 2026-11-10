import {
  BookOpen, Camera, CalendarDays, ChartColumn, CircleUserRound, House, Layers, Library, PenLine, Settings, SquarePlay,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  group: 'leren' | 'hulp' | 'jij';
  /** Staat in de tabbalk onderaan op mobiel. De rest zit onder "Meer". */
  tab?: boolean;
}

export const navItems: NavItem[] = [
  { path: '/', label: 'Home', icon: House, group: 'leren', tab: true },
  { path: '/lijsten', label: 'Mijn lijsten', icon: Library, group: 'leren', tab: true },
  { path: '/oefenen', label: 'Oefenen', icon: Layers, group: 'leren', tab: true },
  { path: '/grammatica', label: 'Grammatica', icon: BookOpen, group: 'leren' },
  { path: '/werkwoorden', label: 'Werkwoorden', icon: PenLine, group: 'leren', tab: true },
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
