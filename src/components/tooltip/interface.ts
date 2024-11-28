import type { TooltipPlacement } from 'ant-design-vue/lib/tooltip';
import type { VNode } from 'vue';

/**
 * @param {React.ReactNode | RenderFunction} title - The content of the tooltip.
 * @param {TooltipPlacement} [placement] - The placement of the tooltip. Defaults to "top".
 */
interface Props {
  title: VNode | string;
  placement?: TooltipPlacement;
}
export default Props;
