<script setup lang="tsx">
import { useTranslation } from 'i18next-vue';

import CSvgIcon from '@/components/svg-icon/main.vue';
import { EIcon } from '@/enums';
import { APP_NAME, KEY_DATA } from '@/utils';

/**
 * Represents the layout component for the authentication pages.
 */
Object.keys(KEY_DATA).forEach(value => {
  localStorage.setItem(KEY_DATA[value], JSON.stringify({ data: [], isLatest: false }));
});

const { t } = useTranslation('locale', { keyPrefix: 'Pages.Base.Login' });
</script>
<template>
  <div class="l-login">
    <div class="wrapper">
      <div class="t-head -intro-x">
        <div class="block-grap-1">
          <CSvgIcon :name="EIcon.Logo" :size="24" class="fill-primary" />
          <h4>{{ APP_NAME }}</h4>
        </div>
        <h5 class="uppercase">{{ t('EnterpriseManagementSystem') }}</h5>
      </div>
      <div class="content intro-x">
        <router-view />
      </div>
    </div>
  </div>
</template>
<style lang="less">
@import url('./index.less');
</style>
