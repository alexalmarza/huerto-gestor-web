
import { useLanguage } from '@/contexts/LanguageContext';
import { translations as caTranslations } from '@/translations/ca';
import { translations as esTranslations } from '@/translations/es';

const translations = {
  ca: caTranslations,
  es: esTranslations,
};

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key: keyof typeof caTranslations, params?: Record<string, string | number>) => {
    let translation = translations[language][key] || key;
    
    // Replace parameters in the translation
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, value.toString());
      });
    }
    
    return translation;
  };

  return { t, language };
};
