import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 查询开户列表
export async function queryApplyList(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryOpenSeatList, params);
  return data || [];
}

// 申请开户
export async function saveOpenSeatFlow(params: any) {
  const { data } = await dispatchPass(API.productionApi.saveOpenSeatFlow, params);
  return data;
}

// 取消开户
export async function cancelOpenSeatFlow(params: any) {
  const { data } = await dispatchPass(API.productionApi.cancelOpenSeatFlow, params);
  return data || [];
}

// 查询产品开户状态
export async function queryAccountStatusByFundId(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryAccountStatusByFundId, params);
  return data || [];
}

// 模糊查询项目经理/产品经理
export async function queryManagerByKeyword(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryManagerByKeyword, params);
  return data || [];
}

// 根据基金代码/名称查询基金信息-母基金 公募以及专户
export async function queryProductInfo(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryProductInfo, params);
  return data || [];
}

// 查询产品开户类型列表
export async function queryAccountTypeEnumList() {
  const { data } = await dispatchPass(API.productionApi.queryAccountTypeEnumList);
  return data || [];
}

// 席位-根据流程id查OA信息
export async function queryOASeatByProcessId(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryOASeatByProcessId, params);
  return data || {};
}

// 席位-查询席位上传列表
export async function queryUploadList(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryUploadList, params);
  return data || {};
}

// 席位-获取弘存所有席位信息
export async function queryOtcSeatInfos() {
  const { data } = await dispatchPass(API.productionApi.queryOtcSeatInfos);
  return data || {};
}

// 席位-完成准备材料
export async function completeOpenSeatMaterial(params: any) {
  const { data } = await dispatchPass(API.productionApi.completeOpenSeatMaterial, params);
  return data || {};
}
