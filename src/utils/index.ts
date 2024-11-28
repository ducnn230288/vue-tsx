import { ETypeChart } from '@/enums';
import enUS from 'ant-design-vue/lib/locale/en_US';
import jaJP from 'ant-design-vue/lib/locale/ja_JP';
import viVN from 'ant-design-vue/lib/locale/vi_VN';
import dayjs from 'dayjs';

import { enLocale, jaLocale, viLocale } from './locale';
import { KEY_USER } from './variable';

export * from './api';
export * from './variable';

/**
 * Sorts two objects based on a specified property.
 * @param {Object} options - The options for sorting.
 * @param {any} options.left - The left object to compare.
 * @param {any} options.right - The right object to compare.
 * @param {string} [options.name] - The name of the property to compare. (optional)
 * @returns {number} - Returns -1 if left is less than right, 1 if left is greater than right, or 0 if they are equal.
 */
export const sortObject = ({ left, right, name }: { left: any; right: any; name?: string }) => {
  if (name !== undefined) {
    if (left[name] < right[name]) return -1;
    else if (left[name] > right[name]) return 1;
  }
  return 0;
};

/**
 * Converts a File object to a base64 string.
 *
 * @param file - The File object to convert.
 * @returns A Promise that resolves to the base64 string representation of the file.
 */
export const handleGetBase64 = async (file: File) =>
  await new Promise(resolve => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.readAsDataURL(file);
  });

/**
 * Moves an element within an array from the old index to the new index.
 *
 * @param arr - The array to modify.
 * @param old_index - The index of the element to move.
 * @param new_index - The new index where the element should be moved to.
 * @returns The modified array with the element moved.
 */
export const arrayMove = (arr: any[], old_index: number, new_index: number) => {
  if (new_index >= arr.length) {
    let k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr.filter(item => !!item);
};

/**
 * Removes duplicate elements from an array.
 * If a key is provided, it checks for duplicates based on the value of the specified key.
 * If no key is provided, it checks for duplicates based on the entire object.
 *
 * @param array - The array to remove duplicates from.
 * @param key - The key to check for duplicates (optional).
 * @returns A new array with duplicate elements removed.
 */
export const arrayUnique = (array: any, key?: string) => {
  const a = array.concat();
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if ((key && a[i][key] === a[j][key]) || JSON.stringify(a[i]) === JSON.stringify(a[j])) {
        a.splice(j, 1);
      }
    }
  }
  return a;
};

/**
 * Searches a tree-like structure for an item with a specific value in a given key.
 * @param array - The array representing the tree structure.
 * @param value - The value to search for.
 * @param key - The key to compare the value against in each item.
 * @returns The first item found with the specified value in the specified key, or null if not found.
 */
export const searchTree = ({ array, value, key = '' }: { array: any; value?: string; key?: string }): any => {
  let result = null;
  if (array?.length)
    array.forEach(item => {
      if (!result) {
        if (item[key] == value) {
          result = item;
        } else if (item.children != null) {
          result = searchTree({ array: item.children, value, key });
        }
      }
    });
  return result;
};
/**
 * Maps a tree object to a new object with modified properties.
 *
 * @param item - The tree object to be mapped.
 * @returns The mapped object.
 */
export const mapTreeObject = (item: any): any => {
  return {
    ...item,
    title: item?.title ?? item?.name,
    key: item?.code ?? item?.id,
    value: item?.code ?? item?.id,
    isLeaf: !item?.children?.length,
    expanded: true,
    children: !item?.children ? null : item?.children?.map((i: any) => mapTreeObject(i)),
  };
};

/**
 * Formats data for a chart.
 *
 * @param obj - The data object.
 * @param title - The title of the chart.
 * @param level - The level of the data.
 * @param list - The list of fields to include in the chart.
 * @param type - The type of chart.
 * @returns An object containing the formatted data for the chart.
 */
