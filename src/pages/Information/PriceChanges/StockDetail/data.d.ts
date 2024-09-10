import React from 'react';

export enum COLORENUM {
  // （由浅到深）：
  red1 = '#FFEBEB',
  red2 = '#FFDBDC',
  red3 = '#FFB7B7',
  red4 = '#FF8F8F',
  red5 = '#FF8181',
  red6 = '#EC6464',
  red7 = '#c60f33',
  green1 = '#E6FAEB',
  green2 = '#C9EDD2',
  green3 = '#ABE3B8',
  green4 = '#86D097',
  green5 = '#67C47D',
  green6 = '#40B333',
  gray = '#CDCDCD',
  warning6 = '#F27C49',
  orange = '#fbbe04',
}

export enum StockDetailTabsKeys {
  MOVE = 'move',
}

export const getColorText = (value: any) => {
  if (Number(value) < 0) {
    return COLORENUM.green6;
  } else if (Number(value) > 0) {
    return COLORENUM.red6;
  } else {
    return '#000000';
  }
};

export interface ITableItemType {}

export interface IStockDetailContext {
  title?: React.ReactNode;
  onOpen: (value: ICloseEventModalParams) => void;
  record?: Partial<{
    eventDetail: string;
    eventTitle: string;
    eventType: string;
    tradeDate: string;
    windBondCode: string;
  }>;
  visible?: boolean;
  valueEnum?: Reacord<string, any>;
  code?: string;
  stockType?: string;
}

export interface ICAProps<T> {
  params: T; //参数
  onChangeParams: (e: T) => void;
}

export const initCAcontextValue: IStockDetailContext = {
  title: '',
  text: '',
  visible: false,
  stockType: '',
  valueEnum: {},
};

export interface ICommonStateType extends Omit<IStockDetailContext, 'onOpen'> {}

export interface ICloseEventModalParams extends Omit<IStockDetailContext, 'valueEnum' | 'onOpen'> {}

export interface ICommonActionType {
  payload?: ICommonStateType;
  type: 'OPEN' | 'CLOSE' | 'EVENT-ENUM' | 'SET-STOCK-TYPE';
}

export const StockDetailContext = React.createContext<IStockDetailContext>(initCAcontextValue);

export const numberToT = (value: any, decimal = 1, round = false, actuary = true) => {
  const newValue = ['', '', ''];
  let fr = 1000;
  let num = 3;
  let text1 = '';
  let fm = 1;

  while (value / fr >= 1) {
    fr *= 10;
    num += 1;
  }

  if (num <= 4) {
    // 千
    newValue[0] = (value / 1000).toFixed(decimal) + '';
    newValue[1] = '千';
  } else if (num <= 8) {
    // 万
    if (actuary) {
      text1 = parseInt(num - 4) / 3 > 1 ? '千万' : '万';
    } else {
      text1 = '万';
    }
    // tslint:disable-next-line:no-shadowed-variable
    fm = text1 === '万' ? 10000 : 10000000;
    if (value % fm === 0) {
      newValue[0] = parseInt(value / fm) + '';
    } else {
      if (round) {
        newValue[0] = parseFloat(value / fm).toFixed(decimal) + '';
      } else {
        newValue[0] = formatDecimal(parseFloat(value / fm), decimal) + '';
      }
    }
    newValue[1] = text1;
  } else if (num <= 16) {
    // 亿
    if (actuary) {
      text1 = (num - 8) / 3 > 1 ? '千亿' : '亿';
      text1 = (num - 8) / 4 > 1 ? '万亿' : text1;
      text1 = (num - 8) / 7 > 1 ? '千万亿' : text1;
    } else {
      text1 = '亿';
    }

    // tslint:disable-next-line:no-shadowed-variable
    fm = 1;
    if (text1 === '亿') {
      fm = 100000000;
    } else if (text1 === '千亿') {
      fm = 100000000000;
    } else if (text1 === '万亿') {
      fm = 1000000000000;
    } else if (text1 === '千万亿') {
      fm = 1000000000000000;
    }
    if (value % fm === 0) {
      newValue[0] = parseInt(value / fm) + '';
    } else {
      if (round) {
        newValue[0] = parseFloat(value / fm).toFixed(decimal) + '';
      } else {
        newValue[0] = formatDecimal(parseFloat(value / fm), decimal) + '';
      }
    }
    newValue[1] = text1;
  }

  if (value < 1) {
    newValue[0] = value.toFixed(4) + '';
    newValue[1] = '';
  } else if (value < 1000) {
    newValue[0] = value.toFixed(decimal) + '';
    newValue[1] = '';
  }

  return newValue.join('');
};
