import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { transOptions } from '@/utils/utils';
import { keys as _keys } from 'lodash';

// 参数及取值范围
export async function queryParams(params: any) {
  // return paramsData
  const { data, success } = await dispatchPass(API.productionApi.queryFundIndexParams, params);
  return success && data ? data : [];
}

const handleData = (data: []) => {
  return (data || []).map((i) => {
    const { results, code } = i;
    const record = {};
    _keys(results).forEach((key) => {
      const { colName, valueDesc, extInfo, selfType } = results[key];
      const { color, resultList = [] } = extInfo || {};
      if (selfType === 1 || selfType === 2) {
        resultList.forEach((valueResult) => {
          const { startYear, endYear, webRateStr, color: sColor } = valueResult;
          record[`${colName}_${startYear}_${endYear}`] = webRateStr;
          record[`${colName}_${startYear}_${endYear}_color`] = sColor;
        });
      } else {
        record[colName] = valueDesc;
        record[colName + '_color'] = color;
      }
    });
    return {
      ...record,
      code,
    };
  });
};
// 查询数据
export async function queryTableData(params: any) {
  const { data: result, success } = await dispatchPass(
    API.productionApi.queryFundIndexTableData,
    params,
  );
  if (success && result) {
    const { pageNo, pageSize, totalNum, data = [] } = result;
    const dataSource = handleData(data || []);

    return { pageNo: pageNo || 1, pageSize: pageSize || 10, totalNum, dataSource };
  }
  return { data: [] };
}

// 列出查询方案
export async function querySolution(params: any) {
  const { data, success } = await dispatchPass(API.productionApi.queryAllSolutionList, params);
  return success && data ? data : [];
}

// 保存查询方案
export async function saveSolution(params: any) {
  const { success, errorMsg } = await dispatchPass(API.productionApi.saveFundIndexSolution, params);
  return { success, errorMsg };
}

// 删除查询方案
export async function deleteSolution(params: any) {
  const { success, errorMsg } = await dispatchPass(
    API.productionApi.deleteFundIndexSolution,
    params,
  );
  return { success, errorMsg };
}
// 基金标签列表树
export async function queryFundMarkData() {
  const { data, success } = await dispatchPass(API.marketingApi.queryFundMarkData);
  return success && data ? data : [];
}
// 我的分类
export async function queryClassify() {
  const { data } = await dispatchPass(API.productionApi.queryMyTreeStructure);
  return transOptions(data, 'title', 'id', false);
}

// 调入/批量调入
export async function batchTransInProducts(params: any) {
  const { data, success } = await dispatchPass(API.marketingApi.batchTransInProducts, params);
  return { data, success };
}

// 调入/批量调入
export async function batchTransInByKeys(params: any) {
  const { data, success } = await dispatchPass(API.productionApi.batchTransInByKeys, params);
  return { data, success };
}
// 下载
export async function exportAllFundInfos(params: any) {
  const { data, success, errorMsg } = await dispatchPass(
    API.productionApi.queryAllFundInfosExport,
    params,
  );
  return { data, success, errorMsg };
}
// 下载
export async function exportFundInfosById(params: any) {
  const { data, success, errorMsg } = await dispatchPass(
    API.productionApi.exportFundInfosByFileid,
    params,
  );
  return { data, success, errorMsg };
}

// 指数行业分类
export async function queryEtfSortSys(params?: any) {
  const { data } = await dispatchPass(API.productionApi.queryEtfSortSys, params);
  return data || [];
}
// 查询行业节点树
export async function querySysNodeList(params: any) {
  const { data } = await dispatchPass(API.productionApi.querySysNodeList, params);
  return data || [];
}
// 点击查询方案
export async function hitSolution(params: any) {
  const { success } = await dispatchPass(API.productionApi.hitQuerySolution, params);
  return success;
}
// 基金产品、经理、公司模糊搜索联想补全
export async function fuzzySearch(params: any) {
  const { success, data } = await dispatchPass(API.productionApi.fuzzySearch, params);
  return { success, data };
}

// 模糊查询下拉框 人员
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

// 分享方案
export async function shareSolution(params: any) {
  const { success } = await dispatchPass(API.productionApi.shareSolution, params);

  return success;
}
