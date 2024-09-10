import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { transOptions } from '@/utils/utils';

export interface TableListItem {
  orgFundCode: string;
  orgFundName: string;
  fundCode: string;
  fundAbbr: string;
  dcFundAbbr: string;
  fundRaisingType: string;
  panelShowType: string;
  panelShowName: string;
}

// 产品信息列表展示
export async function queryFundBasicInfo(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryFundConfigInfo, params);
  return data || {};
}

// 字典信息查询
export async function getDictInfoByType(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.getDictInfoByType, params);
  return transOptions(data, 'dictValue', 'dictKey', false);
}

// 大盘显示类型配置
export async function setFundPanelShowType(params = {}) {
  return await dispatchPass(API.marketingApi.setFundPanelShowType, params);
}
