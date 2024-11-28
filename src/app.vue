<script lang="ts">
import { ConfigProvider, message as noti } from 'ant-design-vue';
import { MessageInstance } from 'ant-design-vue/es/message/interface';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { SGlobal } from './services/global';
import { LANGUAGE } from './utils';
export let message: MessageInstance;
</script>

<script setup lang="ts">
const [api, contextHolder] = noti.useMessage();
const sGlobal = SGlobal();
onMounted(() => {
  // set function call message ant design vue to global variable message
  message = api;
  // set default language by router
  sGlobal.setLanguage(LANGUAGE);
});

// setup slim progress bars when change route
const router = useRouter();
router.afterEach(() => NProgress.start());
router.afterEach(() => NProgress.done());
router.onError(() => NProgress.done());

// config theme ant design vue
const theme = {
  token: {
    // config style font
    fontSize: 13,
    lineHeight: 1.847,
    fontFamily:
      'Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    // config style data entry
    controlHeight: 32,
  },
};
</script>

<template>
  <ConfigProvider :locale="sGlobal.locale" :theme="theme">
    <!-- render message ant design vue -->
    <context-holder />

    <!-- render router -->
    <router-view />
  </ConfigProvider>
</template>
