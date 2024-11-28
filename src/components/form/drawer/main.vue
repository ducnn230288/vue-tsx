<script setup lang="tsx" name="CDrawerForm">
import { FormApi } from '@tanstack/vue-form';
import { Drawer } from 'ant-design-vue';
import { useTranslation } from 'i18next-vue';
import { ref } from 'vue';

import { CForm } from '..';
import { CButton } from '../../button';
import { convertFormValue } from '../convert';
import type Props from './interface';

/**
 * Represents the configuration for a drawer component.
 */
const {
  size,
  title,
  columns,
  textSubmit = 'Save',
  textCancel = 'Cancel',
  facade,
  keyState = 'isVisible',
  keyIsLoading = 'isLoading',
  keyData = 'data',
  onClose,
  onSubmit,
} = defineProps<Props>();
const { t } = useTranslation('locale', { keyPrefix: 'Components' });
/**
 * Renders the footer component for the drawer.
 *
 * @returns The JSX element representing the footer component.
 */
const renderFooter = () => (
  <div class={'mt-2 flex items-center justify-end gap-3 sm:flex-row'}>
    <CButton
      isLoading={facade[keyIsLoading]}
      text={typeof textCancel === 'string' ? t(textCancel) : textCancel}
      className={'out-line sm:w-auto sm:min-w-36'}
      onClick={onClose ?? (() => facade.set({ [keyData]: undefined, [keyState]: false }))}
    />
    <CButton
      isLoading={facade[keyIsLoading]}
      text={typeof textSubmit === 'string' ? t(textSubmit) : textSubmit}
      onClick={() => refForm.value?.handleSubmit()}
      disabled={facade[keyIsLoading]}
      className={'w-full sm:w-auto sm:min-w-48'}
    />
  </div>
);

const refForm = ref<FormApi<any, any>>();
defineExpose(refForm.value);
</script>
<template>
  <Drawer
    :keyboard="false"
    :destroyOnClose="true"
    :size="size"
    :open="facade[keyState]"
    @close="onClose ?? (() => facade.set({ [keyData]: undefined, [keyState]: false }))"
  >
    <template #footer>
      <component :is="renderFooter" />
    </template>
    <template #closeIcon />
    <template #title>
      <h3>{{ title }}</h3>
    </template>
    <CForm
      ref="refForm"
      :values="facade[keyData]"
      :columns="columns"
      :isLoading="facade[keyIsLoading]"
      @submit="({ value }) => onSubmit(convertFormValue(columns, value))"
    />
  </Drawer>
</template>
<style lang="less">
@import url('./index.less');
</style>
