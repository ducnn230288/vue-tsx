<script setup lang="tsx">
import { useTranslation } from 'i18next-vue';
import { computed, onBeforeUnmount, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { CSvgIcon } from '@/components/svg-icon';
import { EIcon } from '@/enums';
import { SGlobal } from '@/services';
import { APP_NAME, KEY_ROLE, LINK } from '@/utils';
import { Menu } from 'ant-design-vue';
import { IMenu } from './interface';

const { t } = useTranslation('locale', { keyPrefix: 'Menu' });

const sGlobal = SGlobal();
const checkResponsive = () => {
  if (innerWidth < 1280 && !sGlobal.isCollapseMenu) {
    sGlobal.set({ isCollapseMenu: true });
  }
};
onUnmounted(() => {
  window.addEventListener('resize', checkResponsive, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkResponsive);
});

const list: IMenu[] = [
  {
    key: `/${sGlobal.language}${LINK.Dashboard}`,
    icon: <CSvgIcon name={EIcon.Calendar} size={24} />,
    label: 'Dashboard',
  },
  {
    key: `/${sGlobal.language}${LINK.User}`,
    icon: <CSvgIcon name={EIcon.UserCircle} size={24} />,
    label: 'User',
    permission: KEY_ROLE.P_USER_INDEX,
    queryparams: { roleCode: 'SUPER-ADMIN' },
  },
  {
    key: `/${sGlobal.language}${LINK.Setting}`,
    icon: <CSvgIcon name={EIcon.Cog} size={24} />,
    label: 'Setting',
    children: [
      {
        key: `/${sGlobal.language}${LINK.Code}`,
        label: 'Code',
        permission: KEY_ROLE.P_CODE_INDEX,
        queryparams: { typeCode: 'POSITION' },
      },
      {
        key: `/${sGlobal.language}${LINK.Content}`,
        label: 'Content',
        permission: KEY_ROLE.P_CONTENT_INDEX,
        queryparams: { typeCode: 'VALUES' },
      },
      {
        key: `/${sGlobal.language}${LINK.Post}`,
        label: 'Post',
        permission: KEY_ROLE.P_POST_INDEX,
        queryparams: { typeCode: 'NEWS' },
      },
      {
        key: `/${sGlobal.language}${LINK.Parameter}`,
        label: 'Parameter',
        permission: KEY_ROLE.P_PARAMETER_INDEX,
        queryparams: { code: 'ADDRESS' },
      },
    ],
  },
];
const listMenu = computed(() =>
  list
    .filter(item => {
      return (
        !item.permission ||
        (!item.children && item.permission && sGlobal.user?.role?.permissions?.includes(item.permission)) ||
        (item.children &&
          item.children.filter(
            subItem => !subItem.permission || sGlobal.user?.role?.permissions?.includes(subItem.permission),
          ).length > 0)
      );
    })
    .map(item => ({
      ...item,
      label: t(item.label ?? ''),
      children: item.children?.map(subItem => ({ ...subItem, label: t(subItem.label ?? '') })),
    })),
);
/**
 * Finds a menu item by its key in the given array of menus.
 *
 * @param menus - The array of menus to search in.
 * @param key - The key of the menu item to find.
 * @returns The found menu item, or undefined if not found.
 */
const findMenu = (menus: IMenu[], key: string): IMenu | undefined => {
  let menuCurrent: IMenu | undefined;
  const forEachMenu = (menu: IMenu) => {
    if (menu.key === key) {
      menuCurrent = menu;
    } else if (menu.children) {
      menu.children.forEach(forEachMenu);
    }
  };
  menus.forEach(forEachMenu);
  return menuCurrent;
};

const router = useRouter();
const onSelect = ({ key }) => {
  const menu = findMenu(listMenu.value, key);
  if (menu) {
    router.push({
      path: menu.key,
      query: menu.queryparams,
    });
  }
};

const route = useRoute();
</script>
<template>
  <div :class="['overload', { active: !sGlobal.isCollapseMenu }]" />
  <aside :class="[{ active: sGlobal.isCollapseMenu }]">
    <button
      :class="['logo', { active: sGlobal.isCollapseMenu }]"
      @click="() => router.push({ path: `/${sGlobal.language}${LINK.Dashboard}` })"
    >
      <CSvgIcon :name="EIcon.Logo" />
      <h1 :class="[{ active: sGlobal.isCollapseMenu }]">{{ APP_NAME }}</h1>
    </button>
    <div className="scrollbar">
      <Menu
        :selectedKeys="[route.path]"
        :openKeys="['/' + route.path.substring(1).split('/').slice(0, 2).join('/')]"
        mode="inline"
        :inlineCollapsed="sGlobal.isCollapseMenu"
        :items="listMenu as any"
        @select="onSelect"
      />
    </div>
  </aside>
</template>
