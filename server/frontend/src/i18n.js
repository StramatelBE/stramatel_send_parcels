import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend) // Charge les fichiers de traduction
  .use(LanguageDetector) // Détecte automatiquement la langue
  .use(initReactI18next) // Initialise avec React
  .init({
    fallbackLng: 'de', // Langue par défaut si la langue détectée n'est pas disponible
    debug: false, // Désactiver les logs en production
    saveMissing: true, // (Facultatif) Pour identifier les clés manquantes en développement
    missingKeyHandler: (lng, ns, key) => {
      console.warn(`Clé de traduction manquante : ${key} dans la langue ${lng} et le namespace ${ns}`);
    },
    detection: {
      order: ['navigator'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage', 'cookie'],
    },
    interpolation: {
      escapeValue: false, // React gère déjà l'échappement des valeurs
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Chemin des fichiers de traduction
    },
    react: {
      useSuspense: false, // Désactive le suspense pour éviter des erreurs au chargement
    },
    returnNull: false, // Si une clé de traduction manque, retournez du texte par défaut (pas `null`)
    returnEmptyString: false, // Si une clé de traduction est vide, retournez du texte par défaut
  });

export default i18n;