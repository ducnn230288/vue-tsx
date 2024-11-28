import i18n from 'i18next';
import { defineStore } from 'pinia';

import type { IMUser, IResetPassword } from '@/interfaces/model';
import { checkLanguage } from '@/utils';
import { RGlobal } from './base';
import { initialState, type StateGlobal } from './state';

export const name = 'Auth';
export const SGlobal = () =>
  defineStore(name, {
    state: (): StateGlobal => initialState,
    actions: {
      set(value: StateGlobal) {
        Object.keys(value).forEach(key => {
          this[key] = value[key as keyof StateGlobal];
        });
      },
      setLanguage(value) {
        if (value !== this.language) {
          const { language, locale, localeDate } = checkLanguage(value);
          i18n.changeLanguage(language);
          this.locale = locale;
          this.language = language;
          this.localeDate = localeDate;
        }
      },

      getProfile() {
        RGlobal.getProfile.reducer(this);
      },
      putProfile(values: IMUser) {
        RGlobal.putProfile.reducer(this, values);
      },
      postLogin(values: { password: string; email: string }) {
        RGlobal.postLogin.reducer(this, values);
      },
      postForgottenPassword(values: { email: string }) {
        RGlobal.postForgottenPassword.reducer(this, values);
      },
      postOtpConfirmation(values: { email: string; otp: string }) {
        RGlobal.postOtpConfirmation.reducer(this, values);
      },
      postResetPassword(values: IResetPassword) {
        RGlobal.postResetPassword.reducer(this, values);
      },
    },
  })();
