import { create } from "zustand";

interface LocaleState {
  locale: string;
  dictionary: Record<string, string>;
  setLocale: (locale: string) => void;
  setDictionary: (dict: Record<string, string>) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: "ru", // По умолчанию
  dictionary: {},
  setLocale: (locale) => set({ locale }),
  setDictionary: (dict) => set({ dictionary: dict }),
}));
