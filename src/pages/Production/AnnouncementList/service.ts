import type { IndexAnnouncementParams } from './data';
import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryIndexAnnouncementPageList(params?: IndexAnnouncementParams) {
  const { data } = await dispatchPass(API.productionApi.fundprodinfo, {
    ...params,
    pageNo: params?.current,
  });
  return { ...data, data: data.dataList || [] };
}
