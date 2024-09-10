import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 查询公募基金列表
export async function queryRaisereportList(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryRaisereportList, params);
  return { ...data, data: data?.dataList || [] };
}
// 生效公告基本信息
export async function queryEffectBasicData(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryEffectBasicData, params);
  return { ...data, basicData: data || [] };
}
// 生效公告发起式信息
export async function querySponsorData(params: any) {
  const { data } = await dispatchPass(API.productionApi.querySponsorData, params);
  return { ...data, sponsordData: data || [] };
}
// 生效公告募集信息
export async function queryRaiseData(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryRaiseData, params);
  return { ...data, raisedData: data?.fundRaiseList || [] };
}
export async function fetchAllEffectData(params: any) {
  return await Promise.all([
    queryEffectBasicData(params),
    querySponsorData(params),
    queryRaiseData(params),
  ]);
}
// 备案请示
export async function queryFilingReport(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryFilingReport, params);
  return { ...data, data: data || {} };
}
// 投资者情况说明
export async function queryInvestorsDesReport(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryInvestorsDesReport, params);
  return { ...data, data: data || {} };
}
// 验资报告
export async function queryCVRReport(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryCVRReport, params);
  return { ...data, data: data || [] };
}
