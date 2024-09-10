import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 数据源列表
export async function queryIntegrationSource(params: any) {
  const { success, data } = await dispatchPass(API.investmentApi.queryIntegrationSource, {
    ...params,
    pageNumber: params.current,
  });
  return { success, data: data || [], total: data.length };
}

// 单个数据源信息
export async function querySingleIntegrationSource(parmas: any) {
  const res = await dispatchPass(API.investmentApi.querySingleIntegrationSource, {
    ...parmas,
  });
  return res;
}

// 修改数据源
export async function modifyIntegrationSource(parmas: any) {
  const res = await dispatchPass(API.investmentApi.modifyIntegrationSource, {
    ...parmas,
  });
  return res;
}

// 保存数据源
export async function saveIntegrationSource(parmas: any) {
  const res = await dispatchPass(API.investmentApi.saveIntegrationSource, {
    ...parmas,
  });
  return res;
}

// 测试数据源链接
export async function testSourceConn(parmas: any) {
  const res = await dispatchPass(API.investmentApi.testSourceConn, {
    ...parmas,
  });
  return res;
}
