<script setup lang="tsx" name="CModalForm">
import { FormApi } from '@tanstack/vue-form';
import { ref } from 'vue';

import { CModal } from '@/components/modal';
import { CForm } from '..';
import { convertFormValue } from '../convert';
import type Props from './interface';

/**
 * Represents the configuration for a modal form.
 */

const {
  title,
  width = 1200,
  columns,
  textSubmit,
  textCancel,
  className = '',
  footerCustom,
  facade,
  keyState = 'isVisible',
  keyData = 'data',
  keyIsLoading = 'isLoading',
  onSubmit,
  onClose,
} = defineProps<Props>();
const refForm = ref<FormApi<any, any>>();
defineExpose(refForm.value);
</script>
<template>
  <CModal
    :facade="facade"
    :keyState="keyState"
    :width="width"
    :textSubmit="textSubmit"
    :textCancel="textCancel"
    :className="className"
    :footerCustom="footerCustom"
    :title="() => title(facade[keyData])"
    @ok="() => refForm?.handleSubmit()"
    @cancel="onClose?.(facade[keyData])"
  >
    <CForm
      ref="refForm"
      :values="facade[keyData]"
      :columns="columns"
      :isLoading="facade[keyIsLoading]"
      @submit="({ value }) => onSubmit(convertFormValue(columns, value))"
    />
  </CModal>
</template>
