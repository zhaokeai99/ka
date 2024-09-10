import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import React from 'react';

export const SelectKeyProvider = React.createContext({ selectKey: {} });
export const TabProvider = React.createContext({ tab: '' });

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
        ? transOptions(item.children, labelName, valueName)
        : [],
    };
  });
};

// 查询产业链节点树
export async function queryChainNodeTree(params: any) {
  const { data } = await dispatchPass(API.industrialChain.queryChainNodeTree, params);

  return data || [];
}

// 查询产业链节点EDB指标详情
export async function queryChainNodeEdbData(params: any) {
  const { data } = await dispatchPass(API.industrialChain.queryChainNodeEdbData, params);

  return data || [];
}

// 查询行业基金详情
export async function queryIndustryFundInfo(params: any) {
  const { data } = await dispatchPass(API.industrialChain.queryIndustryFundInfo, params);

  return data || [];
}

// 节点公司公告掘金接口
export async function queryCompanyEarningsEstimateCount(params: any) {
  const { data } = await dispatchPass(
    API.industrialChain.queryCompanyEarningsEstimateCount,
    params,
  );

  return data || [];
}

// 查询上市发债公司营业情况
export async function queryStockFinancialIndex(params: any) {
  const { data } = await dispatchPass(API.industrialChain.queryStockFinancialIndex, params);

  return data || {};
}

// 查询节点竞争格局报告期列表
export async function queryCompanyProductsIncomeDeclareDate(params: any) {
  const { data } = await dispatchPass(
    API.industrialChain.queryCompanyProductsIncomeDeclareDate,
    params,
  );

  return data || {};
}

// 查询节点竞争格局
export async function queryCompanyProductsIncome(params: any) {
  const { data } = await dispatchPass(API.industrialChain.queryCompanyProductsIncome, params);

  return data || [];
}

// 舆情
export async function queryChainNodeNewsInfoLimitList(params: any) {
  const { data } = await dispatchPass(API.industrialChain.queryChainNodeNewsInfoLimitList, params);

  return data || {};
}

// 查询节点tag异动情况
export async function queryNodeTagAbnormalSignal(params: any) {
  const { data } = await dispatchPass(API.industrialChain.queryNodeTagAbnormalSignal, params);

  return data || [];
}
