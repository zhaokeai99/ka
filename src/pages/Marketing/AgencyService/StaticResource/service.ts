import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { transOptions } from '@/utils/utils';

export interface TableListItem {
  id: string;
  pictureDesc: string;
  pictureUrl: string;
  pictureType: string;
  hot: string;
  pictureOrder: string;
  skipUrl: string;
  skipUrlType: string;
  gmtCreate: string;
  gmtModified: string;
}

// 查询
export async function queryPageIcons(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryPageIcons, params);
  return data || {};
}
// 新增
export async function addPageIcon(params = {}) {
  return await dispatchPass(API.marketingApi.addPageIcon, params);
}
// 修改
export async function updatePageIcon(params = {}) {
  return await dispatchPass(API.marketingApi.updatePageIcon, params);
}
// 删除
export async function deleteIcons(params = {}) {
  return await dispatchPass(API.marketingApi.deleteIcons, params);
}
// 修改排序
export async function updatePageIconOrder(params = {}) {
  return await dispatchPass(API.marketingApi.updatePageIconOrder, params);
}
// 静态资源配置信息图片类型下拉列表
export async function queryPageIconTypeDesc() {
  const { data } = await dispatchPass(API.marketingApi.queryPageIconTypeDesc);
  return transOptions(data, 'typeDesc', 'type', false);
}

// 静态资源配置图片跳转类型下拉列表
export async function queryPageIconSkipTypeDesc() {
  const { data } = await dispatchPass(API.marketingApi.queryPageIconSkipTypeDesc);
  return transOptions(data, 'typeDesc', 'type', false);
}
