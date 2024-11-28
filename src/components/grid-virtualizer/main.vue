<script setup lang="tsx" name="CGridVirtualizer">
import type { CellContext, ColumnDef } from '@tanstack/vue-table';
import { Checkbox } from 'ant-design-vue';
import { reactive, ref, useTemplateRef, watch } from 'vue';

import { EIcon, ETableFilterType } from '@/enums';
import { useTranslation } from 'i18next-vue';
import { formatDateTime } from '../../utils';
import { CSvgIcon } from '../svg-icon';
import type Props from './interface';
import ForwardedTanstack from './tanstack.vue';
import { getSizePageByHeight } from './util';

const {
  columns,
  data,
  widthCell = 28,
  heightCell = 28,
  columnPinning = { left: [], right: [] },
  isResizing = true,
  isExpanded,
  onExpand,
  isPagination = true,
  rowSelection,
  onScroll,
  firstItem,
  paginationDescription,
  filterGlobal,
  onRow,
  style,
  className,
  isVirtualized,
  keyId,
  currentId,
  onChange,
} = defineProps<Props<any>>();

const { i18next } = useTranslation('locale', { keyPrefix: 'Pages.Base.Code' });
const parentRef = useTemplateRef<any>('parentRef');
const state = reactive<{ columns?: ColumnDef<any>[] }>({});
const renderExpandedColumn = ({ row, getValue }: CellContext<any, any>) => (
  <>
    {row.getCanExpand() && (
      <button
        type='button'
        onClick={() => {
          row.toggleExpanded();
          onExpand?.(row.original);
        }}
      >
        <CSvgIcon name={EIcon.Arrow} size={13} class={[{ 'rotate-90': row.getIsExpanded() }]} />
      </button>
    )}
    <span>{getValue()}</span>
  </>
);
const renderCellDate = ({ getValue }: CellContext<any, any>) => formatDateTime(getValue());

watch(
  () => [i18next.language, columns],
  () => {
    setTimeout(() => {
      if (parentRef.value) {
        const orginColumns = columns.map(column => {
          if (column.meta?.filter === ETableFilterType.Date && !column.cell) {
            column.cell = renderCellDate;
          }
          return column;
        });
        if (isExpanded && columns.length > 0) {
          orginColumns[0].cell = renderExpandedColumn;
          if (!orginColumns[0].meta) orginColumns[0].meta = {};
          orginColumns[0].meta.cellStyle = ({ row }: CellContext<any, any>) => ({
            paddingLeft: `${row.depth * 1.5}rem`,
          });
        }
        if (rowSelection && !orginColumns.find(col => col.id === 'rowSelection')) {
          const header = ({ table }) => (
            <Checkbox
              checked={table.getIsAllRowsSelected()}
              indeterminate={table.getIsSomeRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
            />
          );
          const cell = ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          );
          orginColumns.unshift({
            id: 'rowSelection',
            size: rowSelection.columnWidth ?? 30,
            header,
            cell,
          });
        }
        const arrayWidthColumn = orginColumns.map(column => column.size ?? 0);
        const totalWidthColumns = arrayWidthColumn.reduce((prve, next) => prve + next, 0);
        const widthCell =
          (parentRef.value.getBoundingClientRect().width - totalWidthColumns) /
          arrayWidthColumn.filter(size => !size).length;
        const newColumns = columns.map(column => ({ ...column, size: column.size ?? widthCell }));
        newColumns[newColumns.length - 1].size = newColumns[newColumns.length - 1].size - 1;
        if (JSON.stringify(state.columns) !== JSON.stringify(newColumns)) state.columns = newColumns;
      }
    }, 140);
  },
  { immediate: true },
);

const refTable = ref<any>();
defineExpose({ table: refTable });
</script>
<template>
  <div ref="parentRef">
    <ForwardedTanstack
      v-if="state.columns"
      ref="refTable"
      :data="JSON.parse(JSON.stringify(data))"
      :widthCell="widthCell"
      :heightCell="heightCell"
      :maxSize="parentRef?.getBoundingClientRect().width ?? 1200"
      :columns="state.columns"
      :rowSelection="rowSelection"
      :columnPinning="columnPinning"
      :isResizing="isResizing"
      :isExpanded="isExpanded"
      :pageSize="getSizePageByHeight({ height: heightCell, element: parentRef })"
      :isPagination="isPagination"
      :isFilter="columns.some(obj => obj.meta && Object.keys(obj.meta).includes('filter'))"
      :onScroll="onScroll"
      :firstItem="firstItem"
      :paginationDescription="paginationDescription"
      :filterGlobal="filterGlobal"
      :onRow="onRow"
      :style="style"
      :className="className"
      :isVirtualized="isVirtualized"
      :keyId="keyId"
      :currentId="currentId"
      :onChange="onChange"
    />
  </div>
</template>
<style lang="less">
@import url('./index.less');
</style>
