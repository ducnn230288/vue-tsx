<script setup lang="tsx">
import { useTranslation } from 'i18next-vue';
import { useRoute, useRouter } from 'vue-router';

import { CBreadcrumbs } from '@/components/breadcrumbs';
import { CDataTable } from '@/components/data-table';
import { CDrawerForm } from '@/components/form/drawer';
import { CSideTree } from '@/components/slide-tree';
import { IMUser, IMUserRole } from '@/interfaces/model';
import { SCrud, SGlobal } from '@/services';
import { KEY_ROLE, searchTree } from '@/utils';
import { computed } from 'vue';
import _column from './variable';

const sGlobal = SGlobal();
const sCrud = SCrud<IMUser, IMUserRole>('User', 'UserRole');
const route = useRoute();
sCrud.get({ include: 'position' });
sCrud.getType({});

const handleSubmit = values => {
  if (sCrud.data?.id) sCrud.put({ ...values, id: sCrud.data.id, roleCode: route.query.roleCode });
  else sCrud.post({ ...values, roleCode: route.query.roleCode });
};
const { t } = useTranslation('locale', { keyPrefix: 'Pages.Base.User' });
const Form = computed(() => (
  <CDrawerForm
    facade={sCrud}
    columns={_column.form({ t, position: sCrud.data?.position })}
    title={t(sCrud.data?.id ? 'EditUser' : 'AddNewUser', {
      name: searchTree({ array: sCrud.resultType?.data, value: route.query.roleCode?.toString(), key: 'code' })?.name,
    })}
    onSubmit={handleSubmit}
  />
));

const router = useRouter();
const handleSelect = roleCode => {
  router.push({ path: route.path, query: { ...route.query, roleCode } });
};

const Main = computed(() => (
  <div className='card'>
    <div className='body'>
      <CDataTable
        filterGlobal={(row, columnId, value) => row.original[columnId].includes(value)}
        data={sCrud.result?.data?.filter(item => item.roleCode === route.query.roleCode)}
        isLoading={sCrud.isLoading}
        action={{
          onDisable: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_USER_UPDATE) && sCrud.put,
          onEdit: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_USER_UPDATE) && sCrud.getById,
          onDelete: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_USER_DESTROY) && sCrud.delete,
          name: data => data.name,
          label: t('User'),
          labelAdd: t('AddNewUser', {
            name: searchTree({ array: sCrud.resultType?.data, value: route.query.roleCode?.toString(), key: 'code' })
              ?.name,
          }),
          onAdd: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_USER_STORE) && sCrud.set,
        }}
        paginationDescription={(from: number, to: number, total: number) => t('PaginationUser', { from, to, total })}
        columns={_column.table({ t })}
      />
    </div>
  </div>
));
</script>
<template>
  <CBreadcrumbs :title="t('User')" :list="[t('User')]" />
  <component :is="Form" />
  <div class="wrapper-grid">
    <div className="-intro-x left">
      <CSideTree
        :label="t('Role')"
        :value="route.query.roleCode as string"
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
