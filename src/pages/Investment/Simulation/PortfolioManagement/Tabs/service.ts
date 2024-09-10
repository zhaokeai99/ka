import { dispatchPass } from '@/services/service';
import { API } from '@/services/api';

// 组合持仓TableColumsType
export interface TableListMpHoldItem {
  id: number;
  bmCode: string;
  bmName: string;
  domain: string;
  bmType: number;
  indexCode: string;
  indexName: string;
  indexSysName: string;
}

// 组合调整TableColumsType
export interface TableListMpHoldChg {
  isEdit: boolean;
  id: number;
  tradeDate: string;
  stkType: string;
  stkCode: string;
  stkName: number;
  mtkCode: string;
  targetWeight: number;
  iniWeight: number;
  exRate: string;
  targetPrice: string;
  comn: string;
  chgWay: string;
  lastWeight: number;
}

// 组合成交明细TableColumsType
export interface TableListMpDeal {
  id: number;
  tradeDate: string;
  stkType: string;
  stkCode: string;
  stkName: string;
  mtkCode: string;
  orderType: number;
  targetWeight: number;
  exRate: number;
  dealDirection: string;
  dealPrice: number;
  dealAmount: number;
  dealBalance: number;
  ordelFeeYj: number;
}

// 组合换手TableColumsType
export interface TableListMpTurnOver {
  id: number;
  tradeDate: string;
  stkType: string;
  stkCode: string;
  stkName: number;
  mtkCode: string;
  afterMv: string;
  beforeMv: string;
  diffMv: string;
  pctChange: number;
}

// 组合调整查询
export async function MpRsHoldChgQuery(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpRsHoldChgQuery, params);
  return data || [];
}

// 成交明细查询
export async function MpRsDealQueryByPage(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpRsDealQueryByPage, params);
  return data || [];
}

// 组合换手查询
export async function MpTurnOverQueryByPage(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpTurnOverQueryByPage, params);
  return data || [];
}

// 查询sirm证券分类
export async function SirmStockQuery(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.SirmStockQuery, params);
  return data || [];
}

// 组合调整提交
export async function EditChgHold(params = {}) {
  return await dispatchPass(API.investmentApi.EditChgHold, params);
}

// 查询证券信息集合
export async function StkInfoListQuery(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.StkInfoListQuery, params);
  return data || [];
}

// 查询证券信息集合
export async function MpRsHoldChgFacadeRevokeAdjustment(params = {}) {
  return await dispatchPass(API.investmentApi.MpRsHoldChgFacadeRevokeAdjustment, params);
}
