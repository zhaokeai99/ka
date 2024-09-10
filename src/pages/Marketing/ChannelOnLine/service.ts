import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 查询下拉选项
export async function queryScTreeData(params: any) {
  const { data } = await dispatchPass(API.marketingApi.queryScTreeData, params);
  return data || [];
}

// 查询渠道上线列表
export async function queryAgencyOnlineSituation(params: any) {
  const { success, data } = await dispatchPass(API.marketingApi.queryAgencyOnlineSituation, params);

  return { success, data };
}

// 下载
export async function downLoadAgencyOnlineSituation(params: any) {
  return await dispatchPass(API.marketingApi.downLoadAgencyOnlineSituation, params);
}
