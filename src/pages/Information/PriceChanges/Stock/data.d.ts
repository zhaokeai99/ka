export const riseAndFallPctOption = [
  {
    value: 'oppositeHs300IncomeRate',
    label: '沪深300',
    title: (prefix?: sting) => {
      return `相对沪深300${prefix ?? ''}涨跌幅（%）`;
    },
  },
  {
    value: 'oppositeZz500IncomeRate',
    label: '中证500',
    title: (prefix?: sting) => {
      return `相对中证500${prefix ?? ''}涨跌幅（%）`;
    },
  },
  {
    value: 'oppositeCybIncomeRate',
    label: '创业板指(399006)',
    title: (prefix?: sting) => {
      return `相对创业板指数${prefix ?? ''}涨跌幅（%）`;
    },
  },
  {
    value: 'oppositeHsIncomeRate',
    label: '恒生指数(HSI)',
    title: (prefix?: sting) => {
      return `相对恒生指数${prefix ?? ''}涨跌幅（%）`;
    },
  },
  {
    value: 'oppositeHskjIncomeRate',
    label: '恒生科技(HSTECH)',
    title: (prefix?: sting) => {
      return `相对恒生科技指数${prefix ?? ''}涨跌幅（%）`;
    },
  },
  {
    value: 'oppositeCiticsOneWeekIncomeRate',
    label: '中信一级行业',
    title: (prefix?: sting) => {
      return `相对行业指数${prefix ?? ''}涨跌幅（%）`;
    },
  },
];

export const productTypeOpitions = [
  {
    value: '公募',
    label: '公募',
  },
  {
    value: '专户',
    label: '专户',
  },
];

export const fundTypeOpitions = [
  {
    value: '主动',
    label: '主动管理型',
  },
  {
    value: '被动',
    label: '被动管理型',
  },
];

export enum StockTypeNameKeys {
  ASHARES = 'A股',
  HSHARES = '港股',
}

export const stockTypeNameOpitions = [
  {
    value: StockTypeNameKeys.ASHARES,
    label: 'A股',
  },
  {
    value: StockTypeNameKeys.HSHARES,
    label: '港股',
  },
];

export enum ChangeTypeKeys {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  CUSTOM = 'custom',
}

export const changeTypeOpitions = [
  {
    value: ChangeTypeKeys.DAY,
    label: '日',
    title: '日涨跌幅',
  },
  {
    value: ChangeTypeKeys.WEEK,
    label: '周',
    title: '周涨跌幅',
  },
  {
    value: ChangeTypeKeys.MONTH,
    label: '月',
    title: '月涨跌幅',
  },
  {
    value: ChangeTypeKeys.YEAR,
    label: '年',
    title: '年涨跌幅',
  },
  {
    value: ChangeTypeKeys.CUSTOM,
    label: '区间',
    title: '区间涨跌幅',
  },
];

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

export const getColorText = (value: any) => {
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
  citicsOneIncomeRate: {
    //行业指数涨跌幅（%）
    show: false,
  },
  hs300IncomeRate: {
    //沪深300涨跌幅（%）
    show: false,
  },
  zz500IncomeRate: {
    //中证500涨跌幅（%）
    show: false,
  },
  cybIncomeRate: {
    //创业板指数涨跌幅（%）
    show: false,
  },
  hsIncomeRate: {
    //恒生指数涨跌幅（%）
    show: false,
  },
  hskjIncomeRate: {
    //恒生科技指数涨跌幅（%）
    show: false,
  },
};
