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
 * @extends RReducer
 */
class Get extends RReducer {
  public constructor() {
    super();
    this.action = async ({
      params,
      keyApi,
      format,
    }: {
      params: IPaginationQuery;
      keyApi: string;
      format: (item: any, index: number) => void;
    }) => {
      const result = await API.get({ url: C_API[keyApi], params });
      if (format) result.data = (result.data as any).map(format);
      return result;
    };
    this.pending = (state, value) => {
      const queryParams = JSON.parse(JSON.stringify(value));
      state.result = {
        data: JSON.parse(localStorage.getItem(KEY_DATA[queryParams.keyApi]) ?? '[]').data.filter(
          item => !item.isDelete,
        ),
      };
    };
    this.fulfilled = (state, data) => {
      state.result = data;
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
    this.action = async ({
      id,
      params,
      keyApi,
    }: {
      id: string;
      params?: IPaginationQuery;
      keyApi: string;
      data: any;
    }) => {
      const { data } = await API.get({ url: `${C_API[keyApi]}/${id}`, params });
      return data;
    };
    this.fulfilled = (state, data) => {
      if (JSON.stringify(state.data) !== JSON.stringify(data)) state.data = data;
      state.isVisible = true;
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
    this.action = async ({ values, keyApi }: { values: any; keyApi: string }) => {
      const { data } = await API.post({ url: `${C_API[keyApi]}`, values });
      return data;
    };
    this.pending = (state, value) => {
      state.data = value.values;
    };
    this.fulfilled = state => {
      state.isVisible = false;
      state.status = EStatusState.IsFulfilled;
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
    this.action = async ({ values: { id, ...values }, keyApi }: { values: any; keyApi: string }) => {
      const { data } = await API.put({ url: `${C_API[keyApi]}/${id}`, values });
      return data;
    };
    this.pending = (state, value) => {
      state.data = value.values;
    };
    this.fulfilled = state => {
      state.isVisible = false;
      state.status = EStatusState.IsFulfilled;
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
    this.action = async ({ id, keyApi }: { id: string; keyApi: string }) => {
      const { data } = await API.delete({ url: `${C_API[keyApi]}/${id}` });
      return data;
    };
    this.fulfilled = state => {
      state.status = EStatusState.IsFulfilled;
    };
  }
}

export const RCurd = {
  get: new Get(),
  getId: new GetId(),
  post: new Post(),
  put: new Put(),
  delete: new Delete(),
};
