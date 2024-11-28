<script setup lang="tsx" name="CTooltip">
import { Tooltip } from 'ant-design-vue';
import type Props from './interface';

/**
 * Tooltip component that wraps the provided children with a tooltip.
 */
const { title, placement } = defineProps<Props>();
</script>
<template>
  <Tooltip :title="title" :placement="placement" :destroyTooltipOnHide="true">
    <slot />
  </Tooltip>
</template>
