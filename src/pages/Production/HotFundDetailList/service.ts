import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { transOptions } from '@/utils/utils';

export async function queryHotFundList(params: any) {
  const { data: result } = await dispatchPass(API.productionApi.queryHosListPage, params);
  return { ...result, data: result?.dataList || [] };
}

export async function queryProductManagers(params: any) {
  const { success, data } = await dispatchPass(API.productionApi.queryProductManagerList, params);
  const optionsData =
    (success && data?.map((i: any) => ({ label: i.productManager, value: i.productManager }))) ||
    [];
  return optionsData;
}

export async function queryFundManagers(params: any) {
  const { success, data } = await dispatchPass(API.productionApi.queryFundManagerList, params);
  const optionsData =
    (success && data?.map((i: any) => ({ label: i.fundManager, value: i.fundManager }))) || [];
  return optionsData;
}

// 基金索引模糊查询
export async function queryLikeFundInfo(params: any) {
  const { data, success } = await dispatchPass(API.productionApi.queryLikeFundInfo, params);
  const optionsData =
    (success &&
      data?.map((i: any) => ({
        label: `${i.fundCode} - ${i.fundName}`,
        value: `${i.fundName}/${i.fundId}`,
      }))) ||
    [];
  return optionsData;
}

const handleData = (data: any = []) => {
  return data.map((i: any) => ({ label: i.title, value: i.key })) || [];
};

// 热点产品下拉筛选
export async function queryDropOptions() {
  const { data } = await dispatchPass(API.productionApi.queryDropOptions);
  const assetManagers = data?.assetManagers?.map((i: any) => ({ label: i, value: i })) || [];
  const classification = handleData(data?.classification);
  const classifyObj = {};
  classification.map((i: any) => {
    classifyObj[i.value] = i.label;
  });
  // const oneClassification = handleData(data?.oneClassification);
  const productStageList = handleData(data?.productStageList);
  return { assetManagers, classification, classifyObj, productStageList };
}

// 加入关注
export async function focusOn(params: any) {
  const { data } = await dispatchPass(API.productionApi.saveUserFocusFund, params);
  return data;
}

// 下拉筛选联动
export async function pullDownLinkage(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryPullDownProductLinkage, params);
  const oneClassification = handleData(data?.oneClassification);
  return oneClassification || [];
}

export async function queryClassify() {
  const { data } = await dispatchPass(API.productionApi.queryMyTreeStructure);
  return transOptions(data, 'title', 'id', false);
}
