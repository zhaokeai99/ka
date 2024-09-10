import { dispatchPass } from '@/services/service';
import { API } from '@/services/api';

export interface TableListItem {
  id: number;
  bmCode: string;
  bmName: string;
  domain: string;
  stkCode: string;
  stkName: string;
  weight: number;
  marketValue: number;
  tradeDate: string;
}

// 查询自定义基准定义权重分页
export async function MpBmSelfdefWeightQueryByPage(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpBmSelfdefWeightQueryByPage, params);
  return data || {};
}
// 查询自定义基准净值
export async function MpBmSelfdefNvQuery(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpBmSelfdefNvQuery, params);
  return data || {};
}
