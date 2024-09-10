import React from 'react';
import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export const VogProvider = React.createContext({});

export const progressIconUrl =
  'https://cdnprod.tianhongjijin.com.cn/thfile/progress_icon1652342500255.png';

// 时间组件
export async function queryDateInfo() {
  const { data } = await dispatchPass(API.marketingApi.queryDateInfo);
  return data || {};
}

// 整体达成-卡片
export async function queryVogOverview(params: any) {
  const { data } = await dispatchPass(API.marketingApi.queryVogOverview, params);
  const newCardData = data?.typeList?.map((i: any) => ({
    ...i,
    vogRatio: (i?.vogRatio * 100).toFixed(2),
  }));
  return { ...data, typeList: newCardData || [] };
}

// 重点指标-部门体系达成
export async function queryVogWithPdept(params: any) {
  const { data, success } = await dispatchPass(API.marketingApi.queryVogWithPdept, params);
  return { data: data || [], success };
}

// 重点指标-专户专项业绩
export async function queryVogWithSpecialAccount(params: any) {
  const { data, success } = await dispatchPass(API.marketingApi.queryVogWithSpecialAccount, params);
  return { data: data || [], success };
}

// 存量趋势
export async function queryAmountTrend(params: any) {
  const { data } = await dispatchPass(API.marketingApi.queryAmountTrend, params);
  return data || [];
}

// 非货公募产品排行-产品类型卡片
export async function queryVogWithFundVogType(params: any) {
  const { data } = await dispatchPass(API.marketingApi.queryVogWithFundVogType, params);
  const finishData = data?.map((i: any) => ({
    ...i,
    vogRatio: (i?.vogRatio * 100).toFixed(2),
    name: i.fundVogName,
    type: i.fundVogType,
  }));
  return finishData || [];
}

// 非货公募产品排行-产品排行
export async function querySellInfoByFund(params: any) {
  const { data, success } = await dispatchPass(API.marketingApi.querySellInfoByFund, params);
  return { data, success, total: data?.length || 0 };
}

// 非货公募产品排行-二级卡片
export async function querySecondCardList(params: any) {
  const { data } = await dispatchPass(API.marketingApi.querySecondCardList, params);
  const finishData = data?.map((i: any) => ({
    ...i,
    name: i.fundCustomVogName,
    type: i.fundCustomVogName,
  }));
  return finishData || [];
}
