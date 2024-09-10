import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { transOptions } from '@/utils/utils';

export interface TypeItem {
  typeCode: string;
  typeName: string;
}

export interface TableListItem {
  fundCode?: string;
  fundName?: string;
  vogType?: string | number;
  vogTypeDesc?: string;
  pptUrl?: string;
  pdfUrl?: string;
  materialPackageUrl?: string;
  tag?: string;
  showType?: string;
  publishDate?: string | any;
  createTime?: string;
  updateTime?: string;
}

// 类型接口
export async function getTypeList() {
  const { data } = await dispatchPass(API.marketingApi.getVogTypeList);
  return transOptions(data, 'typeDesc', 'type', false);
}
// 查询
export async function queryAllProductRecommend(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryAllProductRecommendInfo, params);
  return data || {};
}
// 新增
export async function addProductRecommend(params = {}) {
  return await dispatchPass(API.marketingApi.addProductRecommendInfo, params);
}
// 类型修改
export async function updateProductRecommend(params = {}) {
  return await dispatchPass(API.marketingApi.updateProductRecommendInfo, params);
}
// 删除
export async function deleteProductRecommend(params = {}) {
  return await dispatchPass(API.marketingApi.deleteProductRecommendInfo, params);
}
