import { dispatchPass } from '@/services/service';
import { API } from '@/services/api';
import ColorSpan from '@/components/ColorSpan';
import './index.less';

//D-日;W-周;M-月;3M-3月;Y-年;C-成立以来;MTD-本月以来;QTD-本季度以来;YTD-今年以来;
export const CHARTS_OPTIONS_TYPE_DIC = [
  { label: '日', value: 'D' },
  { label: '周', value: 'W' },
  { label: '月', value: 'M' },
  { label: '3月', value: '3M' },
  { label: '1年', value: 'Y' },
  { label: '本月以来', value: 'MTD' },
  { label: '本季以来', value: 'QTD' },
  { label: '今年以来', value: 'YTD' },
  { label: '成立以来', value: 'C' },
];

const fomatValue = (text: any) => {
  const val = text * 100;
  if (val) {
    return <ColorSpan value={val.toFixed(2)} suffix={'%'} />;
  }
  return '';
};

const excFomatValue = (text: any) => {
  const val = text * 100;
  if (val) {
    return <ColorSpan value={val.toFixed(2)} suffix={'%'} />;
  }
  return '';
};

export const NETGROWTHRATIO_CHARTS_COLUMNS = [
  // 组合收益
  {
    circle: 'D',
    title: '日收益',
    dataIndex: 'bNetGrowthRatioDValueDec',
    className: 'text-right head-center',
    sorter: true,
    width: 80,
    render: (text: any) => fomatValue(text),
  },
  {
    circle: 'W',
    title: '周收益',
    dataIndex: 'bNetGrowthRatioWValueDec',
    className: 'text-right head-center',
    sorter: true,
    width: 80,
    render: (text: any) => fomatValue(text),
  },
  {
    circle: 'M',
    title: '月收益',
    dataIndex: 'bNetGrowthRatioMValueDec',
    className: 'text-right head-center',
    sorter: true,
    width: 80,
    render: (text: any) => fomatValue(text),
  },
  {
    circle: '3M',
    title: '3月收益',
    dataIndex: 'bNetGrowthRatio3MValueDec',
    className: 'text-right head-center',
    sorter: true,
    width: 85,
    render: (text: any) => fomatValue(text),
  },
  {
    circle: 'Y',
    title: '年收益',
    dataIndex: 'bNetGrowthRatioYValueDec',
    className: 'text-right head-center',
    sorter: true,
    width: 80,
    render: (text: any) => fomatValue(text),
  },
  {
    circle: 'C',
    title: '成立以来',
    dataIndex: 'bNetGrowthRatioCValueDec',
    className: 'text-right head-center',
    sorter: true,
    width: 90,
    render: (text: any) => fomatValue(text),
  },
  {
    circle: 'MTD',
    title: '本月收益',
    dataIndex: 'bNetGrowthRatioMTDValueDec',
    className: 'text-right head-center',
    sorter: true,
    width: 90,
    render: (text: any) => fomatValue(text),
  },
  {
    circle: 'QTD',
    title: '本季收益',
    dataIndex: 'bNetGrowthRatioQTDValueDec',
    className: 'text-right head-center',
    sorter: true,
    width: 90,
    render: (text: any) => fomatValue(text),
  },
  {
    circle: 'YTD',
    title: '今年收益',
    dataIndex: 'bNetGrowthRatioYTDValueDec',
    className: 'text-right head-center',
    sorter: true,
    width: 90,
    render: (text: any) => fomatValue(text),
  },
];

