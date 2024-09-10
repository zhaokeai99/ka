import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 查询查询人行备案列表
export async function queryDocumentPrepareList(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryBankRecordList, params);
  return data || [];
}

// 模糊查询项目经理/产品经理
export async function queryManagerByKeyword(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryManagerByKeyword, params);
  return data || [];
}

// 完成人行备案
export async function completeBankRecord(params: any) {
  const { data } = await dispatchPass(API.productionApi.completeBankRecord, params);
  return data;
}
