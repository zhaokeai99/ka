import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function IrReportFacadeQueryIrUserInfo(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.IrReportFacadeQueryIrUserInfo, params);
  return data || [];
}
