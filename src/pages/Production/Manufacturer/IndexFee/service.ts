import { API } from '@/services/api';
import moment from 'moment';
import qs from 'qs';
import { dispatchPass } from '@/services/service';

// 查找列表
export async function queryReportList(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryReportList, params);
  return { ...data, data: data.dataList || [] };
}

// 查找信息产品
export async function queryFundInfoList(params: any = '') {
  const { success, data } = await dispatchPass(API.productionApi.queryFundInfoList, {
    fundName: params,
  });
  if (success && Array.isArray(data)) {
    return data.map(({ fundCode, fundName: fName, beginDate, endDate }) => ({
      label: `${fundCode} - ${fName}`,
      value: [fName, fundCode, beginDate, endDate],
    }));
  }
  return [];
}

// 查找跟踪指标
export async function queryIndexFollowList(params: any = '') {
  const { success, data } = await dispatchPass(API.productionApi.queryIndexFollowList, {
    indexName: params,
  });
  if (success && Array.isArray(data)) {
    return data.map(({ indexCode, indexName: iName, publisher, publisherStr }) => ({
      label: `${indexCode} - ${iName}`,
      value: [iName, indexCode, publisher, publisherStr],
    }));
  }
  return [];
}

// 查找业务周期
export async function queryBusinessCycleList() {
  const { success, data } = await dispatchPass(API.productionApi.queryBusinessCycleList);
  if (success && Array.isArray(data)) {
    const options: any = [];
    let defaultValue = '';
    data.map((i: any) => {
      options.push({
        label: i.businessName,
        value: i.businessIndex,
      });
      if (i.defaultDisplay) {
        defaultValue = i.businessIndex;
      }
    });
    return { data: options, defaultValue };
  }
  return { data: [], defaultValue: '' };
}

// 查找公司
export async function queryIndexPublisherList() {
  const { success, data } = await dispatchPass(API.productionApi.queryIndexPublisherList);
  if (success && Array.isArray(data)) {
    return data.map(({ publisherStr, publisher }) => ({
      label: publisherStr,
      value: publisher,
    }));
  }
  return [];
}

// 查单条
export async function queryById(params: any) {
  const { data, success } = await dispatchPass(API.productionApi.queryByFundCode, params);
  const {
    indexFollow,
    companyName,
    publisher,
    publisherStr,
    fundCode,
    fundName,
    startDate,
    endDate,
    companyPay,
  } = data || {};
  if (success) {
    return {
      ...data,
      followInfo: {
        label: `${indexFollow} - ${companyName}`,
        value: [companyName, indexFollow, publisher, publisherStr],
      },
      fundInfo: {
        label: `${fundCode} - ${fundName}`,
        value: [fundName, fundCode],
      },
      date: [startDate ? moment(startDate) : null, endDate ? moment(endDate) : null],
      companyPay: companyPay === 0,
      publisherInfo: publisherStr,
    };
  }
  return {};
}

// 新增
export async function add(params: any) {
  const { success } = await dispatchPass(API.productionApi.addReport, params);
  return { success };
}

// 更新
export async function update(params: any) {
  const { success } = await dispatchPass(API.productionApi.updateReport, params);
  return { success };
}

// 导出
export function configListExport(params: any) {
  return `${API.productionApi.configListExport}?${qs.stringify(params)}`;
}

// 查看详情
export async function queryDetail(params: any) {
  const data = await dispatchPass(API.productionApi.queryDetail, params);
  return data || {};
}

// 导出明细
export function detailConfigExport(fundCode: any, businessCycle: any) {
  return `${API.productionApi.detailConfigExport}?fundCode=${fundCode}&businessCycle=${businessCycle}`;
}

// 批量导出明细
export function batchDetailConfigExport(fundCodes: any, businessCycle: any) {
  return `${API.productionApi.batchDetailConfigExport}?fundCodes=${fundCodes}&businessCycle=${businessCycle}`;
}
