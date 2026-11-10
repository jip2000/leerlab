import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Backup } from '@/lib/backup';

export type Plan = 'gratis' | 'plus';

interface AccountStore {
  ready: boolean;
  session: Session | null;
  plan: Plan;
  /** Er staat iets anders in je account dan op dit apparaat: de gebruiker moet kiezen. */
  conflict: Backup | null;
  setConflict: (b: Backup | null) => void;
  setSession: (s: Session | null) => void;
  refreshPlan: () => Promise<void>;
}

/** Wie is er ingelogd, en met welk abonnement. */
export const useAccount = create<AccountStore>()((set, get) => ({
  ready: !supabase,
  session: null,
  plan: 'gratis',
  conflict: null,
  setConflict: (conflict) => set({ conflict }),
  setSession: (session) => {
    set({ session, ready: true });
    void get().refreshPlan();
  },
  refreshPlan: async () => {
    const s = get().session;
    if (!supabase || !s) return set({ plan: 'gratis' });
    const { data } = await supabase.from('profiles').select('plan, plus_tot').eq('id', s.user.id).maybeSingle();
    const active = data?.plan === 'plus' && (!data.plus_tot || new Date(data.plus_tot) > new Date());
    set({ plan: active ? 'plus' : 'gratis' });
  },
}));

/** Luistert naar in- en uitloggen. Eén keer aanroepen bij het opstarten. */
export function startAccountListener() {
  if (!supabase) return;
  void supabase.auth.getSession().then(({ data }) => useAccount.getState().setSession(data.session));
  supabase.auth.onAuthStateChange((_e, session) => useAccount.getState().setSession(session));
}
