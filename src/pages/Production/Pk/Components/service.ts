import { flatten as _flatten } from 'lodash';

// 格式化pk过来的参数格式
export function formatCustomItemColumn(data: any) {
  const result = (data || [])
    .filter((d: any) => {
      if (d.selfType === 1 || d.selfType === 2) {
        return !!d?.extInfo?.valueList;
      }

      return d.colName !== 'code' && d.colName !== 'name';
    })
    .map((d: any) => {
      if (d.selfType === 1 || d.selfType === 2) {
        return d.extInfo.valueList.map(({ colName, endYear, startYear, yearString }: any) => ({
          label: `${d.colDesc}${yearString}`,
          key: `${colName}_${startYear}_${endYear}`,
        }));
      }

      return {
        label: d.colDesc,
        key: d.colName,
      };
    });
  return _flatten(result) as [];
}

// 格式化自定义返回数据
export function formatCustomItemData(data: any) {
  return (data || []).map((d: any) => ({
    fundCode: d.code,
    ...d,
  }));
}
