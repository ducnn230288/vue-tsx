<script setup lang="tsx" name="CEEditor">
import { TabPane, Tabs } from 'ant-design-vue';
import { useTranslation } from 'i18next-vue';

import CField from '../field.vue';
import { handleCondition } from '../util';
import type { PropsTab } from './interface';

/**
 * Renders a password input component.
 */

const { name, column = [], list, form, values, Field } = defineProps<PropsTab>();

const { t } = useTranslation('locale', { keyPrefix: 'Components' });

/**
 * Renders the tab content for a given name and index.
 *
 * @param name - The name of the tab.
 * @param i - The index of the tab.
 * @returns An array of JSX elements representing the tab content.
 */
const render = ({ name, i }: { name: string; i: number }) =>
  column
    .filter((item, index) => handleCondition({ item, index, values: values[i] }))
    .map((col: any, index: number) => (
      <div
        class={[col?.formItem?.classItem, 'sm:col-span-' + (col?.formItem?.col ?? 12), 'col-span-12']}
        key={'tabs' + index}
      >
        <CField
          item={col}
          index={index + '_' + i}
          name={`${name}[${i}].${col.name}`}
          t={t}
          form={form}
          values={values[i]}
          Field={Field}
        />
      </div>
    ));
</script>

<template>
  <component :is="Field" :name="name" mode="array">
    <template v-slot="{ field }">
      <Tabs :destroyInactiveTabPane="true">
        <TabPane v-for="(_, i) in field.state.value" :tab="list[i].label" :key="i">
          <div class="grid grid-cols-12 gap-x-5"><component :is="render" :name="name" :i="i" /></div>
        </TabPane>
      </Tabs>
    </template>
  </component>
</template>
