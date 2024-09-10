import { dispatchPass } from '@/services/service';
import { API } from '@/services/api';
import { transOptions } from '@/utils/utils';

// 方案列表
export async function queryProductDataSearch() {
  const { data } = await dispatchPass(API.productionApi.queryProductDataSearch, {});
  return transOptions(data, 'schemeName', 'id');
}

// 保存方案
export async function saveProductDataSearch(params: any) {
  return await dispatchPass(API.productionApi.saveProductDataSearch, params);
}

//删除方案
export async function deleteProductDataSearch(params: any) {
  return await dispatchPass(API.productionApi.deleteProductDataSearch, params);
}

// 我的分类
export async function queryMyTreeStructure() {
  const { data } = await dispatchPass(API.productionApi.queryMyTreeStructure);
  return transOptions(data, 'title', 'value', false);
}

// 产品状态
export async function queryProductStatusList() {
  const { data } = await dispatchPass(API.productionApi.queryProductStatusList);
  return transOptions(data, 'productMsg', 'productCode', false);
}

// table列项
export async function queryColumnDropDownList() {
  const { data } = await dispatchPass(API.productionApi.queryColumnDropDownList);
  return data || [];
}

// 页面列表
export async function queryDataBrowserListPage(params: any) {
  const { data = {} } = await dispatchPass(API.productionApi.queryDataBrowserListPage, params);
  return {
    dataList: data?.dataList || [],
    total: data.total || 0,
  };
}
