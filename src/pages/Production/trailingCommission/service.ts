import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 代销商列表接口
export async function queryDis(params = {}) {
  const { data } = await dispatchPass(API.productionApi.queryDis, params);
  return data || {};
}
// 基金列表接口
export async function queryCareFeeFundInfo(params = {}) {
  const { data } = await dispatchPass(API.productionApi.queryCareFeeFundInfo, params);
  return data || {};
}

// 尾佣查询
export async function queryCareFeePage(params = {}) {
  const { data } = await dispatchPass(API.productionApi.queryCareFeePage, params);
  return data || { list: [] };
}

// 尾佣新增
export async function addCareFee(params = {}) {
  const result = await dispatchPass(API.productionApi.addCareFee, params);
  return result || {};
}

// 尾佣更新
export async function updateCareFee(params = {}) {
  const result = await dispatchPass(API.productionApi.updateCareFee, params);
  return result || {};
}
// 尾佣删除
export async function delCareFee(params = {}) {
  const result = await dispatchPass(API.productionApi.delCareFee, params);
  return result || {};
}
// 导出
export async function exportCareFee(params = {}) {
  const { data } = await dispatchPass(API.productionApi.exportCareFee, params);
  return data || '';
}
