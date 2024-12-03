import type { EStatusState } from '@/enums';
import type { IMUser, IResetPassword } from '@/interfaces/model';
/**
 * Represents the global state of the application.
 */
interface GlobalState {
  isLoading?: boolean;
  user?: IMUser;
  data?: IResetPassword & IMUser;
  status?: EStatusState;
}
export default GlobalState;
