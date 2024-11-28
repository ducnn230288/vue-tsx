import type { Column, ColumnDef, ColumnPinningState, FilterFn, FilterFns } from '@tanstack/vue-table';
import type { Ref, StyleValue } from 'vue';

interface Props<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  widthCell?: number;
  heightCell?: number;
  columnPinning?: ColumnPinningState;
  isResizing?: boolean;
  isExpanded?: boolean;
  onExpand?: (row: any) => void;
  isPagination?: boolean;
  rowSelection?: {
    onChange?: (selectedRows: any[]) => void;
    columnWidth?: number;
  };
  isFilter?: boolean;
  pageSize?: number;

  onScroll?: any;
  firstItem?: any;
  paginationDescription?: (from: number, to: number, total: number) => string;
  filterGlobal?: FilterFn<TData>;
  onRow?: (data: any) => { onDoubleClick?: () => void; onClick?: () => void };
  maxSize?: number;
  style?: StyleValue;
  className?: string;
  isVirtualized?: boolean;
  keyId?: string;
  currentId?: string;
  onChange?: (state: any) => void;
}
export default Props;
export interface PropsFilter {
  column: Column<any>;
  refFilterTypeCurrent: Ref<{ [selector: string]: keyof FilterFns }>;
}
