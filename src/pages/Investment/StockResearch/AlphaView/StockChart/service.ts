// 图数据
import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 证券查询
export async function DataRunFacadeQuerySecurityDayHistoryRange(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.DataRunFacadeQuerySecurityDayHistoryRange,
    params,
  );
  return data || [];
}

// datarun
export async function DataRunFacadeQuerySecurityDayDerivativeRange(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.DataRunFacadeQuerySecurityDayDerivativeRange,
    params,
  );
  return data || [];
}

// datarun
export async function DataRunFacadeGetSecurityDayDerivativeRangeNew(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.DataRunFacadeGetSecurityDayDerivativeRangeNew,
    params,
  );
  return data || undefined;
}

// 交易标签
export async function IrReportFacadeQueryRecommendRecord(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.IrReportFacadeQueryRecommendRecord, params);
  return data || [];
}
