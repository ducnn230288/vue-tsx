<script setup lang="tsx">
import { useTranslation } from 'i18next-vue';
import { useRoute, useRouter } from 'vue-router';

import { CBreadcrumbs } from '@/components/breadcrumbs';
import { CDataTable } from '@/components/data-table';
import { CDrawerForm } from '@/components/form/drawer';
import { CSideTree } from '@/components/slide-tree';
import { IMPost, IMPostType } from '@/interfaces/model';
import { SCrud, SGlobal } from '@/services';
import { KEY_ROLE, mapTreeObject, searchTree } from '@/utils';
import { computed } from 'vue';
import _column from './variable';
import _columnType from './variable/type';

const sGlobal = SGlobal();
const sCrud = SCrud<IMPost, IMPostType>('Post', 'PostType');
const route = useRoute();
sCrud.get({ include: 'languages' });
sCrud.getType({});

const handleSubmit = values => {
  if (sCrud.data?.id) sCrud.put({ ...values, id: sCrud.data.id, typeCode: route.query.typeCode });
  else sCrud.post({ ...values, typeCode: route.query.typeCode });
};
const { t } = useTranslation('locale', { keyPrefix: 'Pages.Base.Post' });
const Form = computed(() => (
  <CDrawerForm
    size={'large'}
    facade={sCrud}
    columns={_column.form({ t, id: sCrud.data?.id })}
    title={t(sCrud.data?.id ? 'EditPost' : 'AddNewPost', {
      name: searchTree({ array: sCrud.resultType?.data, value: route.query.typeCode?.toString(), key: 'code' })?.name,
    })}
    onSubmit={handleSubmit}
  />
));

const router = useRouter();
const handleSelect = typeCode => {
  router.push({ path: route.path, query: { ...route.query, typeCode } });
};
const Main = computed(() => (
  <div className='card'>
    <div className='body'>
      <CDataTable
        filterGlobal={(row, columnId, value) => row.original[columnId].includes(value)}
        data={sCrud.result?.data
          ?.filter(item => item.typeCode === route.query.typeCode)
          ?.map(item => {
            const language = item?.languages?.find(sub => sub.language === localStorage.getItem('i18nextLng'));
            return {
              ...item,
              name: language?.name,
              slug: language?.slug,
            };
          })}
        isLoading={sCrud.isLoading}
        action={{
          onDisable: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_UPDATE) && sCrud.put,
          onEdit: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_UPDATE) && sCrud.getById,
          onDelete: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_DESTROY) && sCrud.delete,
          name: data => data.name,
          label: t('Post'),
          labelAdd: t('AddNewPost', {
            name: searchTree({ array: sCrud.resultType?.data, value: route.query.typeCode?.toString(), key: 'code' })
              ?.name,
          }),
          onAdd: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_STORE) && sCrud.set,
        }}
        paginationDescription={(from: number, to: number, total: number) => t('PaginationPost', { from, to, total })}
        columns={_column.table({ t })}
      />
    </div>
  </div>
));

const onSubmitType = values => {
  if (sCrud.dataType?.id) sCrud.putType({ ...values, id: sCrud.dataType.id });
  else sCrud.postType({ ...values });
};
const FormType = computed(() => (
  <CDrawerForm
    facade={sCrud}
    keyData='dataType'
    keyIsLoading='isLoadingType'
    keyState='isVisibleType'
    columns={_columnType.form({ t, id: sCrud.dataType?.id, list: sCrud.resultType?.data?.map(mapTreeObject) })}
    title={t(sCrud.dataType?.id ? 'EditTypePost' : 'AddNewTypePost')}
    onSubmit={onSubmitType}
  />
));
</script>
<template>
  <CBreadcrumbs :title="t('Post')" :list="[t('Setting'), t('Post')]" />
  <component :is="Form" />
  <component :is="FormType" />
  <div class="wrapper-grid">
    <div className="-intro-x left">
      <CSideTree
        :label="t('TypePost')"
        :value="route.query.typeCode as string"
        :isLoading="sCrud.isLoadingType"
        :listData="sCrud.resultType?.data"
        @select="handleSelect"
        @add="sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_TYPE_STORE) && sCrud.set"
        @edit="sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_TYPE_UPDATE) && sCrud.getByIdType"
        @delete="sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_TYPE_DESTROY) && sCrud.deleteType"
      />
    </div>
    <div class="intro-x right">
      <component :is="Main" />
    </div>
  </div>
</template>
