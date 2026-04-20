import { useLocaleStore } from "../model/localeStore";

export const useTranslation = () => {
  const dictionary = useLocaleStore((state) => state.dictionary);

  const t = (key: string, fallback?: string): string => {
    // Если ключ найден в словаре, возвращаем его.
    // Если нет - возвращаем fallback (если передан) или сам ключ
    return dictionary[key] || fallback || key;
  };

  return { t };
};
