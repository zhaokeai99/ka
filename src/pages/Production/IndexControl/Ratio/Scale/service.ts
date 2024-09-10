import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 指数地图-资金规模客户规模 - 柱状图
export async function queryProductScale(params?: any) {
  const { data } = await dispatchPass(API.productionApi.queryProductScale, params);

  return data || {};
}

// 全赛道季频总规模折线图 导航列表
export async function linearIndexSectorNav(params?: any) {
  const { data } = await dispatchPass(API.productionApi.linearIndexSectorNav, params);

  return data || [];
}
