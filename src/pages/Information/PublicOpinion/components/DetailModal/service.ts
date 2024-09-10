import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface bondListType {
  bondCode: string;
  bondName: string;
  issuerCode: string;
  issuerName: string;
}
export interface ItemDataType {
  bondList: bondListType[];
  enclosureUrl: string;
  eventAbstract: string;
  eventContent: string;
  eventSubType: string;
  eventTitle: string;
  eventType: string;
  sentType: string;
}

// 获取狭义负面舆情事件详情
export async function getXyNegativeSentimentDetailByEvent(params = {}) {
  const { data = {} } = await dispatchPass(
    API.informationApi.XyNegativeSentimentInfoFacadeGetXyNegativeSentimentDetailByEvent,
    params,
  );
  return data;
}
