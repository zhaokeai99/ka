import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface optionType {
  subTypeCode: string;
  subTypeName: string;
}

export interface EventListItemType {
  eventAbstract: string;
  eventContent: string;
  eventSubType: string;
  eventTitle: string;
  eventType: string;
  id: number;
  sentType: string;
  tDate: string;
}
export interface BondItemType {
  bondCode: string;
  bondName: string;
  innerRating: string;
  outerRating: string;
  issuerName: string;
  eventDetailId: number;
}
export interface HoldItemType {
  fundName: string;
  bondName: string;
  bondCode: string;
  issuerName: string;
  issuerOuterRating: string;
  outerRating: string;
  issuerInnerRating: string;
  innerRating: string;
  exchmarket: string;
  endDate: string;
  putEndDate: string;
  hldBalance: number;
  fundNetNav: number;
  hldRatio: number;
  hldAmount: string;
  hldMarketAmountRatio: number;
}

// 获取所属类目
export async function getSentType(params = {}) {
  const { data } = await dispatchPass(API.informationApi.TypeCodeInfoFacadeGetSentType, params);
  return data || [];
}
// 获取初始开始和结束时间
export async function getWorkDayRange(params = {}) {
  const { data } = await dispatchPass(
    API.informationApi.TransactionCalendarFacadeGetWorkDayRange,
    params,
  );
  return data || {};
}

//获取风险报告舆情事件
export async function getSentEventPageByQuery(params = {}) {
  const { data } = await dispatchPass(
    API.informationApi.EveryBondCreditRisksReportSentInfoFacadeGetSentEventPageByQuery,
    params,
  );
  return data || {};
}
//个券信用风险提示报告关联债券查询
export async function getSentBondByEvent(params = {}) {
  const { data } = await dispatchPass(
    API.informationApi.EveryBondCreditRisksReportSentInfoFacadeGetSentBondByEvent,
    params,
  );
  return data || {};
}
//个券信用风险提示报告持仓查询
export async function getHlDetailByBondCode(params = {}) {
  const { data } = await dispatchPass(
    API.informationApi.EveryBondCreditRisksReportSentInfoFacadeGetHlDetailByBondCode,
    params,
  );
  return data || {};
}
