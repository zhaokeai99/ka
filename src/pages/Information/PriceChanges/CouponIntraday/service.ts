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
  compCode: boolean; //主题代码
}

export interface ICouponIntradayChartType {
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

// 个券异动-成交曲线-历史
export async function getHistoryVolChart(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.BondPriceChangeGetHistoryVolChart,
    params,
  );
  return {
    data,
    success,
  };
}

// 个券异动-成交曲线
export async function getVolChart(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.BondPriceChangeGetVolChart,
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
