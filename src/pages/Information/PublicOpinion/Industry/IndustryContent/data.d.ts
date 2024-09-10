import moment from 'moment';
export interface IIndustySearchParams {
  industryId?: string; //行业id
  industryName?: string; //行业名称
  startDate?: string; // 开始时间
  endDate?: string; //结束时间
  publicSentiment?: string; //正负面
}

export interface ITrendChartsPropsType {
  data: Record<string, any>[];
}

export enum QueryTypeTabKeys {
  EMOTION = 'emotion', //情绪
  POPULARITY = 'popularity', //热度
}

export enum PublicSentimentKeys {
  BEARISH = 'BEARISH', //利空
  GOOD = 'GOOD', //利好
  NEUTRAL = 'NEUTRAL', //中性
}

export const filterParams = (params: IIndustySearchParams) => {
  const newParams: IIndustySearchParams = {};

  Object.entries(params)?.forEach(([key, value]) => {
    if (params?.[key]) {
      newParams[key] = value;
    }
  });

  return newParams;
};

export enum COLORINDUSTRYENUM {
  // （由浅到深）：
  red1 = '#FFEBEB',
  red2 = '#FFDBDC',
  red3 = '#FFB7B7',
  red4 = '#FF8F8F',
  red5 = '#FF8181',
  red6 = '#EC6464',
  red7 = '#D34A4A',
  green1 = '#E6FAEB',
  green2 = '#C9EDD2',
  green3 = '#ABE3B8',
  green4 = '#86D097',
  green5 = '#67C47D',
  green6 = '#40B333',
  gray = '#CDCDCD',
  gray1 = 'rgba(0, 0, 0, 0.45)',
  warning6 = '#F27C49',
  blue = '#5b8ff9',
}

export const tagTypeMap = {
  利好: {
    color: COLORINDUSTRYENUM['red6'],
    backgroundCol: COLORINDUSTRYENUM['red1'],
  },
  中性: {
    color: COLORINDUSTRYENUM['gray1'],
    backgroundCol: '#f5f5f5',
  },
  利空: {
    color: COLORINDUSTRYENUM['green6'],
    backgroundCol: COLORINDUSTRYENUM['green1'],
  },
};

export const initStartDate = moment().subtract(30, 'days');

export const initEndDate = moment().subtract(0, 'days');
