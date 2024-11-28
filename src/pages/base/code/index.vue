<script setup lang="tsx">
import { useTranslation } from 'i18next-vue';
import { useRoute, useRouter } from 'vue-router';

import { CBreadcrumbs } from '@/components/breadcrumbs';
import { CDataTable } from '@/components/data-table';
import { CDrawerForm } from '@/components/form/drawer';
import { CSideTree } from '@/components/slide-tree';
import { IMCode, IMCodeType } from '@/interfaces/model';
import { SCrud, SGlobal } from '@/services';
import { KEY_ROLE, searchTree } from '@/utils';
import { computed } from 'vue';
import _column from './variable';

const sGlobal = SGlobal();
const sCrud = SCrud<IMCode, IMCodeType>('Code', 'CodeType');
const route = useRoute();
sCrud.get({});
sCrud.getType({});

const handleSubmit = values => {
  if (sCrud.data?.id) sCrud.put({ ...values, id: sCrud.data.code, typeCode: route.query.typeCode });
  else sCrud.post({ ...values, typeCode: route.query.typeCode });
};
const { t } = useTranslation('locale', { keyPrefix: 'Pages.Base.Code' });
const Form = computed(() => (
  <CDrawerForm
    facade={sCrud}
    columns={_column.form({ t })}
    title={t(sCrud.data?.id ? 'EditCode' : 'AddNewCode', {
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
        data={sCrud.result?.data?.filter(item => item.typeCode === route.query.typeCode)}
        isLoading={sCrud.isLoading}
        action={{
          onDisable: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CODE_UPDATE) && sCrud.put,
          onEdit: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CODE_UPDATE) && sCrud.getById,
          onDelete: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CODE_DESTROY) && sCrud.delete,
          name: data => data.name,
          label: t('Code'),
          labelAdd: t('AddNewCode', {
            name: searchTree({ array: sCrud.resultType?.data, value: route.query.typeCode?.toString(), key: 'code' })
              ?.name,
          }),
          onAdd: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CODE_STORE) && sCrud.set,
        }}
        paginationDescription={(from: number, to: number, total: number) => t('PaginationCode', { from, to, total })}
        columns={_column.table({ t })}
      />
    </div>
  </div>
));
</script>
<template>
  <CBreadcrumbs :title="t('Code')" :list="[t('Setting'), t('Code')]" />
  <component :is="Form" />
  <div class="wrapper-grid">
    <div className="-intro-x left">
      <CSideTree
        :label="t('TypeCode')"
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
