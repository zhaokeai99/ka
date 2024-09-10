import type { TemplateItem, Pagination } from './data';
import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 查找列表
export async function queryTemplateList(params: TemplateItem & Pagination) {
  const result = await dispatchPass(API.investmentApi.queryTemplateList, params);

  // const result = {
  //   data: {
  //     currentPage: 10,
  //     itemsPerPage: 20,
  //     totalItems: 100,
  //     result: [
  //       {
  //         modelId: '1',
  //         modelName: 'dddd',
  //         modelRemark: 'xxxx',
  //         createUser: 'xxxx',
  //         createTime: 'YYYYMMDD HH:mm:ss',
  //         updateUser: 'xxxx',
  //         updateTime: 'YYYYMMDD HH:mm:ss',
  //       },
  //       {
  //         modelId: '2',
  //         modelName: 'dddd',
  //         modelRemark: 'xxxx',
  //         createUser: 'xxxx',
  //         createTime: 'YYYYMMDD HH:mm:ss',
  //         updateUser: 'xxxx',
  //         updateTime: 'YYYYMMDD HH:mm:ss',
  //       },
  //     ],
  //   },
  //   success: true,
  //   message: null,
  //   resultCode: '0000',
  // };

  const newResult = {
    total: (result && result.totalItems) || 0,
    success: result.success,
    data: (result && result.result) || [],
  };

  return newResult;
}

export async function queryTemplateDetail(params: any) {
  const result = await dispatchPass(API.investmentApi.queryEditTemplateDetail, params);

  // const result = {
  //   data: {
  //     modelId: 14,
  //     modelName: 'xxxx',
  //     paramList: [
  //       {
  //         paramCode: 'fundCode',
  //         paramName: '基金代码',
  //         paramType: 'input',
  //         paramFormat: 'YYYYMMDD',
  //         ifRequired: 'Y',
  //         ifMulti: 'N',
  //         defaultValues: [],
  //         optionalValues: [],
  //         paramProcessName: '',
  //         dbColumn: '',
  //         paramOperation: '=',
  //       },
  //       {
  //         paramCode: 'secCode',
  //         paramName: 'sec码',
  //         paramType: 'select',
  //         paramFormat: 'YYYYMMDD',
  //         ifRequired: 'Y',
  //         ifMulti: 'N',
  //         defaultValues: [],
  //         optionalValues: [],
  //         paramProcessName: '',
  //         dbColumn: '',
  //         paramOperation: '=',
  //       },
  //     ],
  //     columnList: [
  //       { dataIndex: 'fundCode', dataTitle: '基金代码', orderIndex: 0 },
  //       { dataIndex: 'secCode', dataTitle: 'sec码', orderIndex: 1 },
  //     ],
  //     modelLogic: 'xxxxxx',
  //     modelRemark: 'test mark',
  //   },
  //   success: true,
  //   message: null,
  //   resultCode: '0000',
  // };
  return result;
}

// 新增应用
export async function addTemplate(params: TemplateItem) {
  const result = await dispatchPass(API.investmentApi.addModuleTemplate, params);

  return result;
}

// 修改应用
export async function updateTemplate(params: TemplateItem) {
  const result = await dispatchPass(API.investmentApi.updateModuleTemplate, params);

  return result;
}

// 删除应用
export async function deleteTemplate(params: TemplateItem) {
  const result = await dispatchPass(API.investmentApi.deleteModuleTemplate, params);

  return result;
}
