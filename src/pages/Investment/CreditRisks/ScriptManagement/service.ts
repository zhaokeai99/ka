import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 查找列表
export async function queryScriptList(params: any) {
  const { success, data } = await dispatchPass(API.investmentApi.QueryScriptList, {
    ...params,
  });

  return { data: data || [], success };
}

export async function saveScript(params: any) {
  const { success } = await dispatchPass(API.investmentApi.SaveScript, {
    ...params,
  });

  return success;
}

export async function deleteScriptById(params: any) {
  const { success } = await dispatchPass(API.investmentApi.DeleteScriptById, {
    ...params,
  });

  return success;
}

export async function queryScriptDetail(params: any) {
  const { data } = await dispatchPass(API.investmentApi.QueryScriptDetail, {
    ...params,
  });

  return data || {};
}

export async function queryScriptTypeEnum() {
  const { data } = await dispatchPass(API.investmentApi.QueryScriptTypeEnum);

  return (data || []).map(({ key, value }: any) => ({
    label: key,
    value: key,
    type: value,
  }));
}
