import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// Banner列表查询
export async function queryScStaticResource(params: any) {
  const { data, success } = await dispatchPass(API.marketingApi.queryScStaticResource, params);
  return { data, success };
}

// Banner添加
export async function addScStaticResource(params: any) {
  return await dispatchPass(API.marketingApi.addScStaticResource, params);
}

// Banner修改
export async function updateScStaticResource(params: any) {
  return await dispatchPass(API.marketingApi.updateScStaticResource, params);
}

// Banner删除
export async function deleteScStaticResource(params: any) {
  return await dispatchPass(API.marketingApi.deleteScStaticResource, params);
}

// 消息-列表查询
export async function queryScMessageInfo(params: any) {
  const { data, success } = await dispatchPass(API.marketingApi.queryScMessageInfo, params);
  return { data, success };
}

// 消息-添加
export async function addScMessage(params: any) {
  return await dispatchPass(API.marketingApi.addScMessage, params);
}

// 消息-修改
export async function updateScMessage(params: any) {
  return await dispatchPass(API.marketingApi.updateScMessage, params);
}

// 消息-删除
export async function deleteScMessage(params: any) {
  return await dispatchPass(API.marketingApi.deleteScMessage, params);
}
