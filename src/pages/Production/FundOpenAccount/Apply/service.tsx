import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 查询开户列表
export async function queryApplyList(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryOpenAccountList, params);
  return data || [];
}

// 申请开户
export async function saveOpenAccountFlow(params: any) {
  const { data } = await dispatchPass(API.productionApi.saveOpenAccountFlow, params);
  return data;
}

// 取消开户
export async function cancelOpenAccountFlow(params: any) {
  const { data } = await dispatchPass(API.productionApi.cancelOpenAccountFlow, params);
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
