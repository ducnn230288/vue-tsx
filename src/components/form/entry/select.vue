<script setup lang="tsx" name="CESelect">
import { Select } from 'ant-design-vue';
import { reactive } from 'vue';

import { API, C_API, KEY_DATA, arrayUnique } from '@/utils';
import type { PropsSelect } from './interface';

/**
 * Represents the properties for the Select component.
 */

const {
  value,
  showSearch = true,
  maxTagCount,
  onChange,
  onBlur,
  placeholder,
  disabled,
  get,
  list = [],
  isMultiple,
  className = '',
  allowClear = true,
} = defineProps<PropsSelect>();
/**
 * Represents an array of data.
 */
let current: any = [];
if (get?.data() && get?.format) {
  current = isMultiple ? get.data().map(get.format) : [get.format(get.data())];
}
/**
 * Represents a select input component.
 */
const state = reactive<{ current: any[]; list: any[]; isLoading: boolean }>({
  current,
  list: !get?.keyApi
    ? list
    : JSON.parse(localStorage.getItem(KEY_DATA[get.keyApi]) ?? '{}')
        .data.filter(item => !item.isDelete)
        .map((e: any) => (get?.format ? get.format(e) : e)),
  isLoading: false,
});

/**
 * Loads data for the select input.
 *
 * @param fullTextSearch - The full text search string.
 */
const loadData = async (fullTextSearch: string) => {
  if (get?.keyApi) {
    const params = { latestUpdated: '' };
    const local = JSON.parse(localStorage.getItem(KEY_DATA[get.keyApi]) ?? '{}');
    if (!local.isLatest)
      try {
        state.isLoading = true;
        params.latestUpdated = local.data?.[0]?.updatedAt;

        const result = await API.get<any>({ url: `${C_API[get.keyApi]}`, params });
        local.data = [...result.data, ...local.data];
        localStorage.setItem(KEY_DATA[get.keyApi], JSON.stringify({ data: local.data, isLatest: true }));
      } catch (e) {
        console.log(e);
      }
    state.list = local.data
      .map((e: any) => (get?.format ? get.format(e) : e))
      .filter(
        (item: any) =>
          !item.isDelete &&
          !!item.value &&
          !!item.label &&
          item.label.toUpperCase()?.indexOf?.(fullTextSearch.toUpperCase()) > -1,
      );
    state.isLoading = false;
  } else if (list) {
    state.list = list.filter(
      (item: any) => !item?.label?.toUpperCase || item?.label?.toUpperCase().indexOf(fullTextSearch.toUpperCase()) > -1,
    );
  }
};
</script>
<template>
  <Select
    :className="className"
    :maxTagCount="maxTagCount"
    :placeholder="placeholder"
    :disabled="disabled"
    :listHeight="200"
    :filterOption="false"
    :showSearch="showSearch"
    :loading="state.isLoading"
    :allowClear="allowClear"
    :defaultValue="value"
    :maxTagPlaceholder="array => '+' + array.length"
    :mode="isMultiple ? 'multiple' : undefined"
    optionFilterProp="label"
    @search="value => showSearch && loadData(value)"
    @change="onChange"
    @blur="onBlur"
    @dropdownVisibleChange="open => open && !state.isLoading && loadData('')"
  >
    <Select.Option
      v-for="(item, index) in arrayUnique([...state.current, ...state.list], 'value')"
      :key="`${item.value}${index}`"
      :value="item.value"
      :disabled="item.disabled"
    >
      <span>{{ item.label }}</span>
    </Select.Option>
  </Select>
</template>
