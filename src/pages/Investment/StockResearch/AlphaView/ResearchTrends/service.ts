import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 研究动态数据分页查询
export async function irReportFacadeQueryByPage(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.IrReportFacadeQueryByPage, params);
  return data || [];
}

// 研究动态数据分页查询分组
export async function IrReportFacadeQueryIrReportInfoGroupByPage(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.IrReportFacadeQueryIrReportInfoGroupByPage,
    params,
  );
  return data || [];
}
// 上一交易日
export async function MpRsSysBaseInfoFacadeGetPrevTrade(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpRsSysBaseInfoFacadeGetPrevTrade, params);
  return data || [];
}

// 内部用户信息查询
export async function irReportFacadeQueryIrUserInfo(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.IrReportFacadeQueryIrUserInfo, params);
  return data || [];
}

// 内部研究码表查询
export async function irReportFacadeQuerySysConfigCode(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.IrReportFacadeQuerySysConfigCode, params);
  return data || [];
}

// 内部研究范围记录
export async function IrReportFacadeQueryTargetRand(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.IrReportFacadeQueryTargetRand, params);
  return data || [];
}

// 查看oss
export async function IrReportFacadeGetOssUrl(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.IrReportFacadeGetOssUrl, params);
  return data || [];
}
