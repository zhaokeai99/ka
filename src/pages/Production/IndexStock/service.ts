import { chain as _chain, map as _map } from 'lodash';
import {
  IndexListParams,
  StockInfoParams,
  IndexLineParams,
  IndustryParams,
  IndexCoreParams,
} from './data';
import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import moment from 'moment';

// 列表
export async function queryIndexPageList(
  params?: IndexListParams,
  cb?: (pageRes: PageListRes) => void,
) {
  const { data } = await dispatchPass(API.productionApi.queryIndexPageList, {
    ...params,
    pageNo: params?.current,
  });
  if (cb) {
    cb({
      ...data,
      data: data.dataList || [],
    });
  }
  return {
    ...data,
    data: data.dataList || [],
  };
}

// 基本信息
export async function queryIndexInfo(indexCode: string) {
  const { data = {} } = await dispatchPass(API.productionApi.indexInfo, { indexCode });
  return { ...data, data: data?.dataList || [] };
}

// 估值数据
export async function queryIndexValuation(indexCode: string) {
  const { data } = await dispatchPass(API.productionApi.indexValuation, { indexCode });
  return { ...data, data: data.dataList || [] };
}

// 详情 - 证券组成
export async function queryStockInfoPageList(indexCode: string, params?: StockInfoParams) {
  const { data = {} } = await dispatchPass(API.productionApi.queryStockInfoPageList, {
    ...params,
    pageNo: params?.current,
    indexCode,
  });
  return { ...data, data: data?.dataList || [] };
}

// 指数走势
export async function queryIndexLineChart(params: IndexLineParams) {
  const { data } = await dispatchPass(API.productionApi.indexLineChart, params);
  let latestValue = '-';
  let latestQuantile = '-';
  const list = _chain(data?.dataList)
    .map(({ data: dt, indexCode, indexName, newValue = '-', newQuantile = '-' }) => {
      latestValue = newValue;
      latestQuantile = newQuantile;
      if (dt === null) return [{ indexCode, indexName }];
      return _map(dt, (d: any) => ({
        ...d,
        value: parseFloat(d.value),
        quantile: d.quantile,
        indexCode,
        indexName,
      }));
    })
    .reduce((pre, next) => pre.concat(next))
    .sortBy(['name'])
    .value();

  return {
    list,
    latestValue,
    latestQuantile,
  };
}

// 指数走势PK
export async function queryIndexLinePKChart(params: IndexLineParams) {
  const { data } = await dispatchPass(API.productionApi.indexLinePKChart, params);

  const newList = _map(data && data.list, (item) => {
    if (item) {
      const newName =
        data && data.indexCode === item.indexCode ? item.indexName + '(基准)' : item.indexName;
      return {
        ...item,
        indexName: newName,
      };
    } else {
      return item;
    }
  }).sort((a, b) => {
    return moment(b.tradeDate).isBefore(moment(a.tradeDate)) ? 1 : -1;
  });

  return {
    list: newList,
    baseName: data && data.indexName,
    latestValue: '',
    latestQuantile: '',
  };
}

// 样本股图
export async function queryStockConcentration(params: StockInfoParams) {
  const { data } = await dispatchPass(API.productionApi.queryStockConcentration, params);

  return _chain(data?.dataList)
    .map(({ topData, weightsData, indexCode, indexName }) => ({
      topData:
        topData === null
          ? [{ indexCode, indexName }]
          : _map(topData, (d: any) => ({
              ...d,
              indexCode,
              indexName,
            })),
      weightsData:
        weightsData === null
          ? [{ indexCode, indexName }]
          : _map(weightsData, (d: any) => ({
              ...d,
              indexCode,
              indexName,
            })),
    }))
    .reduce((pre, next) => ({
      topData: pre.topData.concat(next.topData),
      weightsData: pre.weightsData.concat(next.weightsData),
    }))
    .value();
}

// 对比top10股票组成
export async function queryStockTop(params: StockInfoParams) {
  const { data } = await dispatchPass(API.productionApi.stockIndexValuation, params);

  return data?.dataList || [];
}

// 行业分布
export async function queryIndustryDistribute(params: IndustryParams) {
  const { data } = await dispatchPass(API.productionApi.queryStockIndustry, params);
  return data?.dataList || [];
}

// 指数行业分类
export async function fetchIndexSortSys() {
  const { data } = await dispatchPass(API.productionApi.fetchIndexSortSys);
  const selectData = data?.map((i: any) => ({ value: i.id, label: i.name }));
  return selectData || [];
}

// 核心要素展示
export async function queryIndexCoreConfigDetail(params: IndexCoreParams) {
  const { data } = await dispatchPass(API.productionApi.queryIndexCoreConfigDetail, params);
  return data;
}

// 导出证券组成详情
export async function queryStockInfoExport(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryStockInfoExport, params);
  return data;
}

// 模糊查询指数索引
export async function querySearchIndexInfo(params: { keyword: string }) {
  const { data } = await dispatchPass(API.productionApi.querySearchIndexInfo, params);

  return data;
}

// 跟标指数查询
export async function queryTrackIndexProductList(params: { indexCode: string }) {
  const { data } = await dispatchPass(API.productionApi.queryTrackIndexProductList, params);
  return data;
}
// 发布方枚举
export async function queryIndexPublisherList() {
  const { success, data } = await dispatchPass(API.productionApi.queryIndexPublisherList);
  if (success && Array.isArray(data)) {
    return data.map(({ publisherStr, publisher }) => ({
      label: publisherStr,
      value: publisher,
    }));
  }
  return [];
}
