import { createRouter, createWebHashHistory } from 'vue-router';

import { KEY_TOKEN, LANGUAGE, LINK } from './utils';

const langPath = '/:lang';
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: `/${LANGUAGE}${!localStorage.getItem(KEY_TOKEN) ? LINK.Login : LINK.Dashboard}`,
    },
    {
      path: langPath,
      component: () => import('@/app.vue'),
      children: [
        {
          path: langPath + LINK.Auth,
          component: () => import('@/layouts/auth/index.vue'),
          redirect: langPath + LINK.Login,
          children: [
            {
              path: langPath + LINK.Login,
              component: () => import('@/pages/base/login/index.vue'),
            },
            {
              path: langPath + LINK.ForgetPassword,
              component: () => import('@/pages/base/login/forget-password/index.vue'),
            },
            {
              path: langPath + LINK.VerifyForotPassword,
              component: () => import('@/pages/base/login/forget-password/verify-forgot-password/index.vue'),
            },
            {
              path: langPath + LINK.SetPassword,
              component: () =>
                import('@/pages/base/login/forget-password/verify-forgot-password/set-password/index.vue'),
            },
          ],
        },
        {
          path: langPath,
          component: () => import('@/layouts/admin/index.vue'),
          redirect: langPath + LINK.Dashboard,
          children: [
            {
              path: langPath + LINK.MyProfile,
              component: () => import('@/pages/base/my-profile/index.vue'),
            },
            {
              path: langPath + LINK.Dashboard,
              component: () => import('@/pages/dashboard/index.vue'),
            },
            {
              path: langPath + LINK.Parameter,
              component: () => import('@/pages/base/parameter/index.vue'),
            },
            {
              path: langPath + LINK.Code,
              component: () => import('@/pages/base/code/index.vue'),
            },
            {
              path: langPath + LINK.User,
              component: () => import('@/pages/base/user/index.vue'),
            },
            {
              path: langPath + LINK.Content,
              component: () => import('@/pages/base/content/index.vue'),
            },
            {
              path: langPath + LINK.Post,
              component: () => import('@/pages/base/post/index.vue'),
            },
          ],
        },
      ],
    },
  ],
  // When refreshing, the scroll bar position is restored
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export default router;
