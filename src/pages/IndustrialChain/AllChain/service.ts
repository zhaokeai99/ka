import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 查询产业链列表
export async function queryIndustryChainList(params?: any) {
  const { data } = await dispatchPass(
    API.industrialChain.IndustryChainFacadeQueryIndustryChainList,
    params,
  );

  return data || [];
}

// 产业链列表
export interface ChainCardItemType {
  industryChainName: string;
  industryChainCode: string;
  follow: string;
  change: string;
  industryProsperity: string;
}
