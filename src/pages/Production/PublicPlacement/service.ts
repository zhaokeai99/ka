import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 根据基金状态查询基金信息
export async function queryProductInfoListForManage(params: any) {
  const data = await dispatchPass(API.productionApi.queryProductInfoListForManage, params);
  return data;
}

// 新增基金产品信息
export async function addProductInfo(params: any) {
  const data = await dispatchPass(API.productionApi.addProductInfo, params);
  return data;
}

// 产品审核政策列表
export async function queryProductExamineList(params: any) {
  const data = await dispatchPass(API.productionApi.queryProductExamineList, params);
  return data;
}

// 新增基金审核政策
export async function addProductExaminePolicy(params: any) {
  const data = await dispatchPass(API.productionApi.addProductExaminePolicy, params);
  return data;
}

// 删除基金审核政策
export async function delProductExaminePolicy(params: any) {
  const data = await dispatchPass(API.productionApi.delProductExaminePolicy, params);
  return data;
}

// 修改基金审核政策
export async function updateProductExaminePolicy(params: any) {
  const data = await dispatchPass(API.productionApi.updateProductExaminePolicy, params);
  return data;
}

// 修改基金产品信息
export async function updateProductInfo(params: any) {
  const data = await dispatchPass(API.productionApi.updateProductInfo, params);
  return data;
}
