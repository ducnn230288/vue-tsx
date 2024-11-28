import type { KEY_ROLE } from '@/utils';
import type { VNode } from 'vue';

/**
 * Represents a menu item in the admin layout.
 */
export interface IMenu {
  key?: string;
  label?: string;
  icon?: VNode;
  permission?: KEY_ROLE;
  queryparams?: any;
  children?: IMenu[];
}
