<script setup lang="tsx" name="CForm">
import { useForm } from '@tanstack/vue-form';
import { Spin } from 'ant-design-vue';
import { useTranslation } from 'i18next-vue';

import { watch } from 'vue';
import { convertFormValue } from './convert';
import Field from './field.vue';
import type Props from './interface';
import { handleCondition } from './util';

/**
 * A custom form component.
 */
const { className, columns, values = {}, isLoading = false, isEnterSubmit, onSubmit } = defineProps<Props>();

const form = useForm({
  defaultValues: convertFormValue(columns, values, false),
  onSubmit: ({ value }) => onSubmit?.({ value: convertFormValue(columns, value, true), formApi: form }),
});
defineExpose(form);

watch(
  () => values,
  () => {
    form.reset();
    form.update({ ...form.options, defaultValues: convertFormValue(columns, values, false) });
  },
  { immediate: true },
);

const handleSubmit = e => {
  e.preventDefault();
  e.stopPropagation();
  form.handleSubmit();
};

const { t } = useTranslation('locale', { keyPrefix: 'Components' });
</script>
<template>
  <Spin :spinning="isLoading">
    <form :class="['c-form', className]" @submit="handleSubmit">
      <input type="submit" hidden v-if="isEnterSubmit" />
      <template
        v-for="(item, index) in columns.filter((item, index) => handleCondition({ item, index, values }))"
        :key="index + item.name"
      >
        <Field :item="item" :index="index" :name="item.name" :t="t" :form="form" :values="values" :Field="form.Field" />
      </template>
    </form>
  </Spin>
  <form.Subscribe>
    <template v-slot="{ canSubmit, isSubmitting }">
      <slot name="footer" :canSubmit="canSubmit" :isSubmitting="isSubmitting" :form="form" />
    </template>
  </form.Subscribe>
</template>

<style lang="less">
@import url('./index.less');
</style>
