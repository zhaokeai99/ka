import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 关注行业
export interface followType {
  followIndustryName?: string; // 行业名称，followType=SINGLE 时必填
  followType: string; // 关注类型 ALL：全部  SINGLE：单个
}

// 关注行业
export async function followIndustry(params: followType) {
  const { success } = await dispatchPass(API.industrialChain.followIndustry, params);

  return { success } || {};
}

// 取消关注行业
export async function unFollowIndustry(params: followType) {
  const { success } = await dispatchPass(API.industrialChain.unFollowIndustry, params);

  return { success } || {};
}
