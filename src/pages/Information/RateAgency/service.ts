import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

interface ListParams {
  windCreditratingName: string;
  staticStatus: string;
  current: string;
  pageSize: string;
}
interface UpdateParams {
  windCreditratingagency: string;
  staticStatus: number;
}

// 列表查询
export async function queryRatageMag(params: ListParams) {
  const { success, data } = await dispatchPass(
    API.informationApi.queryInfoRatingAgencyManagementFacadeRatageMag,
    {
      ...params,
      pageNum: params.current,
    },
  );
  return success && data ? data : {};
}

// 更新统计状态
export async function updataStatus(params: UpdateParams) {
  return await dispatchPass(API.informationApi.updateInfoRatingAgencyManagementFacadeStaticStatus, {
    ...params,
  });
}
