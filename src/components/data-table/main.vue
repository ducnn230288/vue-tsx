<script setup lang="tsx" name="CDataTable">
import { ColumnDef, ColumnPinningState } from '@tanstack/vue-table';
import { Popconfirm, Spin } from 'ant-design-vue';
import dayjs from 'dayjs';
import { useTranslation } from 'i18next-vue';
import { reactive, ref, watch } from 'vue';

import { EIcon, ETableAlign, ETablePinAlign } from '@/enums';
import { FORMAT_DATE } from '@/utils';
import { CButton } from '../button';
import { CGridVirtualizer } from '../grid-virtualizer';
import { CSearch } from '../search';
import { CSvgIcon } from '../svg-icon';
import { CTooltip } from '../tooltip';
import type Props from './interface';

const {
  columns = [],
  data,
  heightCell = 28,
  defaultParams = {},
  rightHeader,
  leftHeader,
  paginationDescription = (from: number, to: number, total: number) => from + '-' + to + ' of ' + total + ' items',
  isSearch = true,
  isLoading = false,
  action,
  isPagination = true,
  onRow,
  filterGlobal,
  style,
  onScroll,
  isExpanded,
  onExpand,
  rowSelection,
  isVirtualized,
  keyId,
  currentId,
} = defineProps<Props>();

const { t } = useTranslation('locale', { keyPrefix: 'Components' });
const state = reactive<{ columns?: ColumnDef<any>[]; columnPinning?: ColumnPinningState }>({});
watch(
  () => [columns],
  () => {
    const columnPinning: ColumnPinningState = { left: [], right: [] };
    const orginColumns = columns;

    orginColumns.forEach(item => {
      if (item.tableItem?.fixed && item.name) {
        if (item.tableItem.fixed === ETablePinAlign.Left) columnPinning.left?.push(item.name);
        else if (item.tableItem.fixed === ETablePinAlign.Right) columnPinning.right?.push(item.name);
      }
      if (item?.tableItem?.isDateTime && !item.tableItem?.render) {
        const day = text => dayjs(text).format(FORMAT_DATE + ' HH:mm:ss');
        item.tableItem.render = text => <CTooltip title={day(text)}>{dayjs(text).format(FORMAT_DATE)}</CTooltip>;
      }
    });
    if (action?.label && columns.filter(item => item.title === t('Action')).length === 0) {
      orginColumns.push({
        name: 'action',
        title: t('Action'),
        tableItem: {
          width: action.width ?? 90,
          fixed: action.fixed,
          align: ETableAlign.Center,
          render: (_: string, data) => (
            <div className={'action'}>
              {action?.render?.(data)}
              {!!action.onDisable && (
                <CTooltip
                  title={t(data.isDisable ? 'Disabled' : 'Enabled', {
                    name: action.name(data),
                    label: action.label.toLowerCase(),
                  })}
                >
                  <Popconfirm
                    destroyTooltipOnHide={true}
                    title={t(!data.isDisable ? 'AreYouSureWantDisable' : 'AreYouSureWantEnable', {
                      name: action.name(data),
                      label: action.label.toLowerCase(),
                    })}
                    onConfirm={() => action.onDisable({ id: data.code ?? data.id ?? data, isDisable: !data.isDisable })}
                    placement='left'
                  >
                    <button
                      title={t(data.isDisable ? 'Disabled' : 'Enabled', {
                        name: action.name(data),
                        label: action.label.toLowerCase(),
                      })}
                    >
                      {data.isDisable ? (
                        <CSvgIcon name={EIcon.Disable} className='warning' />
                      ) : (
                        <CSvgIcon name={EIcon.Check} className='success' />
                      )}
                    </button>
                  </Popconfirm>
                </CTooltip>
              )}

              {!!action.onEdit && (
                <CTooltip title={t('Edit', { name: action.name(data), label: action.label.toLowerCase() })}>
                  <button
                    title={t('Edit', { name: action.name(data), label: action.label.toLowerCase() })}
                    onClick={() => action.onEdit({ id: data.code ?? data.id ?? data, params: defaultParams, data })}
                  >
                    <CSvgIcon name={EIcon.Edit} className='primary' />
                  </button>
                </CTooltip>
              )}

              {!!action.onDelete && (
                <CTooltip title={t('Delete', { name: action.name(data), label: action.label.toLowerCase() })}>
                  <Popconfirm
                    destroyTooltipOnHide={true}
                    title={t('AreYouSureWantDelete', {
                      name: action.name(data),
                      label: action.label.toLowerCase(),
                    })}
                    onConfirm={() => action.onDelete(data.code ?? data.id ?? data)}
                    placement='left'
                  >
                    <button title={t('Delete', { name: action.name(data), label: action.label.toLowerCase() })}>
                      <CSvgIcon name={EIcon.Trash} className='error' />
                    </button>
                  </Popconfirm>
                </CTooltip>
              )}
            </div>
          ),
        },
      });
    }
    state.columnPinning = columnPinning;
    state.columns = orginColumns.map(item => ({
      accessorKey: item.name,
      header: item.title,
      size: item.tableItem?.width,
      meta: {
        sorter: item.tableItem?.sorter,
        onCell: item.tableItem?.onCell,
        align: item.tableItem?.align,
        filter: item.tableItem?.filter,
      },
      cell:
        item?.tableItem?.render && item.name
          ? ({ row }) => item.tableItem!.render!(row.original[item.name ?? ''], row.original)
          : undefined,
    }));
  },
  { immediate: true },
);

const refTable = ref<any>();
defineExpose({ table: refTable });

/**
 * Renders the header of the data table.
 *
 * @returns The JSX element representing the header.
 */
const renderHeader = () =>
  (!!isSearch || !!leftHeader || !!rightHeader) && (
    <div className='top-header'>
      <div className='flex items-center gap-2'>
        {!!action?.onAdd && (
          <CButton
            icon={<CSvgIcon name={EIcon.Plus} size={12} />}
            text={action?.labelAdd}
            onClick={() => action?.onAdd({ data: undefined, isVisible: true })}
          />
        )}
        {rightHeader}
        <Spin spinning={isLoading} />
      </div>

      {(!!isSearch || !!leftHeader) && (
        <div className={'right'}>
          {leftHeader}
          {isSearch ? <CSearch onChange={value => refTable.value.table.setGlobalFilter(value)} /> : <div />}
        </div>
      )}
    </div>
  );
</script>
<template>
  <div v-if="data && state?.columns" class="data-table">
    <component :is="renderHeader" />
    <CGridVirtualizer
      ref="refTable"
      :heightCell="heightCell"
      :columnPinning="state.columnPinning"
      :data="data"
      :paginationDescription="paginationDescription"
      :columns="state.columns"
      :isPagination="isPagination"
      :onRow="onRow"
      :filterGlobal="filterGlobal"
      :style="style"
      :onScroll="onScroll"
      :isExpanded="isExpanded"
      :onExpand="onExpand"
      :rowSelection="rowSelection"
      :isVirtualized="isVirtualized"
      :keyId="keyId"
      :currentId="currentId"
    />
  </div>
</template>
<style lang="less">
@import url('./index.less');
</style>
