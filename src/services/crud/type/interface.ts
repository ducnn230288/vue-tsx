import type { EStatusState } from '@/enums';
import type { IResponses } from '@/interfaces';
/**
 * Represents the state of a CRUD operation.
 * @template T - The type of data being operated on.
 */
interface CurdTypeState<T> {
  isLoadingType?: boolean;
  statusType?: EStatusState;
  resultType?: IResponses<T[]>;
  dataType?: T;
  isVisibleType?: boolean;
}
export default CurdTypeState;
