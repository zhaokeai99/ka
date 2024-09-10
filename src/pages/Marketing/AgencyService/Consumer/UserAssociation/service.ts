import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface TableListItem {
  userId: string;
  userName: string;
  mobile: string;
  agencyUser: string[];
}

// 用户关联关系
export async function getUserInfoByType(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.getUserInfoByType, params);
  if (Array.isArray(data)) {
    return data.map((item) => ({
      title: item.userName,
      key: item.userId,
      mobile: item.mobile,
      agencyName: item.agencyName,
      departmentName: item.departmentName,
    }));
  }
  return [];
}

// 查询
export async function queryUserRelation(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryUserRelation, params);
  console.log(data);
  return data || [];
}
// 配置
export async function userRelationConfig(params = {}) {
  return await dispatchPass(API.marketingApi.userRelationConfig, params);
}
