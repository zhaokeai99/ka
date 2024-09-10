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

  if (value < 1000) {
    newValue[0] = value.toFixed(decimal) + '';
    newValue[1] = '';
  }

  return newValue.join('');
};
