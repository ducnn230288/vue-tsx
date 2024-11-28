<script setup lang="tsx" name="CButton">
import { Spin } from 'ant-design-vue';
import type Props from './interface';

const {
  isTiny = false,
  isLoading = false,
  className = '',
  disabled,
  title,
  text = '',
  type = 'button',
  icon,
} = defineProps<Props>();

const classButton = [
  'btn',
  className,
  {
    'h-8 px-3': !isTiny,
    'h-6 px-2': isTiny,
  },
];
const render = () => (
  <>
    {isLoading && <Spin size='small' />}
    {!isLoading && icon}
    {text}
  </>
);
</script>
<template>
  <button
    :type="type"
    :disabled="disabled"
    :title="title ?? text"
    :class="classButton"
    @click="event => onClick?.(event)"
    @paste="event => onPaste?.(event)"
  >
    <component :is="render" />
  </button>
</template>
<style lang="less">
@import url('./index.less');
</style>
