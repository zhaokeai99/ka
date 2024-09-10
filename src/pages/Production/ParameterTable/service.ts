import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 筛选框基金模糊搜索
export async function queryByKeyword(keyword: string) {
  const { data } = await dispatchPass(API.productionApi.queryByKeyword, { keyword });
  return (data || []).map((r: any) => ({
    key: r.fundId,
    value: r.fundId,
    label: r.fundName,
  }));
}

// 基金参数表-查询公募基金(母基金)列表
export async function queryPublicProductInfoList(params: any) {
  const { data: result, success } = await dispatchPass(
    API.productionApi.queryPublicProductInfoList,
    params,
  );

  return { ...result, success, data: result?.dataList || [] };
}

// 基金参数表-查询公募基金(子基金)列表
export async function queryChildProductInfoList(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryChildProductInfoList, params);

  return data || [];
}

// 基金参数表-导出参数表生效版本excel和pdf
export async function detailConfigExport(params: { fundId: string; id: string }) {
  const { data } = await dispatchPass(API.productionApi.exportExcelAndPdf, params);
  // return `${API.productionApi.exportExcelAndPdf}?fundCode=${fundCode}`;
  return data;
}

// 基金参数表-查询基金参数表版本列表
export async function queryFundParamVersionList(params: any) {
  const { data: result } = await dispatchPass(API.productionApi.queryFundParamVersionList, params);

  return { ...result, data: result?.dataList || [] };
}

// 基金参数表-预览参数表
export async function previewPdfResult(params: { fundId: string; id: string }) {
  const { data } = await dispatchPass(API.productionApi.previewPdfResult, params);

  return data;
}

// 基金参数表-基金id查询参数表生效/将生效列表
export async function queryEffectVersionsByFundId(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryEffectVersionsByFundId, params);
  return data || [];
}

// 加入关注
export async function focusOn(params: any) {
  const { data } = await dispatchPass(API.productionApi.saveUserFocusFund, params);

  return data;
}

// 基金参数表-按id查询基金参数表详细信息
export async function queryFundParamInfo(params: { fundId: string; id: string }) {
  const { data } = await dispatchPass(API.productionApi.queryFundParamInfo, params);

  return {
    data: data?.submitDataList || [],
    eTime: data?.effectiveTime,
    status: data?.status,
    id: data?.id,
  };
}

// 基金参数表-一键复制
export async function copyFundParamInfo(params: { fundId: string; sourceId: string }) {
  const { data } = await dispatchPass(API.productionApi.copyFundParamInfo, params);

  return { data: data?.submitDataList || [], eTime: data?.effectiveTime };
}

// 失效基金参数表当前版本
export async function invalidFundParam(params: { id: string; effectiveTime: string }) {
  const { success } = await dispatchPass(API.productionApi.invalidFundParam, params);

  return { success };
}

// 复核基金参数表并设置生效时间
export async function reviewFundParamInfo(params: {
  id: string;
  effectiveTime: string;
  confirm?: boolean;
}) {
  const { success, data } = await dispatchPass(API.productionApi.reviewFundParamInfo, params);

  return { success, needConfirm: data.needConfirm, effectiveTime: data.effectiveTime };
}

// 保存基金参数表提交信息 新增保存
export async function saveFundParamInfo(params: {
  fundId: string;
  effectiveTime: string;
  status: string;
  submitDataList: {
    childFundId: number;
    fundParamBasic: Record<string, string>;
    fundParamLimitList: any[];
    fundParamSettlementAcctList: any[];
    fundParamSettlementBusiList: any[];
    fundParamTradeRateList: any[];
  }[];
}) {
  const { success, data } = await dispatchPass(API.productionApi.saveFundParamInfo, params);

  return { success, data };
}

// 基金参数表-修改参数表信息
export async function updateFundParamInfo(params: {
  fundId: string;
  id: string;
  effectiveTime: string;
  status?: string;
  submitDataList: {
    childFundId: number;
    fundParamBasic: Record<string, string>;
    fundParamLimitList: any[];
    fundParamSettlementAcctList: any[];
    fundParamSettlementBusiList: any[];
    fundParamTradeRateList: any[];
  }[];
}) {
  const { success } = await dispatchPass(API.productionApi.updateFundParamInfo, params);

  return { success };
}

// 根据id查fundName
export async function getPanoramaFundInfo(params: any) {
  const { data } = await dispatchPass(API.productionApi.getPanoramaFundInfo, params);
  return data || {};
}

// 根据id查状态
export async function queryStatusByVersionId(params: { id: string }) {
  const { data } = await dispatchPass(API.productionApi.queryStatusByVersionId, params);
  return data || '';
}

// 一键复制查询
export async function searchCopyList({ keyword }: { keyword: string }) {
  const { data } = await queryPublicProductInfoList({
    keyword,
    pageNo: 1,
    pageSize: 20,
  });

  return data;
}

// 基金参数表-批量导出参数表生效版本压缩包
export async function batchExportByFundIds(params: any) {
  const { data } = await dispatchPass(API.productionApi.batchExportByFundIds, params);
  // return `${API.productionApi.exportExcelAndPdf}?fundCode=${fundCode}`;
  return data;
}

// 基金代码批量导出
export async function batchExportByFundCodes(params: { fundCodes: string[] }) {
  const { data } = await dispatchPass(API.productionApi.batchExportByFundCodes, params);
  return data;
}

// 导出参数表检查没有版本的基金
export async function checkInvalidExportFunds(params: {
  fundCodes?: string[];
  fundIds?: string[];
}) {
  const { data } = await dispatchPass(API.productionApi.checkInvalidExportFunds, params);
  return data || [];
}

// 全量导出参数表数据
export async function queryExportFundParamInfo() {
  const { data, success } = await dispatchPass(API.productionApi.exportFundParamInfo);
  return { success, data };
}
