import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 基本信息 + 管理经验
export async function fundManagerPK(params: { codes: string[] }) {
  const codes = params.codes.filter((str) => str);

  if (codes.length) {
    const { data } = await dispatchPass(API.productionApi.fundManagerPK, { codes });
    return data || [];
  }
  return [];
}

// 基金经理 PK 顶部信息
export async function queryAllManagerInfos(params: { codes: string[] }) {
  const codes = params.codes.filter((str) => str);

  if (codes.length) {
    const { data } = await dispatchPass(API.productionApi.fundManagerPK, { codes });
    return data?.map((i: any) => ({ name: i.name, code: i.code, shortName: i.name })) || [];
  }
  return [];
}

// 基金经理 PK 管理规模走势，机构、个人用户占比
export async function fundManagerTrendChart(params: { codeList: string[]; colName: string }) {
  const codeList = params.codeList.filter((str) => str);

  if (codeList.length) {
    const { data } = await dispatchPass(API.productionApi.fundManagerTrendChart, {
      codeList,
      colName: params.colName,
    });
    return data || [];
  }
  return [];
}
