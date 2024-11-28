import i18next from 'i18next';
import i18nextHttpBackend from 'i18next-http-backend';
import I18NextVue from 'i18next-vue';
import type { App } from 'vue';

import { LANGUAGE } from './utils';

const createI18nOptions = () => {
  localStorage.setItem('i18nextLng', LANGUAGE);
  document.querySelector('html')?.setAttribute('lang', LANGUAGE);

  return {
    ns: 'locale',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    fallbackLng: LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
  };
};

const createI18nInstance = () => {
  const options = createI18nOptions();
  return i18next.use(i18nextHttpBackend).init(options);
};

export const i18n = createI18nInstance();

export default (app: App) => {
  app.use(I18NextVue, { i18next });
  return app;
};
