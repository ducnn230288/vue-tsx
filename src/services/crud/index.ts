import { defineStore } from 'pinia';

import type { IPaginationQuery } from '@/interfaces';
import { RCurd } from './base';
import { initialState, type StateCrud } from './state';
import { RCurdType } from './type';

let keyApi;
let keyApiType;
const name = 'CURD';
export const SCrud = <T, Y = object>(apiKey?: string, apiKeyType?: string) => {
  if (apiKey) keyApi = apiKey;
  if (apiKeyType) keyApiType = apiKeyType;
  const keyId = 'id';
  const keyIsDelete = 'isDelete';
  return defineStore(name, {
    state: (): StateCrud<T, Y> => initialState as StateCrud<T, Y>,
    actions: {
      set(value: StateCrud<T, Y>) {
        Object.keys(value).forEach(key => {
          this[key] = value[key as keyof StateCrud<T, Y>];
        });
      },
      reset() {
        this.set(initialState as StateCrud<T, Y>);
      },
      modify(values: T) {
        const data = (this.result?.data ?? []) as T[];
        const index = data.findIndex(item => item[keyId] === values[keyId]);
        if (index > -1) data[index] = values;
        else data.unshift(values);
        this.set({ result: { ...this.result, data: data.filter(item => !item[keyIsDelete]) } });
      },
      modifyType(values: Y) {
        const data = (this.resultType?.data ?? []) as Y[];
        const index = data.findIndex(item => item[keyId] === values[keyId]);
        if (index > -1) data[index] = values;
        else data.unshift(values);
        this.set({ resultType: { ...this.resultType, data: data.filter(item => !item[keyIsDelete]) } });
      },

      get(params: IPaginationQuery<T>, format?: (item: T, index: number) => void) {
        RCurd.get.reducer(this, { params: params as IPaginationQuery, keyApi, format });
      },
      getById({ id, params, data }: { id: string; params?: IPaginationQuery<T>; data: T }) {
        RCurd.getId.reducer(this, { id, params: params as IPaginationQuery, keyApi, data });
      },
      post(values: T) {
        RCurd.post.reducer(this, { values: values as StateCrud, keyApi });
      },
      put(values: T) {
        RCurd.put.reducer(this, { values: values as StateCrud, keyApi });
      },
      delete(id: string) {
        RCurd.delete.reducer(this, { id, keyApi });
      },

      getType(params: IPaginationQuery<Y>) {
        RCurdType.get.reducer(this, { params: params as IPaginationQuery, keyApiType });
      },
      getByIdType({ id, params }: { id: string; params?: IPaginationQuery<Y> }) {
        RCurdType.getId.reducer(this, { id, params: params as IPaginationQuery, keyApiType });
      },
      postType(values: Y) {
        RCurdType.post.reducer(this, { values: values as StateCrud, keyApiType });
      },
      putType(values: Y) {
        RCurdType.put.reducer(this, { values: values as StateCrud, keyApiType });
      },
      deleteType(id: string) {
        RCurdType.delete.reducer(this, { id, keyApiType });
      },
    },
  })();
};
