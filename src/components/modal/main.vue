<script setup lang="tsx" name="CModal">
import { Modal, Spin } from 'ant-design-vue';
import { useTranslation } from 'i18next-vue';

import { CButton } from '../button';
import type Props from './interface';

/**
 * Represents the configuration options for a modal component.
 */
const {
  facade,
  keyState = 'isVisible',
  title,
  width = 9999,
  onOk,
  onCancel,
  firstChange = true,
  textSubmit = 'Save',
  textCancel = 'Cancel',
  className = '',
  footerCustom,
} = defineProps<Props>();

/**
 * Represents the facade object.
 * @template T - The type of data in the facade object.
 */
const { data, isLoading } = facade;
/**
 * Retrieves the translation function from the specified translation namespace.
 *
 * @param {string} namespace - The translation namespace.
 * @param {object} options - The translation options.
 * @param {string} options.keyPrefix - The prefix for translation keys.
 * @returns {TranslationFunction} The translation function.
 */
const { t } = useTranslation('locale', { keyPrefix: 'Components' });
const handleCancel = () => {
  onCancel?.();
  facade.set({ [keyState]: false });
};
const handleOk = async () => {
  if (onOk) onOk();
  else handleCancel();
};

/**
 * Renders the footer of the modal.
 *
 * @param {Function} handleOk - The function to handle the OK button click.
 * @param {Function} handleCancel - The function to handle the Cancel button click.
 * @param {React.ReactNode} footerCustom - The custom footer component.
 * @param {string | React.ReactNode} textCancel - The text or component for the Cancel button.
 * @param {string | React.ReactNode} textSubmit - The text or component for the Submit button.
 * @param {boolean} isLoading - Indicates whether the Submit button is in a loading state.
 * @param {boolean} firstChange - Indicates whether any input field has been changed.
 * @returns {React.ReactNode} The rendered footer component.
 */
const renderFooter = footerCustom ? (
  footerCustom(handleOk, handleCancel)
) : (
  <div className='flex justify-end gap-2'>
    <CButton
      text={typeof textCancel === 'string' ? t(textCancel) : textCancel}
      className='bg-base-100 text-primary'
      onClick={handleCancel}
    />
    <CButton
      isLoading={isLoading}
      text={typeof textCancel === 'string' ? t(textSubmit) : textSubmit}
      disabled={!firstChange}
      onClick={handleOk}
    />
  </div>
);

const renderTitle = title && <h3 class='text-lg font-bold'>{title(data)}</h3>;
</script>
<template>
  <Modal
    :maskClosable="false"
    :destroyOnClose="true"
    :centered="true"
    :width="width"
    :title="renderTitle"
    :open="facade[keyState]"
    :wrapClassName="className"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #footer><component :is="renderFooter" /></template>
    <Spin :spinning="isLoading"><slot /></Spin>
  </Modal>
</template>
<style lang="less">
@import url('./index.less');
</style>
