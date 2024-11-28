<script setup lang="tsx" name="CSideTree">
import { EIcon } from '@/enums';
import { mapTreeObject } from '@/utils';
import { Popconfirm, Spin, Tree, TreeSelect } from 'ant-design-vue';
import { useTranslation } from 'i18next-vue';
import { CButton } from '../button';
import { CSvgIcon } from '../svg-icon';
import { CTooltip } from '../tooltip';
import type Props from './interface';

/**
 * Renders a side tree component.
 */
const { isLoading, listData, label, value, onAdd, onEdit, onDelete } = defineProps<Props>();
/**
 * Retrieves the translation function from the specified translation namespace.
 *
 * @returns The translation function.
 */
const { t } = useTranslation('locale', { keyPrefix: 'Components' });

/**
 * Renders the title of a data item.
 *
 * @param data - The data item containing the title.
 * @returns The JSX element representing the rendered title.
 */
const renderTitle = ({ data }) => (
  <span className={'item'}>
    {data.title}
    <div className='action'>
      {!!onEdit && (
        <CTooltip title={t('Edit', { name: data.title, label: label.toLowerCase() })}>
          <button
            title={t('Edit', { name: data.title, label: label.toLowerCase() })}
            onClick={() => onEdit({ id: data.key })}
          >
            <CSvgIcon name={EIcon.Edit} className='primary' />
          </button>
        </CTooltip>
      )}
      {onDelete && (
        <CTooltip title={t('Delete', { name: data.title, label: label.toLowerCase() })}>
          <Popconfirm
            destroyTooltipOnHide={true}
            title={t('AreYouSureWantDelete', {
              name: data.title,
              label: label.toLowerCase(),
            })}
            onConfirm={() => onDelete(data.key)}
          >
            <button title={t('Delete', { name: data.title, label: label.toLowerCase() })}>
              <CSvgIcon name={EIcon.Trash} className='error' />
            </button>
          </Popconfirm>
        </CTooltip>
      )}
    </div>
  </span>
);

/**
 * Renders the add button.
 *
 * @returns The JSX element representing the add button.
 */
const renderBtnAdd = !!onAdd && (
  <CButton
    icon={<CSvgIcon name={EIcon.Plus} size={12} />}
    onClick={() => onAdd({ dataType: undefined, isVisibleType: true })}
  />
);
const icon = <CSvgIcon name={EIcon.Arrow} size={12} />;
</script>
<template>
  <div class="card">
    <div class="header">
      <h3>{{ label }}<Spin :spinning="isLoading" /></h3>
      <component :is="renderBtnAdd" />
    </div>

    <div class="desktop">
      <div class="scrollbar">
        <Tree
          :blockNode="true"
          :showLine="{ showLeafIcon: false }"
          :autoExpandParent="true"
          :defaultExpandAll="true"
          :selectedKeys="[value]"
          :treeData="listData?.map(mapTreeObject)"
          @select="selectedKeys => selectedKeys[0] && onSelect(selectedKeys[0] as string)"
        >
          <template #switcherIcon><component :is="icon" /></template>
          <template #title="data"><component :is="renderTitle" :data="data" /></template>
        </Tree>
      </div>
    </div>
    <div className="mobile">
      <TreeSelect
        :treeLine="{ showLeafIcon: false }"
        :value="value"
        class="w-full"
        :treeData="listData?.map(mapTreeObject)"
        @change="selectedKey => onSelect('select', selectedKey)"
      >
        <template #suffixIcon><component :is="icon" /></template>
      </TreeSelect>
    </div>
  </div>
</template>
