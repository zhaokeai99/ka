import { StoreValue, RuleObject } from 'rc-field-form/lib/interface';
import React from 'react';

export enum headerTabsCardKeys {
  INTRADAY = 'intraday',
  AFTER = 'after',
}

export enum intradayTabsKeys {
  VALUATION = 'valuation',
  PRE = 'pre',
}

export enum afterTabsKeys {
  VALUATION = 'valuation',
  CLOSE = 'close',
  RELATIVE = 'relative',
}

export const ratingSelectOption = [
  {
    label: 'AAA',
    value: 'AAA',
  },
  {
    label: 'AA+',
    value: 'AA+',
  },
  {
    label: 'AA',
    value: 'AA',
  },
  {
    label: 'AA-',
    value: 'AA-',
  },
  {
    label: 'A+',
    value: 'A+',
  },
  {
    label: 'A',
    value: 'A',
  },
  {
    label: '其他',
    value: '其他',
  },
];

export interface IModifyType<T, k> {
  (arr: k[]): T[];
}

export interface IBondTabsContext<T> {
  bondType: T[];
  industry: T[];
}

export type IBondContextType = IBondTabsContext<{
  value: string;
  label: string;
}>;

export type IBondContextValueType = IBondTabsContext<{
  value: string;
  label: string;
}>;

export const bondTabsContextInitValue: IBondContextValueType = {
  bondType: [],
  industry: [],
};

// 存储公共参数
export const BondTabsContext = React.createContext<IBondContextType>(bondTabsContextInitValue);

// 最大值最小值表单校验
export const maxMinValidator =
  (title?: string) =>
  (
    rule: RuleObject,
    value: StoreValue,
    // callback?: (error?: string) => void //TODO
  ) => {
    if (!value) {
      return Promise.resolve();
    }
    const max = value?.[0];
    const min = value?.[0];
    if (!max) {
      return Promise.reject(new Error(`请输入${title || ''}最大值`));
    }
    if (!min) {
      return Promise.reject(new Error(`请输入${title || ''}最小值`));
    }
    if (min > max) {
      return Promise.reject(new Error(`${title || ''}最小值不能大于最大值`));
    }
    return Promise.resolve();
  };

export const InputNumberPrecision = 2; // 搜索条件精确到小数点后两位

export const sorterOpition = {
  dateTime: '时间',
  offsetPCT: '偏离百分比',
  offsetVal: '偏离绝对值',
  volume: '成交量',
  amount: '成交金额',
};

export enum COLORENUM {
  // （由浅到深）：
  red1 = '#FFEBEB',
  red2 = '#FFDBDC',
  red3 = '#FFB7B7',
  red4 = '#FF8F8F',
  red5 = '#FF8181',
  red6 = '#E64552',
  red7 = '#D34A4A',
  green1 = '#E6FAEB',
  green2 = '#C9EDD2',
  green3 = '#ABE3B8',
  green4 = '#86D097',
  green5 = '#67C47D',
  green6 = '#40B333',
  gray = '#CDCDCD',
  warning6 = '#F27C49',
}

export const getOffsetValColor = (value: any) => {
  if (Number(value) < 0) {
    return COLORENUM.green6;
  } else if (Number(value) > 0) {
    return COLORENUM.red6;
  } else {
    return '#000000';
  }
};

// 默认不显示的列
export const commonColumnState = {
  bondCompany: {
    //债项/主体评级
    show: false,
  },
  remainingMaturity: {
    //剩余期限（年）
    show: false,
  },
  couponRate: {
    //票面利率（%）
    show: false,
  },
  // province: {
  //   // 区域
  //   show: false,
  // },
  // industryName: { // 行业
  //   show: false
  // },
  bondType: {
    // 债券类型
    show: false,
  },
};

// 成交量 tooltip 标题
export const volumeTootipTitle =
  '交易所成交量：原始数据为当日累计成交，以小时快照更新，当前逐笔成交=当前累计成交-上笔累计成交';

// 成交金额 tooltip 标题
export const amountTootipTitle =
  '交易所成交金额：原始数据为当日累计成交，以小时快照更新，当前逐笔成交=当前累计成交-上笔累计成交';
