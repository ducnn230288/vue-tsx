<script setup lang="tsx" name="CEAddable">
import { Checkbox } from 'ant-design-vue';
import { useTranslation } from 'i18next-vue';
import { reactive } from 'vue';

import { EIcon } from '@/enums';
import { CButton } from '../../button';
import { CSvgIcon } from '../../svg-icon';
import CField from '../field.vue';
import { handleCondition } from '../util';
import type { PropsAddable } from './interface';

/**
 * Component description.
 */
const {
  name = '',
  column = [],
  textAdd = 'Thêm dòng',
  onAdd = () => null,
  form = {},
  isTable = true,
  showRemove = () => true,
  idCheck,
  values = [],
  Field,
} = defineProps<PropsAddable>();
/**
 * Represents the state of the addable input component.
 */
const state = reactive<{ indeterminate: boolean; checkAll: boolean; checkedList: any[] }>({
  indeterminate: false,
  checkAll: false,
  checkedList: [],
});

/**
 * Handles the change event when the "Check All" checkbox is clicked.
 *
 * @param e - The event object.
 */
const onCheckAllChange = (e: any) => {
  /**
   * Updates the `array` by setting the value of the `idCheck + 'Checked'` property of each item to the value of `e.target.checked`.
   *
   * @param {any[]} array - The array to be updated.
   * @param {ChangeEvent<HTMLInputElement>} e - The event object containing the checked value.
   * @param {string} idCheck - The identifier used to construct the property name.
   * @returns {any[]} The updated array.
   */
  const array = form.getFieldValue(name).map((item: any) => {
    item[idCheck + 'Checked'] = e.target.checked;
    return item;
  });
  state.indeterminate = false;
  state.checkAll = e.target.checked;
  state.checkedList = e.target.checked ? array.map((item: any) => item[idCheck]) : [];

  form.setFieldValue(name, array);
};
/**
 * Handles the change event for a checkbox.
 *
 * @param e - The event object.
 * @param array - The array containing the checkbox values.
 * @param index - The index of the checkbox in the array.
 */
const onCheckChange = (e: any, array: any[], index: number) => {
  if (e.target.checked) {
    state.checkedList.push(array[index][idCheck]);

    state.indeterminate = array.length !== state.checkedList.length;
    state.checkAll = array.length === state.checkedList.length;
    // state.checkedList = state.checkedList;
  } else {
    state.checkedList.splice(state.checkedList.indexOf(array[index][idCheck]), 1);
    state.indeterminate = state.checkedList.length !== 0;
    state.checkAll = false;
    // state.checkedList = state.checkedList;
  }
  array[index][idCheck + 'Checked'] = e.target.checked;
  if (form.setFieldValue) {
    form.setFieldValue(name, array);
  }
};
/**
 * Retrieves the translation function from the specified locale and sets the key prefix to 'Components'.
 * @returns The translation function.
 */
const { t } = useTranslation('locale', { keyPrefix: 'Components' });

/**
 * Renders a table with addable rows.
 *
 * @param fields - The array of fields for each row.
 * @param add - The function to add a new row.
 * @param remove - The function to remove a row.
 */
const renderTable = ({ field, value }: any) => (
  <>
    <div class={'table w-full border-collapse'} style={{ minWidth: column.length * 150 }}>
      <div class='table-row'>
        {!!idCheck && (
          <div class={'table-cell w-10 p-1 text-center font-bold'}>
            <Checkbox indeterminate={state.indeterminate} onChange={onCheckAllChange} checked={state.checkAll} />
          </div>
        )}
        <div class={'table-cell w-10 border bg-gray-300 p-1 text-center font-bold'}>STT</div>
        {column.map((col: any, index: number) => (
          <div
            key={name + index}
            class={[
              'table-cell border bg-gray-300 p-1 text-center font-bold',
              {
                'w-full': column.length === 1,
                'w-1/2': column.length === 2,
                'w-1/3': column.length === 3,
                'w-1/4': column.length === 4,
                'w-1/5': column.length === 5,
                'w-1/6': column.length === 6,
              },
            ]}
          >
            {col.title}
          </div>
        ))}
        <div class={'h-1 w-8'} />
      </div>
      {value?.map((item, i) => (
        <div class='table-row' key={name + i}>
          {!!idCheck && (
            <div class={'table-cell text-center'}>
              <Checkbox
                onChange={e => onCheckChange(e, field.state?.value, i)}
                checked={state.checkedList.indexOf(item[idCheck] ?? '') > -1}
              />
            </div>
          )}
          <div class={'table-cell border bg-base-200 text-center'}>{i + 1}</div>
          {column
            .filter((item, index) => handleCondition({ item, index, values: values[i] }))
            .map((col: any, index: number) => (
              <div class={'relative table-cell border'} key={name + index}>
                <CField
                  item={col}
                  index={index + '_' + i}
                  isLabel={false}
                  name={`${name}[${i}].${col.name}`}
                  t={t}
                  form={form}
                  values={values[i]}
                  Field={Field}
                />
              </div>
            ))}
          <div class={'table-cell w-8 align-middle sm:w-8'}>
            {showRemove(item) && (
              <button
                onClick={() => {
                  field.removeValue(i);
                  onAdd(form.getFieldValue(name));
                }}
              >
                <CSvgIcon name={EIcon.Trash} size={32} class='fill-error hover:fill-error/50' />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
    <div class={'flex justify-end'}>
      <CButton
        onClick={() => {
          field.pushValue({});
          onAdd(form.getFieldValue(name));
        }}
        icon={<CSvgIcon name={EIcon.Plus} size={20} />}
        text={textAdd}
      />
    </div>
  </>
);

/**
 * Renders the input fields for the addable component.
 *
 * @param fields - The array of fields to render.
 * @param add - The function to add a new field.
 * @param remove - The function to remove a field.
 */
const renderInput = ({ field, value }: any) => (
  <>
    {value?.map((item, i) => (
      <div class={'grid grid-cols-12 gap-x-5'} key={name + i}>
        {column
          .filter((item, index) => handleCondition({ item, index, values: values[i] }))
          .map((col: any, index: number) => (
            <div
              class={[col?.formItem?.classItem, 'col-span-12', 'sm:col-span-' + (col?.formItem?.col ?? 12)]}
              key={'addable' + index}
            >
              <CField
                item={col}
                index={index + '_' + i}
                isLabel={false}
                name={`${name}[${i}].${col.name}`}
                t={t}
                form={form}
                values={values[i]}
                Field={Field}
              />
            </div>
          ))}
        <div class={'table-cell w-8 align-middle'}>
          {showRemove(item) && (
            <button
              onClick={() => {
                field.removeValue(i);
                onAdd(form.getFieldValue(name));
              }}
            >
              <CSvgIcon name={EIcon.Trash} size={32} class='fill-error hover:fill-error/50' />
            </button>
          )}
        </div>
      </div>
    ))}
    <div class={'flex justify-end'}>
      <CButton
        icon={<CSvgIcon name={EIcon.Plus} size={20} />}
        text={textAdd}
        onClick={() => {
          field.pushValue({});
          onAdd(form.getFieldValue(name));
        }}
      />
    </div>
  </>
);
</script>

<template>
  <component :is="Field" :name="name" mode="array">
    <template v-slot="{ field }">
      <component :is="isTable ? renderTable : renderInput" :field="field" :value="field.state?.value" />
    </template>
  </component>
</template>
