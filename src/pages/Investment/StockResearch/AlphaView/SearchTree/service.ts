import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 证券树查询
export async function IrReportFacadeQueryIrStockTreeByUserName(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.IrReportFacadeQueryIrStockTreeByUserName,
    params,
  );
  return data || [];
}

export async function IrReportFacadeQueryIrStockTree(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.IrReportFacadeQueryIrStockTree, params);
  return data || [];
}
