<script setup lang="tsx" name="CEMask">
import { computed, useTemplateRef, watch } from 'vue';
import type { PropsMask } from './interface';

const {
  mask,
  value,
  addonBefore,
  addonAfter,
  disabled,
  placeholder,
  height,
  width,
  type,
  onBlur,
  onFocus,
  onChange,
  onPressEnter,
} = defineProps<PropsMask>();

const input = useTemplateRef('input');
defineExpose({ input });

watch(
  () => value,
  () => {
    if (input.value) {
      input.value.value = value ?? '';
      // eslint-disable-next-line sonarjs/new-cap
    } else setTimeout(() => !!mask && !!input.value && Inputmask(mask).mask(input.value));
  },
  { immediate: true },
);

/**
 * Generates the className for the input element.
 *
 * @param addonBefore - Whether there is an addon before the input.
 * @param addonAfter - Whether there is an addon after the input.
 * @param disabled - Whether the input is disabled.
 * @returns The generated className.
 */

const className = computed(() => ['ant-input', { before: !!addonBefore, after: !!addonAfter, disabled: disabled }]);
</script>

<template>
  <div class="relative">
    <span v-if="addonBefore" class="before">
      <component :is="addonBefore" />
    </span>
    <input
      ref="input"
      :type="type"
      :class="className"
      :readOnly="disabled"
      :defaultValue="value"
      :placeholder="placeholder"
      :style="{ height, width }"
      @blur="event => onBlur?.(event)"
      @input="event => onChange?.(event)"
      @focus="event => onFocus?.(event)"
      @keyup="event => event.key === 'Enter' && onPressEnter?.(event)"
    />
    <span v-if="addonAfter" class="after">
      <component :is="addonAfter" />
    </span>
  </div>
</template>
