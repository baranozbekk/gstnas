import { RouteConfig } from '../routes';

// Types for translations
type TranslationKey = string;
type TranslationValue = string | { [key: string]: any };
type Translations = Record<TranslationKey, TranslationValue>;

// Default language - only English is supported
const currentLanguage = 'en';

// Cache for loaded translations
const translationsCache: Record<string, Translations> = {};

export const t = (key: string, defaultValue: string = key): string => {
  if (!translationsCache[currentLanguage]) {
    return defaultValue;
  }

  // Handle nested keys
  const keys = key.split('.');
  let value: any = translationsCache[currentLanguage];

  for (const k of keys) {
    if (!value[k]) {
      return defaultValue;
    }
    value = value[k];
  }

  return typeof value === 'string' ? value : defaultValue;
};

export const loadTranslation = (lang: string, namespace: string): Promise<void> => {
  return new Promise(resolve => {
    // Simulate delay
    setTimeout(() => {
      if (!translationsCache[lang]) {
        translationsCache[lang] = {};
      }

      // Mock translations - in a real app, this would be loaded from a server
      const mockTranslations: Record<string, any> = {
        en: {
          login: 'Login',
          dashboard: 'Dashboard',
          posts: 'Posts',
          post: 'Post',
          notFound: 'Page Not Found',
          forbidden: 'Access Denied',
          common: {
            buttons: {
              submit: 'Submit',
              cancel: 'Cancel',
              edit: 'Edit',
              delete: 'Delete',
              view: 'View',
            },
          },
        },
      };

      if (mockTranslations[lang] && mockTranslations[lang][namespace]) {
        translationsCache[lang][namespace] = mockTranslations[lang][namespace];
      }

      resolve();
    }, Math.random() * 300 + 200); // Random delay between 200-500ms
  });
};

export const prefetchRouteTranslations = (route: RouteConfig): Promise<void> => {
  if (!route.translations || !route.translations.length) {
    return Promise.resolve();
  }

  const promises = route.translations.map(namespace => loadTranslation(currentLanguage, namespace));

  return Promise.all(promises).then(() => {
    if (route.children && route.children.length) {
      const childPromises = route.children.map(prefetchRouteTranslations);
      return Promise.all(childPromises).then(() => {});
    }
  }) as Promise<void>;
};

export const getCurrentLanguage = (): string => {
  return currentLanguage;
};

export default {
  t,
  getCurrentLanguage,
  loadTranslation,
  prefetchRouteTranslations,
};