export const formatDataChart = ({
  obj,
  title,
  level = 1,
  list,
  type = ETypeChart.Pie,
}: {
  obj: any;
  title: string;
  level?: number;
  list?: string[];
  type: ETypeChart;
}) => {
  const listXy = [ETypeChart.Scatter, ETypeChart.Bubble];
  const listNumber = [ETypeChart.Pie, ETypeChart.Ring];
  let series: any[] = [];
  const category = obj.data
    .filter((i: any) => !level || (i.level === level && !i.isSummary))
    .map((i: any) => i.content);
  if (listXy.indexOf(type) > -1) {
    const listField: any[] = [];
    obj.meta
      .filter((i: any) => i.type === 'number' && (!list?.length || list.indexOf(i.field) > -1))
      .forEach((i: any, j: number, array: any[]) => {
        if (type === ETypeChart.Bubble) {
          if (j % 3 === 2) {
            listField.push({
              name: array[j - 1].fullName + ' vs ' + array[j - 2].fullName + ' vs ' + i.fullName,
              field: array[j - 1].field + '|' + array[j - 2].field + '|' + i.field,
              value: [],
            });
          }
        } else if (j % 2 === 1) {
          listField.push({
            name: array[j - 1].fullName + ' vs ' + i.fullName,
            field: array[j - 1].field + '|' + i.field,
            value: [],
          });
        }
      });
    obj.data
      .filter((i: any) => !level || (i.level === level && !i.isSummary))
      .forEach((e: any) => {
        series.push({ name: e.content, value: [] });
        listField.forEach((_: any, index: number) => {
          const arrayField = listField[index].field.split('|');
          const value: number[] = [];
          arrayField.forEach((i: string) => {
            value.push(isNumeric(e[i]) ? parseFloat(e[i]) : 0);
          });
          series[series.length - 1].value.push([...value, ...listField[index].name.split(' vs ')]);
        });
      });
  } else {
    const listField = obj.meta
      .filter((i: any) => i.type === 'number' && (!list?.length || list.indexOf(i.field) > -1))
      .map((i: any) => ({ value: listNumber.indexOf(type) > -1 ? 0 : [], name: i.fullName, field: i.field }));
    obj.data
      .filter((i: any) => !level || (i.level === level && !i.isSummary))
      .forEach((e: any) => {
        listField.forEach((i: any, index: number) => {
          if (listNumber.indexOf(type) > -1 && isNumeric(e[i.field])) listField[index].value += parseFloat(e[i.field]);
          else listField[index].value.push(isNumeric(e[i.field]) ? parseFloat(e[i.field]) : 0);
        });
      });
    series = listNumber.indexOf(type) > -1 ? [{ data: listField }] : listField;
  }
  return { title, type, series, category };
};

/**
 * Checks if a given string is numeric.
 *
 * @param str - The string to check.
 * @returns `true` if the string is numeric, `false` otherwise.
 */
export const isNumeric = (str: string) => {
  return !isNaN(Number(str)) && !isNaN(parseFloat(str));
};

/**
 * Checks the language and sets the locale and localeDate accordingly.
 * @param language - The language to be checked.
 * @returns An object containing the language, locale, and localeDate.
 */
export const checkLanguage = (language: string) => {
  let locale;
  let localeDate;
  switch (language) {
    case 'en':
      locale = enUS;
      localeDate = enLocale;
      break;
    case 'vi':
      locale = viVN;
      localeDate = viLocale;
      break;
    case 'ja':
      locale = jaJP;
      localeDate = jaLocale;
      break;
  }
  dayjs.locale(language);
  localStorage.setItem('i18nextLng', language);
  document.querySelector('html')?.setAttribute('lang', language);
  const user = JSON.parse(localStorage.getItem(KEY_USER) ?? '{}');
  return { language, locale, localeDate, user };
};

export const generateRangeNumber = ({ start, end, step = 1 }: { start?: number; end?: number; step?: number }) => {
  if (start !== undefined && end !== undefined) {
    const len = Math.floor((end - start) / step) + 1;
    return Array(len)
      .fill(undefined)
      .map((_, idx) => start + idx * step);
  }
  return [];
};
/**
 * Formats a given date string into the specified format using Day.js.
 *
 * @param {string} dateString - The date string to be formatted.
 * @param {string} [format=FORMAT_DATE] - The format string to use for formatting the date.
 * @returns {string} The formatted date string.
 * @throws {Error} If the provided date string is invalid.
 */
export function formatDateTime(dateString: string, format: string = FORMAT_DATE): string {
  /**
   * Creates a Day.js date object from the provided date string.
   *
   * @param {string} dateString - The date string to be parsed into a Day.js date object.
   * @returns {Dayjs} The Day.js date object representing the parsed date.
   */
  const dateObj = dayjs(dateString);
  if (!dateObj.isValid()) {
    return dateString;
  }

  return dateObj.format(format);
}
