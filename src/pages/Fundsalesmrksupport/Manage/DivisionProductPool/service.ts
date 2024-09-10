import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface TableListItem {
  divisionId: string;
  fundCode: string;
  wProductCode: string;
  fundName: string;
  companyName?: number;
  buyRate: string;
  redeemRate: string;
  gmtCreate: string;
  gmtModified: string;
}

// 查询
export async function queryProducts(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryProducts, params);
  return data.productInfos || [];
}
// 新增
export async function addProduct(params = {}) {
  return await dispatchPass(API.marketingApi.addProduct, params);
}
// 修改
export async function updateProduct(params = {}) {
  return await dispatchPass(API.marketingApi.updateProduct, params);
}
// 删除
export async function deleteDivisionProduct(params = {}) {
  return await dispatchPass(API.marketingApi.deleteDivisionProduct, params);
}
