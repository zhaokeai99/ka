import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 根据类型查询联系人
export async function queryContactsByType(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryContactsByType, params);
  return data || [];
}

// 保存联系人
export async function saveContcat(params: any) {
  const { data } = await dispatchPass(API.productionApi.saveContcat, params);
  return data;
}

// 更新联系人
export async function updateContcat(params: any) {
  const { data } = await dispatchPass(API.productionApi.updateContcat, params);
  return data;
}

// 删除联系人
export async function deleteContact(params: any) {
  const { data } = await dispatchPass(API.productionApi.deleteContact, params);
  return data;
}

// 产品开户-查询账户类型
export async function queryAcctTypeReference() {
  const { data } = await dispatchPass(API.productionApi.queryAcctTypeReference);
  return data;
}
