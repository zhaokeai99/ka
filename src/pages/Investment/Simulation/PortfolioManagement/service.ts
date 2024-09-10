import { dispatchPass } from '@/services/service';
import { API } from '@/services/api';

export const BM_TYPE_DIC = {
  '1': '市场指数',
  '2': '复合基准',
  '3': '自定义基准',
  '4': '自定义指数',
};
export const STK_TYPE_DIC = { A: '股票', ORD: '港股' };
export const SECURITY_TYPE = { '1': 'STOCK', '2': 'FUND', '3': '混合' };
export const POOL_TYPE = { 'INVEST/白名单/投资池': 'INVEST', 'FORBID/黑名单/禁投池': 'FORBID' };
export const MTK_CODE_DIC = { SZSE: '深交所', SSE: '上交所', HKEX: '港交所' };
export const ORDER_CODE_DIC = { '1': '比例', '2': '金额' };
export const DEAL_DIRECTION_DIC = {
  '1': '买入',
  '2': '卖出',
  '3': '配股申购',
  '4': '现金分红',
  '5': '红转送',
};

//D-日;W-周;M-月;3M-3月;Y-年;C-成立以来;MTD-本月以来;QTD-本季度以来;YTD-今年以来;
export const CHARTS_OPTIONS_TYPE_DIC = [
  { label: '1周', value: 'W' },
  { label: '1月', value: 'M' },
  { label: '3月', value: '3M' },
  { label: '1年', value: 'Y' },
  { label: '本月以来', value: 'MTD' },
  { label: '季度以来', value: 'QTD' },
  { label: '今年以来', value: 'YTD' },
  { label: '成立以来', value: 'C' },
];

export interface ReportData {
  incomeData: any;
  incomeDetail: any;
  maxData: any;
  returnData: any[];
}

export interface TableListItem1 {
  id: number;
  bmCode: string;
  bmName: string;
  domain: string;
  bmType: number;
  indexCode: string;
  indexName: string;
  indexSysName: string;
}

export interface TableListItem2 {
  id: number;
  close: number;
  indexClassPath: string;
  domain: string;
  bmType: number;
  indexCode: string;
  indexName: string;
  indexSysName: string;
  tradeDate: string;
}
//　组合信息
export interface PortfolioInfo {
  /**
   * 自增主键
   */
  id: number;
  /**
   * 业务域
   */
  domain: string;
  /**
   * 组合代码
   */
  mpCode: string;
  /**
   * 组合名称
   */
  mpName: string;
  /**
   * 组合类型:1-自由组合;2-行业组合(行业组合需要有行业关联)
   */
  mpType: string;
  /**
   * 下单方式 1-比例 2-金额
   */
  orderType: string;
  /**
   * 默认成交价格:1-前收;2-最新;3-均价
   */
  dealPriceDefault: string;
  /**
   * 初始资金
   */
  startMoney: number;
  /**
   * 主基准代码,和基准的业务域保持一致,如果有多个基准,之后可以添加外关联表
   */
  bmCode: string;
  /**
   * 主基准名称,和基准的业务域保持一致,如果有多个基准,之后可以添加外关联表
   */
  bmName: string;
  /**
   * 投资证券类型:1-股票;2-基金;3混合(第一版本不支持)
   */
  stkType: string;
  /**
   * 所属行业(行业组合需要)
   */
  indCode: string;
  /**
   * 所属行业路径(投研部行业分类->基础化工->化工制品)
   */
  indPath: string;
  /**
   * 投资池,如二级库,三级库,多个逗号分隔(没有配置，取业务域)
   */
  investPool: string;
  /**
   * 禁投池,多个逗号分隔(没有配置，取业务域)
   */
  noInvestPool: string;
  /**
   * 组合状态:1-正常; 0-废弃
   */
  status: string;
  /**
   * 交易费率
   */
  orderFee: number;
  /**
   * 佣金
   */
  commissionFee: number;
  /**
   * 生效日
   */
  beginDate: string | any;
  /**
   * 失效日
   */
  endDate: string | any;
  /**
   * 是否公开:1-公开;0-不公开(公开,业务域下相互可见)
   */
  isPublic: string;
  /**
   * 投资策略
   */
  strategy: string;
  /**
   * 申请编号(前端可不见)
   */
  appSheetSerialNo: string;
  /**
   * 创建人域账号
   */
  userId: string;
  /**
   * 创建时间
   */
  createTime: string;
  /**
   * 修改时间
   */
  updateTime: string;
  /**
   * 时间
   */
  validDate: any[];

  /**
   * 投资池名称
   */
  investPoolName: string;
}

// 获取组合结构
export async function MpRsPortfolioFacadeGet(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpRsPortfolioFacadeGet, params);
  return data || [];
}

