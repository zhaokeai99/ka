import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export const MSG_TYPE_DIC = {
  1: '电话会议',
  2: '调研邀请',
  3: '调研纪要',
  4: '卖方观点',
  5: '深度报告',
  6: '其他',
};

// 卖方信息聚合 查询
export async function SelmRoadShowInfoFacadeQueryRoadShowInfoByPage(params = {}) {
  const data = await dispatchPass(
    API.investmentApi.SelmRoadShowInfoFacadeQueryRoadShowInfoByPage,
    params,
  );
  return data;
}
// 卖方信息聚合 查询
export async function SelmRoadShowInfoFacadeGetSelmRoadShowInfo(params = {}) {
  const data = await dispatchPass(
    API.investmentApi.SelmRoadShowInfoFacadeGetSelmRoadShowInfo,
    params,
  );
  return data;
}
// 卖方信息聚合 字典
export async function SelmRoadShowInfoFacadeGetRoadShowDic(params = {}) {
  const data = await dispatchPass(API.investmentApi.SelmRoadShowInfoFacadeGetRoadShowDic, params);
  return data;
}
// 微信群收录查询
export async function SelmWechatGroupQueryWechatGroup(params = {}) {
  const data = await dispatchPass(API.investmentApi.SelmWechatGroupQueryWechatGroup, params);
  return data;
}
// 搜索历史记录
export async function SelmRoadShowOpLogFacadeQueryRoadShowOpInfoByPage(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.SelmRoadShowOpLogFacadeQueryRoadShowOpInfoByPage,
    params,
  );
  return data;
}
// 搜索历史记录
export async function SelmRoadShowOpLogFacadeQueryRoadShowOpUnique(params = {}) {
  const data = await dispatchPass(
    API.investmentApi.SelmRoadShowOpLogFacadeQueryRoadShowOpUnique,
    params,
  );
  return data;
}
// 统计搜索历史记录
export async function SelmRoadShowOpLogFacadeCountRoadShowOpInfoByUsername(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.SelmRoadShowOpLogFacadeCountRoadShowOpInfoByUsername,
    params,
  );
  return data;
}
// 新增搜索历史记录
export async function SelmRoadShowOpLogFacadeAddRoadShowOpInfo(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.SelmRoadShowOpLogFacadeAddRoadShowOpInfo,
    params,
  );
  return data;
}
// 删除搜索历史记录
export async function SelmRoadShowOpLogFacadeDeleteRoadShowOpInfo(params = {}) {
  const data = await dispatchPass(
    API.investmentApi.SelmRoadShowOpLogFacadeDeleteRoadShowOpInfo,
    params,
  );
  return data;
}
// 搜索热度
export async function SelmRoadShowOpLogFacadeQuerySearchRoadShowOpTopByPage(params = {}) {
  const data = await dispatchPass(
    API.investmentApi.SelmRoadShowOpLogFacadeQuerySearchRoadShowOpTopByPage,
    params,
  );
  return data;
}
// 股票公司
export async function WindCompIntroductionFacadeQueryCompIntroductionByPage(params = {}) {
  const data = await dispatchPass(
    API.investmentApi.WindCompIntroductionFacadeQueryCompIntroductionByPage,
    params,
  );
  return data;
}
// 股票公司
export async function SelmRoadShowInfoFacadeQueryRoadShowSimple(params = {}) {
  const data = await dispatchPass(
    API.investmentApi.SelmRoadShowInfoFacadeQueryRoadShowSimple,
    params,
  );
  return data;
}

// 会议统计
export async function SelmRoadShowInfoFacadeQueryRoadShowStatistics(params = {}) {
  const data = await dispatchPass(
    API.investmentApi.SelmRoadShowInfoFacadeQueryRoadShowStatistics,
    params,
  );
  return data;
}

// es数据查询
export async function EsIndexDataInfoFacadeQuerySimpleEsDataByPage(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.EsIndexDataInfoFacadeQuerySimpleEsDataByPage,
    params,
  );
  return data || {};
}

// 保存搜索
export async function SelmRoadShowInfoFacadeSaveKeywordOpLog(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.SelmRoadShowInfoFacadeSaveKeywordOpLog,
    params,
  );
  return data || {};
}

// 个人爱好查询
export async function IrFollowFacadeQueryIrFollowList(params = {}) {
  const data = await dispatchPass(API.investmentApi.IrFollowFacadeQueryIrFollowList, params);
  return data || {};
}

// 个人爱好新增
export async function IrFollowFacadeInsertIrFollowList(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.IrFollowFacadeInsertIrFollowList, params);
  return data || {};
}

// 个人爱好删除
export async function IrFollowFacadeDeleteIrFollowList(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.IrFollowFacadeDeleteIrFollowList, params);
  return data || {};
}

// 查看oss
export async function IrReportFacadeGetOssUrl(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.IrReportFacadeGetOssUrl, params);
  return data || [];
}
