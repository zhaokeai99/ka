import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { transOptions } from '@/utils/utils';

export interface NotContainIndex {
  code: string;
  name: string;
}

export interface LabelPoolIndex {
  code: string;
  name: string;
  foldTime: string;
}

// 基金标签列表树
export async function queryFundMarkData() {
  const { data } = await dispatchPass(API.marketingApi.queryFundMarkData);
  return data || [];
}

// 保存基金标签树信息
export async function saveFundMarkData(params: any) {
  return await dispatchPass(API.marketingApi.saveFundMarkData, params);
}

// 基金父级标签下拉
export async function queryParentMarkDropDown(params: any) {
  const { data } = await dispatchPass(API.marketingApi.queryParentMarkDropDown, params);
  return transOptions(data, 'titleName', 'id', false);
}

// 查询未包含对象列表
export async function queryFundMarkNotContainProductData(params: any) {
  const { data } = await dispatchPass(API.marketingApi.queryFundMarkNotContainProductData, params);
  return { ...data, data: data?.dataList || [] };
}

// 查询标签池列表
export async function queryFundMarkProductData(params: any) {
  const { data } = await dispatchPass(API.marketingApi.queryFundMarkProductData, params);
  return { ...data, data: data?.dataList || [] };
}

// 调入/批量调入
export async function batchTransInProducts(params: any) {
  const { data, success } = await dispatchPass(API.marketingApi.batchTransInProducts, params);
  return { data, success };
}

// 调出/批量调出
export async function batchTransOutProducts(params: any) {
  const { data, success } = await dispatchPass(API.marketingApi.batchTransOutProducts, params);
  return { data, success };
}

// 全部调入
export async function allTransInProducts(params: any) {
  const { data, success } = await dispatchPass(API.marketingApi.allTransInProducts, params);
  return { data, success };
}

// 查询单条数据
export async function queryMarkEcho(params: any) {
  const { data, success } = await dispatchPass(API.marketingApi.queryMarkEcho, params);
  return { data, success };
}

// 编辑
export async function updateFundMarkData(params: any) {
  return await dispatchPass(API.marketingApi.updateFundMarkData, params);
}

// 删除
export async function deleteFundMarkData(params: any) {
  return await dispatchPass(API.marketingApi.deleteFundMarkData, params);
}

// 模糊查询
export async function searchUserInfo(params: any) {
  const { success, data } = await dispatchPass(API.marketingApi.searchUserInfo, params);
  const optionsData =
    (success &&
      data?.map((i: any) => ({
        label: `${i.realName}(${i.userName})`,
        value: `${i.realName}(${i.userName})`,
      }))) ||
    [];
  return optionsData;
}

// 列出查询方案
export async function queryFundIndexSolution(params: any) {
  const { data } = await dispatchPass(API.marketingApi.queryFundIndexSolution, params);
  return data?.map((i: any) => ({ label: i.name, value: i.id })) || [];
}

// 自动打标-保存方案
export async function saveMarkSchemesData(params: any) {
  return await dispatchPass(API.marketingApi.saveMarkSchemesData, params);
}

// 自动打标-方案回显
export async function querySchemEcho(params: any) {
  const { data } = await dispatchPass(API.marketingApi.querySchemEcho, params);
  return data || {};
}

// 拉黑
export async function batchMarkBlackList(params: any) {
  return await dispatchPass(API.marketingApi.batchMarkBlackList, params);
}

// 自动打标开关
export async function saveAutoMark(params: any) {
  return await dispatchPass(API.marketingApi.saveAutoMark, params);
}

// 自动打标方案-立即执行
export async function autoFundMarksSync(params: any) {
  return await dispatchPass(API.marketingApi.autoFundMarksSync, params);
}

// 黑名单标签-全部删除
export async function batchAllMarkBlackList(params: any) {
  return await dispatchPass(API.marketingApi.batchAllMarkBlackList, params);
}
