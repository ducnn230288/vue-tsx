<script setup lang="tsx" name="CEDatePicker">
import { DatePicker } from 'ant-design-vue';
import dayjs from 'dayjs';
import { ref } from 'vue';

import { SGlobal } from '@/services';
import { FORMAT_DATE } from '@/utils';
import type { PropsDatePicker } from './interface';

/**
 * Renders a date picker component.
 */
const { value, name, placeholder, onChange, format, disabledDate, picker, disabled } = defineProps<PropsDatePicker>();

/**
 * Represents the global state of the application.
 */
const sGlobal = SGlobal();
const parentRef = ref<any>();
const refValue = ref<any>(value && dayjs(value));
/**
 * Handles the open change event for the date picker.
 *
 * @param {Event} e - The event object.
 * @returns {void}
 */
const handleOpenChange = e => {
  if (!e) {
    const { value }: any = parentRef.value.getElementsByTagName('input')[0];
    const selectDate = dayjs(value, format ?? FORMAT_DATE);
    if (selectDate.isValid() && onChange && name) {
      refValue.value = selectDate;
      onChange(selectDate, value);
    }
  }
  setTimeout(() => parentRef.value.getElementsByTagName('input')[0].focus());
};
</script>
<template>
  <div ref="parentRef">
    <DatePicker
      :defaultValue="refValue"
      :value="refValue"
      :format="format"
      :disabledDate="disabledDate"
      :picker="picker"
      :locale="sGlobal.localeDate"
      :disabled="disabled"
      :placeholder="placeholder"
      @change="onChange"
      @openChange="handleOpenChange"
    />
  </div>
</template>