export const BENCHMARKNETGROWTHRATIO_CHARTS_COLUMNS = [
  // 基准收益
  {
    circle: 'D',
    title: '日收益',
    dataIndex: 'bBenchmarkNetGrowthRatioDValueDec',
    className: 'text-right head-center column_left',
    sorter: true,
    width: 80,
    render: (text: any) => fomatValue(text),
  },
  {
    circle: 'W',
    title: '周收益',
    dataIndex: 'bBenchmarkNetGrowthRatioWValueDec',
    className: 'text-right head-center column_left',
    sorter: true,
    width: 80,
    render: (text: any) => fomatValue(text),
  },
  {
    circle: 'M',
    title: '月收益',
    dataIndex: 'bBenchmarkNetGrowthRatioMValueDec',
    className: 'text-right head-center column_left',
    sorter: true,
    width: 80,
    render: (text: any) => fomatValue(text),
  },
  {
    circle: '3M',
    title: '3月收益',
    dataIndex: 'bBenchmarkNetGrowthRatio3MValueDec',
    className: 'text-right head-center column_left',
    sorter: true,
    width: 85,
    render: (text: any) => fomatValue(text),
  },
  {
    circle: 'Y',
    title: '年收益',
    dataIndex: 'bBenchmarkNetGrowthRatioYValueDec',
    className: 'text-right head-center column_left',
    sorter: true,
    width: 80,
    render: (text: any) => fomatValue(text),
  },
  {
    circle: 'C',
    title: '成立以来',
    dataIndex: 'bBenchmarkNetGrowthRatioCValueDec',
    className: 'text-right head-center column_left',
    sorter: true,
    width: 90,
    render: (text: any) => fomatValue(text),
  },
  {
    circle: 'MTD',
    title: '本月收益',
    dataIndex: 'bBenchmarkNetGrowthRatioMTDValueDec',
    className: 'text-right head-center column_left',
    sorter: true,
    width: 90,
    render: (text: any) => fomatValue(text),
  },
  {
    circle: 'QTD',
    title: '本季收益',
    dataIndex: 'bBenchmarkNetGrowthRatioQTDValueDec',
    className: 'text-right head-center column_left',
    sorter: true,
    width: 90,
    render: (text: any) => fomatValue(text),
  },
  {
    circle: 'YTD',
    title: '今年收益',
    dataIndex: 'bBenchmarkNetGrowthRatioYTDValueDec',
    className: 'text-right head-center column_left',
    sorter: true,
    width: 90,
    render: (text: any) => fomatValue(text),
  },
];
export const EXCESSRETURNS_CHARTS_COLUMNS = [
  // 超额收益
  {
    circle: 'D',
    title: '日收益',
    dataIndex: 'bExcessReturnsDValueDec',
    className: 'text-right head-center column_right',
    sorter: true,
    width: 80,
    render: (text: any) => excFomatValue(text),
  },
  {
    circle: 'W',
    title: '周收益',
    dataIndex: 'bExcessReturnsWValueDec',
    className: 'text-right head-center column_right',
    sorter: true,
    width: 80,
    render: (text: any) => excFomatValue(text),
  },
  {
    circle: 'M',
    title: '月收益',
    dataIndex: 'bExcessReturnsMValueDec',
    className: 'text-right head-center column_right',
    sorter: true,
    width: 80,
    render: (text: any) => excFomatValue(text),
  },
  {
    circle: '3M',
    title: '3月收益',
    dataIndex: 'bExcessReturns3MValueDec',
    className: 'text-right head-center column_right',
    sorter: true,
    width: 85,
    render: (text: any) => excFomatValue(text),
  },
  {
    circle: 'Y',
    title: '年收益',
    dataIndex: 'bExcessReturnsYValueDec',
    className: 'text-right head-center column_right',
    sorter: true,
    width: 80,
    render: (text: any) => excFomatValue(text),
  },
  {
    circle: 'C',
    title: '成立以来',
    dataIndex: 'bExcessReturnsCValueDec',
    className: 'text-right head-center column_right',
    sorter: true,
    width: 90,
    render: (text: any) => excFomatValue(text),
  },
  {
    circle: 'MTD',
    title: '本月收益',
    dataIndex: 'bExcessReturnsMTDValueDec',
    className: 'text-right head-center column_right',
    sorter: true,
    width: 90,
    render: (text: any) => excFomatValue(text),
  },
  {
    circle: 'QTD',
    title: '本季收益',
    dataIndex: 'bExcessReturnsQTDValueDec',
    className: 'text-right head-center column_right',
    sorter: true,
    width: 90,
    render: (text: any) => excFomatValue(text),
  },
  {
    circle: 'YTD',
    title: '今年收益',
    dataIndex: 'bExcessReturnsYTDValueDec',
    className: 'text-right head-center column_right',
    sorter: true,
    width: 90,
    render: (text: any) => excFomatValue(text),
  },
];

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

// 收益详情列表查询
export async function MpPortfolioAnalyseFacadeQuery(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpPortfolioAnalyseFacadeQuery, params);
  return data || [];
}

// 收益分析视图查询
export async function MpPortfolioAnalyseFacadeQueryCharts(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.MpPortfolioAnalyseFacadeQueryCharts,
    params,
  );
  return data || [];
}

// 收益详情子列表查询
export async function MpPortfolioAnalyseFacadeQueryChildrenList(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.MpPortfolioAnalyseFacadeQueryChildrenList,
    params,
  );
  return data || [];
}

// 收益详情导出
export async function MpPortfolioAnalyseFacadeExportData(params: {
  domains: any;
  tradeDate: string | undefined;
}) {
  const { success, data, errorMsg } = await dispatchPass(
    API.investmentApi.MpPortfolioAnalyseFacadeExportData,
    params,
  );
  return { success, data, errorMsg };
}

// 查询我的组合结构
export async function MpRsPortfolioFacadeMyPortfolio(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpRsPortfolioFacadeMyPortfolio, params);
  return data || [];
}

// 查询其他业务域可见组合结构
export async function MpRsPortfolioFacadeQueryByPage(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpRsPortfolioFacadeQueryByPage, params);
  return data || [];
}

// 查询组合最新持仓日期
export async function MpRsSysBaseInfoFacadeGetDateInfo(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpRsSysBaseInfoFacadeGetDateInfo, params);
  return data || [];
}

// 基准信息查询
export async function MpBenchmarkQuery(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpBenchmarkQuery, params);
  if (Array.isArray(data)) {
    // @ts-ignore
    return data.map(({ bmCode, bmName, domain, bmComment, bmType }) => ({
      label: bmName,
      value: bmCode,
      domain: domain,
      comment: bmComment,
      bmType: bmType,
    }));
  }
  return [];
}
