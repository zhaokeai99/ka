import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface IIndustryNewsLimit {
  data: {
    pageNum: number;
    pageSize: number;
    pages: number;
    total: number;
    data: IIndustryNewsLimitData[];
  };
  success: boolean;
}

export interface IIndustryNewsLimitData {
  clusterEventDate?: string;
  fromSource?: string;
  author?: string;
  publicSentiment?: string;
  industryName?: string;
  labelList?: string[];
  documentId?: string;
  eventTitle?: string;
  newsContent?: string;
}

// 查询行业树
export async function queryIndustryTree(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.IndustryNewsFacadeQueryIndustryTree,
    params,
  );
  return {
    data,
    success,
  };
}

// 查询行业舆情趋势图表
export async function queryTrendChart(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.IndustryNewsFacadeQueryTrendChart,
    params,
  );
  return {
    data,
    success,
  };
}

// 分页查询行业舆情列表
export async function queryIndustryNewsLimit(params = {}): Promise<IIndustryNewsLimit> {
  const { data, success } = await dispatchPass(
    API.informationApi.IndustryNewsFacadeQueryIndustryNewsLimit,
    params,
  );
  return {
    data,
    success,
  };
}
