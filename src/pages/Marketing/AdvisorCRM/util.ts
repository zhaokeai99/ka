const objectHasOnlyKeysValue = (obj: any, keys: string[], allKeys: string[]): boolean => {
  if (keys.length > 0 && allKeys.length > 0) {
    let kc = 0;
    for (let j = 0; j < keys.length; j++) {
      if (obj[keys[j]]) {
        kc++;
      }
    }
    let ac = 0;
    for (let i = 0; i < allKeys.length; i++) {
      if (obj[allKeys[i]]) {
        ac++;
      }
    }
    if (kc === keys.length && kc === ac) {
      return true;
    }
    return false;
  } else {
    return false;
  }
};

/**
 * 直销CRM客户查询条件检查（不允许为空，且只能有一类有效输入项<比如：输入客户代码作为条件后，不能再输入手机号，身份证号等来作为条件>）
 * @param values
 */
export const queryCustomerCondCheck = (values: any) => {
  if (
    objectHasOnlyKeysValue(
      values,
      ['customerName'],
      ['customerName', 'mobileNo', 'thUserId', 'appUserId', 'certType', 'certNo'],
    )
  ) {
    return true;
  }
  if (
    objectHasOnlyKeysValue(
      values,
      ['mobileNo'],
      ['customerName', 'mobileNo', 'thUserId', 'appUserId', 'certType', 'certNo'],
    )
  ) {
    return true;
  }
  if (
    objectHasOnlyKeysValue(
      values,
      ['thUserId'],
      ['customerName', 'mobileNo', 'thUserId', 'appUserId', 'certType', 'certNo'],
    )
  ) {
    return true;
  }
  if (
    objectHasOnlyKeysValue(
      values,
      ['appUserId'],
      ['customerName', 'mobileNo', 'thUserId', 'appUserId', 'certType', 'certNo'],
    )
  ) {
    return true;
  }
  if (
    objectHasOnlyKeysValue(
      values,
      ['certType', 'certNo'],
      ['customerName', 'mobileNo', 'thUserId', 'appUserId', 'certType', 'certNo'],
    )
  ) {
    return true;
  }
  return false;
};

/**
 * 转换生日yyyymmdd为这样的格式 yyyy.mm.dd
 * @param values
 */
export const getDateWithPoint = (values: any) => {
  if (values === '' || values === null || values === undefined) {
    return '';
  }
  if (values.length != 8) {
    return values;
  }
  return values.substring(0, 4) + '.' + values.substring(4, 6) + '.' + values.substring(6, 8);
};

/**
 * 空串或者null值需转化成undefined，应用搜索参数在输入后X掉时传空串，后端当成有效值使用
 * @param values
 */
export const emptyToUndefined = (values: any) => {
  if (values === '' || values === null) {
    return undefined;
  }
  return values;
};
