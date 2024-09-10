import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
// import _maxBy from 'lodash/maxBy';

// 查询页面搜索参数配置
export async function queryPageSearchConfig(params: any) {
  const { data } = await dispatchPass(API.marketingApi.queryPageSearchConfig, params);
  return data || {};
}

// 查询页面搜索参数配置
export async function queryChartData(params?: any) {
  const { data } = await dispatchPass(API.marketingApi.queryChartData, params);
  if (!data) {
    return [];
  }
  const cloudChartData = data.cloudChartUnitDataList.map((item: any) => {
    // 排序
    const suspensionListChildren = item.businessData.sort((a: any, b: any) => {
      if (b[b.area].value === a[b.area].value) {
        if (b[b.color].value === a[b.color].value) {
          return b[b.numValue].value - a[b.numValue].value;
        }
        return b[b.color].value - a[b.color].value;
      }
      return b[b.area].value - a[a.area].value;
    });

    const sortChildren = [...suspensionListChildren];

    // 颜色相等
    const maxColor = sortChildren.sort((a, b) => {
      return b[b.color].value - a[a.color].value;
    })[0];

    const businessData = suspensionListChildren.map((cur: any, i: number) => {
      let value = [];
      if (cur[cur.area].value === cur[cur.color].value) {
        value = [
          cur[cur.area].value,
          maxColor[maxColor.color].value ? maxColor[maxColor.color].value : 1,
        ];
      } else {
        value = [cur[cur.area].value, cur[cur.color].value];
      }
      return {
        ...cur,
        ranking: i + 1,
        parentCode: item.code,
        value: value,
      };
    });
    return {
      fieldLabelConfig: item.fieldLabelConfig,
      name: item.title,
      code: item.code,
      children: businessData,
    };
  });
  return cloudChartData || [];
}
