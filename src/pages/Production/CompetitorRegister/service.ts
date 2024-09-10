import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryMutualFundCollectChart(params = {}) {
  return await dispatchPass(API.productionApi.queryMutualFundCollectChart, params);
}

export async function queryMutualFundCollectList(params = {}) {
  const { data } = await dispatchPass(API.productionApi.queryMutualFundCollectList, params);

  return { ...data, data: data.dataList || [] };

  // if (success) {
  //   return data;
  // }

  // return {
  //   dataList: [],
  //   pageNum: 1,
  //   total: 0,
  // };
}

// 基金公司列表
export async function queryFundCompanyList(params = {}) {
  const { data } = await dispatchPass(API.productionApi.queryFundCompanyList, params);
  return data || [];
}
// 发行/储备数量分布图
export async function queryGroupByFundType(params = {}) {
  const { data } = await dispatchPass(API.productionApi.queryGroupByFundType, params);
  return data || [];
}
// 发行/储备产品TOP5
export async function queryNumGroupByManager(params = {}) {
  const { data } = await dispatchPass(API.productionApi.queryNumGroupByManager, params);
  return data || [];
}
// 发行/储备产品数量饼图
export async function queryNumByManagerGroupByFundType(params = {}) {
  const { data } = await dispatchPass(API.productionApi.queryNumByManagerGroupByFundType, params);
  return data || {};
}

// 统计信息列表查询
export async function queryStatisticTableList(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryStatisticsList, params);
  const headerList = data?.header?.map((v: any, i: number) => ({
    title: v,
    dataIndex: `index_${i}`,
    key: `index_${i}`,
    sorter: i !== 0 ? (a: any, b: any) => a[`index_${i}`] - b[`index_${i}`] : null,
  }));
  const tableList: any = [];
  data?.dataList?.map((val: any) => {
    const obj = {};
    val.map((v: any, i: number) => (obj[headerList[i]['dataIndex']] = v));
    tableList.push(obj);
  });
  return { dataList: tableList || [], header: headerList || [] };
}

// 审批速度
export async function queryMutualFundApproveInfoList() {
  const { data } = await dispatchPass(API.productionApi.queryMutualFundApproveInfoList);
  return data || [];
}

// 导出
export async function exportCollectProgressList(params: any) {
  const { data } = await dispatchPass(API.productionApi.exportCollectProgressList, params);
  return data || '';
}

// 获取产品类型
export async function queryFundTypeList() {
  const { data } = await dispatchPass(API.productionApi.queryFundTypeList);
  return data || [];
}
