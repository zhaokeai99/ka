import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface IBondBaseInfoType {
  bondCode: string; // 债券代码
  bondRating: string; // 债券评级
  bondShortName: string; // 债券简称
  compName: string; // 主体名称
  compRating: string; // 主体评级
  compWindName: string; // 所属行业
  couponRate: string; // 票面利率
  guarantorNature: string; // 性质
  industryName: string; // 一级板块
  maturityDate: string; // 到期日
  region: string; // 地区
  remainingMaturity: string; // 剩余期限
  type: string; // 类型
  urbanInvest: boolean; //城投债
  compCode: string; //主体Code
}

export interface ICouponAfterChartType {
  chartType: 'point' | 'line' | 'column'; //
  dateTime: string; //时间
  markPoint: boolean; //是否标记
  resultValue: number;
  type: string;
}

// 个券异动-个券及主体基础信息
export async function getBondBaseInfo(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.BondPriceChangeGetBondBaseInfo,
    params,
  );
  return {
    data,
    success,
  };
}

// 个券异动-收盘价趋势
export async function getClosePriceChart(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.BondPriceChangeGetClosePriceChart,
    params,
  );
  return {
    data,
    success,
  };
}

// 个券异动-估值趋势
export async function getValChart(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.BondPriceChangeGetValChart,
    params,
  );
  return {
    data,
    success,
  };
}

// 个券异动-相对估值偏离趋势
export async function getValOffsetChart(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.BondPriceChangeGetValOffsetChart,
    params,
  );
  return {
    data,
    success,
  };
}

// 个券异动-筛选条件-异动类型查询
export async function getEventType(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.BondPriceChangeGetEventType,
    params,
  );
  return {
    data,
    success,
  };
}

// 异动归因-异动风险图
export async function getEventChart(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.BondPriceChangeGetEventChart,
    params,
  );
  return {
    data,
    success,
  };
}

// 异动归因-异动风险分页报表
export async function getEventReport(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.BondPriceChangeGetEventReport,
    params,
  );
  return {
    data,
    success,
  };
}
// 债券持仓-持仓基本信息查询
export async function getBondThfundHold(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.BondPriceChangeGetBondThfundHold,
    params,
  );
  return {
    data,
    success,
  };
}
// 个券异动--债券偿还信息
export async function getBondAmountChange(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.BondPriceChangeGetBondAmountChange,
    params,
  );
  return {
    data,
    success,
  };
}
