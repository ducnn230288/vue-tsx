<script setup lang="tsx">
import { useTranslation } from 'i18next-vue';
import { watch } from 'vue';
import { useRouter } from 'vue-router';

import { CButton } from '@/components/button';
import { CForm } from '@/components/form';
import { EFormRuleType, EStatusState } from '@/enums';
import { IForm } from '@/interfaces';
import { SGlobal } from '@/services';
import { LINK } from '@/utils';

const router = useRouter();
const sGlobal = SGlobal();
watch(
  () => sGlobal.status,
  () => {
    if (sGlobal.status === EStatusState.IsFulfilled) {
      sGlobal.set({ status: EStatusState.Idle });
      router.push({ path: `/${sGlobal.language}${LINK.VerifyForotPassword}`, replace: true });
    }
  },
  { immediate: true },
);

const { t } = useTranslation('locale', { keyPrefix: 'Pages.Base.Login.ForgetPassword' });
const columns: IForm[] = [
  {
    name: 'email',
    title: t('RecoveryEmail'),
    formItem: {
      rules: [{ type: EFormRuleType.Required }, { type: EFormRuleType.Email }],
    },
  },
];
const renderFooter = ({ canSubmit, form }) => (
  <CButton
    isLoading={sGlobal.isLoading}
    text={t('GetOTP')}
    onClick={() => form.handleSubmit()}
    disabled={!canSubmit}
    className={'!h-12 w-full rounded-lg bg-primary leading-4 text-base-100 hover:bg-primary/90'}
  />
);
</script>
<template>
  <div className="intro-x">
    <h1>{{ t('ForgetPassword') }}</h1>
    <h5>{{ t('PleaseEnterYourEmailAnOTPVerificationCodeWillBeSentToYou') }}</h5>
  </div>
  <CForm
    :isEnterSubmit="true"
    :isLoading="sGlobal.isLoading"
    :columns="columns"
    @submit="({ value }) => sGlobal.postForgottenPassword(value)"
  >
    <template #footer="{ canSubmit, form }"><component :is="renderFooter({ canSubmit, form })" /></template>
  </CForm>
  <div class="mt-3 text-center">
    <button
      :title="t('GoBackToLogin')"
      @click="() => router.push({ path: `/${sGlobal.language}${LINK.Login}`, replace: true })"
    >
      {{ t('GoBackToLogin') }}
    </button>
  </div>
</template>
