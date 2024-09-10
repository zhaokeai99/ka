import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

type paramsType = {
  queryType: string;
  updateList?: any[];
};

// 查询异动推送列表
export async function queryAbnormalPushList(params: paramsType) {
  const { success, data } = await dispatchPass(API.industrialChain.queryAbnormalPushList, params);

  return { success, data };
}

// 修改异动推送标志
export async function updateAbnormalPush(params: paramsType) {
  const { success } = await dispatchPass(API.industrialChain.updateAbnormalPush, params);

  return { success };
}
