import type { TemplateItem, Pagination } from './data';
import { dispatchPass } from '@/services/service';
import { API } from '@/services/api';

// 查用户配置后的业务信息列表
export async function queryInfoList(params: TemplateItem & Pagination) {
  const result = await dispatchPass(API.investmentApi.getBizInfoList, params);

  // const result = {
  //   data: {
  //     currentPage: 10,
  //     itemsPerPage: 200,
  //     totalItems: 1000,
  //     result: [
  //       { fundCode: '000198', fundName: '余额宝' },
  //       { fundCode: '420001', fundName: 'xxxx' },
  //       { fundCode: '420002', fundName: 'yyyyy' },
  //     ],
  //   },
  //   success: true,
  //   message: null,
  //   resultCode: '0000',
  // };

  const newResult = {
    total: (result && result.totalItems) || 0,
    success: result.success,
    data: result && result.result,
    message: result.message,
  };

  return newResult;
}

export async function queryTemplateDetail(params: any) {
  const result = await dispatchPass(API.investmentApi.getUseTemplateDetail, params);

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
  //         orderIndex: 0,
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
  //         optionalValues: [
  //           { entityKey: '01', entityValue: '01码' },
  //           { entityKey: '02', entityValue: '02码' },
  //         ],
  //         paramProcessName: '',
  //         orderIndex: 2,
  //         dbColumn: '',
  //         paramOperation: '=',
  //       },
  //       {
  //         paramCode: 'secCodex',
  //         paramName: 'sec码x',
  //         paramType: 'select',
  //         paramFormat: 'YYYYMMDD',
  //         ifRequired: 'N',
  //         ifMulti: 'Y',
  //         defaultValues: [],
  //         optionalValues: [
  //           { entityKey: '01', entityValue: '01码x' },
  //           { entityKey: '02', entityValue: '02码x' },
  //         ],
  //         paramProcessName: '',
  //         orderIndex: 1,
  //         dbColumn: '',
  //         paramOperation: '=',
  //       },
  //       {
  //         paramCode: 'startDate',
  //         paramName: '开始日期',
  //         paramType: 'date',
  //         paramFormat: 'YYYYMMDD',
  //         ifRequired: 'N',
  //         defaultValues: [],
  //         optionalValues: [],
  //         paramProcessName: '',
  //         orderIndex: 3,
  //         dbColumn: '',
  //         paramOperation: '=',
  //       },
  //     ],
  //     columnList: [
  //       { dataIndex: 'fundCode', dataTitle: '基金代码', orderIndex: 0 },
  //       { dataIndex: 'secCode', dataTitle: 'sec码', orderIndex: 2 },
  //       { dataIndex: 'fundName', dataTitle: '基金名称', orderIndex: 1 },
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
export async function getAllTemplate() {
  const result = await dispatchPass(API.investmentApi.getAllTemplate, {});

  // const result = {
  //   data: [
  //       { modelId: '1', modelName: '模型1' },
  //       { modelId: '2', modelName: '模型2' },
  //       { modelId: '3', modelName: '模型3' },
  //       { modelId: '4', modelName: '模型4' },
  //     ],
  //   success: true,
  //   message: null,
  //   resultCode: '0000',
  // };
  return {
    success: result.success,
    message: result.message,
    resultCode: result.resultCode,
    data: result.data && result.data,
  };
}

// 下载文件
export async function download(params: any) {
  const result = await dispatchPass(API.investmentApi.downloadBizInfoList, params);

  return result;
}
