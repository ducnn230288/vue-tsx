<script setup lang="tsx" name="CRowVirtualizer">
import { useVirtualizer } from '@tanstack/vue-virtual';
import { ref, watch } from 'vue';
import type Props from './interface';

/**
 * Component for rendering a row virtualizer.
 */
const { className, data, render, firstItem, heightCell = 28, isDisabled } = defineProps<Props>();

const parentRef = ref<HTMLDivElement>();

/**
 * Initializes a virtualizer for efficient rendering of a large list.
 *
 * @param {number} count - The number of items in the list.
 * @param {Function} getScrollElement - A function that returns the scroll element.
 * @param {Function} estimateSize - A function that estimates the size of each item in the list.
 * @returns {Virtualizer} The virtualizer object.
 */
const virtualizer = useVirtualizer({
  count: data?.length ?? 0,
  getScrollElement: () => parentRef.value ?? document.body,
  estimateSize: () => heightCell,
  measureElement:
    typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
      ? element => element?.getBoundingClientRect().height
      : undefined,
  overscan: 0,
});
const items = virtualizer.value.getVirtualItems();

const refScrollOffset = ref<number | null>(0);
watch(
  () => [isDisabled],
  () => {
    if (!isDisabled) {
      setTimeout(() => {
        virtualizer.value.scrollToOffset(refScrollOffset.value ?? 0);
      });
    } else refScrollOffset.value = virtualizer.value.scrollOffset;
  },
  { immediate: true },
);

const measureElement = el => {
  if (!el) return;
  virtualizer.value.measureElement(el);
  return undefined;
};
</script>
<template>
  <div ref="parentRef" :class="['scrollbar', className]">
    <component :is="firstItem" />
    <div v-if="!isDisabled" :style="{ height: `${virtualizer.getTotalSize()}px` }">
      <div :style="{ transform: `translateY(${items[0]?.start ?? 0}px)` }">
        <div v-for="virtualRow in items" :dataIndex="virtualRow.index" :key="virtualRow.key + ''" :ref="measureElement">
          <component v-if="data" :is="render?.(data[virtualRow.index], virtualRow.index)" />
        </div>
      </div>
    </div>
  </div>
</template>
