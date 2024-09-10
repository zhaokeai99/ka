import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 根据基金代码查详情
export async function queryFundCompanyPKListByCompCodes(params: { codes: string[] }) {
  const fundCodes = params.codes.filter((str) => str);
  if (fundCodes.length) {
    const { data } = await dispatchPass(API.productionApi.queryFundCompanyPKListByCompCodes, {
      fundCompCodes: fundCodes,
    });

    return (
      data?.map((i: any) => ({
        ...i,
        name: i.fundCompName,
        shortName: i.fundCompName,
        code: i.fundCompCode,
      })) || []
    );
  }
  return [];
}

// 搜索基金公司
export async function searchFundInfo(params: any) {
  const { data } = await dispatchPass(
    API.productionApi.fuzzyQueryFundCompanyListByCompName,
    params,
  );
  return data || [];
}
