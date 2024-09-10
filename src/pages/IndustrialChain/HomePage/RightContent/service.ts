import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 产业链列表
export interface ChainCardItemType {
  industryChainName: string;
  industryChainCode: string;
  follow: string;
  change: string;
  industryProsperity: string;
}

export interface BondInfoType {
  bondCode: string;
  bondName: string;
}
export interface IssuerInfoType {
  issuerCode: string;
  issuerName: string;
}
export interface optionType {
  subTypeCode: string;
  subTypeName: string;
}
export interface ListItemDataType {
  id: number;
  tDate: string;
  tTime: string;
  sentType: string;
  eventType: string;
  eventSubType: string;
  eventTitle: string;
  holdStatus: number;
  bondList: BondInfoType[];
  issuerList: IssuerInfoType[];
}

export type detailType = {
  id: number;
  eventType: number;
};

// 格式化联动图表数据
export const formatData = (arrayList: any[]) => {
  const emotionValueMapping = {};
  const industryMapping = {};

  // 1. 收集最全的 emotion
  arrayList.forEach(({ industryName, emotionValue, emotion }: any) => {
    emotionValueMapping[emotion] = emotionValue;

    // 2. 根据 industryName 对数据分组
    let industryArrs = industryMapping[industryName];

    if (!industryArrs) {
      industryArrs = industryMapping[industryName] = [];
    }

    industryArrs.push({
      industryName,
      emotionValue,
      emotion,
    });
  });

  const newData: any[] = [];

  // 按照顺序把数据重新输出
  Object.keys(industryMapping)
    .sort((a, b) => {
      return industryMapping[b].length - industryMapping[a].length;
    })
    .forEach((key) => {
      newData.push(...industryMapping[key]);
    });

  return newData;
};

// 查询产业链列表
export async function queryIndustryChainList() {
  const { data } = await dispatchPass(
    API.industrialChain.IndustryChainFacadeQueryIndustryChainList,
  );

  return data || [];
}

// 行业表现
export async function queryIndustryForecast(params: any) {
  const { data } = await dispatchPass(
    API.industrialChain.IndustryResearchFacadeQueryIndustryForecast,
    params,
  );

  return data || [];
}

// 行业业绩预测
export async function queryIndustryPerformance(params: any) {
  const { data } = await dispatchPass(
    API.industrialChain.IndustryResearchFacadeQueryIndustryPerformance,
    params,
  );

  return data || [];
}

// 媒体情绪
export async function queryMediaSentiment(params: any) {
  const { data, success } =
    (await dispatchPass(API.industrialChain.IndustryResearchFacadeQueryMediaSentiment, params)) ||
    {};

  return { data, success };
}

// 卖方评级-研报信息提取
export async function querySellerEvaluation(params: any) {
  const { data } = await dispatchPass(
    API.industrialChain.IndustryResearchFacadeQuerySellerEvaluation,
    params,
  );

  return data || [];
}

// 行业景气度
export async function queryIndustryProsperity() {
  const { data } = await dispatchPass(
    API.industrialChain.IndustryResearchFacadeQueryIndustryProsperity,
  );

  return data || [];
}
