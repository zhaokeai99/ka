import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryLastQuaryDay() {
  const { data } = await dispatchPass(API.productionApi.queryLastQuaryDay);
  return data;
}

export async function queryCompanyScaleData(params = {}) {
  const { data } = await dispatchPass(API.productionApi.queryCompanyScaleData, params);
  const result = {
    ...data,
    list:
      (data && data.list.map((e) => ({ ...e, value: parseFloat(e.value.replace('%', '')) }))) || [],
    countList:
      (data &&
        data.countList.map((e) => ({ ...e, value: parseFloat(e.value.replace('%', '')) }))) ||
      [],
  };

  return result;
}

export async function queryCompanyTrendData(params?: any) {
  const { data } = await dispatchPass(API.productionApi.queryCompanyTrendData, params);
  return data || [];
}
