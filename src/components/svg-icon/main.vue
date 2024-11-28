<script setup lang="tsx" name="CSvgIcon">
import type Props from './interface';

/**
 * Renders an SVG icon.
 */
const { name, size, className } = defineProps<Props>();
</script>
<template>
  <svg :style="size ? { width: size, height: size } : {}" :class="className" aria-hidden="true">
    <use :href="'/assets/images/sprite.svg#icon_' + name" />
  </svg>
</template>
