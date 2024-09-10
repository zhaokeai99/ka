import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface TopContentProps {
  data: any;
}

export interface CumulativeProps {
  data: any;
}

export interface SameMonthProps {
  data: any;
  title: string;
}

export interface SearchFormProps {
  getChartData: (value: any) => void;
}

// 获取所属类目
export async function getSentType(params = {}) {
  const { data } = await dispatchPass(API.informationApi.TypeCodeInfoFacadeGetSentType, params);
  return data || [];
}
