import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface TableListItem {
  id: number;
  messageId: string;
  theme: string;
  showDate: string;
  showTime: string;
  addr: string;
  analyst: string;
  broker: string;
  industry: string;
  contact: string;
  showUrl: string;
  phoneNumber: string;
  stockCode: string;
  stockName: string;
  status: number;
  updateTime: Date;
}

// 获取路演中心查询
export async function SelmLiveRoadShowInfoFacadeQueryLiveRoadShowInfoByPage(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.SelmLiveRoadShowInfoFacadeQueryLiveRoadShowInfoByPage,
    params,
  );
  return data || [];
}

// 获取路演中心
export async function SelmLiveRoadShowInfoFacadeGetLiveRoadShowInfo(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.SelmLiveRoadShowInfoFacadeGetLiveRoadShowInfo,
    params,
  );
  return data || {};
}

// 路演中心保存
export async function SelmLiveRoadShowInfoFacadeSaveLiveRoadShowInfo(params = {}) {
  const data = await dispatchPass(
    API.investmentApi.SelmLiveRoadShowInfoFacadeSaveLiveRoadShowInfo,
    params,
  );
  return data || {};
}

// 路演中心新增
export async function SelmLiveRoadShowInfoFacadeAddLiveRoadShowInfo(params = {}) {
  const data = await dispatchPass(
    API.investmentApi.SelmLiveRoadShowInfoFacadeAddLiveRoadShowInfo,
    params,
  );
  return data || {};
}

// 路演中心日志查询
export async function SelmLiveRoadShowInfoFacadeQueryLogByPage(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.SelmLiveRoadShowInfoFacadeQueryLogByPage,
    params,
  );
  return data || [];
}

// 路演中心忽略
export async function SelmLiveRoadShowInfoFacadeIgnoreLog(params = {}) {
  const data = await dispatchPass(API.investmentApi.SelmLiveRoadShowInfoFacadeIgnoreLog, params);
  return data || {};
}

// 路演中心统计信息
export async function SelmLiveRoadShowInfoFacadeCountLiveInfo(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.SelmLiveRoadShowInfoFacadeCountLiveInfo,
    params,
  );
  return data || {};
}

// 发送邮件
export async function SelmLiveRoadShowInfoFacadeMailSend(params = {}) {
  const data = await dispatchPass(API.investmentApi.SelmLiveRoadShowInfoFacadeMailSend, params);
  return data || {};
}
// 字典
export async function SelmLiveRoadShowInfoFacadeGetLiveInfoDic(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.SelmLiveRoadShowInfoFacadeGetLiveInfoDic,
    params,
  );
  return data || {};
}
