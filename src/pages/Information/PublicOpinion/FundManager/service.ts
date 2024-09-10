import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

interface FundParams {
  tDate: string;
  bondSearchContext: string;
}
interface CombinationParams {
  tDate: string;
  bondCode: string;
}

interface EventParams {
  tDate: string;
  bondCode: string;
  eventDateRangeType: string;
}

// 持仓舆情债券查询
export async function queryFundManagerHoldBondInfo(params: FundParams) {
  const { success, data } = await dispatchPass(
    API.informationApi.queryFundManagerPanelInfoFacadeHoldBondInfo,
    params,
  );
  return success && data ? data : [];
}
// 组合持仓查询
export async function queryFundManagerCombinationInfo(params: CombinationParams) {
  const { success, data } = await dispatchPass(
    API.informationApi.queryFundManagerPanelInfoFacadeCombinationInfo,
    params,
  );
  return success && data ? data : {};
}
// 持仓债券舆情事件查询
export async function queryFundManagerHoldBondSenEvent(params: EventParams) {
  const { success, data } = await dispatchPass(
    API.informationApi.queryFundManagerPanelInfoFacadeHoldBondSenEvent,
    params,
  );
  return success && data ? data : {};
}
// 获取前一个工作日日期
export async function queryLastWorkDay() {
  const { success, data } = await dispatchPass(
    API.informationApi.queryTransactionCalendarFacadeLastWorkDay,
  );
  return success && data ? data : '';
}
// 事件时间范围
export async function queryEventDateRange() {
  const { success, data } = await dispatchPass(
    API.informationApi.queryTypeCodeInfoFacadeEventDateRange,
  );
  return success && data ? data : '';
}

export async function fetchAllTimeOptions() {
  return await Promise.all([queryLastWorkDay(), queryEventDateRange()]);
}
