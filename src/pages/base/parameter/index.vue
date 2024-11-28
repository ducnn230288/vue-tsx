<script setup lang="tsx">
import { useTranslation } from 'i18next-vue';
import { useRoute, useRouter } from 'vue-router';

import { CBreadcrumbs } from '@/components/breadcrumbs';
import { CButton } from '@/components/button';
import { CForm } from '@/components/form';
import { CSideTree } from '@/components/slide-tree';
import { EFormType } from '@/enums';
import { IMParameter } from '@/interfaces/model';
import { SCrud } from '@/services';
import { computed } from 'vue';

const sCrud = SCrud<IMParameter>('Parameter');
const route = useRoute();
sCrud.get({});

const { t } = useTranslation('locale', { keyPrefix: 'Pages.Base.Parameter' });
const router = useRouter();
const handleSelect = code => {
  if (sCrud.result?.data) sCrud.getById({ id: code, data: sCrud.result.data.find(item => item.code === code)! });
  router.push({ path: route.path, query: { ...route.query, code } });
};

const columns = [
  { title: 'name', name: 'name', formItem: { type: EFormType.Hidden } },
  { title: 'code', name: 'code', formItem: { type: EFormType.Hidden } },
  {
    title: t('VietnameseParameter'),
    name: 'contentVi',
    formItem: {
      col: 6,
      type: EFormType.Textarea,
    },
  },
  {
    title: t('EnglishParameter'),
    name: 'contentEn',
    formItem: {
      col: 6,
      type: EFormType.Textarea,
    },
  },
];
const renderFooter = ({ canSubmit, form }) => (
  <CButton
    text={t('Save')}
    onClick={() => form.handleSubmit()}
    disabled={!canSubmit}
    className={'!h-12 w-full rounded-lg bg-primary leading-4 text-base-100 hover:bg-primary/90'}
  />
);
const Main = computed(() => {
  const data = sCrud.data ?? sCrud.result?.data?.find(item => item.code === route.query.code);
  return (
    <div className='card'>
      <div className='header'>
        <h3>{t('EditParameter', { code: data?.name })}</h3>
      </div>
      <div className='desktop has-header'>
        <CForm
          isLoading={sCrud.isLoading}
          values={{ ...data }}
          className='intro-x'
          columns={columns}
          onSubmit={({ value }) => sCrud.put({ ...value, id: route.query.code })}
          v-slots={{ footer: ({ canSubmit, form }) => renderFooter({ canSubmit, form }) }}
        />
      </div>
    </div>
  );
});
</script>
<template>
  <CBreadcrumbs :title="t('Parameter')" :list="[t('Setting'), t('Parameter')]" />
  <div class="wrapper-grid">
    <div className="-intro-x left">
      <CSideTree
        :label="t('Parameter')"
        :value="(route?.query?.code ?? 'ADDRESS') as string"
        :isLoading="sCrud.isLoadingType"
        :listData="sCrud.result?.data"
        @select="handleSelect"
      />
    </div>
    <div class="intro-x right">
      <component :is="Main" />
    </div>
  </div>
</template>
