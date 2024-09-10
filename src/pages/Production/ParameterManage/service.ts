import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 获取全部产品实例信息
export async function queryTemplate(params: any) {
  const { data: result, success } = await dispatchPass(API.productionApi.queryAllExample, params);

  return { ...result, success, data: result?.dataList || [] };
}

// 根据基金代码查询基金全称
export async function getFundInfoByCode(params: any) {
  const { success, data } = await dispatchPass(API.productionApi.getFundInfoByCode, params);
  const fundInfoData = (success && data) || {};
  return fundInfoData;
}

// 新增实例信息
export async function createExample(params: any) {
  return await dispatchPass(API.productionApi.createExample, params);
}

// 新增实例信息
export async function queryExampleByFundId(params: any) {
  return await dispatchPass(API.productionApi.queryExampleByFundId, params);
}

// 获取发送邮件信息
export async function getEmailInfo(params: any) {
  return await dispatchPass(API.productionApi.getEmailInfo, params);
}

// 查询用户邮件地址接口
export async function queryUserEmail(params: any) {
  const { success, data } = await dispatchPass(API.productionApi.queryUserEmail, params);
  const optionsData =
    (success &&
      data?.map((item: any) => ({
        label: item,
        value: item,
      }))) ||
    [];
  return optionsData;
}

// 发送邮件
export async function sendEmail(params: any) {
  return await dispatchPass(API.productionApi.sendEmail, params);
}

// excel下载接口
export async function downloadExcel(params: any) {
  return await dispatchPass(API.productionApi.downloadExcel, params);
}

// 数据同步
export async function makeExampleByFundCode(params: any) {
  return await dispatchPass(API.productionApi.makeExampleByFundCode, params);
}

// 修改状态 状态：2：复核通过，3：复核失败，4：已发送
export async function updateState(params: any) {
  return await dispatchPass(API.productionApi.updateState, params);
}

// 修改产品实例信息接口： 已生成报告：true 只修改：false
export async function updateExample(params: any) {
  return await dispatchPass(API.productionApi.updateExample, params);
}

// 筛选框基金模糊搜索
export async function queryByKeywordByExample(keyword: string) {
  const { data } = await dispatchPass(API.productionApi.queryByKeywordByExample, { keyword });
  return (data || []).map((r: any) => ({
    key: r.fundId,
    value: r.fundId,
    label: r.fundName,
  }));
}

export interface exampleByFundInfoType {
  templateCode?: string;
  templateName?: string;
  templateVersion?: string;
  fundId?: number;
  fundCode?: string;
  topicSorts?: topicSortsType[];
  excelUrl?: string;
}

interface topicSortsType {
  topSort?: string;
  topics: topicsType[];
}

interface topicsType {
  topicCode?: string;
  topicName?: string;
  topicType?: string;
  topicOrder?: number;
  topicRemark?: string;
  value?: any;
  topicDefValue?: string;
}
