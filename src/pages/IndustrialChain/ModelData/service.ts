import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import React from 'react';

export const ModelInfoProvider = React.createContext({ modelInfo: {} });

// 处理成树形组件需要的数据格式，动态配置需要的label
export const transOptions: any = (
  list: any = [],
  labelName: string = 'nodeName',
  valueName: string = 'nodeId',
  title: string = 'title',
  key: string = 'key',
  showOtherKey = true,
) => {
  if (!Array.isArray(list)) {
    return [];
  }

  return list.map((item: any) => {
    return {
      ...(showOtherKey ? item : {}),
      [title]: item[labelName] || '--',
      [key]: item[valueName],
      ...(item.children ? { key: item[valueName] } : {}),
      children: Array.isArray(item.children)
        ? transOptions(item.children, labelName, valueName, title, key)
        : [],
    };
  });
};

// 查询模型节点树
export async function queryModelIntroTree() {
  const { data } = await dispatchPass(API.industrialChain.queryModelIntroTree);

  return data || [];
}

// 查询产业链节点EDB指标详情
export async function queryModelIntroInfoByModelName(params: any) {
  const { data } = await dispatchPass(API.industrialChain.queryModelIntroInfoByModelName, params);

  return data || {};
}
