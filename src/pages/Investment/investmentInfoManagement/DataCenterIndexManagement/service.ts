import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 证券树查询
export async function IndexDataInfoFacadeQueryIndexTypeInfo(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.IndexDataInfoFacadeQueryIndexTypeInfo,
    params,
  );
  return data || [];
}

//指标查询
export async function IndexDataInfoFacadeQueryMasterInfo(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.IndexDataInfoFacadeQueryMasterInfo, params);
  return data || [];
}
export async function IndexDataInfoFacadeAddMasterInfo(params = {}) {
  const data = await dispatchPass(API.investmentApi.IndexDataInfoFacadeAddMasterInfo, params);
  return data || {};
}

//指标数据查询
export async function IndexDataInfoFacadeQueryMasterData(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.IndexDataInfoFacadeQueryMasterData, params);
  return data || [];
}

//模板查询
export async function IndustryTemplateInfoFacadeQueryTemplateInfo(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.IndustryTemplateInfoFacadeQueryTemplateInfo,
    params,
  );
  return data || [];
}

//获取模板
export async function IndustryTemplateInfoFacadeGetTemplateInfo(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.IndustryTemplateInfoFacadeGetTemplateInfo,
    params,
  );
  return data || [];
}

//保存模板
export async function IndustryTemplateInfoFacadeAddTemplateInfo(params = {}) {
  const data = await dispatchPass(
    API.investmentApi.IndustryTemplateInfoFacadeAddTemplateInfo,
    params,
  );
  return data || {};
}

//保存模板
export async function IndustryTemplateInfoFacadeEditTemplateInfo(params = {}) {
  const data = await dispatchPass(
    API.investmentApi.IndustryTemplateInfoFacadeEditTemplateInfo,
    params,
  );
  return data || {};
}

//删除
export async function IndustryTemplateInfoFacadeDeleteTemplateInfo(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.IndustryTemplateInfoFacadeDeleteTemplateInfo,
    params,
  );
  return data || {};
}
