import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { transOptions } from '@/utils/utils';

export interface TableListItem {
  viewPointId: string;
  fundManagerId: string;
  vogType: string;
  vogTypeDesc: string;
  title: string;
  summary: string;
  viewpointInfoUrl: string;
  viewDate: string;
  publishDate: string;
  createTime: string;
  updateTime: string;
}

// 查询
export async function queryAllFundManagerViewpoint(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryAllFundManagerViewpoint, params);
  return data || {};
}
// 新增
export async function addFundManagerViewpoint(params = {}) {
  return await dispatchPass(API.marketingApi.addFundManagerViewpoint, params);
}
// 修改
export async function updateFundManagerViewpoint(params = {}) {
  return await dispatchPass(API.marketingApi.updateFundManagerViewpoint, params);
}
// 删除
export async function deleteFundManagerViewpoint(params = {}) {
  return await dispatchPass(API.marketingApi.deleteFundManagerViewpoint, params);
}
// 基金经理查询
export async function queryFundManagerInfo() {
  const { data } = await dispatchPass(API.marketingApi.queryFundManagerInfo, {
    currentPage: 1,
    pageSize: 100,
  });
  return transOptions(data.data, 'fundManagerName', 'fundManagerId', false);
}
// 类型接口
export async function getTypeList() {
  const { data } = await dispatchPass(API.marketingApi.getVogTypeList);
  return transOptions(data, 'typeDesc', 'type', false);
}