// 新增组合结构
export async function MpRsPortfolioFacadeAdd(params = {}) {
  const data = await dispatchPass(API.investmentApi.MpRsPortfolioFacadeAdd, params);
  return data || [];
}

// 修改组合结构
export async function MpRsPortfolioFacadeEdit(params = {}) {
  const data = await dispatchPass(API.investmentApi.MpRsPortfolioFacadeEdit, params);
  return data || [];
}

// 查询组合结构
export async function MpRsPortfolioFacadeQueryByPage(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpRsPortfolioFacadeQueryByPage, params);
  return data || [];
}
// 查询组合结构
export async function MpRsPortfolioFacadeMyPortfolio(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpRsPortfolioFacadeMyPortfolio, params);
  return data || [];
}

// 查询组合分析因子结果
export async function MpRsAnaIndexValueFacadeQuery(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpRsAnaIndexValueFacadeQuery, params);
  return data || [];
}

// 收益走势图
export async function MpRsAnaIndexValueFacadeQueryDetail(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpRsAnaIndexValueFacadeQueryDetail, params);
  return data || [];
}

// 查询调仓手工主动调整的日期-用于收益走势图X轴标点
export async function MpRsAnaIndexValueFacadeQueryChgWayATradeDate(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.MpRsAnaIndexValueFacadeQueryChgWayATradeDate,
    params,
  );
  return data || [];
}

// 查询组合分析因子结果最新记录
export async function MpRsAnaIndexValueFacadeByNew(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpRsAnaIndexValueFacadeByNew, params);
  return data || [];
}

// 持仓
export async function MpRsHoldItemFacadeQueryByPage(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpRsHoldItemFacadeQueryByPage, params);
  return data || [];
}

// 组合净值
export async function MpRsNvFacadeQueryByPage(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpRsNvFacadeQueryByPage, params);
  return data || [];
}

// 查询上一交易日
export async function MpRsSysBaseInfoFacadeGetPrevTrade(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpRsSysBaseInfoFacadeGetPrevTrade, params);
  return data || [];
}

export async function MpRsSysBaseInfoFacadeGetDateInfo(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpRsSysBaseInfoFacadeGetDateInfo, params);
  return data || [];
}

// 组合最大回撤分析
export async function MpAnaMddDetailInfoQuery(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpAnaMddDetailInfoQuery, params);
  return data || {};
}

// 实时查询
export async function MpRsHoldChgFacadeQueryMpRsRealanalysis(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.MpRsHoldChgFacadeQueryMpRsRealanalysis,
    params,
  );
  return data || {};
}
// 查询时间段信息
export async function MpRsHoldChgFacadeGetCircleDate(params = {}) {
  const result = await dispatchPass(API.investmentApi.MpRsHoldChgFacadeGetCircleDate, params);
  return result || {};
}

// wind日历交易日,前几天的交易日
export async function MpWindFacadeGetPrevTradeByNum(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpWindFacadeGetPrevTradeByNum, params);
  return data || {};
}
// wind日历交易日,后几天的交易日
export async function MpWindFacadeGetNextTradeByNum(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpWindFacadeGetNextTradeByNum, params);
  return data || {};
}

// 业务域查询接口
export async function MpDomainQuery() {
  const { data } = await dispatchPass(API.investmentApi.MpDomainQuery);
  if (Array.isArray(data)) {
    return data.map(({ domain, domainName }) => ({
      label: domainName,
      value: domain,
    }));
  }
  return [];
}

// 基准信息查询
export async function MpBenchmarkQuery(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpBenchmarkQuery, params);
  if (Array.isArray(data)) {
    return data.map(({ bmCode, bmName, domain }) => ({
      label: bmName,
      value: bmCode,
      domain: domain,
    }));
  }
  return [];
}

// 收益贡献查询
export async function ReturnContributionQuery(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpRsAnaIndexValueFacadeStkIndex, params);
  return data || [];
}

// 获取上传文件地址
export async function MpRsDicInfoGetExcelHost(params = {}) {
  const result = await dispatchPass(API.investmentApi.MpRsDicInfoGetExcelHost, params);
  return result || {};
}

// 业务域查询接口
export async function MpDomainFacadeImplQueryMpDomain(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpDomainFacadeImplQueryMpDomain, params);
  if (Array.isArray(data)) {
    return data.map(({ domain, domainName }) => ({
      label: domainName,
      value: domain,
    }));
  }
  return [];
}

// 查询业务域股票池树
export async function MpDomainPoolFacadeQueryDomainPoolTree(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.MpDomainPoolFacadeQueryDomainPoolTree,
    params,
  );
  return data || [];
}

// 下载模板
export async function MpRsHoldChgFacadeGetExcelTempleUrl(params = {}) {
  return await dispatchPass(API.investmentApi.MpRsHoldChgFacadeGetExcelTempleUrl, params);
}
