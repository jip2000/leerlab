import { useLiveQuery } from 'dexie-react-hooks';
import { getProfile } from './repo';

/** Streak, XP, level, dagdoel en badges; ververst vanzelf. */
export const useProfile = () => useLiveQuery(() => getProfile(), []);
