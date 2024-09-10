import { colord } from 'colord';
import qs from 'qs';
import { history, request } from 'umi';
import type { RequestOptionsInit } from 'umi-request';
import {
  RedColor,
  GreenColor,
  RedFontColor,
  GreenFontColor,
} from '@/pages/Production/IndexFundMainPage/config';

const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

// 数值格式化为千分位
export const dealNumThousands = (val: string | number) =>
  `${val}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`);

export const FundDefaultValue = '';
export const FundDefaultNullValue = '-';
export const FundDefaultFixed = 2;
export const GUTTER_SIZE = 8;
export const isUrl = (path: string): boolean => reg.test(path);

// 对比颜色
export const COLORS = ['magenta', 'volcano', 'orange', 'green', 'blue'];

// 数值千分位 + 保留level位小数
export const dealNumThousandsAndFloat = (val: string | number, level: number) => {
  const temp = Number(val).toFixed(level);
  const [intPart, floatPart] = `${temp}`.split('.');
  return `${dealNumThousands(intPart)}.${floatPart}`;
};

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const requestPage = async <T = any>(
  url: string,
  options?: RequestOptionsInit,
  cb?: (pageRes: PageListRes) => void,
): Promise<PageListRes<T>> => {
  const body = await request(url, options);
  const { success, message, data, pageNum = 1, pageSize = 10, total = 0 } = body;
  if (!success) {
    return {
      success,
      message,
      data: data || [],
      total,
      current: pageNum,
      pageSize,
    };
  }

  const obj = {
    success,
    data: data || [],
    current: pageNum,
    pageSize,
    total,
  };
  if (cb) {
    try {
      cb(obj);
    } catch (e) {
      console.error('request callback error' + e.message);
    }
  }
  return obj;
};

