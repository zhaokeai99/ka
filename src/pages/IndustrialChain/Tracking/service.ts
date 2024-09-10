import React from 'react';
import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export const ModelInfoProvider = React.createContext({
  modelInfo: {},
  search: {
    abnormalDate: '',
    industryCode: '',
  },
});

// 处理成树形组件需要的数据格式，动态配置需要的label
export const transOptions: any = (
  list: any = [],
  labelName: string = 'nodeName',
  valueName: string = 'nodeId',
  title: string = 'title',
  key: string = 'key',
  showOtherKey = true,
  level: number = 0,
) => {
  if (!Array.isArray(list)) {
    return [];
  }

  return list.map((item: any) => {
    return {
      ...(showOtherKey ? item : {}),
      [title]: item[labelName] || '--',
      [key]: item[valueName] + item[labelName],
      level: level + 1,
      ...(item.childList ? { key: item[valueName] } : {}),
      children:
        Array.isArray(item.childList) && item.childList.length
          ? transOptions(item.childList, labelName, valueName, title, key, true, level + 1)
          : [],
    };
  });
};

// 树形转化为一维数组
export const treeToList = (
  tree: { childList: any; preAbnormalName: any; abnormalId: any; abnormalName: any; key: string }[],
  res: { abnormalId: any; preAbnormalName: any; abnormalName: any; key: string }[],
) => {
  // 输出结果
  tree.forEach(({ childList, preAbnormalName, abnormalId, abnormalName }) => {
    res.push({ abnormalId, preAbnormalName, abnormalName, key: abnormalId + abnormalName });

    if (childList) {
      treeToList(childList, res);
    }
  });

  return res;
};

interface TrackTreeType {
  abnormalDate: string;
  industryCode: string;
  abnormalId?: string | number;
  abnormalName?: string;
}

// 查询模型节点树
export async function queryAbnormalTrackTree(params: TrackTreeType) {
  const { data, success } = await dispatchPass(API.industrialChain.queryAbnormalTrackTree, params);

  return { data, success };
}

interface TrackIndexType {
  abnormalDate: string;
  industryCode: string;
  abnormalId: string | number;
  abnormalName: string;
}

// 查询异动指标
export async function queryAbnormalTrackIndex(params: TrackIndexType) {
  const { data, success } = await dispatchPass(API.industrialChain.queryAbnormalTrackIndex, params);

  return { data, success };
}

// 行业列表
export async function queryIndustryChainList(params?: any) {
  const { data, success } = await dispatchPass(
    API.industrialChain.IndustryChainFacadeQueryIndustryChainList,
    params,
  );

  return { data, success };
}

// 查询异动回测列表
export async function queryBackTest(params: TrackIndexType) {
  const { data, success } = await dispatchPass(API.industrialChain.queryBackTest, params);

  return { data, success };
}
