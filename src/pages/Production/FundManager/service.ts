import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 查询
export async function getByCode(params?: any) {
  const { data } = await dispatchPass(API.productionApi.getByCode, params);
  return data || [];
}

// 管理的产品
export async function listManageProduct(params?: any) {
  const { data } = await dispatchPass(API.productionApi.listManageProduct, params);
  return data || {};
}

// 置顶标签
export async function queryTopMarks(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryTopMarks, params);
  return data || [];
}

// 搜索
export async function fuzzySearch(params: any) {
  const { data } = await dispatchPass(API.productionApi.fuzzySearch, params);
  return data;
}
// 产品类型下拉列表
export async function queryProductTypeData() {
  const { data } = await dispatchPass(API.productionApi.queryProductTypeData);
  return data;
}
