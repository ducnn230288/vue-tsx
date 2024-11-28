<script setup lang="tsx">
import { useTranslation } from 'i18next-vue';
import { watch } from 'vue';
import { useRouter } from 'vue-router';

import { CButton } from '@/components/button';
import { CForm } from '@/components/form';
import { EFormRuleType, EFormType, EStatusState } from '@/enums';
import { IForm } from '@/interfaces';
import { SGlobal } from '@/services';
import { LINK } from '@/utils';

const router = useRouter();
const sGlobal = SGlobal();
watch(
  () => sGlobal.status,
  () => {
    if (sGlobal.status === EStatusState.IsFulfilled && sGlobal.user && Object.keys(sGlobal.user).length > 0) {
      sGlobal.set({ status: EStatusState.Idle });
      router.push({ path: '/' + sGlobal.language + '/dashboard', replace: true });
    }
  },
  { immediate: true },
);
if (!sGlobal.data?.email) router.push({ path: `/${sGlobal.language}${LINK.ForgetPassword}`, replace: true });

const { t } = useTranslation('locale', {
  keyPrefix: 'Pages.Base.Login.ForgetPassword.VerifyForgotPassword.ResetPassword',
});
const columns: IForm[] = [
  {
    name: 'otp',
    title: '',
    formItem: {
      type: EFormType.Hidden,
    },
  },
  {
    title: '',
    name: 'email',
    formItem: {
      type: EFormType.Hidden,
    },
  },
  {
    name: 'password',
    title: t('Password'),
    formItem: {
      type: EFormType.Password,
      rules: [{ type: EFormRuleType.Required }],
    },
  },
  {
    name: 'passwordConfirmation',
    title: t('ConfirmPassword'),
    formItem: {
      type: EFormType.Password,
      rules: [
        { type: EFormRuleType.Required },
        {
          type: EFormRuleType.Custom,
          validator: ({ value, form }) => {
            if (!value || form.getFieldValue('password') === value) return '';
            return t('TwoPasswordsThatYouEnterIsInconsistent');
          },
        },
      ],
    },
  },
];
const renderFooter = ({ canSubmit, form }) => (
  <CButton
    isLoading={sGlobal.isLoading}
    text={t('Submit')}
    onClick={() => form.handleSubmit()}
    disabled={!canSubmit}
    className={'!h-12 w-full rounded-lg bg-primary leading-4 text-base-100 hover:bg-primary/90'}
  />
);
</script>
<template>
  <div className="intro-x">
    <h1>{{ t('ResetPassword') }}</h1>
    <h5>{{ t('PasswordRequires8CharactersOrMoreWithAtLeast1UppercaseLetter') }}</h5>
  </div>
  <CForm
    :isEnterSubmit="true"
    :isLoading="sGlobal.isLoading"
    :columns="columns"
    @submit="({ value }) => sGlobal.postResetPassword(value)"
  >
    <template #footer="{ canSubmit, form }"><component :is="renderFooter({ canSubmit, form })" /></template>
  </CForm>
</template>
