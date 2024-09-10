import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 文库类型、影响类型下拉列表接口
export async function getTypeList() {
  const { data } = await dispatchPass(API.productionApi.queryLibraryTypeList);
  return data || {};
}
// 合规文库查询
export async function queryComPlianceLibraryDataList(params = {}) {
  const { data } = await dispatchPass(API.productionApi.queryComPlianceLibraryDataList, params);
  return data || {};
}

// 合规文库创建
export async function createComPlianceLibraryData(params = {}) {
  const result = await dispatchPass(API.productionApi.createComPlianceLibraryData, params);
  return result || {};
}

// 合规文库更新
export async function updateComPlianceLibraryData(params = {}) {
  const result = await dispatchPass(API.productionApi.updateComPlianceLibraryData, params);
  return result || {};
}
// 合规文库删除
export async function deleteComPlianceLibraryData(params = {}) {
  const result = await dispatchPass(API.productionApi.deleteComPlianceLibraryData, params);
  return result || {};
}

// 查询展位
export async function queryComPlianceLibraryBoothIdData(params = {}) {
  const { data } = await dispatchPass(API.productionApi.queryComPlianceLibraryBoothIdData, params);
  return data;
}
