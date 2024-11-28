<script setup lang="tsx" name="CEUpload">
import { Popconfirm, Spin } from 'ant-design-vue';
import { useTranslation } from 'i18next-vue';
import { v4 as uuidv4 } from 'uuid';
import { h, reactive, useTemplateRef, watch } from 'vue';

import { message } from '@/app.vue';
import { EIcon } from '@/enums';
import { API, arrayMove, handleGetBase64, KEY_TOKEN } from '@/utils';
import { CButton } from '../../button';
import { CSvgIcon } from '../../svg-icon';
import type { PropsUpload } from './interface';

const {
  value = [],
  onChange,
  deleteFile,
  showBtnDelete = () => true,
  method = 'post',
  maxSize = 40,
  isMultiple,
  action = '/files',
  keyImage = 'path',
  accept = 'image/*',
  validation = async () => true,
} = defineProps<PropsUpload>();
/**
 * Retrieves the translation function from the specified locale and sets the key prefix to 'Components'.
 */
const { t } = useTranslation('locale', { keyPrefix: 'Components' });
/**
 * A reference to the component.
 */
const refInput = useTemplateRef<HTMLInputElement>('refInput');
/**
 * Represents the state of the list of files.
 */
const state = reactive<{ listFiles: any[]; isLoading: boolean }>({ listFiles: [], isLoading: false });
watch(
  () => value,
  () => {
    let listFile: any = typeof value === 'string' ? [value] : [];
    if (value && typeof value === 'object') {
      listFile = value.map((_item: any) => {
        if (_item.status) return _item;
        return { ..._item, status: 'done' };
      });
    }
    if (
      JSON.stringify(state.listFiles) !== JSON.stringify(listFile) &&
      state.listFiles?.filter((item: any) => item.status === 'uploading').length === 0
    ) {
      state.listFiles = listFile;
      // eslint-disable-next-line sonarjs/new-cap
      setTimeout(() => GLightbox({}), 100);
    }
  },
  { immediate: true },
);

/**
 * Formats the data and updates the list of files.
 *
 * @param data - The data to be formatted.
 * @param dataFile - The file data object.
 */
const formatData = async ({
  data,
  dataFile,
}: {
  data: any;
  dataFile: {
    [selector: string]: any;
    lastModified: any;
    lastModifiedDate: any;
    name: any;
    size: any;
    type: any;
    originFileObj: any;
    id: string;
    percent: number;
    status: string;
  };
}) => {
  if (data) {
    /**
     * Updates the files array based on the given data and file ID.
     * If isMultiple is true, it updates the corresponding file in the listFiles array.
     * If isMultiple is false, it replaces the files array with a new array containing the given data.
     *
     * @param {boolean} isMultiple - Indicates whether multiple files can be uploaded.
     * @param {Array} listFiles - The array of files.
     * @param {object} dataFile - The file object to be updated.
     * @param {object} data - The new data to be assigned to the file object.
     * @returns {Array} - The updated files array.
     */
    const listFiles = isMultiple
      ? state.listFiles.map((item: any) => {
          if (item.id === dataFile.id) {
            item = { ...item, ...data, status: 'done' };
          }
          return item;
        })
      : [{ ...data, status: 'done' }];
    state.isLoading = false;
    state.listFiles = listFiles;
    onChange?.(listFiles);
  } else {
    state.isLoading = false;
    state.listFiles = state.listFiles.filter((_item: any) => _item.id !== dataFile.id);
  }
};

/**
 * Handles the upload of files.
 *
 * @param target - The target element containing the uploaded files.
 * @returns void
 */
const onUpload = async ({ target }: any) => {
  for (const file of target.files) {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      message.error(
        `${file.name} (${(file.size / (1024 * 1024)).toFixed(1)}mb): ${t('YouCanOnlyUploadUpToMB', {
          max: maxSize,
        })}`,
      );
    }

    if ((maxSize && file.size > maxSize * 1024 * 1024) || !(await validation(file, state.listFiles))) {
      return state.listFiles.filter((_item: any) => _item.id !== dataFile.id);
    }
    /**
     * Retrieves the base64 representation of the given file.
     *
     * @param {File} file - The file to retrieve the base64 representation for.
     * @returns {string} The base64 representation of the file.
     */
    const thumbUrl = await handleGetBase64(file);
    /**
     * Represents a file data object.
     *
     * @property {number} lastModified - The last modified timestamp of the file.
     * @property {Date} lastModifiedDate - The last modified date of the file.
     * @property {string} name - The name of the file.
     * @property {number} size - The size of the file in bytes.
     * @property {string} type - The MIME type of the file.
     * @property {File} originFileObj - The original File object.
     * @property {string} thumbUrl - The URL of the thumbnail image.
     * @property {string} id - The unique identifier of the file.
     * @property {number} percent - The upload progress percentage.
     * @property {string} status - The upload status of the file.
     */
    const dataFile = {
      lastModified: file.lastModified,
      lastModifiedDate: file.lastModifiedDate,
      name: file.name,
      size: file.size,
      type: file.type,
      originFileObj: file,
      [keyImage]: thumbUrl,
      id: uuidv4(),
      percent: 0,
      status: 'uploading',
    };
    if (!isMultiple || !state.listFiles) {
      state.listFiles = [dataFile];
    } else {
      state.listFiles.push(dataFile);
    }
    state.isLoading = true;
    state.listFiles = [...state.listFiles];

    if (typeof action === 'string') {
      /**
       * FormData object used for sending data in HTTP requests.
       */
      const bodyFormData = new FormData();
      bodyFormData.append('file', file);
      const { data } = await API.responsible<any>({
        url: action,
        config: {
          ...API.init(),
          method,
          body: bodyFormData,
          headers: {
            authorization: 'Bearer ' + (localStorage.getItem(KEY_TOKEN) ?? ''),
            'Accept-Language': localStorage.getItem('i18nextLng') ?? '',
          },
        },
      });

      formatData({ data, dataFile });
    }
    // eslint-disable-next-line sonarjs/new-cap
    setTimeout(() => GLightbox({}), 100);
  }
  if (refInput.value) refInput.value.value = '';
};

