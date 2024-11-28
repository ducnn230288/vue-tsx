<script setup lang="tsx">
import { Dropdown, ItemType, Menu } from 'ant-design-vue';
import { useTranslation } from 'i18next-vue';
import { ComputedRef, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { CAvatar } from '@/components/avatar';
import { CSvgIcon } from '@/components/svg-icon';
import { EIcon } from '@/enums';
import { SCrud, SGlobal } from '@/services';
import { KEY_TOKEN, LINK } from '@/utils';
import CSide from './side.vue';

const router = useRouter();
const sGlobal = SGlobal();

if (localStorage.getItem(KEY_TOKEN)) sGlobal.getProfile();
else router.push({ path: `/${sGlobal.language}${LINK.Login}`, replace: true });

router.afterEach(() => {
  SCrud().reset();
});

const changeTheme = () => {
  const html = document.querySelector('html');
  const dataTheme = html?.getAttribute('data-theme');
  const theme = dataTheme === 'light' ? 'dark' : 'light';
  html?.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

const route = useRoute();
const changeLanguage = lang => {
  const path = route.path.replace(/^\/[a-z]{2}/, `/${lang}`);
  sGlobal.setLanguage(lang);
  router.push({ path, query: route.query, replace: true });
};
const listLanguage: ComputedRef<ItemType[]> = computed(() =>
  [
    {
      key: 'en',
      label: (
        <button>
          <CSvgIcon name={EIcon.En} size={24} className='rounded-lg' />
          English
        </button>
      ),
      onClick: () => changeLanguage('en'),
    },
    {
      key: 'vi',
      label: (
        <button>
          <CSvgIcon name={EIcon.Vi} size={24} className='rounded-lg' />
          Tiếng Việt
        </button>
      ),
      onClick: () => changeLanguage('vi'),
    },
  ].filter(item => item.key !== sGlobal.language),
);

const changePage = (link: string, query?: any) => router.push({ path: `/${sGlobal.language}${link}`, query });
const { t } = useTranslation('locale', { keyPrefix: 'Layouts' });
const listMyProfile: ItemType[] = [
  {
    key: 'MyProfile',
    label: (
      <button>
        <CSvgIcon name={EIcon.UserCircle} size={20} />
        {t('MyProfile')}
      </button>
    ),
    onClick: () => changePage(`${LINK.MyProfile}`, { tab: 'MyProfile' }),
  },
  {
    key: 'ChangePassword',
    label: (
      <button>
        <CSvgIcon name={EIcon.Key} size={20} />
        {t('ChangePassword')}
      </button>
    ),
    onClick: () => changePage(`${LINK.MyProfile}`, { tab: 'ChangePassword' }),
  },
  {
    type: 'divider', // Must have
  },
  {
    key: 'SignOut',
    label: (
      <button>
        <CSvgIcon name={EIcon.Out} size={20} />
        {t('SignOut')}
      </button>
    ),
    onClick: () => changePage(`${LINK.Login}`),
  },
];

const renderRightHeader = (
  <div class='right'>
    <Dropdown trigger={['click']} v-slots={{ overlay: () => <Menu items={listLanguage.value} /> }}>
      <button>
        <CSvgIcon name={sGlobal.language as any} size={24} class='rounded-lg' />
      </button>
    </Dropdown>
    <button onClick={changeTheme}>
      <CSvgIcon name={EIcon.DayNight} size={24} />
    </button>
    <Dropdown trigger={['click']} placement='bottomRight' v-slots={{ overlay: () => <Menu items={listMyProfile} /> }}>
      <div id='dropdown-profile' class='flex cursor-pointer gap-1.5'>
        <CAvatar src={sGlobal.user?.avatarUrl ?? ''} size={30} />
        <div class='leading-none'>
          <p class='text-sm font-semibold'>{sGlobal.user?.name}</p>
          <span class='text-xs text-gray-500'>{sGlobal.user?.email}</span>
        </div>
      </div>
    </Dropdown>
  </div>
);
</script>
<template>
  <div class="l-admin">
    <CSide />
    <section>
      <div class="scrollbar">
        <header>
          <button
            :class="['hamburger', { active: sGlobal.isCollapseMenu }]"
            @click="() => sGlobal.set({ isCollapseMenu: !sGlobal.isCollapseMenu })"
          >
            <span class="line" />
            <span class="line" />
            <span class="line" />
          </button>
          <component :is="renderRightHeader" />
        </header>
        <main v-if="sGlobal.data">
          <router-view />
        </main>
      </div>
      <footer>{{ t('Footer', { year: new Date().getFullYear() }) }}</footer>
    </section>
  </div>
</template>

<style lang="less">
@import url('./index.less');
</style>
