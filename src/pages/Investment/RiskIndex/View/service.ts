import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 修改表状态 checked
export async function modifyEnable(parmas: any) {
  const res = await dispatchPass(API.investmentApi.modifyEnable, {
    ...parmas,
  });
  return res;
}

// 数据源列表
export async function queryIntegrationSource(params: any) {
  const { success, data } = await dispatchPass(API.investmentApi.queryIntegrationSource, {
    ...params,
    // pageNumber: params.current,
  });
  if (success && Array.isArray(data)) {
    return data.map(({ id, sourceName, sourceType }) => ({
      label: `${id} - ${sourceName}`,
      value: [id, sourceName, sourceType],
    }));
  }
  return [];
}

// 新增数据表checked
export async function saveTableInfo(parmas: any) {
  const res = await dispatchPass(API.investmentApi.saveTableInfo, {
    ...parmas,
  });
  return res;
}

// 查看数据源下所有表信息 checked
export async function querySourceTable(parmas: any) {
  const { success, data } = await dispatchPass(API.investmentApi.querySourceTable, {
    ...parmas,
  });
  if (success && Array.isArray(data)) {
    return data.map(({ schemaName, tableName, comment }: any) => {
      return {
        label: `${schemaName}-${tableName}${comment ? '-' + comment : ''}`,
        value: [schemaName, tableName, comment ? comment : ''],
      };
    });
  }
  return [];
}

// 查询数据视图列表 check
export async function queryTable(parmas: any) {
  const res = await dispatchPass(API.investmentApi.queryTable, {
    ...parmas,
  });
  if (res.data) {
    return res;
  }
  return [];
}

// 查询单个报表 check
export async function queryTableById(parmas: any) {
  const res = await dispatchPass(API.investmentApi.queryTableById, {
    ...parmas,
  });
  return res;
}

// 查看表字段 checked
export async function searchColumn(parmas: any) {
  const res = await dispatchPass(API.investmentApi.searchColumn, {
    ...parmas,
  });
  return res;
}

// 修改数据表 checked
export async function updateTableInfo(parmas: any) {
  const res = await dispatchPass(API.investmentApi.updateTableInfo, {
    ...parmas,
  });
  return res;
}
