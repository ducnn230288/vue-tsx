import type { FilterFn } from '@tanstack/vue-table';
import type { CSSProperties, VNode } from 'vue';

import type { ETablePinAlign } from '@/enums';
import type { IDataTable, IPaginationQuery } from '@/interfaces';

/**
 * Represents the type definition for the DataTable component.
 */
interface Props {
  columns: IDataTable[];
  defaultParams?: IPaginationQuery;
  rightHeader?: VNode;
  leftHeader?: VNode;
  paginationDescription?: (from: number, to: number, total: number) => string;
  data?: any[];
  isPagination?: boolean;
  isSearch?: boolean;
  onRow?: (data: any) => { onDoubleClick?: () => void; onClick?: () => void };
  isLoading?: boolean;
  action?: {
    onDisable?: any;
    onEdit?: any;
    onDelete?: any;
    label: any;
    name: any;
    onAdd?: any;
    labelAdd?: any;
    render?: any;
    width?: number;
    fixed?: ETablePinAlign;
  };
  filterGlobal?: FilterFn<any>;
  style?: CSSProperties;
  onScroll?: any;
  isExpanded?: boolean;
  onExpand?: (row: any) => void;
  heightCell?: number;
  rowSelection?: {
    onChange?: (selectedRows: any[]) => void;
    columnWidth?: number;
  };
  isVirtualized?: boolean;
  keyId?: string;
  currentId?: string;
}
export default Props;
