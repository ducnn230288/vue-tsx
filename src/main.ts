import 'ant-design-vue/dist/reset.css';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import i18next from '@/i18next';
import router from '@/router';
import App from './app.vue';
import './style.less';
import { KEY_DATA } from './utils';

const bootstrap = async () => {
  // Create app vue with component App
  const app = createApp(App);

  // Setup language
  i18next(app);

  // Setup store
  const pinia = createPinia();
  app.use(pinia);

  // Setup theme
  localStorage.getItem('theme');
  document.querySelector('html')?.setAttribute('data-theme', localStorage.getItem('theme') ?? 'light');

  // Call api to update data in local storage by set false key name isLatest
  Object.keys(KEY_DATA).forEach(value => {
    const local = JSON.parse(localStorage.getItem(KEY_DATA[value]) ?? '{}');
    if (!local.data) local.data = [];
    localStorage.setItem(KEY_DATA[value], JSON.stringify({ ...local, isLatest: false }));
  });

  // Setup router
  app.use(router);

  // Mount app in html have id app
  app.mount('#app');
};

bootstrap();
