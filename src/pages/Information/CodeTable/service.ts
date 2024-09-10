import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface TypeItem {
  typeCode: string;
  typeName: string;
}

export interface TableListItem {
  id: number;
  typeCode: string;
  typeName: string;
  subTypeCode: string;
  subTypeName: string;
  orderNum: string;
  dataValue: string;
  remark: string;
  insertTimeFormat: string;
}

// 码表管理类型接口
export async function getType() {
  const { data } = await dispatchPass(API.informationApi.TypeCodeInfoFacadeGetType);
  if (Array.isArray(data)) {
    return data.map(({ typeCode, typeName }) => ({
      label: typeName,
      value: typeCode,
    }));
  }
  return [];
}
// 码表管理查询
export async function getPageDataByQuery(params = {}) {
  const { data } = await dispatchPass(
    API.informationApi.TypeCodeInfoFacadeGetPageDataByQuery,
    params,
  );
  return data || {};
}
// 码表管理新增
export async function addTypeCode(params = {}) {
  return await dispatchPass(API.informationApi.TypeCodeInfoFacadeAddTypeCode, params);
}
// 码表管理类型修改
export async function updateTypeCode(params = {}) {
  return await dispatchPass(API.informationApi.TypeCodeInfoFacadeUpdateTypeCode, params);
}
