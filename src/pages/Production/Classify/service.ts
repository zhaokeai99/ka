import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryTreeStructure(params = {}) {
  const { data } = await dispatchPass(API.productionApi.queryTreeStructure, params);
  return data;
}

export async function queryTreeStructureLabels(params = {}) {
  const { data } = await dispatchPass(API.productionApi.queryTreeStructureLabels, params);
  return data;
}

export async function queryTreeFundInfos(params = {}) {
  const { data = [] } = await dispatchPass(API.productionApi.queryTreeFundInfos, params);
  return data || [];
}

export async function saveFundInfoAndTreeLabels(params = {}) {
  const { success } = await dispatchPass(API.productionApi.saveFundInfoAndTreeLabels, params);
  return success;
}

export async function deleteTreeFundLabel(params = {}) {
  return await dispatchPass(API.productionApi.deleteTreeFundLabel, params);
}

export async function queryUserGroupRoles(params = {}) {
  return await dispatchPass(API.productionApi.queryUserGroupRoles, params);
}
