import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface TableListItem {
  userId: string;
  userName: string;
  mobile: string;
  agencyName: string;
  investorNames: string;
}

// 资产账户名
export async function getInvestorName(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.getInvestorNameByAgencyName, params);
  if (Array.isArray(data)) {
    return data.map((key) => ({
      label: key,
      value: key,
    }));
  }
  return [];
}

// 查询
export async function queryUserInfo(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryUserInfoInvestorName, params);
  console.log(data);
  return data || [];
}
// 配置
export async function updateUserInfo(params = {}) {
  return await dispatchPass(API.marketingApi.updateUserInfoInvestorName, params);
}
