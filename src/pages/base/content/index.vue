<script setup lang="tsx">
import { useTranslation } from 'i18next-vue';
import { useRoute, useRouter } from 'vue-router';

import { CBreadcrumbs } from '@/components/breadcrumbs';
import { CDataTable } from '@/components/data-table';
import { CDrawerForm } from '@/components/form/drawer';
import { CSideTree } from '@/components/slide-tree';
import { IContentType, IMContent } from '@/interfaces/model';
import { SCrud, SGlobal } from '@/services';
import { KEY_ROLE, searchTree } from '@/utils';
import { computed } from 'vue';
import _column from './variable';

const sGlobal = SGlobal();
const sCrud = SCrud<IMContent, IContentType>('Content', 'ContentType');
const route = useRoute();
sCrud.get({ include: 'languages' });
sCrud.getType({});

const handleSubmit = values => {
  if (sCrud.data?.id) sCrud.put({ ...values, id: sCrud.data.id, typeCode: route.query.typeCode });
  else sCrud.post({ ...values, typeCode: route.query.typeCode });
};
const { t } = useTranslation('locale', { keyPrefix: 'Pages.Base.Content' });
const Form = computed(() => (
  <CDrawerForm
    size={'large'}
    facade={sCrud}
    columns={_column.form({ t })}
    title={t(sCrud.data?.id ? 'EditContent' : 'AddNewContent', {
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
          ?.map(item => ({
            ...item,
            name: item?.languages?.find(sub => sub.language === localStorage.getItem('i18nextLng'))?.name,
          }))}
        isLoading={sCrud.isLoading}
        action={{
          onDisable: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CONTENT_UPDATE) && sCrud.put,
          onEdit: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CONTENT_UPDATE) && sCrud.getById,
          onDelete: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CONTENT_DESTROY) && sCrud.delete,
          name: data => data.name,
          label: t('Content'),
          labelAdd: t('AddNewContent', {
            name: searchTree({ array: sCrud.resultType?.data, value: route.query.typeCode?.toString(), key: 'code' })
              ?.name,
          }),
          onAdd: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CONTENT_STORE) && sCrud.set,
        }}
        paginationDescription={(from: number, to: number, total: number) => t('PaginationContent', { from, to, total })}
        columns={_column.table({ t })}
      />
    </div>
  </div>
));
</script>
<template>
  <CBreadcrumbs :title="t('Content')" :list="[t('Setting'), t('Content')]" />
  <component :is="Form" />
  <div class="wrapper-grid">
    <div className="-intro-x left">
      <CSideTree
        :label="t('TypeContent')"
        :value="route.query.typeCode as string"
        :isLoading="sCrud.isLoadingType"
        :listData="sCrud.resultType?.data"
        @select="handleSelect"
      />
    </div>
    <div class="intro-x right">
      <component :is="Main" />
    </div>
  </div>
</template>
