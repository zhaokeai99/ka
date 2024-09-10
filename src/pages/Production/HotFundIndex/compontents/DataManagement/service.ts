import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 列项管理查询接口
export async function queryColList(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryColList, params);
  return (data || []).map(({ colCategory, colCategoryDesc, fetchCols }: any) => ({
    title: colCategoryDesc,
    key: colCategory,
    children: (fetchCols || []).map(({ colId, colDesc }: any) => ({
      title: colDesc,
      key: colId,
    })),
  }));
}

// 列项筛选项顺序更新
export async function updateSortCols(params: any) {
  const data = await dispatchPass(API.productionApi.updateSortCols, {
    ...params,
    list: (params.list || []).map(({ key, children }: any) => ({
      colCategory: key,
      cols: (children || []).map(({ key: colId }: any) => ({
        colId,
      })),
    })),
  });
  return data;
}

// 查询编辑项
export async function queryFetCols(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryFetCols, {
    ...params,
  });

  return data;
}

// 更新列项设置
export async function updateFetCols(params: any) {
  const { data } = await dispatchPass(API.productionApi.updateFetCols, {
    ...params,
  });

  return data;
}
