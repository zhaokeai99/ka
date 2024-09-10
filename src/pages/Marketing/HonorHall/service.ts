import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 部门信息管理-列表查询
export async function queryHonorNominateDptList(params: any) {
  const { data, success } = await dispatchPass(API.marketingApi.queryHonorNominateDptList, params);
  return { data, success };
}

// 部门信息管理-列表-部门名称下拉查询
export async function queryHonorNominateDptName() {
  const { data } = await dispatchPass(API.marketingApi.queryHonorNominateDptName);
  return data || [];
}

// 部门信息管理-表单-部门名称下拉查询
export async function queryAddNominateDptList() {
  const { data } = await dispatchPass(API.marketingApi.queryAddNominateDptList);
  return data || [];
}

// 部门信息管理-添加
export async function addHonorNominateDpt(params: any) {
  return await dispatchPass(API.marketingApi.addHonorNominateDpt, params);
}

// 部门信息管理-修改
export async function updateHonorNominateDpt(params: any) {
  return await dispatchPass(API.marketingApi.updateHonorNominateDpt, params);
}

// 部门信息管理-删除
export async function deleteHonorNominateDpt(params: any) {
  return await dispatchPass(API.marketingApi.deleteHonorNominateDpt, params);
}

// 奖项配置-列表查询
export async function queryHonorAwardsList(params: any) {
  const { data, success } = await dispatchPass(API.marketingApi.queryHonorAwardsList, params);
  return { data, success };
}

// 奖项配置-奖项标签下拉查询
export async function queryAwardsTypeDesc() {
  const { data } = await dispatchPass(API.marketingApi.queryAwardsTypeDesc);
  return data?.map((item: any) => ({ label: item?.typeDesc, value: item?.type })) || [];
}

// 奖项配置-添加
export async function addHonorAwards(params: any) {
  return await dispatchPass(API.marketingApi.addHonorAwards, params);
}

// 奖项配置-修改
export async function updateHonorAwards(params: any) {
  return await dispatchPass(API.marketingApi.updateHonorAwards, params);
}

// 奖项配置-删除
export async function deleteHonorAwardsById(params: any) {
  return await dispatchPass(API.marketingApi.deleteHonorAwardsById, params);
}

// 榜单配置-列表查询
export async function queryWinnerList(params: any) {
  const { data, success } = await dispatchPass(API.marketingApi.queryWinnerList, params);
  return { data, success };
}

// 榜单配置-榜单周期下拉查询
export async function queryListCycleTypeAndDesc() {
  const { data } = await dispatchPass(API.marketingApi.queryListCycleTypeAndDesc);
  return data || [];
}

// 榜单配置-榜单奖项下拉查询
export async function queryHonorAwardsName() {
  const { data } = await dispatchPass(API.marketingApi.queryHonorAwardsName);
  return data || [];
}

// 榜单配置-榜单名称下拉查询
export async function queryBasisWinnerList() {
  const { data } = await dispatchPass(API.marketingApi.queryBasisWinnerList);
  return data || [];
}

// 榜单配置-添加
export async function addWinnerList(params: any) {
  return await dispatchPass(API.marketingApi.addWinnerList, params);
}

// 榜单配置-修改
export async function updateWinnerList(params: any) {
  return await dispatchPass(API.marketingApi.updateWinnerList, params);
}

// 榜单配置-删除
export async function deleteWinnerList(params: any) {
  return await dispatchPass(API.marketingApi.deleteWinnerList, params);
}

// 颁奖配置-列表查询
export async function queryAwardsWinnerList(params: any) {
  const { data, success } = await dispatchPass(API.marketingApi.queryAwardsWinnerList, params);
  return { data, success };
}

// 颁奖配置-获奖部门查询
export async function queryWinnerCandidate() {
  const { data } = await dispatchPass(API.marketingApi.queryWinnerCandidate);
  return data?.map((i: any) => ({
    ...i,
    winnerName: i?.deptName,
    winnerId: i?.deptId,
  }));
}

// 颁奖配置-获奖人查询
export async function queryWinnerInfo() {
  const { data } = await dispatchPass(API.marketingApi.queryWinnerInfo);
  return data || [];
}

// 颁奖配置-添加
export async function addAwardsWinner(params: any) {
  return await dispatchPass(API.marketingApi.addAwardsWinner, params);
}

// 颁奖配置-修改
export async function updateAwardsWinner(params: any) {
  return await dispatchPass(API.marketingApi.updateAwardsWinner, params);
}

// 颁奖配置-删除
export async function deleteAwardsWinner(params: any) {
  return await dispatchPass(API.marketingApi.deleteAwardsWinner, params);
}

// 营销配置-列表查询
export async function queryPageIcons(params: any) {
  const { data, success } = await dispatchPass(API.marketingApi.queryMarketingPageIcons, params);
  return { data, success };
}

// 营销配置-添加
export async function addPageIcon(params: any) {
  return await dispatchPass(API.marketingApi.addMarketingPageIcon, params);
}

// 营销配置-修改
export async function updatePageIcon(params: any) {
  return await dispatchPass(API.marketingApi.updateMarketingPageIcon, params);
}

// 营销配置-删除
export async function deleteIcons(params: any) {
  return await dispatchPass(API.marketingApi.deleteMarketingIcons, params);
}
