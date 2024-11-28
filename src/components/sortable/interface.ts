import type { DraggableSyntheticListeners } from '@dnd-kit-vue/core';
import type { VNode } from 'vue';
export interface PropsItem {
  value: VNode;
  handle?: boolean;
  dragOverlay?: boolean;
  transform?: any;
  listeners?: DraggableSyntheticListeners;
  transition?: string | null;
  disabled?: boolean;
  dragging?: boolean;
  handleProps?: any;
  onClick?(item: any): void;
  getClassNames?(item: any): string;
}
