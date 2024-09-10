import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface BondTopItemType {
  bondCode: string;
  bondName: string;
  count: number;
  innerRating: string;
  orderNum: number;
  outerRating: string;
  tDate: string;
}

export interface TrendItemType {
  tDate?: string;
  todayEventCount?: number;
  weekEventCount?: number;
  monthEventCount?: number;
  yearEventCount?: number;
}

// 获取Top5
export async function getNewKeyBondTop(params = {}) {
  const { data } = await dispatchPass(
    API.informationApi.XyNegativeSentimentInfoFacadeGetNewKeyBondTop,
    params,
  );
  return data || [];
}
// 获取趋势
export async function getNewSentimentTrend(params = {}) {
  const { data } = await dispatchPass(
    API.informationApi.XyNegativeSentimentInfoFacadeGetNewSentimentTrend,
    params,
  );
  return data || {};
}
//获取分布图
export async function getNewOfflineSentimentDistribution(params = {}) {
  const { data } = await dispatchPass(
    API.informationApi.XyNegativeSentimentInfoFacadeGetNewOfflineSentimentDistribution,
    params,
  );
  return data || [];
}