export const qfw = (value: any, beforeStr = '￥') => {
  const str = beforeStr ? `${beforeStr} ` : '';
  if (`${value}`.indexOf('.') >= 0) {
    return `${str}${value}`.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }

  return `${str}${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const secondFormat = (value: number, str: string): string => {
  if (value >= 0) {
    if (value < 60) {
      return str + value + '秒';
    } else if (value < 3600) {
      return secondFormat(value % 60, parseInt(value / 60 + '') + '分');
    } else if (value < 86400) {
      return secondFormat(value % 3600, parseInt(value / 3600 + '') + '小时');
    } else {
      return secondFormat(value % 86400, parseInt(value / 86400 + '') + '天');
    }
  }
  return '';
};

export const formatDecimal = (num: any, decimal: any) => {
  let numStr = num.toString();
  const index = numStr.indexOf('.');
  if (index !== -1) {
    numStr = numStr.substring(0, decimal + index + 1);
  } else {
    numStr = numStr.substring(0);
  }
  return parseFloat(numStr).toFixed(decimal);
};

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
    newValue[0] = parseInt(value / 1000) + '';
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
  if (value < 1000) {
    newValue[0] = value + '';
    newValue[1] = '';
  }
  return newValue.join('');
};

export const rgbStep = {
  sb: null,
  sg: null,
  sr: null,
  stepB: null,
  stepG: null,
  stepR: null,
  initRgbStep: (colorStr) => {
    const colors = colorStr.split('-');
    const { b: b1, g: g1, r: r1 } = colord(colors[0]).toRgb();
    const { b: b2, g: g2, r: r2 } = colord(colors[1]).toRgb();

    rgbStep.sb = b1;
    rgbStep.sg = g1;
    rgbStep.sr = r1;

    rgbStep.stepB = (b2 - b1) / 100;
    rgbStep.stepR = (r2 - r1) / 100;
    rgbStep.stepG = (g2 - g1) / 100;
  },
  getStepColor: (num) => {
    return colord(
      `rgb(${rgbStep.sr + rgbStep.stepR * num},${rgbStep.sg + rgbStep.stepG * num},${
        rgbStep.sb + rgbStep.stepB * num
      })`,
    ).toHex();
  },
};

// 处理Table 返回空值问题
export const tableEmptyCellRender = (columns: [{ render?: () => {} }]) => {
  return columns.map((i: {}) => ({
    render: (text: any) => (!text && text !== 0 ? '-' : text),
    ...i,
  }));
};

/**
 * 处理options
 * @param
 *     -- list 代转化数组
 *     -- labelName 标签key
 *     -- valueName value Key
 *     --  showOtherKey {Boole} 是否返回数组内其他字段, 默认返回
 * @returns {List}
 *     -- label 字段名
 *     -- value 字段值
 *     -- pid? 父ID
 *     -- children 孩子节点
 */
export const transOptions: any = (
  list: any = [],
  labelName: string = 'subItemName',
  valueName: string = 'subItem',
  showOtherKey = true,
) => {
  if (!Array.isArray(list)) {
    return [];
  }
  return list.map((item: any) => {
    return {
      ...(showOtherKey ? item : {}),
      label: item[labelName] || '--',
      value: item[valueName],
      ...(item.children ? { key: item[valueName] } : {}),
      ...(item.children
        ? {
            children: Array.isArray(item.children)
              ? transOptions(item.children, labelName, valueName)
              : [],
          }
        : {}),
    };
  });
};

/**
 * 替换url
 * @param
 *     -- queryObj query 对象
 *     -- pathname
 */
export const urlQueryReplace: any = (
  queryObj: object = {},
  pathname: string = history.location.pathname,
) => {
  history.replace({
    pathname: pathname,
    search: qs.stringify({
      ...history.location.query,
      ...queryObj,
    }),
  });
};

export const mainMenuToSearch = (list: any, newArr = []) => {
  list.forEach((item: any) => {
    const { search } = item;

    if (search) {
      newArr.push(item as never);
    }
    return;
  });

  return newArr;
};

export const mainMenuToPath = (list: any, newArr = []) => {
  list.forEach((item: any) => {
    if (!item.isUrl) {
      newArr.push(item as never);
    }
    return;
  });

  return newArr;
};

// 字符串转数组

export const stringToNumber = (val: string | number | undefined, defaultVal = '') => {
  if (val === undefined || val === '') {
    return defaultVal;
  }
  if (typeof val === 'number') {
    return val;
  }
  return Number(val);
};

// pk列数
export const totalCount = [0, 1, 2, 3, 4];

// ta参数表分段金额最大最小值 单位为万
export const FEE_MIN = 0;
export const FEE_MAX = 100000000;

// 计算ETF资金流向金额区间 单元格匹配不同颜色 红涨绿跌
const levelValue = 40;
export const capitalLeave = (recordValue: any) => {
  if (recordValue > 0) {
    let le = Math.ceil(recordValue / levelValue);
    if (le > 6) le = 6;
    return {
      style: {
        backgroundColor: RedColor[`red${le}`],
        color: RedFontColor[`red${le}`],
      },
    };
  } else if (recordValue < 0) {
    let le = Math.ceil(Math.abs(recordValue) / levelValue);
    if (le > 6) le = 6;
    return {
      style: {
        backgroundColor: GreenColor[`green${le}`],
        color: GreenFontColor[`green${le}`],
      },
    };
  } else {
    return {
      style: {
        backgroundColor: '#fff',
      },
    };
  }
};

// 菜单树
export function menuTreeToArray(
  arr: any,
  result = [],
  father = null,
  exceptHidden = false,
  onlyLeaf = false,
) {
  for (let i = 0; i < arr.length; i++) {
    const obj = arr[i];
    const tempChildren = obj.children;
    if (Array.isArray(tempChildren) && tempChildren.length) {
      menuTreeToArray(tempChildren, result, obj.path, exceptHidden, onlyLeaf);
    }

    const tempObj = { ...obj, father };

    if (onlyLeaf && tempChildren) {
      continue;
    }

    delete tempObj.children;

    if ((exceptHidden && !tempObj.hideInMenu) || !exceptHidden) {
      result.push(tempObj as never);
    }
  }

  return result;
}

export function menuTreeGetFirst(arr: any, obj = {}, level = 0, rootPath = null) {
  for (let i = 0; i < arr.length; i++) {
    const tempObj = arr[i];
    const tempChildren = tempObj.children;

    if (Array.isArray(tempChildren) && tempChildren.length) {
      menuTreeGetFirst(tempChildren, obj, level + 1, rootPath || tempObj.path);
    }

    if (level) {
      if (tempObj.isFirst) {
        obj[rootPath as unknown as string] = tempObj.path;
        return;
      }
    }
  }

  return obj;
}

export function menuTreeToRootPath(arr: any, obj = {}, rootPath = null) {
  for (let i = 0; i < arr.length; i++) {
    const tempObj = arr[i];
    const tempChildren = tempObj.children;
    if (Array.isArray(tempChildren) && tempChildren.length) {
      menuTreeToRootPath(tempChildren, obj, rootPath || tempObj.path);
    }

    if (!tempObj.isUrl) {
      obj[tempObj.path] = rootPath || tempObj.path;
    }
  }

  return obj;
}

export function menuWithRouteComponent(arr: any, routes: any) {
  for (let i = 0; i < arr.length; i++) {
    const tempObj = arr[i];
    const tempChildren = tempObj.children;
    if (Array.isArray(tempChildren) && tempChildren.length) {
      menuWithRouteComponent(tempChildren, routes);
    } else {
      const tempRoute = routes.find((route) => route.path === tempObj.path);
      if (tempRoute) {
        tempObj.component = tempRoute.component;
      }
    }
  }

  return arr;
}

export function routeWithAuthDingId(arr: any, routes: any) {
  for (let i = 0; i < arr.length; i++) {
    const tempObj = arr[i];
    const tempChildren = tempObj.children;
    if (Array.isArray(tempChildren) && tempChildren.length) {
      routeWithAuthDingId(tempChildren, routes);
    } else {
      const tempRoute = routes.find((route) => route.path === tempObj.path);
      if (tempRoute) {
        // 建业老哥兜底吧
        tempRoute.authDingId = tempObj?.authDingId || 'ytfjcr5';
      }
    }
  }

  return routes;
}
