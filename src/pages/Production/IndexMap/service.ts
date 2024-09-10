import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryIndexLabel(params?: any) {
  const { data: result } = await dispatchPass(API.productionApi.queryIndexLabel, params);

  if (!result) {
    return [];
  }

  return result.map(({ indexTrackType, indexSimpleInfo }: any) => ({
    indexTrackType,
    indexSimpleInfo: indexSimpleInfo.map((d: any) => ({
      ...d,
      radarData: [
        {
          name: `存量产品数\n${d.stockedProductsNum}`,
          value: d.stockedProductsNum,
          rate: d.stockedProductsQuantile,
        },
        {
          name: `存储产品数\n${d.reservedProductsNum}`,
          value: d.reservedProductsNum,
          rate: d.reservedProductsQuantile,
        },
        {
          name: `GMV\n${d.latestGmv}`,
          value: d.latestGmv,
          rate: d.latestGmvQuantile,
        },

        {
          name: `产品总规模\n${d.productTotalScale}`,
          value: d.productTotalScale,
          rate: d.productTotalScaleQuantile,
        },
        {
          name: `市净率\n${d.pb}`,
          value: d.pb,
          rate: d.pbQuantile,
        },
        {
          name: `市盈率\n${d.pe}`,
          value: d.pe,
          rate: d.peQuantile,
        },
        {
          name: `新发值\n${d.newValue}`,
          value: d.newValue,
          rate: d.newValueQuantile,
        },
        {
          name: `换手率\n${d.turnOverRate}`,
          value: d.turnOverRate,
          rate: d.turnOverRateQuantile,
        },
      ],
    })),
  }));
}

export async function queryIndexRadar(params?: any) {
  const { data: result } = await dispatchPass(API.productionApi.queryIndexRadar, params);

  return {
    ...result,
    radarData: [
      {
        name: `存量产品数\n${result?.stockedProductsNum || '--'}`,
        value: result?.stockedProductsNum,
        rate: result?.stockedProductsQuantile,
      },
      {
        name: `最新GMV\n${result?.latestGmv || '--'}`,
        value: result?.latestGmv,
        rate: result?.latestGmvQuantile,
      },
      {
        name: `存储产品数\n${result?.reservedProductsNum || '--'}`,
        value: result?.reservedProductsNum,
        rate: result?.reservedProductsQuantile,
      },
      {
        name: `产品总规模\n${result?.productTotalScale || '--'}`,
        value: result?.productTotalScale,
        rate: result?.productTotalScaleQuantile,
      },
    ],
  };
}

export async function indexChangeRate(params?: any) {
  const { data } = await dispatchPass(API.productionApi.indexChangeRate, params);
  return data;
}

export async function indexCompanyDynamic(params?: any) {
  const { data } = await dispatchPass(API.productionApi.indexCompanyDynamic, params);
  return data;
}

export async function indexProductDynamic(params?: any) {
  const { data } = await dispatchPass(API.productionApi.indexProductDynamic, params);

  return data;
}

// 指数行业分类
export async function fetchIndexSortSys() {
  const { data } = await dispatchPass(API.productionApi.fetchIndexSortSys);

  return data || [];
}

// 查询指数雷达信息二期改造
export async function queryIndexRadarDispatch(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryIndexRadarDispatch, params);

  return data || {};
}

// 模糊查询指数索引
export async function querySearchIndexInfo(params: { keyword: string }) {
  const { data } = await dispatchPass(API.productionApi.querySearchIndexInfo, params);

  return data;
}

// 基本信息
export async function queryIndexInfo(indexCode: string) {
  const { data = {} } = await dispatchPass(API.productionApi.indexInfo, { indexCode });
  return { ...data, data: data?.dataList || [] };
}
