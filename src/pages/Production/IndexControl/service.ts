import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 指数行业分类
export async function fetchIndexSortSys(params?: any) {
  const { data } = await dispatchPass(API.productionApi.fetchIndexSortSys, params);

  return data || [];
}

// 全赛道季频总规模折线图
export async function linearIndexSectorNav(params?: any) {
  const { data } = await dispatchPass(API.productionApi.linearIndexSectorNav, params);

  return data || [];
}
