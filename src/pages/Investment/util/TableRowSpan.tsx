/**
 * @param {*} data   [后台数据]
 * @param {*} key    [要合并的字段]
 * @param {*} target [后台数据对应的index]
 * @returns 合并的行数
 * method of 获取合并的行数
 */
export const getRowSpanCount = (data: any, key: string, target: number) => {
  if (!Array.isArray(data)) return 1;
  const filterData = data.map((_) => _[key]); // 只取出筛选项
  let preValue = filterData[0];
  const res = [[preValue]]; // 放进二维数组里
  let index = 0; // 二维数组下标
  for (let i = 1; i < filterData.length; i++) {
    if (filterData[i] === preValue) {
      // 相同放进二维数组
      res[index].push(filterData[i]);
    } else {
      // 不相同二维数组下标后移
      index += 1;
      res[index] = [];
      res[index].push(filterData[i]);
      preValue = filterData[i];
    }
  }
  const arr: any = [];
  res.forEach((_) => {
    const len = _.length;
    for (let i = 0; i < len; i++) {
      arr.push(i === 0 ? len : 0);
    }
  });
  return arr[target];
};

export default {
  getRowSpanCount,
};
