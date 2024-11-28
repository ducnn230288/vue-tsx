import { EStatusState } from '@/enums';
import type { IPaginationQuery } from '@/interfaces';
import { API, C_API, KEY_DATA } from '@/utils';
import type { StateCrud } from '../state';

/**
 * RReducer class represents a reducer for handling actions in the application.
 * It provides methods for handling pending, fulfilled, and rejected actions.
 */
class RReducer {
  public action;
  public reducer;
  public pending = (_, __) => {};
  public fulfilled = (_, __) => {};
  public rejected = (_, __) => {};
  public constructor() {
    this.reducer = async (state: StateCrud, value) => {
      state.isLoading = true;
      state.status = EStatusState.Idle;
      this.pending(state, value);
      try {
        const res = await this.action(value);
        state.isLoading = false;
        this.fulfilled(state, res);
      } catch (e) {
        state.isLoading = false;
        this.rejected(state, e);
      }
    };
  }
}

/**
 * Represents a class for performing a GET request.
 * @class
 */
class Get extends RReducer {
  public constructor() {
    super();
    this.action = async ({ params, keyApiType }: { params: IPaginationQuery; keyApiType: string }) => {
      const result = await API.get({ url: C_API[keyApiType], params });
      return result;
    };
    this.pending = (state, value) => {
      const queryParams = JSON.parse(JSON.stringify(value));
      state.resultType = {
        data: JSON.parse(localStorage.getItem(KEY_DATA[queryParams.keyApiType]) ?? '{}').data.filter(
          item => !item.isDelete,
        ),
      };
    };
    this.fulfilled = (state, data) => {
      state.resultType = data;
    };
  }
}

/**
 * Represents a class that handles the retrieval of data by ID.
 * @class
 * @extends RReducer
 */
class GetId extends RReducer {
  public constructor() {
    super();
    this.action = async ({ id, params, keyApiType }: { id: string; params?: IPaginationQuery; keyApiType: string }) => {
      const { data } = await API.get({ url: `${C_API[keyApiType]}/${id}`, params });
      return data;
    };
    this.fulfilled = (state, data) => {
      if (JSON.stringify(state.dataType) !== JSON.stringify(data)) state.dataType = data;
      state.isVisibleType = true;
    };
  }
}

/**
 * Represents a Post reducer class.
 * @class
 * @extends RReducer
 */
class Post extends RReducer {
  public constructor() {
    super();
    this.action = async ({ values, keyApiType }: { values: any; keyApiType: string }) => {
      const { data } = await API.post({ url: `${C_API[keyApiType]}`, values });
      return data;
    };
    this.pending = (state, value) => {
      state.dataType = value.values;
    };
    this.fulfilled = (state, data) => {
      if (JSON.stringify(state.dataType) !== JSON.stringify(data)) state.dataType = data;
      state.isVisibleType = false;
      state.statusType = EStatusState.IsFulfilled;
    };
  }
}

/**
 * Represents a class for handling the PUT operation in a reducer.
 * @class
 * @extends RReducer
 */
class Put extends RReducer {
  public constructor() {
    super();
    this.action = async ({ values: { id, ...values }, keyApiType }: { values: any; keyApiType: string }) => {
      const { data } = await API.put({ url: `${C_API[keyApiType]}/${id}`, values });
      return data;
    };
    this.pending = (state, value) => {
      state.dataType = value.values;
    };
    this.fulfilled = (state, data) => {
      if (JSON.stringify(state.dataType) !== JSON.stringify(data)) state.dataType = data;
      state.isVisibleType = false;
      state.statusType = EStatusState.IsFulfilled;
    };
  }
}

/**
 * Represents a class for deleting data using a reducer.
 * @class
 * @extends RReducer
 */
class Delete extends RReducer {
  public constructor() {
    super();
    this.action = async ({ id, keyApiType }: { id: string; keyApiType: string }) => {
      const { data } = await API.delete({ url: `${C_API[keyApiType]}/${id}` });
      return data;
    };
    this.fulfilled = state => {
      state.statusType = EStatusState.IsFulfilled;
    };
  }
}
export const RCurdType = {
  get: new Get(),
  getId: new GetId(),
  post: new Post(),
  put: new Put(),
  delete: new Delete(),
};
