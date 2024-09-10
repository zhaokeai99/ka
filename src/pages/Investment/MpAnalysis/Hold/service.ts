import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 股票查询接口
export async function queryStockByPage(params = {}) {
  return await dispatchPass(API.investmentApi.queryStockByPage, params);
}

// 转债查询接口
export async function queryBondByPage(params = {}) {
  return await dispatchPass(API.investmentApi.queryBondByPage, params);
}

// 获取股票导出url
export async function getStockExportUrl() {
  return await dispatchPass(API.investmentApi.getStockExportUrl);
}

// 获取转债导出url
export async function getBondExportUrl() {
  return await dispatchPass(API.investmentApi.getBondExportUrl);
}

// 查询申万行业
export async function querySwClassifyLevelOne() {
  return await dispatchPass(API.investmentApi.querySwClassifyLevelOne);
}
