export enum COLORENUM {
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
  warning6 = '#F27C49',
}

// 产业链图
export const chainImg =
  'https://cdnprod.tianhongjijin.com.cn/thfile/735E2305-7878-40BB-B319-1C55023EE1861654678834967.png';

export const tagTypeMap = {
  利好: {
    color: COLORENUM['red6'],
    backgroundCol: COLORENUM['red1'],
  },
  中性: {
    color: 'rgba(0,0,0,0.45)',
    backgroundCol: '#f5f5f5',
  },
  利空: {
    color: COLORENUM['green6'],
    backgroundCol: COLORENUM['green1'],
  },
  买入: {
    color: COLORENUM['red6'],
    backgroundCol: COLORENUM['red1'],
  },
  增持: {
    color: COLORENUM['red5'],
    backgroundCol: COLORENUM['red1'],
  },
  减持: {
    color: COLORENUM['green4'],
    backgroundCol: COLORENUM['green1'],
  },
  卖出: {
    color: COLORENUM['green5'],
    backgroundCol: COLORENUM['green1'],
  },
};
