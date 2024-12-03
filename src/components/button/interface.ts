import type { VNode } from 'vue';

/**
 * Represents the properties for the button component.
 *
 * @property {any} text - The text content of the button.
 * @property {boolean} isTiny - Determines if the button should be rendered as a tiny button.
 * @property {VNode} icon - The icon to be displayed within the button.
 * @property {string} title - The title attribute of the button.
 * @property {string} className - The CSS class name for the button.
 * @property {boolean} disabled - Determines if the button is disabled.
 * @property {boolean} isLoading - Determines if the button is in a loading state.
 * @property {string} id - The id attribute of the button.
 * @property {'button' | 'submit' | 'reset'} type - The type attribute of the button.
 * @property {(event: any) => Promise<void>} onClick - The event handler for the button's click event.
 * @property {(event: any) => Promise<void>} onPaste - The event handler for the button's paste event.
 */
interface Props {
  text?: any;
  isTiny?: boolean;
  icon?: VNode;
  title?: string;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  id?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: Event) => void;
  onPaste?: (event: Event) => Promise<void>;
}
export default Props;
