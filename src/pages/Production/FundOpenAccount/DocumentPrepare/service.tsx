import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 查询材料准备列表
export async function queryDocumentPrepareList(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryPrepareMaterialList, params);
  return data || [];
}

// 查询材料树
export async function queryMaterialTree(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryMaterialTree, params);
  return data || [];
}

// 查询材料树-席位
export async function querySeatMaterialTree(params: any) {
  const { data } = await dispatchPass(API.productionApi.querySeatMaterialTree, params);
  return data || [];
}

// 查询材料清单列表
export async function queryMaterialList(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryMaterialList, params);
  return data || [];
}

// 查询材料清单列表-席位
export async function querySeatMaterialList(params: any) {
  const { data } = await dispatchPass(API.productionApi.querySeatMaterialList, params);
  return data || [];
}

// 查询文档对应表单内容
export async function queryTemplateFormData(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryTemplateFormData, params);
  return data || [];
}

// 查询文档对应表单内容-席位
export async function querySeatTemplateFormData(params: any) {
  const { data } = await dispatchPass(API.productionApi.querySeatTemplateFormData, params);
  return data || [];
}

// 模糊查询项目经理/产品经理
export async function queryManagerByKeyword(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryManagerByKeyword, params);
  return data || [];
}

// 保存文档对应表单内容
export async function saveTemplateFormData(params: any) {
  const data = await dispatchPass(API.productionApi.saveTemplateFormData, params);
  return data;
}

// 保存文档对应表单内容-席位
export async function saveSeatTemplateFormData(params: any) {
  const data = await dispatchPass(API.productionApi.saveSeatTemplateFormData, params);
  return data;
}

// 预览文档-pdf格式
export async function previewOpenAccountMaterial(params: any) {
  const { data } = await dispatchPass(API.productionApi.previewOpenAccountMaterial, params);
  return data;
}

// 预览文档-pdf格式-席位
export async function previewOpenSeatMaterial(params: any) {
  const { data } = await dispatchPass(API.productionApi.previewOpenSeatMaterial, params);
  return data;
}

// 完成准备材料
export async function completeOpenAccountMaterial(params: any) {
  const { data } = await dispatchPass(API.productionApi.completeOpenAccountMaterial, params);
  return data;
}

// 复核文档内容
export async function reviewTemplateFormData(params: any) {
  const { data } = await dispatchPass(API.productionApi.reviewTemplateFormData, params);
  return data;
}

// 复核文档内容-席位
export async function reviewSeatTemplateFormData(params: any) {
  const { data } = await dispatchPass(API.productionApi.reviewSeatTemplateFormData, params);
  return data;
}

// 查询复核内容
export async function queryReviewData(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryReviewData, params);
  return data;
}

// 查询复核内容-席位
export async function querySeatReviewData(params: any) {
  const { data } = await dispatchPass(API.productionApi.querySeatReviewData, params);
  return data;
}

// 上传复核文件
export async function uploadReviewFile(params: any) {
  const { data } = await dispatchPass(API.productionApi.uploadReviewFile, params);
  return data;
}
