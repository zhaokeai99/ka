import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import type { LinkListItem } from './data';

// 查询联系人列表
export async function queryContactsList(params: { pageNo: number; pageSize: number }) {
  const { data = [] } = await dispatchPass(API.productionApi.queryContactsList, params);
  return { data };
}

// 新增联系人
export async function addFundParamContacts(params: LinkListItem) {
  const { success } = await dispatchPass(API.productionApi.addFundParamContacts, params);
  return { success };
}

// 修改联系人
export async function updateFundParamContacts(params: LinkListItem) {
  const { success } = await dispatchPass(API.productionApi.updateFundParamContacts, params);
  return { success };
}

// 删除联系人
export async function delFundParamContacts(id: string) {
  const { success } = await dispatchPass(API.productionApi.delFundParamContacts, { id });
  return { success };
}
