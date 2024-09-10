import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
export interface IIndustryNewsInfoType {
  author?: string;
  clusterEventDate?: string;
  documentId?: string;
  eventTitle?: string;
  fromSource?: string;
  industryId?: string;
  industryName?: string;
  labelList?: string[];
  item?: string;
  newsContent?: string;
  newsContentHtml?: string;
  newsUrl?: string;
  popularity?: string;
  publicSentiment?: string;
  publicSentimentScore?: string;
}

// 查询行业树
export async function queryIndustryNewsInfo(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.IndustryNewsFacadeQueryIndustryNewsInfo,
    params,
  );
  return {
    data,
    success,
  };
}
