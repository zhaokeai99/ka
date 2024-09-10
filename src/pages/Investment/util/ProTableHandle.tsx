// protable中ValueEnum属性使用
const toValueEnum = (arr: any, oText: string, oValue: string, type: String = '0') => {
  const result = {};
  if (type === '1') {
    result['-1'] = { text: '全部' };
  }
  for (let i = 0; i < arr.length; i += 1) {
    const obj = {
      text: undefined,
    };
    obj.text = arr[i][oText];
    result[arr[i][oValue]] = obj;
  }
  return result;
};
// columns中FieldProps 属性使用
const toFieldProps = (arr: any, oText: string, oValue: string, type: string = '0') => {
  const result = [];
  if (type === '1') {
    const obj = { label: '', value: '' };
    obj.label = '全部';
    obj.value = '-1';
    result.push(obj);
  }
  for (let i = 0; i < arr.length; i += 1) {
    const obj = { label: '', value: '' };
    obj.label = arr[i][oText];
    obj.value = arr[i][oValue];
    result.push(obj);
  }
  return result;
};

export default {
  toValueEnum,
  toFieldProps,
};
