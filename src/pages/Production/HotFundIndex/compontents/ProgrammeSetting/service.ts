import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 方案查询列表
export async function querySolutionList(params: any) {
  const { current, pageSize, name, searcherType, isCancel } = params;

  const { data } = await dispatchPass(API.productionApi.querySolutionList, {
    offsetId: '',
    pageNo: current,
    pageSize,
    searcherType,
    solutionName: name || '',
    isCancel,
  });

  return {
    data: data.data,
    total: data.totalNum,
    current,
    pageSize,
    success: true,
  };
}

// 方案置顶
export async function querySolutionTop(params: any) {
  const { data } = await dispatchPass(API.productionApi.querySolutionTop, params);
  return data || {};
}

// 修改查询方案
export async function saveSolution(params: any) {
  const { success, errorMsg } = await dispatchPass(API.productionApi.saveFundIndexSolution, params);
  return { success, errorMsg };
}

// 模糊查询下拉框
export async function searchUserInfo(params: any) {
  const { success, data } = await dispatchPass(API.marketingApi.searchUserInfo, params);
  const optionsData =
    (success &&
      data?.map((i: any) => ({
        label: `${i.realName}(${i.userName})`,
        value: i.userName,
      }))) ||
    [];
  return optionsData;
}

// 删除方案
export async function deleteSolution(params: any) {
  const { success, errorMsg } = await dispatchPass(
    API.productionApi.deleteFundIndexSolution,
    params,
  );
  return { success, errorMsg };
}
