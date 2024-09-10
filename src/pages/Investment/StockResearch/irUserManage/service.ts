import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

/*
accountName: "zhangtao"
avatar: ""
createTime: 1660618609000
id: 2
role: "invest"
tenantId: 1
userName: "张韬"
wechatId: "ztthinker"
wechatName: null
 */
export interface TableListItem {
  id: number;
  accountName: string;
  userName: string;
  wechatId: string;
  wechatName: string;
  avatar: number;
  tenantId: number;
  role: string;
  createTime: Date;
}

// 权限验证
export async function IrReportFacadeQueryIrUserInfoByPage(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.IrReportFacadeQueryIrUserInfoByPage,
    params,
  );
  return data || false;
}

// 删除
export async function IrReportFacadeDeleteIrUserInfo(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.IrReportFacadeDeleteIrUserInfo, params);
  return data || false;
}

// 新增
export async function IrReportFacadeAddIrUserInfo(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.IrReportFacadeAddIrUserInfo, params);
  return data || false;
}

// 修改
export async function IrReportFacadeEditIrUserInfo(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.IrReportFacadeEditIrUserInfo, params);
  return data || false;
}

// 查询用户
export async function IrReportFacadeQueryIrUserInfo(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.IrReportFacadeQueryIrUserInfo, params);
  return data || false;
}

// 查询wx用户
export async function IrReportFacadeQueryWxUserPart(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.IrReportFacadeQueryWxUserPart, params);
  return data || false;
}

// 查询account
export async function IrReportFacadeQuerySysAccount(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.IrReportFacadeQuerySysAccount, params);
  return data || false;
}

// 验证
export async function IrReportFacadeAuthUserManage(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.IrReportFacadeAuthUserManage, params);
  return data || false;
}

// 码表查询
export async function irReportFacadeQuerySysConfigCode(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.IrReportFacadeQuerySysConfigCode, params);
  return data || [];
}
