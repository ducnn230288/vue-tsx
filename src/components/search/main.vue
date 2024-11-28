<script setup lang="tsx" name="CSearch">
import { useTranslation } from 'i18next-vue';
import { reactive, ref } from 'vue';

import { EIcon } from '@/enums';
import { CEMask } from '../form/entry';
import { CSvgIcon } from '../svg-icon';
import type Props from './interface';

/**
 * Component for rendering a search input in a data table.
 */
const { value, onChange } = defineProps<Props>();

/**
 * Handles the press of the Enter key in the search input field.
 * Retrieves the value from the search input field, trims it, and passes it to the handleTableChange function along with the current filters.
 */
const handlePressEnter = () => {
  const value = input.value?.input?.value.trim();
  onChange(value);
  state.value = value;
};

/**
 * Handles the change event for the search input.
 * Clears the current timeout and sets a new timeout to trigger the handlePressEnter function after 500 milliseconds.
 */
const timeoutSearch = ref<ReturnType<typeof setTimeout>>();
const handleChange = () => {
  if (timeoutSearch.value) clearTimeout(timeoutSearch.value);
  timeoutSearch.value = setTimeout(() => handlePressEnter(), 500);
};

/**
 * Clears the search input and triggers a table change event.
 */
const handClick = () => {
  if (state.value) {
    state.value = undefined;
    onChange(undefined);
  } else handlePressEnter();
};
const state = reactive({ value });
const { t } = useTranslation('locale', { keyPrefix: 'Components' });

/**
 * Ref object for the input element.
 */
const input = ref<{ input: HTMLInputElement }>();
</script>
<template>
  <div class="c-search">
    <CEMask
      ref="input"
      :value="state.value"
      :placeholder="t('Search')"
      @change="handleChange"
      @pressEnter="handlePressEnter"
    />
    <button @click="handClick">
      <CSvgIcon :name="state.value ? EIcon.Times : EIcon.Search" />
    </button>
  </div>
</template>
<style lang="less">
@import url('./index.less');
</style>
