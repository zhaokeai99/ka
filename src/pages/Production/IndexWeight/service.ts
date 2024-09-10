import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

const queryNewData = (res: any, activeTab: string) => {
  if (res) {
    const newData = res?.industryClassList.map(
      (item: { industryCode: any; stockDetailList: any[] }) => {
        return {
          id: `${item.industryCode}${item.stockDetailList[0]?.stockCode}${
            activeTab === 'HISTORY' ? 'HISTORY' : ''
          }`,
          ...item,
        };
      },
    );
    res.industryClassList = newData;
    return res;
  }
  return res;
};

// 日频数据
export async function queryDaily(params: any, activeTab: string) {
  const { data } = await dispatchPass(API.productionApi.daily, params);
  if (!data) {
    return {};
  }
  return queryNewData(data, activeTab);
}

// 历史数据
export async function queryHistory(params: any, activeTab: string) {
  const { data } = await dispatchPass(API.productionApi.history, params);
  if (!data) {
    return {};
  }
  return queryNewData(data, activeTab);
}
