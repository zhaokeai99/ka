import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface BondInfoType {
  bondCode: string;
  bondName: string;
}
export interface IssuerInfoType {
  issuerCode: string;
  issuerName: string;
}
export interface optionType {
  subTypeCode: string;
  subTypeName: string;
}
export interface ListItemDataType {
  id: number;
  tDate: string;
  tTime: string;
  sentType: string;
  eventType: string;
  eventSubType: string;
  eventTitle: string;
  holdStatus: number;
  bondList: BondInfoType[];
  issuerList: IssuerInfoType[];
}

export type detailType = {
  id: number;
  eventType: number;
};

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

//获取狭义舆情列表
export async function getList(params = {}) {
  const { data } = await dispatchPass(API.informationApi.getXyNegativeSentimentEventByPage, params);
  return data || {};
}
