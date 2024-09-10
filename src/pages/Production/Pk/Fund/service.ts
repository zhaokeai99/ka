import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 根据基金代码查详情
export async function queryAllFundNameInfos(params: { codes: string[] }) {
  const fundCodes = params.codes.filter((str) => str);
  if (fundCodes.length) {
    const { data } = await dispatchPass(API.productionApi.queryAllFundNameInfos, {
      fundCodes,
    });

    return (
      data?.map((i: any) => ({
        ...i,
        name: i.fundName,
        shortName: i.fundShortName,
        code: i.fundCode,
      })) || []
    );
  }

  return [];
}

// 搜索基金
export async function searchFundInfo(params: any) {
  const { data } = await dispatchPass(API.productionApi.fuzzySearch, params);
  return data || [];
}

// 基金特征Ai白话文
export async function queryFundVernacularArticle(params: { fundCodes: string[] }) {
  const fundCodes = params.fundCodes.filter((str) => str);

  if (fundCodes.length) {
    const { data } = await dispatchPass(API.productionApi.queryFundVernacularArticle, {
      fundCodes,
    });
    return data || [];
  }
  return [];
}

// 区间收益和排名
export async function queryFundInterval(params: { fundCodes: string[]; classify: string }) {
  const fundCodes = params.fundCodes.filter((str) => str);
  if (fundCodes.length) {
    const { data } = await dispatchPass(API.productionApi.queryFundInterval, {
      fundCodes,
      classify: params.classify,
    });
    return data || [];
  }
  return [];
}

// 查询pk规模
export async function queryFundAssetAmt(params: { fundCodes: string[] }) {
  const fundCodes = params.fundCodes.filter((str) => str);
  if (fundCodes.length) {
    const { data } = await dispatchPass(API.productionApi.queryFundAssetAmt, {
      fundCodes,
    });
    return data || [];
  }
  return [];
}

// 查询 历史近一年的规模/历史投资收益走势/历史净值走势
export async function queryHistoryFundAssetAmt(params: { fundCodes: string[]; colNames: string }) {
  const fundCodes = params.fundCodes.filter((str) => str);
  if (fundCodes.length) {
    const { data } = await dispatchPass(API.productionApi.queryHistoryFundAssetAmtPk, {
      fundCodes,
      colNames: params.colNames,
    });
    return data || [];
  }
  return [];
}

// 年化回报
export async function queryFundPkAnnualizedReturn(params: { fundCodes: string[] }) {
  const fundCodes = params.fundCodes.filter((str) => str);
  if (fundCodes.length) {
    const { data } = await dispatchPass(API.productionApi.queryFundPkAnnualizedReturn, {
      fundCodes,
    });
    return data || [];
  }
  return [];
}

// 三因子
export async function queryFundNavRegff3ModelData(params: { fundCodes: string[] }) {
  const fundCodes = params.fundCodes.filter((str) => str);
  if (fundCodes.length) {
    const { data } = await dispatchPass(API.productionApi.queryFundNavRegff3ModelDataPk, {
      fundCodes,
    });
    const ff3Mkt: any = [];
    const ff3Smb: any = [];
    const ff3Hml: any = [];
    const rsquared: any = [];

    (data || []).forEach((d) => {
      ff3Mkt.push({
        type: '市场因子',
        value: d.ff3Mkt,
        fundName: d.fundName,
      });
      ff3Smb.push({
        type: '规模因子',
        value: d.ff3Smb,
        fundName: d.fundName,
      });
      ff3Hml.push({
        type: '价值因子',
        value: d.ff3Hml,
        fundName: d.fundName,
      });
      rsquared.push({
        type: 'R²',
        value: d.rsquared,
        fundName: d.fundName,
      });
    });

    return [...rsquared, ...ff3Mkt, ...ff3Smb, ...ff3Hml];
  }
  return [];
}

// 持有人结构
export async function queryFundHoldPercent(params: { fundCodes: string[] }) {
  const fundCodes = params.fundCodes.filter((str) => str);

  if (fundCodes.length) {
    const { data } = await dispatchPass(API.productionApi.queryFundHoldPercentPk, {
      fundCodes,
    });
    const orgHoldPercentList: any[] = [];
    const personHoldPercentList: any[] = [];

    (data || []).forEach((d) => {
      orgHoldPercentList.push({
        fundName: d.fundName,
        value: d.orgHoldPercent,
        type: '机构',
      });
      personHoldPercentList.push({
        fundName: d.fundName,
        value: d.personHoldPercent,
        type: '个人',
      });
    });
    return [...orgHoldPercentList, ...personHoldPercentList];
  }
  return [];
}

