import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';
import type { ConfigEnv, UserConfig } from 'vite';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}
export default ({ command }: ConfigEnv): UserConfig => {
  const isBuild = command === 'build';
  return {
    plugins: [vue(), vueJsx()],
    define:
      isBuild && process.env.VITE_LANGUAGE
        ? {
            'import.meta.env.VITE_LANGUAGE': `"${process.env.VITE_LANGUAGE}"`,
          }
        : {},
    build: {
      target: 'esnext',
      cssTarget: 'chrome86',
      minify: 'terser',
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: isBuild,
        },
      },
      chunkSizeWarningLimit: 600,
    },
    resolve: {
      alias: [{ find: /@\//, replacement: pathResolve('src') + '/' }],
    },
  };
};
