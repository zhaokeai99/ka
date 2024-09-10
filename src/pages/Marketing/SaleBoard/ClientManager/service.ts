import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { transOptions } from '@/utils/utils';

export interface TableListItem {
  userDomain: string;
  userTrueName: string;
  userEmail: string;
  deptId: string;
  deptName: string;
  salesKind: string;
  salesKindName: string;
}

// 客户经理信息列表展示
export async function queryClientManagerInfo(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryClientManagerInfo, params);
  return data || {};
}
// 客户经理销售类型设置
export async function setClientManagerSalesType(params = {}) {
  return await dispatchPass(API.marketingApi.setClientManagerSalesType, params);
}
// 字典信息查询
export async function getDictInfoByType(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.getDictInfoByType, params);
  return transOptions(data, 'dictValue', 'dictKey', false);
}
