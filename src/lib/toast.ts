import { create } from 'zustand';

export interface Toast {
  id: number;
  text: string;
  action?: { label: string; run: () => void };
}

interface ToastStore {
  toasts: Toast[];
  show: (text: string, action?: Toast['action'], ms?: number) => void;
  dismiss: (id: number) => void;
}

let next = 1;

/** Korte meldingen onderaan het scherm, eventueel met een knop zoals "Ongedaan maken". */
export const useToasts = create<ToastStore>()((set, get) => ({
  toasts: [],
  show: (text, action, ms = action ? 7000 : 3500) => {
    const id = next++;
    set({ toasts: [{ id, text, action }] }); // altijd maar één melding tegelijk
    setTimeout(() => get().dismiss(id), ms);
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));

export const toast = (text: string, action?: Toast['action']) => useToasts.getState().show(text, action);
