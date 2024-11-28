<script setup lang="tsx" name="Avatar">
import type Props from './interface';
import { getColorByLetter, getFirstLetter, pickTextColorBasedOnBgColorAdvanced } from './util';

/**
 * @param text - The text to display on the avatar.
 * @param src - The source URL of the avatar image.
 * @param size - The size of the avatar.
 * @param showName - Determines whether to show the name on the avatar.
 * @param index - The index of the avatar.
 */
const { text, src, showName, size, index = 0 } = defineProps<Props>();
/**
 * Renders an avatar image.
 *
 * @returns The JSX element representing the avatar image.
 */
const renderImage = (
  <div class={[{ '-ml-2': index > 0 }]} style={{ height: size, width: size }}>
    <img
      alt='Avatar'
      style={{ height: size + 'px', width: size + 'px' }}
      class={[
        'rounded-full object-center',
        {
          'object-contain': !showName,
          'object-cover': showName,
        },
      ]}
      src={src}
    />
  </div>
);
const getText = (text: string) => getFirstLetter(text);
/**
 * Renders an avatar letter.
 *
 * @returns The JSX element representing the avatar letter.
 */
const renderLetter = text && (
  <div
    class={[
      'inline-block rounded-xl pt-0.5 text-center',
      {
        '-ml-2': index > 0,
      },
    ]}
    style={{
      color: pickTextColorBasedOnBgColorAdvanced(getColorByLetter(text as string)),
      backgroundColor: getColorByLetter(text as string),
      height: size + 'px',
      width: size + 'px',
    }}
  >
    {getText(text as string)}
  </div>
);
</script>
<template>
  <div :class="[{ 'flex items-center': showName }]">
    <component :is="!text || (src && src.indexOf('/defaultAvatar.png') === -1) ? renderImage : renderLetter" />
    <span v-if="!!showName && !!text" class="ml-1">{{ text }}</span>
  </div>
</template>
