import { dispatchPass } from '@/services/service';
import { API } from '@/services/api';

export const STK_TYPE_DIC = { A: '股票', ORD: '港股' };
export const MTK_CODE_DIC = { SZSE: '深交所', SSE: '上交所', HKEX: '港交所' };

// 持仓
export async function MpRsHoldItemFacadeQueryByPage(params = {}) {
  return await dispatchPass(API.investmentApi.MpRsHoldItemFacadeQueryByPage, params);
}

// 组合调整日志(分页)查询
export async function MpAdjustLogQueryByPage(params = {}) {
  return await dispatchPass(API.investmentApi.MpAdjustLogQueryByPage, params);
}

// 成交明细查询
export async function MpRsDealQueryByPage(params = {}) {
  return await dispatchPass(API.investmentApi.MpRsDealQueryByPage, params);
}
