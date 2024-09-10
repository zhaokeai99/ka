import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { transOptions } from '@/utils/utils';

export interface TableListItem {
  id: string;
  pageType: number;
  moduleType: number;
  titleType: number;
  title: string;
  gmtCreate: string;
  gmtModified: string;
}

// 查询
export async function queryModuleTitleConfig(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryModuleTitleConfig, params);
  return data || {};
}
// 新增
export async function addModuleTitleConfig(params = {}) {
  return await dispatchPass(API.marketingApi.addModuleTitleConfig, params);
}
// 修改
export async function updateModuleTitleConfig(params = {}) {
  return await dispatchPass(API.marketingApi.updateModuleTitleConfig, params);
}
// 删除
export async function deleteModuleTitleConfig(params = {}) {
  return await dispatchPass(API.marketingApi.deleteModuleTitleConfig, params);
}
// 页面类型与描述下拉列表
export async function queryModuleTitlePageTypeDesc() {
  const { data } = await dispatchPass(API.marketingApi.queryModuleTitlePageTypeDesc);
  return transOptions(data, 'typeDesc', 'type', false);
}
// 模块类型与描述下拉列表
export async function queryModuleTitleModuleTypeDesc(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryModuleTitleModuleTypeDesc, params);
  return transOptions(data, 'typeDesc', 'type', false);
}
// 标题类型与描述下拉列表
export async function queryModuleTitleTitleTypeDesc(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryModuleTitleTitleTypeDesc, params);
  return transOptions(data, 'typeDesc', 'type', false);
}