// 持仓分析-季报
export async function queryFundHoldSharesPercent(params: { fundCodes: string[] }) {
  const fundCodes = params.fundCodes.filter((str) => str);
  if (fundCodes.length) {
    const { data } = await dispatchPass(API.productionApi.queryFundHoldSharesPercentPk, {
      fundCodes,
    });
    const otherPercent: any[] = [];
    const stockPercent: any[] = [];
    const cashPercent: any[] = [];
    const bondPercent: any[] = [];

    (data || []).forEach((d) => {
      otherPercent.push({
        fundName: d.fundName,
        value: d.otherPercent,
        type: '其他',
      });
      stockPercent.push({
        fundName: d.fundName,
        value: d.stockPercent,
        type: '股票',
      });
      cashPercent.push({
        fundName: d.fundName,
        value: d.cashPercent,
        type: '现金',
      });
      bondPercent.push({
        fundName: d.fundName,
        value: d.bondPercent,
        type: '债券',
      });
    });
    return [...otherPercent, ...stockPercent, ...cashPercent, ...bondPercent];
  }
  return [];
}

// 查询基金经理
export async function queryFundManager(params: { fundCodes: string[] }) {
  const fundCodes = params.fundCodes.filter((str) => str);
  if (fundCodes.length) {
    const { data } = await dispatchPass(API.productionApi.queryFundManagerCompany, {
      fundCodes,
    });
    return data?.fundManagerList || [];
  }
  return [];
}

// 查询公司
export async function queryFundCompany(params: { fundCodes: string[] }) {
  const fundCodes = params.fundCodes.filter((str) => str);
  if (fundCodes.length) {
    const { data } = await dispatchPass(API.productionApi.queryFundManagerCompany, {
      fundCodes,
    });
    return data?.manageCompanyList || [];
  }
  return [];
}

// 行业分析模型
export async function queryFundNavRegIndusPkData(params: { fundCodes: string[] }) {
  const fundCodes = params.fundCodes.filter((str) => str);
  if (fundCodes.length) {
    const { data } = await dispatchPass(API.productionApi.queryFundNavRegIndusPkData, {
      fundCodes,
    });

    let result: any[] = [];
    (data || []).forEach(({ list = [] }) => {
      result = [...result, ...list];
    });

    return result;
  }
  return [];
}

// 基金仓位测算
export async function queryFundNavRegStockPosPkData(params: { fundCodes: string[] }) {
  const fundCodes = params.fundCodes.filter((str) => str);
  if (fundCodes.length) {
    const { data } = await dispatchPass(API.productionApi.queryFundNavRegStockPosPkData, {
      fundCodes,
    });
    return data || [];
  }
  return [];
}

// 择时选股C-L模型
export async function queryFundNavRegClModelData(params: { fundCodes: string[] }) {
  const fundCodes = params.fundCodes.filter((str) => str);
  if (fundCodes.length) {
    const { data } = await dispatchPass(API.productionApi.queryFundNavRegClModelData, {
      fundCodes,
    });
    return data || [];
  }
  return [];
}

// 大盘胜率下拉
export async function querySearchFundMarketCondition() {
  const { data } = await dispatchPass(API.productionApi.querySearchFundMarketCondition);
  return data || [];
}

// 大盘胜率
export async function queryFundMarketRate(params: {
  fundCodes: string[];
  ratioA: number | null;
  ratioB: number | null;
  indexA: number | null;
  indexB: number | null;
}) {
  const fundCodes = params.fundCodes.filter((str) => str);
  const { ratioA, ratioB, indexA, indexB } = params;
  if (fundCodes.length) {
    const { data } = await dispatchPass(API.productionApi.queryFundMarketRate, {
      fundCodes,
      ratioA,
      ratioB,
      indexA,
      indexB,
    });
    return data || [];
  }
  return [];
}

// 获取比率
export async function queryAllMarketFundInfos(params: { fundCodes: string[] }) {
  const fundCodes = params.fundCodes.filter((str) => str);
  if (fundCodes.length) {
    const { data } = await dispatchPass(API.productionApi.queryAllMarketFundInfos, {
      fundCodes,
    });
    return data || [];
  }
  return [];
}

// 风险评估
export async function queryAllFundQuotaScoreData(params: { fundCodes: string[] }) {
  const fundCodes = params.fundCodes.filter((str) => str);
  if (fundCodes.length) {
    const { data } = await dispatchPass(API.productionApi.queryAllFundQuotaScoreData, {
      fundCodes,
    });

    const items = [
      { key: 'volatilityRank', label: '波动率' },
      { key: 'trendRank', label: '趋势' },
      { key: 'riskRank', label: '风险' },
      { key: 'momentumRank', label: '动量' },
      { key: 'maxdrawdownRank', label: '最大回撤' },
    ];

    const list: any[] = [];

    items.forEach(({ key, label }) => {
      (data || []).forEach((d: any) => {
        list.push({
          item: label,
          value: d[key],
          fundName: d.fundShortName,
        });
      });
    });

    return list || [];
  }
  return [];
}

// 风险评估指标介绍
export async function getFundQuotaDescribeList() {
  const { data } = await dispatchPass(API.productionApi.getFundQuotaDescribeList);
  return data || [];
}

// 基金pk 区间收益同类排名 分类标准选项
export async function queryFundLevelIncomeRank() {
  const { data } = await dispatchPass(API.productionApi.queryFundLevelIncomeRank);
  return data || [];
}
