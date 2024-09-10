import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 查询展位
export async function queryComPlianceLibraryBoothIdData(params = {}) {
  const { data } = await dispatchPass(API.productionApi.queryComPlianceLibraryBoothIdData, params);
  return data;
}
