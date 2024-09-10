import { dispatchPass } from '@/services/service';
import { API } from '@/services/api';

export async function queryFundSelfDetails(params: any) {
  const newParam = { ...params, pageNo: params.current };
  const { data, success } = await dispatchPass(API.productionApi.queryFundSelfDetails, newParam);
  const result = {
    data: (data && data.dataList) || [],
    total: (data && data.total) || 0,
    current: (data && data.pageNum) || 1,
    pageSize: (data && data.pageSize) || 5,
    success,
  };
  return result;
}
export async function saveUserManagerCompose(params: any) {
  return await dispatchPass(API.productionApi.saveUserManagerCompose, params);
}
export async function queryTrackComposeList(params: any) {
  return await dispatchPass(API.productionApi.queryTrackComposeList, params);
}
export async function saveNewTrackName(params: any) {
  return await dispatchPass(API.productionApi.saveNewTrackName, params);
}
export async function deleteTrack(params: any) {
  return await dispatchPass(API.productionApi.deleteTrack, params);
}
export async function resetTrackComposes(params: any) {
  return await dispatchPass(API.productionApi.resetTrackComposes, params);
}
export async function deleteUserManagerCompose(params: any) {
  return await dispatchPass(API.productionApi.deleteUserManagerCompose, params);
}
export async function updateUserManagerCompose(params: any) {
  return await dispatchPass(API.productionApi.updateUserManagerCompose, params);
}
export async function saveTrackComposes(params: any) {
  return await dispatchPass(API.productionApi.saveTrackComposes, params);
}
export async function deleteComposeTrackConfig(params: any) {
  return await dispatchPass(API.productionApi.deleteComposeTrackConfig, params);
}
export async function queryAssetUnitDropDownList() {
  return await dispatchPass(API.productionApi.queryAssetUnitDropDownList);
}
export async function queryFundManager() {
  return await dispatchPass(API.productionApi.queryFundManager);
}
