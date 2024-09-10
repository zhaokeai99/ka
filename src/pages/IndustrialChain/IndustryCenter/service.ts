import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import React from 'react';

export const IndustryProvider = React.createContext({
  industryName: '',
  industryId: '',
  chain: '',
});

// 行业画像-大类得分
export async function queryIndustryPortrait(params: any) {
  const { data } = await dispatchPass(API.industrialChain.QueryIndustryPortrait, params);
  return data || [];
}

// 行业画像-子类得分
export async function queryIndustryPortraitSub(params: any) {
  const { data } = await dispatchPass(API.industrialChain.QueryIndustryPortraitSub, params);
  return data || [];
}

// 行业画像-子类排名
export async function queryIndustryPortraitSubSort(params: any) {
  const { data } = await dispatchPass(API.industrialChain.QueryIndustryPortraitSubSort, params);
  return data || [];
}

// 行业中心-产业链行情-最新行情
export async function queryOneChainTrendDailyData(params: any) {
  const { data } = await dispatchPass(
    API.industrialChain.QueryOneChainTrendDailyDataByChainName,
    params,
  );
  return data || {};
}

// 行业中心-产业链行情-K线图
export async function queryListChainTrendDailyData(params: any) {
  const { data } = await dispatchPass(
    API.industrialChain.QueryListChainTrendDailyDataByChainName,
    params,
  );
  const xData: string[] = [],
    kData: any = [],
    ma5: number[] = [],
    ma10: number[] = [],
    ma20: number[] = [],
    ma30: number[] = [];
  data?.map((i: any) => {
    kData.push([i.openPrice, i.endPrice, i.highestPrice, i.lowestPrice]);
    xData.push(i.tm);
    ma5.push(i.ma5);
    ma10.push(i.ma10);
    ma20.push(i.ma20);
    ma30.push(i.ma30);
  });
  return { data, xData, kData, ma5, ma10, ma20, ma30 };
}

// 行业中心-研究报告
export async function queryReportInfoListByIndustryName(params: any) {
  const { data } = await dispatchPass(
    API.industrialChain.QueryReportInfoListByIndustryName,
    params,
  );
  const newData = data?.map((i: any) => ({
    ...i,
    tagList: [i.reportViewpoint, i.industryName, i.reportType, i.reportInd],
  }));
  return newData || [];
}

// 行业中心-基金详情
export async function queryIndustryFundInfo(params: any) {
  const { data } = await dispatchPass(API.industrialChain.QueryIndustryFundInfo, params);
  return data || [];
}

// 行业中心-行业政策
export async function queryThsPolicyData(params: any) {
  const { data } = await dispatchPass(API.industrialChain.queryThsPolicyData, params);

  return data || [];
}

// 行业中心-重点指标-查询产业链EDB指标详情
export async function queryChainEdbFinanceInfoList(params: any) {
  const { data, success } =
    (await dispatchPass(API.industrialChain.queryChainEdbFinanceInfoList, params)) || {};

  return { data, success };
}

// 行业画像-行业历史得分
export async function queryIndustryPortraitHistoryScore(params: any) {
  const { data, success } = await dispatchPass(
    API.industrialChain.queryIndustryPortraitHistoryScore,
    params,
  );

  return { data, success };
}

// 行业中心-产业链图谱
export async function queryStaticResourcesConfigInfo(params: any) {
  const { data, success } = await dispatchPass(
    API.industrialChain.queryStaticResourcesConfigInfo,
    params,
  );

  return { data, success };
}

// 行业中心-行业舆情
export async function queryIndustryNewsInfoAndLabel(params: any) {
  const { data } = await dispatchPass(API.industrialChain.queryIndustryNewsInfoAndLabel, params);

  return data || [];
}
