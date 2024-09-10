import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
const transOptions = (
  list: any = [],
  labelName: string = 'subItemName',
  valueName: string = 'subItem',
  pid?: string,
) => {
  if (!Array.isArray(list)) {
    return [];
  }
  return list.map((item: any) => {
    return {
      label: item[labelName] || '--',
      value: item[valueName] || '',
      pid: pid || '',
    };
  });
};
// 配置详情-获取证券分类/未分类列表明细
export async function querySecuritiesSortList(params: any) {
  const { data, success } = await dispatchPass(API.productionApi.querySecuritiesSortList, params);
  return { ...data, success, data: data?.dataList || [] };
}

// 查询行业节点树
export async function querySysNodeList(params: any) {
  const { data } = await dispatchPass(API.productionApi.querySysNodeList, params);
  return data || [];
}

// 查询当前行业下的成员列表
export async function queryIndustryList(params: any) {
  const { data, success } = await dispatchPass(API.productionApi.querySecuritiesSortedList, params);
  return { ...data, success, data: data?.dataList || [] };
}

// 获取证券体系类型对应的算法
export async function getAlgoList(params: any) {
  const { data } = await dispatchPass(API.productionApi.getSecuritiesSortAlgoList, params);
  return data || [];
}

// 保存证券体系对应算法
export async function saveSecuritiesAlgo(params: any) {
  const { data } = await dispatchPass(API.productionApi.saveSecuritiesSortAlgo, params);
  return data;
}

// 按算法分类当前体系
export async function triggerSortBySysId(params: any) {
  const result = await dispatchPass(API.productionApi.triggerSortBySysId, params);
  return result;
}

// 未分类-查询当前体系的算法
export async function getSecuritiesAlgoConfig(params: any) {
  const { data } = await dispatchPass(API.productionApi.getSecuritiesSortAlgoConfig, params);
  return data;
}

// 查询名称证券体系对应的行业
export async function getSecuritiesSortNodeList(params: any) {
  const { data } = await dispatchPass(API.productionApi.getSecuritiesSortNodeList, params);
  return data || [];
}

// 行业证券信息调入证券-查询目标证券
export async function queryTargetSecuritiesSort(params: any) {
  const { data } = await dispatchPass(API.productionApi.fuzzyQueryTargetSecuritiesSort, params);
  return data || [];
}

// 行业证券信息-调入证券
export async function moveIntoCurrentNode(params: any) {
  const { data } = await dispatchPass(API.productionApi.moveIntoCurrentNode, params);
  return data;
}

// 行业证券信息-删除当前分类结果
export async function deleteSecuritiesItem(params: any) {
  const { data } = await dispatchPass(API.productionApi.delSecuritiesSortResult, params);
  return data;
}

// 行业证券信息-批量行业调整/行业调整
export async function adjustSecuritiesSort(params: any) {
  const { data } = await dispatchPass(API.productionApi.adjustSecuritiesSortResult, params);
  return data;
}

// 未分类股票-调入行业/行业调整
export async function moveIntoTargetNode(params: any) {
  const { data } = await dispatchPass(API.productionApi.moveIntoTargetNode, params);
  return data;
}

// 获取证券体系跟踪行业体系对应的节点列表
export async function getTraceSecuritiesList(params: any) {
  const { data } = await dispatchPass(API.productionApi.getTraceSecuritiesSortNodeList, params);
  return data || [];
}

// 查询跟踪指数
export async function getIndexTracking(params: any) {
  const { data } = await dispatchPass(API.productionApi.getSecuritiesSortNodeTraceCode, params);
  return data || [];
}

// 子行业体系分类-删除子行业
export async function delSecuritiesNode(params: any) {
  const { data } = await dispatchPass(API.productionApi.delSecuritiesSortNode, params);
  return data;
}

// 子行业体系分类-查询当前行业信息
export async function queryItemNodeInfo(params: any) {
  const { data } = await dispatchPass(API.productionApi.querySecuritiesSortNodeInfo, params);
  return data;
}

// 子行业体系分类-新增子行业
export async function addSecuritiesSortNode(params: any) {
  const { data } = await dispatchPass(API.productionApi.addSecuritiesSortNode, params);
  return data;
}

// 子行业体系分类-修改子行业
export async function updateSecuritiesSortNode(params: any) {
  const { data } = await dispatchPass(API.productionApi.updateSecuritiesSortNode, params);
  return data;
}
export async function querySecuritiesIndustryList(params: any) {
  const newParam = { ...params, pageNo: params.current };
  const { data, success } = await dispatchPass(
    API.productionApi.querySecuritiesIndustryList,
    newParam,
  );
  const result = {
    data: (data && data.dataList) || [],
    total: (data && data.total) || 0,
    current: (data && data.pageNum) || 1,
    pageSize: (data && data.pageSize) || 5,
    success,
  };
  return result;
}
// .查询证券类型列表
export async function getSecurityTypes() {
  const { data = [] } = await dispatchPass(API.productionApi.getSecurityTypes);
  return transOptions(data, 'name', 'value');
}
// 根据证券类型查询跟踪的标准行业体系
export async function getStandardSecurityByType(params: any) {
  const { data = [] } = await dispatchPass(API.productionApi.getStandardSecurityByType, params);
  return transOptions(data, 'value', 'id');
}
// 新增证券行业体系
export async function addSecuritiesIndustry(params: any) {
  return await dispatchPass(API.productionApi.addSecuritiesIndustry, params);
}
// 删除证券行业体系
export async function delSecuritiesIndustry(params: any) {
  return await dispatchPass(API.productionApi.delSecuritiesIndustry, params);
}
// 复制证券行业体系
export async function copySecuritiesIndustry(params: any) {
  return await dispatchPass(API.productionApi.copySecuritiesIndustry, params);
}
