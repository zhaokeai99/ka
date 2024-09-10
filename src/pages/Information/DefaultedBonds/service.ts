import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

interface ListParams {
  bondName: string;
  isStatus: number;
  current: string;
  pageSize: string;
}
interface UpdateParams {
  bondCode: string;
  isStatus: number;
}
export interface AddParams {
  bondCode: string;
  bondName: string;
  issuerName: string;
  isStatus: number;
  insertUser: string;
}
export interface RemoveParams {
  bondCode: string;
}

// 列表查询
export async function queryDefReport(params: ListParams) {
  const { success, data } = await dispatchPass(
    API.informationApi.queryDefReportformManagementFacadeDefReportform,
    {
      ...params,
      pageNum: params.current,
    },
  );
  return success && data ? data : {};
}
// 状态更新
export async function updataStatus(params: UpdateParams) {
  return await dispatchPass(
    API.informationApi.updateDefReportformManagementFacadeDefReportformStatus,
    {
      ...params,
    },
  );
}
// 新增
export async function addDefReportform(params: AddParams) {
  return await dispatchPass(API.informationApi.addDefReportformManagementFacadeDefReportform, {
    ...params,
  });
}
// 删除
export async function removeDefReportform(params: RemoveParams) {
  return await dispatchPass(API.informationApi.removeDefReportformManagementFacadeDefReportform, {
    ...params,
  });
}
