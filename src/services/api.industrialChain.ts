export default {
  // 首页接口
  // 查询产业链列表
  IndustryChainFacadeQueryIndustryChainList:
    'com.thfund.industrychaincore.facade.IndustryChainFacade.queryIndustryChainList',
  // 查询复盘总结
  MarketTrendFacadeQueryReplaySummary:
    'com.thfund.industrychaincore.facade.MarketTrendFacade.queryReplaySummary',
  // 查询热点新闻列表
  IndustryResearchFacadeQueryIndustryHotNewsList:
    'com.thfund.industrychaincore.facade.IndustryResearchFacade.queryIndustryHotNewsList',
  // 行业业绩预测
  IndustryResearchFacadeQueryIndustryForecast:
    'com.thfund.industrychaincore.facade.IndustryResearchFacade.queryIndustryForecast',
  // 行业资金流向
  IndustryResearchFacadeQueryIndustryMoneyFlow:
    'com.thfund.industrychaincore.facade.IndustryResearchFacade.queryIndustryMoneyFlow',
  // 行业表现
  IndustryResearchFacadeQueryIndustryPerformance:
    'com.thfund.industrychaincore.facade.IndustryResearchFacade.queryIndustryPerformance',
  // 媒体情绪
  IndustryResearchFacadeQueryMediaSentiment:
    'com.thfund.industrychaincore.facade.IndustryResearchFacade.queryMediaSentiment',
  // 卖方评级-研报信息提取
  IndustryResearchFacadeQuerySellerEvaluation:
    'com.thfund.industrychaincore.facade.IndustryResearchFacade.querySellerEvaluation',
  // 行业景气度
  IndustryResearchFacadeQueryIndustryProsperity:
    'com.thfund.industrychaincore.facade.IndustryResearchFacade.queryIndustryProsperity',

  // 行业中心-行业画像-大类得分
  QueryIndustryPortrait:
    'com.thfund.industrychaincore.facade.IndustryResearchFacade.queryIndustryPortrait',
  // 行业中心-行业画像-子类得分
  QueryIndustryPortraitSub:
    'com.thfund.industrychaincore.facade.IndustryResearchFacade.queryIndustryPortraitSub',
  // 行业中心-行业画像-子类排名
  QueryIndustryPortraitSubSort:
    'com.thfund.industrychaincore.facade.IndustryResearchFacade.queryIndustryPortraitSubSort',
  // 行业中心-产业链行情-最新行情
  QueryOneChainTrendDailyDataByChainName:
    'com.thfund.industrychaincore.facade.IndustryChainFacade.queryOneChainTrendDailyDataByChainName',
  // 行业中心-产业链行情-K线图
  QueryListChainTrendDailyDataByChainName:
    'com.thfund.industrychaincore.facade.IndustryChainFacade.queryListChainTrendDailyDataByChainName',
  // 行业中心-研究报告
  QueryReportInfoListByIndustryName:
    'com.thfund.industrychaincore.facade.IndustryReportFacade.queryReportInfoListByIndustryName',
  // 行业中心-基金详情
  QueryIndustryFundInfo:
    'com.thfund.industrychaincore.facade.IndustryChainFacade.queryIndustryFundInfo',
  // 行业中心-行业政策
  queryThsPolicyData:
    'com.thfund.industrychaincore.facade.IndustryResearchFacade.queryThsPolicyData',
  // 行业中心-重点指标
  queryChainEdbFinanceInfoList:
    'com.thfund.industrychaincore.facade.IndustryResearchFacade.queryChainEdbFinanceInfoList',
  // 行业中心-行业画像-行业历史得分
  queryIndustryPortraitHistoryScore:
    'com.thfund.industrychaincore.facade.IndustryResearchFacade.queryIndustryPortraitHistoryScore',
  // 行业中心-行业画像-产业链图
  queryStaticResourcesConfigInfo:
    'com.thfund.industrychaincore.facade.IndustryChainFacade.queryStaticResourcesConfigInfo',

  // 全景产业链模块接口
  // 查询产业链节点树
  queryChainNodeTree: 'com.thfund.industrychaincore.facade.IndustryChainFacade.queryChainNodeTree',
  // 查询产业链节点EDB指标详情
  queryChainNodeEdbData:
    'com.thfund.industrychaincore.facade.IndustryChainFacade.queryChainNodeEdbData',
  // 查询行业基金
  queryIndustryFundInfo:
    'com.thfund.industrychaincore.facade.IndustryChainFacade.queryIndustryFundInfo',
  // 节点公司公告掘金接口
  queryCompanyEarningsEstimateCount:
    'com.thfund.industrychaincore.facade.IndustryChainFacade.queryCompanyEarningsEstimateCount',
  // 查询上市发债公司营业情况
  queryStockFinancialIndex:
    'com.thfund.industrychaincore.facade.IndustryChainFacade.queryStockFinancialIndex',
  // 查询节点竞争格局报告期列表
  queryCompanyProductsIncomeDeclareDate:
    'com.thfund.industrychaincore.facade.IndustryChainFacade.queryCompanyProductsIncomeDeclareDate',
  // 查询节点竞争格局
  queryCompanyProductsIncome:
    'com.thfund.industrychaincore.facade.IndustryChainFacade.queryCompanyProductsIncome',
  // 舆情
  queryChainNodeNewsInfoLimitList:
    'com.thfund.industrychaincore.facade.IndustryChainFacade.queryChainNodeNewsInfoLimitList',
  // 节点tag异动情况
  queryNodeTagAbnormalSignal:
    'com.thfund.industrychaincore.facade.IndustryChainFacade.queryNodeTagAbnormalSignal',

  // 研报分析
  // 分页查询研报数据
  queryIndustryReportInfoLimit:
    'com.thfund.industrychaincore.facade.IndustryReportFacade.queryIndustryReportInfoLimit',
  // 查询研报图表数据
  queryIndustryReportInfoToChart:
    'com.thfund.industrychaincore.facade.IndustryReportFacade.queryIndustryReportInfoToChart',

  // 模型说明
  // 查询模型节点树
  queryModelIntroTree:
    'com.thfund.industrychaincore.facade.IndustryResearchFacade.queryModelIntroTree',
  // 根据模型名称查询模型详情
  queryModelIntroInfoByModelName:
    'com.thfund.industrychaincore.facade.IndustryResearchFacade.queryModelIntroInfoByModelName',

  // 舆情列表

  // 行业舆情：
  queryIndustryNewsInfoAndLabel:
    'com.thfund.industrychaincore.facade.IndustryResearchFacade.queryIndustryNewsInfoAndLabel',
  // 查询行业节点树
  queryIndustryNodeTree:
    'com.thfund.industrychaincore.facade.IndustryNewsFacade.queryIndustryNodeTree',
  // 分页查询行业新闻
  queryIndustryNewsLimit:
    'com.thfund.industrychaincore.facade.IndustryNewsFacade.queryIndustryNewsLimit',
  // 查询行业新闻图表
  queryIndustryNewsChart:
    'com.thfund.industrychaincore.facade.IndustryNewsFacade.queryIndustryNewsChart',
  // 查询单条新闻详情
  queryIndustryNewsInfo:
    'com.thfund.industrychaincore.facade.IndustryNewsFacade.queryIndustryNewsInfo',
  // 查询单条研报分析新闻详情
  queryIndustryReportInfo:
    'com.thfund.industrychaincore.facade.IndustryReportFacade.queryIndustryReportInfo',

  // 异动
  // 查询异动节点树
  queryAbnormalTrackTree:
    'com.thfund.industrychaincore.facade.AbnormalTrackFacade.queryAbnormalTrackTree',
  // 查询异动指标
  queryAbnormalTrackIndex:
    'com.thfund.industrychaincore.facade.AbnormalTrackFacade.queryAbnormalTrackIndex',
  // 查询异动回测列表
  queryBackTest: 'com.thfund.industrychaincore.facade.AbnormalTrackFacade.queryBackTest',
  // 查询异动推送列表
  queryAbnormalPushList:
    'com.thfund.industrychaincore.facade.AbnormalTrackFacade.queryAbnormalPushList',
  // 修改异动推送标志
  updateAbnormalPush: 'com.thfund.industrychaincore.facade.AbnormalTrackFacade.updateAbnormalPush',

  // 行业政策
  // 分页查询行业政策
  queryIndustryPolicyListLimit:
    'com.thfund.industrychaincore.facade.IndustryPolicyFacade.queryIndustryPolicyListLimit',
  // 查询政策详情
  queryIndustryPolicyInfo:
    'com.thfund.industrychaincore.facade.IndustryPolicyFacade.queryIndustryPolicyInfo',
  // 按照情绪对政策新闻进行分组
  queryIndustryPolicyDataGroupBy:
    'com.thfund.industrychaincore.facade.IndustryPolicyFacade.queryIndustryPolicyDataGroupBy',
  // 查询政策详情to首页
  queryPolicyInfoToHomePage:
    'com.thfund.industrychaincore.facade.IndustryPolicyFacade.queryPolicyInfoToHomePage',
  // 关注行业
  followIndustry: 'com.thfund.industrychaincore.facade.IndustryChainFacade.followIndustry',
  // 取消关注行业
  unFollowIndustry: 'com.thfund.industrychaincore.facade.IndustryChainFacade.unFollowIndustry',
};
