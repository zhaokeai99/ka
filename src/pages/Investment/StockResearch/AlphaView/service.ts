import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 验证
export async function IrReportFacadeAuthUserManage(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.IrReportFacadeAuthUserManage, params);
  return data || false;
}
