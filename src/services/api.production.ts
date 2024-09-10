import { getBaseApi } from './service';

// const ServerApi = process.env.SERVER || '';
const ServerApi = getBaseApi();

export default {
  /** 产品首页 */
  // 查询公募变动产品列表信息
  queryPdFundChangeInfo:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundPortalFacadeService.queryProductInfoList',
  // 查询基金门户各状态数量饼图
  queryFundPortPieChart:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundPortalFacadeService.queryFundPortPieChart',
  // 精品注册动态
  queryMutualFundCollectSummary:
    'com.thfund.product.facade.service.MutualFundCollectFacadeService.queryMutualFundCollectSummary',
  // 查询基金审核政策概览
  queryFundExaminePolicySummary:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundPortalFacadeService.queryFundExaminePolicySummary',
  // 查询指数动态概览
  queryIndexDynamicSummary:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundPortalFacadeService.queryIndexDynamicSummary',
  // 热点产品列表
  pageHotProducts: 'com.thfund.product.facade.service.FundProductFacadeService.pageHotProducts',
  // 热点line
  linearHotProducts: 'com.thfund.product.facade.service.FundProductFacadeService.linearHotProducts',
  // 热点产品模糊查询下拉
  queryLikeFundInfo:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductFundDataFacade.queryLikeFundInfo',
  // 热点产品下拉筛选
  queryDropOptions:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductFundDataFacade.queryDropOptions',
  // 基金索引下拉筛选联动
  queryPullDownProductLinkage:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductFundDataFacade.queryPullDownProductLinkage',
  // 公募存续产品分类
  queryFundSurvivalProductType:
    'com.thfund.product.facade.service.FundProductFacadeService.listMutualFundSurvivalProductType',
  // 公募存续产品列表查询
  fundSurvivalProducts:
    'com.thfund.product.facade.service.FundProductFacadeService.pageMutualFundSurvivalProducts',
  // 公募存续分布图
  queryFundSurvivalPieChart:
    'com.thfund.product.facade.service.FundProductFacadeService.pieMutualFundSurvivalProducts',
  // 热点产品列表
  queryHosListPage:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductFundDataFacade.queryHosListPage',
  // 产品经理下拉选项查询
  queryProductManagerList:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductFundDataFacade.queryProductManagerList',
  // 基金经理下拉选项查询
  queryFundManagerList:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductFundDataFacade.queryFundManagerList',
  // 上月/本月成立大事项查询接口
  queryEvents: 'com.thfund.product.facade.service.FundProductFacadeService.queryEvents',

  /** 指数动态预公告 */
  fundprodinfo:
    'com.thfund.product.facade.service.IndexAnnouncementFacadeService.queryIndexAnnouncementList',

  /** 指数存量研究 */
  indexInfo: 'com.thfund.product.facade.service.IndexInfoFacadeService.queryIndexInfo',
  indexValuation: 'com.thfund.product.facade.service.IndexInfoFacadeService.queryIndexValuation',
  indexLineChart:
    'com.thfund.product.facade.service.IndexInfoFacadeService.queryIndexConcentration',
  indexLinePKChart: 'com.thfund.product.facade.service.IndexInfoFacadeService.queryIndexPkData',
  queryStockConcentration:
    'com.thfund.product.facade.service.StockInfoFacadeService.queryStockConcentration',
  queryStockInfoPageList:
    'com.thfund.product.facade.service.StockInfoFacadeService.queryStockInfoPageList',
  queryIndexPageList:
    'com.thfund.product.facade.service.IndexInfoFacadeService.queryIndexInfoPageList',
  stockIndexValuation:
    'com.thfund.product.facade.service.StockInfoFacadeService.queryStockTopByIndexCode',
  queryStockIndustry: 'com.thfund.product.facade.service.StockInfoFacadeService.queryStockIndustry',
  queryIndexCoreConfigDetail:
    'com.thfund.product.facade.service.IndexInfoFacadeService.queryIndexCoreConfigDetail',
  queryStockInfoExport:
    'com.thfund.product.facade.service.StockInfoFacadeService.queryStockInfoExport',
  querySearchIndexInfo:
    'com.thfund.product.facade.service.IndexInfoFacadeService.querySearchIndexInfo',
  queryTrackIndexProductList:
    'com.thfund.product.facade.service.IndexInfoFacadeService.queryTrackIndexProductList',

  /** 指数使用费报告 */
  queryReportList: 'com.thfund.product.facade.service.ReportFacade.list',
  queryFundInfoList: 'com.thfund.product.facade.service.ReportFacade.queryFundInfoList',
  queryIndexFollowList: 'com.thfund.product.facade.service.ReportFacade.queryIndexFollowList',
  queryBusinessCycleList: 'com.thfund.product.facade.service.ReportFacade.queryBusinessCycleList',
  addReport: 'com.thfund.product.facade.service.ReportFacade.add',
  updateReport: 'com.thfund.product.facade.service.ReportFacade.update',
  queryIndexPublisherList: 'com.thfund.product.facade.service.ReportFacade.queryIndexPublisherList',
  queryById: `${ServerApi}/report/queryById`,
  configListExport: `${ServerApi}/report/configListExport`,
  queryDetail: 'com.thfund.product.facade.service.ReportFacade.queryDetail',
  detailConfigExport: `${ServerApi}/report/detailConfigExport`,
  batchDetailConfigExport: `${ServerApi}/report/batchDetailConfigExport`,
  queryByFundCode: 'com.thfund.product.facade.service.ReportFacade.queryByFundCode',

  /** 专户产品终止日报告 */
  queryDailyReportList:
    'com.thfund.product.facade.service.TerminationReportService.dailyReportList',
  reminderNotification:
    'com.thfund.product.facade.service.TerminationReportService.getReminderNotification',
  reminderWeeklyNotification: `${ServerApi}/dailyReport/reminderWeeklyNotification`,
  expirationDate: 'com.thfund.product.facade.service.TerminationReportService.getOperation',

  /** 公募产品审核政策 */
  queryFundPolicyList:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundPortalFacadeService.queryFundPolicyList',
  queryFundPolicyDetail:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundPortalFacadeService.queryFundPolicyDetail',

  /** 产品募集报告 **/
  queryRaisereportList:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundRaiseFacadeService.queryPublicProductInfoList',
  queryEffectBasicData:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundRaiseFacadeService.queryEABasicInfo',
  querySponsorData:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundRaiseFacadeService.queryEALaunchStyleFundHolderInfo',
  queryRaiseData:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundRaiseFacadeService.queryEARaiseInfo',
  queryFilingReport:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundRaiseFacadeService.queryFilingRequestReport',
  queryInvestorsDesReport:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundRaiseFacadeService.queryInvestorsDesReport',
  queryCVRReport:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundRaiseFacadeService.getCVRReport',

  /** 产品数分类 */
  queryTreeStructure:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductTreeFacade.queryTreeStructure',
  queryTreeStructureLabels:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductTreeFacade.queryLabels',
  queryTreeFundInfos:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductTreeFacade.queryFundInfos',
  saveFundInfoAndTreeLabels:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductTreeFacade.saveFundInfoAndTreeLabels',
  deleteTreeFundLabel:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductTreeFacade.deleteFundLabel',
  queryUserGroupRoles:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductTreeFacade.queryUserGroupRoles',

  /** 竞品注册动态 */
  queryMutualFundCollectChart:
    'com.thfund.product.facade.service.MutualFundCollectFacadeService.queryMutualFundCollectChart',
  queryMutualFundCollectList:
    'com.thfund.product.facade.service.MutualFundCollectFacadeService.queryMutualFundCollectList',
  // 基金公司列表
  queryFundCompanyList:
    'com.thfund.product.facade.service.MutualFundCollectFacadeService.queryFundCompanyList',
  // 发行/储备数量分布图
  queryGroupByFundType:
    'com.thfund.product.facade.service.MutualFundCollectFacadeService.queryGroupByFundType',
  // 发行/储备产品TOP5
  queryNumGroupByManager:
    'com.thfund.product.facade.service.MutualFundCollectFacadeService.queryNumGroupByManager',
  // 发行/储备产品数量饼图
  queryNumByManagerGroupByFundType:
    'com.thfund.product.facade.service.MutualFundCollectFacadeService.queryNumByManagerGroupByFundType',
  // 统计信息列表查询
  queryStatisticsList:
    'com.thfund.product.facade.service.MutualFundCollectFacadeService.queryStatisticsList',
  // 审批速度列表查询
  queryMutualFundApproveInfoList:
    'com.thfund.product.facade.service.MutualFundCollectFacadeService.queryMutualFundApproveInfoList',
  // 导出竞品
  exportCollectProgressList:
    'com.thfund.product.facade.service.MutualFundCollectFacadeService.exportCollectProgressList',
  // 产品类型
  queryFundTypeList:
    'com.thfund.product.facade.service.MutualFundCollectFacadeService.fundTypeList',

  /** 产品全景图 */
  // 获取全景图基本信息
  getPanoramaFundInfo:
    'com.thfund.product.facade.service.productpanorama.ProductPanoramaFacadeService.getFundInfo',
  // 关键词搜索
  searchFundInfo:
    'com.thfund.product.facade.service.productpanorama.ProductPanoramaFacadeService.searchFundInfo',
  // 关注接口
  saveUserFocusFund:
    'com.thfund.product.facade.service.productanalyse.fundportal.UserFocusFundFacadeService.saveUserFocusFund',
  // 查询关注
  queryUserFocusFundStatus:
    'com.thfund.product.facade.service.productanalyse.fundportal.UserFocusFundFacadeService.queryUserFocusFundStatus',
  // 产品生命周期
  getPanoramaFundLifeCycle:
    'com.thfund.product.facade.service.productpanorama.ProductPanoramaFacadeService.getFundLifeCycle',
  // 产品详情 - 基本信息
  getPanoramaContractInfo:
    'com.thfund.product.facade.service.productpanorama.ProductPanoramaFacadeService.getContractInfo',
  // 产品详情 - 费用信息
  getPanoramaFeeInfo:
    'com.thfund.product.facade.service.productpanorama.ProductPanoramaFacadeService.getFeeInfo',
  // 产品详情 - 基金经理
  getFundManagerChangeInfo:
    'com.thfund.product.facade.service.productpanorama.ProductPanoramaFacadeService.getFundManagerChangeInfo',
  // 产品详情 - 日期信息
  getPanoramaDateInfo:
    'com.thfund.product.facade.service.productpanorama.ProductPanoramaFacadeService.getDateInfo',
  // 产品详情 - 干系人信息
  getPanoramaStakeHolderInfo:
    'com.thfund.product.facade.service.productpanorama.ProductPanoramaFacadeService.getStakeHolderInfo',
  // 产品详情 - 标签信息
  queryProductTreeFundIdLabels:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductTreeFacade.queryFundIdLabels',
  // 产品详情 - 文件类型查询
  queryFileTypeAll: 'com.thfund.product.facade.service.FileInfoService.queryFileTypeAll',
  // 产品详情 - 文件信息查询
  queryFileInfoList: 'com.thfund.product.facade.service.FileInfoService.queryFileInfoList',
  // 根据 fundCode 查询 fundId
  queryFundCodeToFundId:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundPkNetValueFacade.queryFundCodeToFundId',
  // 查询置顶标签
  queryTopMarks:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundMarkFacade.queryTopMarks',

  // 产品流程
  queryProcessRelatedList:
    'com.thfund.product.facade.service.ProcessRelatedService.queryProcessList',
  // 资产信息 - 自准日期
  queryFundDailyMarketBaseDate:
    'com.thfund.product.facade.service.FundDailyMarketFacade.queryBaseDate',
  // 资产信息 - 规模配置
  queryFundAssetPosition:
    'com.thfund.product.facade.service.FundDailyMarketFacade.queryFundAssetPosition',
  // 资产信息 - 规模变动
  queryFundAsset: 'com.thfund.product.facade.service.FundDailyMarketFacade.queryFundAsset',
  // 资产信息 - 持有人
  queryFundAssetHolder:
    'com.thfund.product.facade.service.FundDailyMarketFacade.queryFundAssetHolder',
  // 资产信息 - 机构持有人前十大
  queryFundSalesHoldTop10:
    'com.thfund.product.facade.service.IndexEtfMapFacade.queryFundSalesHoldTop10',

  // 持仓信息 - 十大股票持仓
  queryStockRange: 'com.thfund.product.facade.service.FundDailyMarketFacade.queryStockRange',
  // 持仓信息 - 股票行业分类
  queryStockIndustry2: 'com.thfund.product.facade.service.FundDailyMarketFacade.queryStockIndustry',
  // 持仓信息 - 前五债券
  queryBondRange: 'com.thfund.product.facade.service.FundDailyMarketFacade.queryBondRange',
  // 持仓信息 - 债券类型分类
  queryBondIndustry: 'com.thfund.product.facade.service.FundDailyMarketFacade.queryBondIndustry',
  // 收益信息 - 收益走势&资产占比详情
  queryEarnFundAsset: 'com.thfund.product.facade.service.FundDailyMarketFacade.queryFundAsset',
  // 收益信息 - 最新10日历史数据
  queryFundAssetLimit:
    'com.thfund.product.facade.service.FundDailyMarketFacade.queryFundAssetLimit',
  // 收益信息 - 动态回撤
  queryFundAssetPullback:
    'com.thfund.product.facade.service.FundDailyMarketFacade.queryFundAssetPullback',

  // 开放安排
  getFundOpenDateInfo:
    'com.thfund.product.facade.service.productpanorama.ProductPanoramaFacadeService.getFundOpenDateInfo',

  // 产品数据浏览器 - 方案列表
  queryProductDataSearch:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductFundDataFacade.queryProductDataSearch',
  // 产品数据浏览器 - 保存方案
  saveProductDataSearch:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductFundDataFacade.saveProductDataSearch',
  // 产品数据浏览器 - 删除方案
  deleteProductDataSearch:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductFundDataFacade.deleteProductDataSearch',
  // 产品数据浏览器 - 我的分类
  queryMyTreeStructure:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductFundDataFacade.queryMyTreeStructure',
  // 产品数据浏览器 - 产品状态下拉
  queryProductStatusList:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductFundDataFacade.queryProductStatusList',
  // 产品数据浏览器 - 页面列表列项
  queryColumnDropDownList:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductFundDataFacade.queryColumnDropDownList',
  // 产品数据浏览器 - 页面列表
  queryDataBrowserListPage:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductFundDataFacade.queryDataBrowserListPage',
  // 风险评估 - 查询基金评分
  getFundQuotaRadar:
    'com.thfund.product.facade.service.productpanorama.ProductPanoramaFacadeService.getFundQuotaRadar',
  // 风险评估 - 指标描述信息
  getFundQuotaDescribeList:
    'com.thfund.product.facade.service.productpanorama.ProductPanoramaFacadeService.getFundQuotaDescribeList',
  // 指数地图
  queryIndexLabel: 'com.thfund.product.facade.service.IndexMapFacade.queryIndexLabel',
  queryIndexRadar: 'com.thfund.product.facade.service.IndexMapFacade.queryIndexRadar',
  // 替换新接口
  // indexChangeRate: 'com.thfund.product.facade.service.IndexMapFacade.indexChangeRate',
  indexChangeRate: 'com.thfund.product.facade.service.IndexMapFacade.indexChangeRateAndPoint',
  indexCompanyDynamic: 'com.thfund.product.facade.service.IndexMapFacade.indexCompanyDynamic',
  indexProductDynamic: 'com.thfund.product.facade.service.IndexMapFacade.indexProductDynamic',
  // 指数行业分类
  fetchIndexSortSys: 'com.thfund.product.facade.service.IndexMapFacade.fetchIndexSortSys',
  // 全赛道季频总规模折线图
  linearIndexSectorNav: 'com.thfund.product.facade.service.IndexMapFacade.linearIndexSectorNav',
  // 产品资产组合
  //资产列表查询
  queryComposePageList:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductComposeFacade.queryComposePageList',
  // 查询当前用户下该产品code对应的组合列表
  queryFundSelfDetails:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductComposeFacade.queryFundSelfDetails',
  //保存自定义组合信息
  saveUserManagerCompose:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductComposeFacade.saveUserManagerCompose',
  // 查询当前用户赛道下的组合列表显示
  queryTrackComposeList:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductComposeFacade.queryTrackComposeList',
  // 保存赛道
  saveNewTrackName:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductComposeFacade.saveNewTrackName',
  // 校验当前组合是否在其他赛道
  checkComposeTrack:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductComposeFacade.checkComposeTrack',
  // 保存赛道和组合的关系
  saveTrackComposes:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductComposeFacade.saveTrackComposes',
  // 删除赛道
  deleteTrack:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductComposeFacade.deleteTrack',
  // 删除赛道里面的组合
  deleteComposeTrackConfig:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductComposeFacade.deleteComposeTrackConfig',
  // 重置
  resetTrackComposes:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductComposeFacade.resetTrackComposes',
  // 更新组合信息
  updateUserManagerCompose:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductComposeFacade.updateUserManagerCompose',
  // 删除组合信息
  deleteUserManagerCompose:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductComposeFacade.deleteUserManagerCompose',
  //产品分类下拉列表
  queryProductCategoryDropDownList:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductComposeFacade.queryProductCategoryDropDownList',
  // 资产单元下拉列表
  queryAssetUnitDropDownList:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductComposeFacade.queryAssetUnitDropDownList',
  // 基金经理下拉
  queryFundManager:
    'com.thfund.product.facade.service.productanalyse.fundportal.ProductComposeFacade.queryFundManager',
  // 指数地图-top5市占率饼图
  queryFundNavTop5GroupByManage:
    'com.thfund.product.facade.service.IndexMapFacade.queryFundNavTop5GroupByManage',
  // 指数地图-资金规模客户规模柱状图
  queryProductScale: 'com.thfund.product.facade.service.IndexMapFacade.queryProductScale',
  // 指数地图-指数赛道中排名雷达图
  calThIndexSectorLatestRanking:
    'com.thfund.product.facade.service.IndexMapFacade.calThIndexSectorLatestRanking',
  // 赛道Top10
  queryFundNavAndHolderRankList:
    'com.thfund.product.facade.service.IndexMapFacade.queryFundNavAndHolderRankList',
  // 查询指数雷达信息二期改造
  queryIndexRadarDispatch: 'com.thfund.product.facade.service.IndexMapFacade.queryIndexRadar',

  /** 行业分类体系 */
  // 配置详情-获取证券分类
  querySecuritiesSortList:
    'com.thfund.product.facade.service.productanalyse.fundportal.SecuritiesIndustryFacadeService.querySecuritiesSortList',
  // 查询行业节点树
  querySysNodeList:
    'com.thfund.product.facade.service.productanalyse.fundportal.SecuritiesIndustryFacadeService.querySysNodeList',
  // 查询当前行业下的成员列表
  querySecuritiesSortedList:
    'com.thfund.product.facade.service.productanalyse.fundportal.SecuritiesIndustryFacadeService.querySecuritiesSortedList',
  // 获取证券体系类型对应的算法
  getSecuritiesSortAlgoList:
    'com.thfund.product.facade.service.productanalyse.fundportal.SecuritiesIndustryFacadeService.getSecuritiesSortAlgoList',
  // 保存证券体系对应算法
  saveSecuritiesSortAlgo:
    'com.thfund.product.facade.service.productanalyse.fundportal.SecuritiesIndustryFacadeService.saveSecuritiesSortAlgo',
  // 按算法分类当前体系
  triggerSortBySysId:
    'com.thfund.product.facade.service.productanalyse.fundportal.SecuritiesIndustryFacadeService.triggerSortBySysId',
  // 未分类-查询当前体系的算法
  getSecuritiesSortAlgoConfig:
    'com.thfund.product.facade.service.productanalyse.fundportal.SecuritiesIndustryFacadeService.getSecuritiesSortAlgoConfig',
  // 查询名称证券体系对应的行业
  getSecuritiesSortNodeList:
    'com.thfund.product.facade.service.productanalyse.fundportal.SecuritiesIndustryFacadeService.getSecuritiesSortNodeList',
  // 行业证券信息调入证券-查询目标证券
  fuzzyQueryTargetSecuritiesSort:
    'com.thfund.product.facade.service.productanalyse.fundportal.SecuritiesIndustryFacadeService.fuzzyQueryTargetSecuritiesSort',
  // 行业证券信息-调入证券
  moveIntoCurrentNode:
    'com.thfund.product.facade.service.productanalyse.fundportal.SecuritiesIndustryFacadeService.moveIntoCurrentNode',
  // 行业证券信息-删除当前分类结果
  delSecuritiesSortResult:
    'com.thfund.product.facade.service.productanalyse.fundportal.SecuritiesIndustryFacadeService.delSecuritiesSortResult',
  // 未分类股票-调入行业/行业调整
  moveIntoTargetNode:
    'com.thfund.product.facade.service.productanalyse.fundportal.SecuritiesIndustryFacadeService.moveIntoTargetNode',
  // 行业证券信息-批量行业调整/行业调整
  adjustSecuritiesSortResult:
    'com.thfund.product.facade.service.productanalyse.fundportal.SecuritiesIndustryFacadeService.adjustSecuritiesSortResult',
  // 获取证券体系跟踪行业体系对应的节点列表
  getTraceSecuritiesSortNodeList:
    'com.thfund.product.facade.service.productanalyse.fundportal.SecuritiesIndustryFacadeService.getTraceSecuritiesSortNodeList',
  // 查询跟踪指数
  getSecuritiesSortNodeTraceCode:
    'com.thfund.product.facade.service.productanalyse.fundportal.SecuritiesIndustryFacadeService.getSecuritiesSortNodeTraceCode',
  // 子行业体系分类-删除子行业
  delSecuritiesSortNode:
    'com.thfund.product.facade.service.productanalyse.fundportal.SecuritiesIndustryFacadeService.delSecuritiesSortNode',
  // 子行业体系分类-查询当前行业信息
  querySecuritiesSortNodeInfo:
    'com.thfund.product.facade.service.productanalyse.fundportal.SecuritiesIndustryFacadeService.querySecuritiesSortNodeInfo',
  // 子行业体系分类-新增子行业
  addSecuritiesSortNode:
    'com.thfund.product.facade.service.productanalyse.fundportal.SecuritiesIndustryFacadeService.addSecuritiesSortNode',
  // 子行业体系分类-修改子行业
  updateSecuritiesSortNode:
    'com.thfund.product.facade.service.productanalyse.fundportal.SecuritiesIndustryFacadeService.updateSecuritiesSortNode',
  querySecuritiesIndustryList:
    'com.thfund.product.facade.service.productanalyse.fundportal.SecuritiesIndustryFacadeService.querySecuritiesIndustryList',
  // 查询证券类型列表
  getSecurityTypes:
    'com.thfund.product.facade.service.productanalyse.fundportal.SecuritiesIndustryFacadeService.getSecurityTypes',
  // 根据证券类型查询跟踪的标准行业体系
  getStandardSecurityByType:
    'com.thfund.product.facade.service.productanalyse.fundportal.SecuritiesIndustryFacadeService.getStandardSecurityByType',
  // 新增证券行业体系
  addSecuritiesIndustry:
    'com.thfund.product.facade.service.productanalyse.fundportal.SecuritiesIndustryFacadeService.addSecuritiesIndustry',
  // .删除证券行业体系
  delSecuritiesIndustry:
    'com.thfund.product.facade.service.productanalyse.fundportal.SecuritiesIndustryFacadeService.delSecuritiesIndustry',
  // 复制证券行业体系
  copySecuritiesIndustry:
    'com.thfund.product.facade.service.productanalyse.fundportal.SecuritiesIndustryFacadeService.copySecuritiesIndustry',

  // ETF流程
  // 日常任务列表查询
  queryTaskList: 'com.thfund.poros.facade.api.PortalIndexManageFacade.queryTaskList',
  //任务详情查询
  queryTaskDetail: 'com.thfund.poros.facade.api.PortalIndexManageFacade.queryTaskDetail',
  //查询PCF运作流程进度
  queryPcfFlow: 'com.thfund.poros.facade.api.PortalIndexManageFacade.queryPcfFlow',
  //查询PCF运作流程详情
  queryPcfFlowDetail: 'com.thfund.poros.facade.api.PortalIndexManageFacade.queryPcfFlowDetail',
  //查询补券流程
  querySupplyBondFlow: 'com.thfund.poros.facade.api.PortalIndexManageFacade.querySupplyBondFlow',
  //查询补券文件
  querySupplyBondFile: 'com.thfund.poros.facade.api.PortalIndexManageFacade.querySupplyBondFile',
  // 查询补券指令下达
  querySupplyBondArrive:
    'com.thfund.poros.facade.api.PortalIndexManageFacade.querySupplyBondArrive',
  // 查询补券指令执行
  querySupplyBondExecute:
    'com.thfund.poros.facade.api.PortalIndexManageFacade.querySupplyBondExecute',

  // 指数基金大盘
  // 查询市场数据
  queryIndexFundMarketData: 'com.thfund.poros.facade.api.PortalIndexSeePlateFacade.queryMarketData',
  // 查询ETF日报
  queryIndexFundDailyReport:
    'com.thfund.poros.facade.api.PortalIndexSeePlateFacade.queryDailyReport',
  // 热门板块
  queryIndexFundHotPlate: 'com.thfund.poros.facade.api.PortalIndexSeePlateFacade.hotPlate',
  // 查询所有ETF指数基
  queryIndexFundAllEtfFunds: 'com.thfund.poros.facade.api.PortalIndexSeePlateFacade.allFundDetail',
  // 实时估值
  queryIndexFundEtfRealFaNav:
    'com.thfund.poros.facade.api.PortalIndexSeePlateFacade.queryEtfRealFaNav',
  // 全市场ETF资金流向
  queryIndexFundAllMarketCapital:
    'com.thfund.poros.facade.api.PortalIndexSeePlateFacade.queryAllMarketCapital',
  // 基金公司TOP数据
  queryIndexFundCompanyScaleTop:
    'com.thfund.poros.facade.api.PortalIndexSeePlateFacade.fundCompanyScaleTop',
  // 查询近一日ETF资金流入情况
  queryOneInflowAmount:
    'com.thfund.poros.facade.api.PortalIndexSeePlateFacade.queryOneInflowAmount',
  // 查询今年ETF资金流入情况
  queryThisYearInflowAmount:
    'com.thfund.poros.facade.api.PortalIndexSeePlateFacade.queryThisYearInflowAmount',
  // 查询最新ETF规模分布情况
  queryNewScaleAmount: 'com.thfund.poros.facade.api.PortalIndexSeePlateFacade.queryNewScaleAmount',
  // 我司ETF基金流动性
  thFundMobility: 'com.thfund.poros.facade.api.PortalIndexSeePlateFacade.thFundMobility',
  // 查询ETF行业分类
  queryIndustry: 'com.thfund.poros.facade.api.PortalIndexSeePlateFacade.queryIndustry',
  // 行业产品资金流向
  industryProductCapital:
    'com.thfund.poros.facade.api.PortalIndexSeePlateFacade.industryProductCapital',
  // 查询样本详情
  querySampleData: 'com.thfund.poros.facade.api.PortalIndexSeePlateFacade.querySampleData',
  // 查询链接基金持仓详情
  queryLinkFund: 'com.thfund.poros.facade.api.PortalIndexSeePlateFacade.queryLinkFund',

  // ETF资金监控
  // ETF份额规模只数
  queryEtfIndexInfoCondition:
    'com.thfund.product.facade.service.IndexEtfMapFacade.queryEtfIndexInfoCondition',
  // ETF类型
  queryEtfTypeList: 'com.thfund.product.facade.service.IndexEtfMapFacade.queryEtfTypeList',
  // 查询ETF场内资金监控
  queryEtfIndexInfoList:
    'com.thfund.product.facade.service.IndexEtfMapFacade.queryEtfIndexInfoList',
  // 折线图
  queryLineChartList: 'com.thfund.product.facade.service.IndexEtfMapFacade.queryLineChartList',
  // 指数分析
  queryEtfSortSys: 'com.thfund.product.facade.service.IndexEtfMapFacade.queryEtfSortSys',

  // 基金公司详情
  // 查询基金公司基础信息
  queryBaseInfo:
    'com.thfund.product.facade.service.saleinfo.fundcompany.FundCompanyDetailFacadeService.queryBaseInfo',
  // 查询基金公司基金经理信息列表
  queryFMPageList:
    'com.thfund.product.facade.service.saleinfo.fundcompany.FundCompanyDetailFacadeService.queryFMPageList',
  // 查询基金公司存续产品信息列表
  queryHoldFundPageList:
    'com.thfund.product.facade.service.saleinfo.fundcompany.FundCompanyDetailFacadeService.queryHoldFundPageList',
  // 查询基金公司新发产品信息列表
  queryNewFundPageList:
    'com.thfund.product.facade.service.saleinfo.fundcompany.FundCompanyDetailFacadeService.queryNewFundPageList',
  // 根据公司名称关键字模糊查询基金公司列表
  fuzzyQueryFundCompanyListByCompName:
    'com.thfund.product.facade.service.saleinfo.fundcompany.FundCompanyDetailFacadeService.fuzzyQueryFundCompanyListByCompName',

  // 基金索引
  // 参数及取值范围
  queryFundIndexParams: 'com.thfund.fundprodindexcore.facade.SearchFacadeService.fetchCols',
  // 查询数据
  queryFundIndexTableData: 'com.thfund.fundprodindexcore.facade.SearchFacadeService.search',
  // 列出查询方案
  queryFundIndexSolution:
    'com.thfund.fundprodindexcore.facade.SearchFacadeService.listQuerySolution',
  // 保存查询方案
  saveFundIndexSolution:
    'com.thfund.fundprodindexcore.facade.SearchFacadeService.saveQuerySolution',
  // 删除查询方案
  deleteFundIndexSolution:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundMarkFacade.deleteSolution',
  // 'com.thfund.fundprodindexcore.facade.SearchFacadeService.deleteQuerySolution',
  // 根据条件批量调入
  batchTransInByKeys:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundMarkFacade.oneKeyMarks',
  // 根据条件导出
  queryAllFundInfosExport:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundAllMarketFacade.queryAllFundInfosExport',
  exportFundInfosByFileid:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundAllMarketFacade.syncUploadFile',
  // 点击方案
  hitQuerySolution: 'com.thfund.fundprodindexcore.facade.SearchFacadeService.hitQuerySolution',
  // 基金产品、经理、公司模糊搜索联想补全
  fuzzySearch: 'com.thfund.fundprodindexcore.facade.SearchFacadeService.fuzzySearch',

  // 基金索引-方案管理
  // 查询方案列表
  querySolutionList: 'com.thfund.fundprodindexcore.facade.SolutionManagerFacade.querySolutionList',
  queryAllSolutionList:
    'com.thfund.fundprodindexcore.facade.SolutionManagerFacade.queryHomePageSolutionList',
  // 方案置顶
  querySolutionTop: 'com.thfund.fundprodindexcore.facade.SolutionManagerFacade.querySolutionTop',
  // 分享
  shareSolution: 'com.thfund.fundprodindexcore.facade.SolutionManagerFacade.shareDingTalkMsg',

  // 基金索引-列项和筛选项管理
  // 列项管理查询接口
  queryColList: 'com.thfund.fundprodindexcore.facade.SolutionManagerFacade.queryColList',
  // 列项筛选项顺序更新
  updateSortCols: 'com.thfund.fundprodindexcore.facade.SolutionManagerFacade.updateSortCols',
  // 列项筛选项回显
  queryFetCols: 'com.thfund.fundprodindexcore.facade.SolutionManagerFacade.queryFetCols',
  // 更新列项
  updateFetCols: 'com.thfund.fundprodindexcore.facade.SolutionManagerFacade.updateFetCols',

  // 参数表
  // 模糊查询基金
  queryByKeyword:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundParamFacadeService.queryByKeyword',
  // 基金参数表-查询公募基金(母基金)列表 分页接口
  queryPublicProductInfoList:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundParamFacadeService.queryPublicProductInfoList',
  // 基金参数表-查询公募基金(子基金)列表
  queryChildProductInfoList:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundParamFacadeService.queryChildProductInfoList',
  // 基金参数表-导出参数表生效版本excel和pdf
  exportExcelAndPdf:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundParamFacadeService.exportExcelAndPdf',
  // 查询基金参数表版本列表
  queryFundParamVersionList:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundParamFacadeService.queryFundParamVersionList',
  // 基金参数表-按id查询基金参数表详细信息
  queryFundParamInfo:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundParamFacadeService.queryFundParamInfo',
  // 基金参数表-一键复制
  copyFundParamInfo:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundParamFacadeService.copyFundParamInfo',
  // 失效基金参数表当前版本
  invalidFundParam:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundParamFacadeService.invalidFundParam',
  // 复核基金参数表并设置生效时间
  reviewFundParamInfo:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundParamFacadeService.reviewFundParamInfo',
  // 保存基金参数表提交信息 新增保存
  saveFundParamInfo:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundParamFacadeService.saveFundParamInfo',
  // 基金参数表-修改参数表信息
  updateFundParamInfo:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundParamFacadeService.updateFundParamInfo',
  // 根据id查状态
  queryStatusByVersionId:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundParamFacadeService.queryStatusByVersionId',
  // 基金代码批量导出
  batchExportByFundCodes:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundParamFacadeService.batchExportByFundCodes',
  // 基金参数表-批量导出参数表生效版本压缩包
  batchExportByFundIds:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundParamFacadeService.batchExportByFundIds',
  // 基金参数表-基金id查询参数表生效/将生效列表
  queryEffectVersionsByFundId:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundParamFacadeService.queryEffectVersionsByFundId',
  // 预览参数表
  previewPdfResult:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundParamFacadeService.previewPdfResult',
  // 导出参数表检查没有版本的基金
  checkInvalidExportFunds:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundParamFacadeService.checkInvalidExportFunds',
  // 全量导出参数表数据
  exportFundParamInfo:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundParamFacadeService.exportFundParamInfo',

  // 基金经理面板
  // 查询
  getByCode:
    'com.thfund.product.facade.service.fundmanager.FundManagerAllMktFacadeService.getByCode',
  // 管理的产品
  listManageProduct:
    'com.thfund.product.facade.service.fundmanager.FundManagerAllMktFacadeService.listManageProduct',
  // 产品类型
  queryProductTypeData:
    'com.thfund.product.facade.service.fundmanager.FundManagerAllMktFacadeService.queryProductTypeData',

  // 联系人
  // 查询联系人列表
  queryContactsList:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundParamFacadeService.queryContactsList',
  // 新增联系人
  addFundParamContacts:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundParamFacadeService.addFundParamContacts',
  // 修改联系人
  updateFundParamContacts:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundParamFacadeService.updateFundParamContacts',
  //  删除联系人
  delFundParamContacts:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundParamFacadeService.delFundParamContacts',

  // 全市场基金面板-基本信息
  queryAllMarketFundInfo:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundAllMarketFacade.queryAllMarketFundInfo',
  // 全市场基金面板-持仓分析-资产配置
  queryFundHoldSharesPercent:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundPkNetValueFacade.queryFundHoldSharesPercent',
  // 全市场基金面板-持仓分析-规模变动
  queryHistoryFundAssetAmt:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundPkNetValueFacade.queryHistoryFundAssetAmt',
  // 全市场基金面板-持仓分析-持有人结构
  queryFundHoldPercent:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundAllMarketFacade.queryFundHoldPercent',
  // 全市场基金面板-持仓分析-行业暴露
  queryFundNavRegIndusData:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundPkNetValueFacade.queryFundNavRegIndusData',
  // 全市场基金面板-持仓分析-择时&选股能力
  queryFundNavRegClModelData:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundPkNetValueFacade.queryFundNavRegClModelData',
  // 全市场基金面板-持仓分析-FF三因子模型
  queryFundDetailNavRegff3ModelData:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundPkNetValueFacade.queryFundDetailNavRegff3ModelData',
  // 全市场基金面板-持仓分析-基金仓位
  queryFundNavRegStockPosData:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundPkNetValueFacade.queryFundNavRegStockPosData',

  // 基金PK
  // 根据基金代码查询信息
  queryAllFundNameInfos:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundAllMarketFacade.queryAllFundNameInfos',
  // 基金特征Ai白话文
  queryFundVernacularArticle:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundPkNetValueFacade.queryFundVernacularArticle',
  // 年化回报
  queryFundPkAnnualizedReturn:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundPkNetValueFacade.queryFundPkAnnualizedReturn',
  // 区间收益和排名
  queryFundInterval:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundPkNetValueFacade.queryFundInterval',
  // 区间收益和排名 分类标准选项
  queryFundLevelIncomeRank:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundPkNetValueFacade.queryFundLevelIncomeRank',
  // 查询pk规模
  queryFundAssetAmt:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundPkNetValueFacade.queryFundAssetAmt',
  // 查询 历史近一年的规模/历史投资收益走势/历史净值走势
  queryHistoryFundAssetAmtPk:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundPkNetValueFacade.queryHistoryFundAssetAmt',
  // 三因子
  queryFundNavRegff3ModelDataPk:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundPkNetValueFacade.queryFundNavRegff3ModelData',
  // 持有人结构
  queryFundHoldPercentPk:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundPkNetValueFacade.queryFundHoldPercent',
  // 持仓分析-季报
  queryFundHoldSharesPercentPk:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundPkNetValueFacade.queryFundHoldSharesPercent',
  // 基金经理以及管理人
  queryFundManagerCompany:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundPkNetValueFacade.queryFundManagerCompany',
  // 行业分析
  queryFundNavRegIndusPkData:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundPkNetValueFacade.queryFundNavRegIndusPkData',
  // 基金仓位pk
  queryFundNavRegStockPosPkData:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundPkNetValueFacade.queryFundNavRegStockPosPkData',
  // 大盘胜率下拉选项
  querySearchFundMarketCondition:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundPkNetValueFacade.querySearchFundMarketCondition',
  // 大盘胜率
  queryFundMarketRate:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundPkNetValueFacade.queryFundMarketRate',
  // 比率
  queryAllMarketFundInfos:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundAllMarketFacade.queryAllMarketFundInfos',
  // 风险评估
  queryAllFundQuotaScoreData:
    'com.thfund.product.facade.service.productanalyse.netvalue.FundPkNetValueFacade.queryAllFundQuotaScoreData',

  // 基金经理PK-基本信息+管理经验
  fundManagerPK:
    'com.thfund.product.facade.service.fundmanager.FundManagerAllMktFacadeService.fundManagerPK',
  // 基金经理PK-管理规模走势，机构、个人用户占比
  fundManagerTrendChart:
    'com.thfund.product.facade.service.fundmanager.FundManagerAllMktFacadeService.fundManagerTrendChart',

  // 基金公司PK
  // 根据公司代码列表查询PK相关数据结果;
  queryFundCompanyPKListByCompCodes:
    'com.thfund.product.facade.service.saleinfo.fundcompany.FundCompanyPKFacadeService.queryFundCompanyPKListByCompCodes',

  /** 基金开户相关 */
  // 产品开户-查询开户申请列表 分页接口
  queryOpenAccountList:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenAccountFacadeService.queryOpenAccountList',
  // 产品开户-申请开户
  saveOpenAccountFlow:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenAccountFacadeService.saveOpenAccountFlow',
  // 产品开户-取消开户
  cancelOpenAccountFlow:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenAccountFacadeService.cancelOpenAccountFlow',
  // 产品开户-查询产品开户状态
  queryAccountStatusByFundId:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenAccountFacadeService.queryAccountStatusByFundId',
  // 产品开户-模糊查询项目经理/产品经理
  queryManagerByKeyword:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenAccountFacadeService.queryManagerByKeyword',
  // 产品开户-查询材料清单列表
  queryMaterialList:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenAccountFacadeService.queryMaterialList',
  // 产品开户-查询材料树
  queryMaterialTree:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenAccountFacadeService.queryMaterialTree',
  // 产品开户-查询开户材料列表
  queryPrepareMaterialList:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenAccountFacadeService.queryPrepareMaterialList',
  // 产品开户-根据基金代码/名称查询基金信息-母基金 公募以及专户
  queryProductInfo:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenAccountFacadeService.queryProductInfo',
  // 产品开户-查询文档对应表单内容
  queryTemplateFormData:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenAccountFacadeService.queryTemplateFormData',
  // 产品开户-保存文档对应表单内容
  saveTemplateFormData:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenAccountFacadeService.saveTemplateFormData',
  // 产品开户-预览文档-pdf格式
  previewOpenAccountMaterial:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenAccountFacadeService.previewOpenAccountMaterial',
  // 产品开户-完成准备材料
  completeOpenAccountMaterial:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenAccountFacadeService.completeOpenAccountMaterial',
  // 产品开户-查询人行备案列表
  queryBankRecordList:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenAccountFacadeService.queryBankRecordList',
  // 产品开户-查询产品开户类型列表
  queryAccountTypeEnumList:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenAccountFacadeService.queryAccountTypeEnumList',
  // 产品开户-复核文档内容
  reviewTemplateFormData:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenAccountFacadeService.reviewTemplateFormData',
  // 产品开户-查询复核内容
  queryReviewData:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenAccountFacadeService.queryReviewData',
  // 产品开户-上传复核文件
  uploadReviewFile:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenAccountFacadeService.uploadReviewFile',
  // 产品开户-完成人行备案
  completeBankRecord:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenAccountFacadeService.completeBankRecord',
  // 产品开户-查询账户类型
  queryAcctTypeReference:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenAccountFacadeService.queryAcctTypeReference',
  // 根据类型查询联系人
  queryContactsByType:
    'com.thfund.product.facade.service.CommonContactFacadeService.queryContactsByType',
  // 保存联系人
  saveContcat: 'com.thfund.product.facade.service.CommonContactFacadeService.saveContcat',
  // 更新联系人
  updateContcat: 'com.thfund.product.facade.service.CommonContactFacadeService.updateContcat',
  // 删除联系人
  deleteContact: 'com.thfund.product.facade.service.CommonContactFacadeService.deleteContact',

  // 宣推需求
  // 合规文库
  // 文库类型、影响类型下拉列表接口
  queryLibraryTypeList:
    'com.thfund.product.facade.service.productanalyse.netvalue.PlianceLibraryFacade.queryLibraryTypeList',
  // 查询
  queryComPlianceLibraryDataList:
    'com.thfund.product.facade.service.productanalyse.netvalue.PlianceLibraryFacade.queryComPlianceLibraryDataList',
  // 新增
  createComPlianceLibraryData:
    'com.thfund.product.facade.service.productanalyse.netvalue.PlianceLibraryFacade.createComPlianceLibraryData',
  // 更新
  updateComPlianceLibraryData:
    'com.thfund.product.facade.service.productanalyse.netvalue.PlianceLibraryFacade.updateComPlianceLibraryData',
  // 删除
  deleteComPlianceLibraryData:
    'com.thfund.product.facade.service.productanalyse.netvalue.PlianceLibraryFacade.deleteComPlianceLibraryData',

  // 基金宣推数据
  // 获奖信息
  queryFundCodeAwardinfoData:
    'com.thfund.product.facade.service.productanalyse.netvalue.AllFundInComeFacade.queryFundCodeAwardinfoData',
  // 收益趋势
  queryLastQuaryDay:
    'com.thfund.product.facade.service.productanalyse.netvalue.AllFundInComeFacade.queryLastQuaryDay',
  queryFundIncomeTrendData:
    'com.thfund.product.facade.service.productanalyse.netvalue.AllFundInComeFacade.queryFundIncomeTrendData',
  queryIncomeRateData:
    'com.thfund.product.facade.service.productanalyse.netvalue.AllFundInComeFacade.queryIncomeRateData',
  queryAllIncomeRateData:
    'com.thfund.product.facade.service.productanalyse.netvalue.AllFundInComeFacade.queryAllIncomeRateData',
  // 收益pk
  queryFundPerformanceInfos:
    'com.thfund.product.facade.service.productanalyse.netvalue.AllFundInComeFacade.queryFundPerformanceInfos',
  // 持有人柱状折线图
  queryFundShowIncomeInfos:
    'com.thfund.product.facade.service.productanalyse.netvalue.AllFundInComeFacade.queryFundShowIncomeInfos',

  // 投资范围
  queryFundCodeDividendInfos:
    'com.thfund.product.facade.service.productanalyse.netvalue.AllFundInComeFacade.queryFundCodeDividendInfos',

  //宣推风险
  // 风险提示回显接口
  queryRiskStatementData:
    'com.thfund.product.facade.service.productanalyse.netvalue.AllFundInComeFacade.queryRiskStatementData',
  // 风险提示保存接口
  saveRiskStatementData:
    'com.thfund.product.facade.service.productanalyse.netvalue.AllFundInComeFacade.saveRiskStatementData',

  // 查询展位
  queryComPlianceLibraryBoothIdData:
    'com.thfund.product.facade.service.productanalyse.netvalue.PlianceLibraryFacade.queryComPlianceLibraryBoothIdData',

  // 公司宣推数据
  // 获奖信息
  queryCompanyAwardinfoLine:
    'com.thfund.product.facade.service.productanalyse.netvalue.AllCompanyIncomeFacade.queryCompanyAwardinfoLine',
  queryCompanyAwardinfoData:
    'com.thfund.product.facade.service.productanalyse.netvalue.AllCompanyIncomeFacade.queryCompanyAwardinfoData',
  // 规模
  queryCompanyScaleData:
    'com.thfund.product.facade.service.productanalyse.netvalue.AllCompanyIncomeFacade.queryCompanyScaleData',
  queryCompanyTrendData:
    'com.thfund.product.facade.service.productanalyse.netvalue.AllCompanyIncomeFacade.queryCompanyTrendData',
  queryCompanyHoldData:
    'com.thfund.product.facade.service.productanalyse.netvalue.AllCompanyIncomeFacade.queryCompanyHoldData',
  // 查询基金公司基础信息卡片
  queryCompanyScaleQuarterData:
    'com.thfund.product.facade.service.productanalyse.netvalue.AllCompanyIncomeFacade.queryCompanyScaleQuarterData',
  // 近十年基金业绩
  queryRecentYearsIncomeData:
    'com.thfund.product.facade.service.productanalyse.netvalue.AllFundInComeFacade.queryRecentYearsIncomeData',
  // 宣推数据中的基金经理列表
  queryManagerDetail:
    'com.thfund.product.facade.service.productanalyse.netvalue.AllFundInComeFacade.queryManagerDetail',
  // 宣推数据排行
  queryFundEvaluateData:
    'com.thfund.product.facade.service.productanalyse.netvalue.AllFundInComeFacade.queryFundEvaluateData',

  // o3参数表
  // 获取全部产品实例信息
  queryAllExample:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundTopicTemplateService.queryAllExample',
  // 根据基金代码查询基金全称
  getFundInfoByCode:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundTopicTemplateService.getFundInfoByCode',
  // 新增实例信息
  createExample:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundTopicTemplateService.createExample',
  // 数据同步
  makeExampleByFundCode:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundTopicTemplateService.makeExampleByFundCode',
  // 获取单个实例信息
  queryExampleByFundId:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundTopicTemplateService.queryExampleByFundId',
  // 修改产品实例信息接口
  updateExample:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundTopicTemplateService.updateExample',
  // 修改状态
  updateState:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundTopicTemplateService.updateState',
  // excel下载接口
  downloadExcel:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundTopicTemplateService.downloadExcel',
  // 获取发送邮件信息
  getEmailInfo:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundTopicTemplateService.getEmailInfo',
  // 查询用户邮件地址接口
  queryUserEmail:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundTopicTemplateService.queryUserEmail',
  // 发送邮件
  sendEmail:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundTopicTemplateService.sendEmail',
  // o3筛选框基金模糊搜索
  queryByKeywordByExample:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundTopicTemplateService.queryByKeyword',
  // 指数权重
  // 查询盘中实时权重数据
  daily: 'com.thfund.poros.facade.api.IndexWeightFacade.queryDaily',
  // 查询历史权重数据
  history: 'com.thfund.poros.facade.api.IndexWeightFacade.queryHistory',

  //尾佣
  queryCareFeePage:
    'com.thfund.product.facade.service.confcenter.agency.ConfCenterCareFeeFacadeService.queryCareFeePage',
  //代销商列表
  queryDis:
    'com.thfund.product.facade.service.confcenter.agency.ConfCenterCareFeeFacadeService.queryDis',
  //基金列表查询
  queryCareFeeFundInfo:
    'com.thfund.product.facade.service.confcenter.agency.ConfCenterCareFeeFacadeService.queryCareFeeFundInfo',
  //删除尾佣
  delCareFee:
    'com.thfund.product.facade.service.confcenter.agency.ConfCenterCareFeeFacadeService.delCareFee',
  //新增尾佣
  addCareFee:
    'com.thfund.product.facade.service.confcenter.agency.ConfCenterCareFeeFacadeService.addCareFee',
  //更新尾佣
  updateCareFee:
    'com.thfund.product.facade.service.confcenter.agency.ConfCenterCareFeeFacadeService.updateCareFee',
  //导出
  exportCareFee:
    'com.thfund.product.facade.service.confcenter.agency.ConfCenterCareFeeFacadeService.exportCareFee',
  // 指数参数配置
  // 查询指数新规配置项
  queryComplianceConfigList:
    'com.thfund.product.facade.service.IndexInfoFacadeService.queryComplianceConfigList',
  // 更新指数新规配置项
  updateComplianceConfig:
    'com.thfund.product.facade.service.IndexInfoFacadeService.updateComplianceConfig',
  // 查询个性化热力图权重配置
  getIndexHotMapUserWeights:
    'com.thfund.product.facade.service.IndexMapFacade.getIndexHotMapUserWeights',
  // 保存个性化热力图权重配置
  addOrUpdateIndexHotMapUserWeights:
    'com.thfund.product.facade.service.IndexMapFacade.addOrUpdateIndexHotMapUserWeights',

  // 公募产品变动管理
  // 根据基金状态查询基金信息 分页接口--管理用
  queryProductInfoListForManage:
    'com.thfund.product.facade.service.productanalyse.fundportal.PublicFundManageFacadeService.queryProductInfoListForManage',
  // 产品审核政策列表
  queryProductExamineList:
    'com.thfund.product.facade.service.productanalyse.fundportal.PublicFundManageFacadeService.queryProductExamineList',
  // 新增基金产品信息
  addProductInfo:
    'com.thfund.product.facade.service.productanalyse.fundportal.PublicFundManageFacadeService.addProductInfo',
  // 新增基金审核政策
  addProductExaminePolicy:
    'com.thfund.product.facade.service.productanalyse.fundportal.PublicFundManageFacadeService.addProductExaminePolicy',
  // 删除基金审核政策
  delProductExaminePolicy:
    'com.thfund.product.facade.service.productanalyse.fundportal.PublicFundManageFacadeService.delProductExaminePolicy',
  // 修改基金审核政策
  updateProductExaminePolicy:
    'com.thfund.product.facade.service.productanalyse.fundportal.PublicFundManageFacadeService.updateProductExaminePolicy',
  // 修改基金产品信息
  updateProductInfo:
    'com.thfund.product.facade.service.productanalyse.fundportal.PublicFundManageFacadeService.updateProductInfo',
  //席位管理
  // 席位-根据流程id查OA信息
  queryOASeatByProcessId:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenSeatFacadeService.queryOASeatByProcessId',
  // 席位-查询席位户申请列表
  queryOpenSeatList:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenSeatFacadeService.queryOpenSeatList',
  // 席位-取消开席位户
  cancelOpenSeatFlow:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenSeatFacadeService.cancelOpenSeatFlow',
  // 席位-查询席位上传列表
  queryUploadList:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenSeatFacadeService.queryUploadList',
  // 席位-获取弘存所有席位信息
  queryOtcSeatInfos:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenSeatFacadeService.queryOtcSeatInfos',
  // 席位-申请开席位户
  saveOpenSeatFlow:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenSeatFacadeService.saveOpenSeatFlow',
  // 席位-完成准备材料
  completeOpenSeatMaterial:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenSeatFacadeService.completeOpenSeatMaterial',
  // 席位-查询材料树
  querySeatMaterialTree:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenSeatFacadeService.queryMaterialTree',
  // 席位-查询材料清单列表
  querySeatMaterialList:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenSeatFacadeService.queryMaterialList',
  // 席位-预览文档-pdf格式
  previewOpenSeatMaterial:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenSeatFacadeService.previewOpenSeatMaterial',
  // 席位-查询文档对应表单内容
  querySeatTemplateFormData:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenSeatFacadeService.queryTemplateFormData',
  // 席位-保存文档对应表单内容
  saveSeatTemplateFormData:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenSeatFacadeService.saveTemplateFormData',
  // 席位-查询复核内容
  querySeatReviewData:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenSeatFacadeService.queryReviewData',
  // 席位-复核文档对应表单内容
  reviewSeatTemplateFormData:
    'com.thfund.product.facade.service.productanalyse.fundportal.OpenSeatFacadeService.reviewTemplateFormData',
};