/**
 * Handles the paste event and uploads any files from the clipboard.
 *
 * @param {ClipboardEvent} event - The paste event.
 * @returns {Promise<void>} - A promise that resolves when the upload is complete.
 */
const handlePaste = async event => {
  /**
   * Retrieves the items from the clipboard data.
   *
   * @param {ClipboardEvent['clipboardData']['items']} items - The items from the clipboard data.
   */
  const items = event.clipboardData.items;
  for (const index in items) {
    const item = items[index];
    if (item.kind === 'file') {
      const blob = item.getAsFile();
      await onUpload({ target: { files: [blob] } });
    }
  }
};

/**
 * Moves an image within the list of files.
 *
 * @param index - The index of the image to be moved.
 * @param new_index - The new index where the image should be moved to.
 * @returns Promise<void> - A promise that resolves when the image has been moved.
 */
const moverImage = async (index: number, new_index: number) => {
  if (isMultiple) {
    const listFiles = arrayMove(state.listFiles, index, new_index);
    state.listFiles = listFiles;
    onChange?.(listFiles);
  }
};

/**
 * Renders an arrow up button for the given index.
 *
 * @param index - The index of the button.
 * @returns The arrow up button component.
 */
const renderArrowUp = (index: number) =>
  index > 0 && (
    <button
      type='button'
      onClick={() => moverImage(index, index - 1)}
      class={
        'absolute right-1 top-1 size-5 cursor-pointer rounded-full bg-base-200 text-base-content transition-all duration-300 hover:bg-primary'
      }
    >
      <CSvgIcon name={EIcon.Arrow} size={12} className={'m-1 rotate-180 fill-primary hover:fill-base-content'} />
    </button>
  );

/**
 * Renders an arrow down button for the given index.
 *
 * @param index - The index of the button.
 * @returns The arrow down button JSX element.
 */
const renderArrowDown = (index: number) =>
  index < state.listFiles.length - 1 && (
    <button
      type='button'
      onClick={() => moverImage(index, index + 1)}
      class={[
        'absolute right-1 size-5 cursor-pointer rounded-full bg-base-200 text-base-content transition-all duration-300 hover:bg-primary',
        {
          'top-8': index > 0,
          'top-1': index === 0,
        },
      ]}
    >
      <CSvgIcon name={EIcon.Arrow} size={12} className={'m-1 fill-primary hover:fill-base-content'} />
    </button>
  );

/**
 * Renders a delete button for a file.
 *
 * @param file - The file object.
 * @param index - The index of the file in the list.
 * @returns The delete button component.
 */
const renderBtnDelete = (file, index) =>
  showBtnDelete(file) && (
    <Popconfirm
      destroyTooltipOnHide={true}
      title={t('AreYouSureWantDelete', { name: file.name, label: t('File').toLowerCase() })}
      onConfirm={async () => {
        if (deleteFile && file?.id) {
          const data = await deleteFile(file?.id);
          if (!data) {
            return false;
          }
        }
        state.listFiles = state.listFiles.filter((_item: any) => _item.id !== file.id);
        onChange?.(state.listFiles);
      }}
    >
      <button
        type='button'
        class={[
          'btn-delete',
          {
            'top-16': state.listFiles.length > 1 && index > 0 && index < state.listFiles.length - 1,
            'top-8': state.listFiles.length > 1 && (index === 0 || index === state.listFiles.length - 1),
            'top-1': state.listFiles.length === 1,
          },
        ]}
      >
        <CSvgIcon name={EIcon.Times} size={12} className={'m-1 fill-error hover:fill-base-content'} />
      </button>
    </Popconfirm>
  );
</script>
<template>
  <Spin :spinning="state.isLoading">
    <input type="file" class="hidden" :accept="accept" :multiple="isMultiple" ref="refInput" @change="onUpload" />
    <div :class="['c-upload', { 'upload-grid': isMultiple }]">
      <div class="relative" v-for="(file, index) in state.listFiles" :key="'file-' + index">
        <a :href="file[keyImage] ? file[keyImage] : file" class="glightbox">
          <img :src="file[keyImage] ? file[keyImage] : file" :alt="file.name" />
        </a>
        <component :is="renderArrowUp(index)" />
        <component :is="renderArrowDown(index)" />
        <component :is="renderBtnDelete(file, index)" />
      </div>
    </div>
    <div class="mt-2 flex gap-2">
      <CButton
        :isTiny="true"
        @click="() => refInput?.click()"
        :icon="h(CSvgIcon, { name: EIcon.Upload, size: 16 })"
        text="Upload"
      />
      <CButton :isTiny="true" :icon="h(CSvgIcon, { name: EIcon.Paste, size: 16 })" text="Paste" @paste="handlePaste" />
    </div>
  </Spin>
</template>
