import { EStatusState } from '@/enums';
import type { IMUser, IResetPassword } from '@/interfaces/model';
import { API, C_API, KEY_REFRESH_TOKEN, KEY_TOKEN, KEY_USER } from '@/utils';
import type { StateGlobal } from '../state';

/**
 * RReducer class represents a reducer for global state.
 * It handles pending, fulfilled, and rejected actions.
 */
class RReducer {
  public action;
  public reducer;
  public pending = (_, __) => {};
  public fulfilled = (_, __) => {};
  public rejected = (_, __) => {};
  public constructor() {
    this.reducer = async (state: StateGlobal, value) => {
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
 * Represents a class that handles the retrieval of a user profile.
 */
class GetProfile extends RReducer {
  public constructor() {
    super();
    this.action = async () => {
      const { data } = await API.get<IMUser>({ url: `${C_API.Auth}/profile` });
      return data || {};
    };

    this.fulfilled = (state, data) => {
      if (data) {
        state.data = data;
        state.user = data;
        localStorage.setItem(KEY_USER, JSON.stringify(data));
        state.status = EStatusState.Idle;
      }
    };
  }
}
/**
 * Represents a class for putting a user profile.
 */
class PutProfile extends RReducer {
  public constructor() {
    super();
    this.action = async (values: IMUser) => {
      const { data } = await API.put<{ user: IMUser; token: string; refreshToken: string }>({
        url: `${C_API.Auth}/profile`,
        values,
      });
      if (data) {
        localStorage.setItem(KEY_TOKEN, data?.token);
        localStorage.setItem(KEY_REFRESH_TOKEN, data?.refreshToken);
      }
      return data!.user;
    };

    this.pending = (state, value) => {
      state.data = { ...state.data, ...value };
    };
    this.fulfilled = (state, data) => {
      if (data) {
        localStorage.setItem(KEY_USER, JSON.stringify(data));
        state.user = data;
        state.status = EStatusState.IsFulfilled;
      }
    };
  }
}
/**
 * Represents a class for handling login functionality.
 * @class
 */
class PostLogin extends RReducer {
  public constructor() {
    super();
    this.action = async (values: { password: string; username: string }) => {
      const { data } = await API.post<{ user: IMUser; token: string; refreshToken: string }>({
        url: `${C_API.Auth}/login`,
        values,
        params: { include: 'role' },
      });
      if (data) {
        localStorage.setItem(KEY_TOKEN, data?.token);
        localStorage.setItem(KEY_REFRESH_TOKEN, data?.refreshToken);
      }
      return data!.user;
    };

    this.pending = (state, value) => {
      state.data = value;
    };
    this.fulfilled = (state, data) => {
      if (data) {
        localStorage.setItem(KEY_USER, JSON.stringify(data));
        state.user = data;
        state.data = undefined;
        state.status = EStatusState.IsFulfilled;
      }
    };
  }
}
/**
 * Represents a class for patching forgotten passwords.
 */
class PostForgottenPassword extends RReducer {
  public constructor() {
    super();
    this.action = async (values: { email: string }) => {
      await API.post({ url: `${C_API.Auth}/forgotten-password`, values });
      return true;
    };

    this.pending = (state, value) => {
      state.data = value;
    };
    this.fulfilled = state => {
      state.status = EStatusState.IsFulfilled;
    };
  }
}
/**
 * Represents a class for handling OTP confirmation.
 */
class PostOtpConfirmation extends RReducer {
  public constructor() {
    super();
    this.action = async (values: { email: string; otp: string }) => {
      await API.post({ url: `${C_API.Auth}/otp-confirmation`, values });
      return true;
    };

    this.pending = (state, value) => {
      state.data = value;
    };
    this.fulfilled = (state, data) => {
      if (data) {
        state.status = EStatusState.IsFulfilled;
      }
    };
  }
}
/**
 * Represents a class for resetting password using patch method.
 */
class PostResetPassword extends RReducer {
  public constructor() {
    super();
    this.action = async (values: IResetPassword) => {
      await API.post({ url: `${C_API.Auth}/reset-password`, values });
      return true;
    };

    this.pending = (state, value) => {
      state.data = value;
    };
    this.fulfilled = state => {
      state.data = {};
      state.status = EStatusState.IsFulfilled;
    };
  }
}

/**
 * RGlobal is an object that contains various service methods for global functionality.
 * Each property represents a specific service method.
 */
export const RGlobal = {
  getProfile: new GetProfile(),
  putProfile: new PutProfile(),
  postLogin: new PostLogin(),
  postForgottenPassword: new PostForgottenPassword(),
  postOtpConfirmation: new PostOtpConfirmation(),
  postResetPassword: new PostResetPassword(),
};
