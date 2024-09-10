import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface ICommonTableItems {
  dateTime?: any; //时间
  offsetPCT?: any; //偏离百分比
  volume?: any; //成交量
  bondShortName?: string; //债券
  offsetVal?: any; //偏离绝对值
  amount?: any; //成交金额
  bondCode?: string; //券码代码
  companyName?: string; //主体
  holdOn?: boolean; //持仓债券
  bondType?: string; //债券类型
  industryName?: string; //中信一级行业
  province?: string; //区域选择
  bondRating?: string; //债项评级
  companyRating?: string; //主体评级
  urbanInvest?: boolean; //城投绩
  firstPrice?: string; //中债估值
  secondPrice?: string; //昨日估值
  valYields?: string; //估值收益率
  bondCompany?: string; //债项/主体评级
  remainingMaturity?: string; //剩余期限
  couponRate?: string; //票面利率(%)
  priceChangeMark?: string; //是否异动
}

export interface ICommonSearch {
  id: string;
  name: string;
}

// 筛选条件-债券类型查询
export async function getBondType() {
  const { data, success } = await dispatchPass(API.informationApi.BondPriceChangeGetBondType);
  return {
    data,
    success,
  };
}

// 筛选条件-一级行业查询
export async function getIndustry() {
  const { data, success } = await dispatchPass(API.informationApi.BondPriceChangeGetIndustry);
  return {
    data,
    success,
  };
}
