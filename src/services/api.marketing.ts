export default {
  /** 渠道分布 */
  queryChannelList:
    'com.thfund.sales.fundsalesbi.facade.agency.AgencySummaryFacade.queryAgencyListByPage',
  queryAgencyAssetConfig:
    'com.thfund.sales.fundsalesbi.facade.agency.AgencyTradeDetailFacade.queryAgencyAssetConfig',
  queryAgencyPurchaseConfig:
    'com.thfund.sales.fundsalesbi.facade.agency.AgencyTradeDetailFacade.queryAgencyPurchaseConfig',
  queryAgencyList:
    'com.thfund.sales.fundsalesbi.facade.agency.AgencyTradeDetailFacade.queryAgencyListByPage',
  queryAgencyStockAmt:
    'com.thfund.sales.fundsalesbi.facade.agency.AgencyTradeDetailFacade.queryAgencyStockAmtByDay',
  queryAgencyFundList:
    'com.thfund.sales.fundsalesbi.facade.agency.AgencyTradeDetailFacade.queryAgencyFundTradeInfo',
  queryFundAllocationList:
    'com.thfund.sales.fundsalesbi.facade.agency.AgencyTradeDetailFacade.queryAgencyVogTradeInfo',
  queryAgencyTotalStatistics:
    'com.thfund.sales.fundsalesbi.facade.agency.AgencyTradeDetailFacade.queryAgencyTotalStatistics',
  queryAgencyTotalKindStatistics:
    'com.thfund.sales.fundsalesbi.facade.agency.AgencyTradeDetailFacade.queryAgencyTotalKindStatistics',
  queryAgencyBasicInfo:
    'com.thfund.sales.fundsalesbi.facade.agency.AgencyTradeDetailFacade.queryAgencyInfoByAgencyCode',
  queryAgencyTotalAssetConfig:
    'com.thfund.sales.fundsalesbi.facade.agency.AgencyTradeDetailFacade.queryAgencyTotalAssetConfig',

  /** 基金产品 */
  queryFundList:
    'com.thfund.sales.fundsalesbi.facade.product.FundSummaryFacade.queryFundListByPage',
  queryFundTableInfo:
    'com.thfund.sales.fundsalesbi.facade.product.FundTradeDetailFacade.queryFundByMulDate',
  queryFundChartInfo:
    'com.thfund.sales.fundsalesbi.facade.product.FundTradeDetailFacade.queryFundStockAmtByDay',
  queryCastSurelyLineInfo:
    'com.thfund.sales.fundsalesbi.facade.product.FundAgencyFixInvestFacade.queryFundInvestByAco',
  queryCastSurelyTableList:
    'com.thfund.sales.fundsalesbi.facade.product.FundAgencyFixInvestFacade.queryFundInvestDetail',
  queryChannelTableList:
    'com.thfund.sales.fundsalesbi.facade.product.FundTradeDetailFacade.queryFundAgencyInfo',
  queryFundProfitability:
    'com.thfund.sales.fundsalesbi.facade.product.FundTradeDetailFacade.queryFundProfitabilityByFundCode',
  queryFundIncomeRate:
    'com.thfund.sales.fundsalesbi.facade.product.FundTradeDetailFacade.queryFundIncomeRateByFundCode',
  queryAgencyByName:
    'com.thfund.sales.fundsalesbi.facade.agency.AgencyTradeDetailFacade.queryAgencyByNameLike',
  queryBIproductInfo:
    // 'com.thfund.product.facade.service.productpanorama.ProductPanoramaFacadeService.getFundInfo',
    'com.thfund.sales.fundsalesbi.facade.product.FundTradeDetailFacade.queryFundBasicInfoByFundCode',
  queryFundByNameLike:
    'com.thfund.sales.fundsalesbi.facade.product.FundTradeDetailFacade.queryFundByNameLike',

  /** 首页 */
  queryStatisticCardInfo:
    'com.thfund.sales.fundsalesbi.facade.company.CorpTradeDetailFacade.queryTradeAccum',
  queryStatisticChartsInfo:
    'com.thfund.sales.fundsalesbi.facade.company.CorpTradeDetailFacade.queryTradeDetail',
  queryCorpIntervalAmt:
    'com.thfund.sales.fundsalesbi.facade.company.CorpTradeDetailFacade.queryCorpIntervalAmt',
  queryFundInterval:
    'com.thfund.sales.fundsalesbi.facade.company.CorpTradeDetailFacade.queryFundInterval',
  queryFundDayInterval:
    'com.thfund.sales.fundsalesbi.facade.company.CorpTradeDetailFacade.queryFundDayInterval',
  queryFundIntervalTradeInfo:
    'com.thfund.sales.fundsalesbi.facade.product.FundSummaryFacade.queryFundIntervalTradeInfo',
  queryAgencyIntervalTrade:
    'com.thfund.sales.fundsalesbi.facade.agency.AgencySummaryFacade.queryAgencyIntervalTrade',
  queryVogAmt: 'com.thfund.sales.fundsalesbi.facade.agency.AgencyTradeDetailFacade.queryVogAmt',
  statisticsFundByVogType:
    'com.thfund.sales.fundsalesbi.facade.product.FundTradeDetailFacade.statisticsFundByVogType',
  queryAppIndicators:
    'com.thfund.sales.fundsalesbi.facade.company.CorpTradeDetailFacade.queryAppDsIndicators',
  queryFundCalendar: 'com.thfund.sales.fundsalesbi.facade.config.queryFundCalendar',

  /** 理财师挑战赛 赛区*/
  queryDivision:
    'com.thfund.sales.fundsalesmrksupport.facade.background.DivisionBgFacade.queryDivision',
  addDivision:
    'com.thfund.sales.fundsalesmrksupport.facade.background.DivisionBgFacade.addDivision',
  updateDivision:
    'com.thfund.sales.fundsalesmrksupport.facade.background.DivisionBgFacade.updateDivision',
  deleteDivision:
    'com.thfund.sales.fundsalesmrksupport.facade.background.DivisionBgFacade.deleteDivision',
  /** 理财师挑战赛 赛区配置*/
  addDivisionConfig:
    'com.thfund.sales.fundsalesmrksupport.facade.background.DivisionBgFacade.addDivisionConfig',
  deleteDivisionConfig:
    'com.thfund.sales.fundsalesmrksupport.facade.background.DivisionBgFacade.deleteDivisionConfig',
  updateDivisionConfig:
    'com.thfund.sales.fundsalesmrksupport.facade.background.DivisionBgFacade.updateDivisionConfig',
  queryDivisionConfig:
    'com.thfund.sales.fundsalesmrksupport.facade.background.DivisionBgFacade.queryDivisionConfig',
  /** 理财师挑战赛 赛季接口*/
  addSeason: 'com.thfund.sales.fundsalesmrksupport.facade.background.SeasonBgFacade.addSeason',
  deleteSeason:
    'com.thfund.sales.fundsalesmrksupport.facade.background.SeasonBgFacade.deleteSeason',
  updateSeason:
    'com.thfund.sales.fundsalesmrksupport.facade.background.SeasonBgFacade.updateSeason',
  querySeason: 'com.thfund.sales.fundsalesmrksupport.facade.background.SeasonBgFacade.querySeason',
  querySeasonByDivisionId:
    'com.thfund.sales.fundsalesmrksupport.facade.background.SeasonBgFacade.querySeasonByDivisionId',

  addAgency:
    'com.thfund.sales.fundsalesmrksupport.facade.background.AgencyAndDptBgFacade.addAgency',
  deleteAgency:
    'com.thfund.sales.fundsalesmrksupport.facade.background.AgencyAndDptBgFacade.deleteAgency',
  updateAgency:
    'com.thfund.sales.fundsalesmrksupport.facade.background.AgencyAndDptBgFacade.updateAgency',
  queryAgency:
    'com.thfund.sales.fundsalesmrksupport.facade.background.AgencyAndDptBgFacade.queryAgency',
  addDpt: 'com.thfund.sales.fundsalesmrksupport.facade.background.AgencyAndDptBgFacade.addDpt',
  deleteDpt:
    'com.thfund.sales.fundsalesmrksupport.facade.background.AgencyAndDptBgFacade.deleteDpt',
  updateDpt:
    'com.thfund.sales.fundsalesmrksupport.facade.background.AgencyAndDptBgFacade.updateDpt',
  queryDpt: 'com.thfund.sales.fundsalesmrksupport.facade.background.AgencyAndDptBgFacade.queryDpt',
  queryAgencyByDivisionId:
    'com.thfund.sales.fundsalesmrksupport.facade.background.AgencyAndDptBgFacade.queryAgencyByDivisionId',

  addSubBranch:
    'com.thfund.sales.fundsalesmrksupport.facade.background.AgencyAndDptBgFacade.addSubBranch',
  deleteSubBranch:
    'com.thfund.sales.fundsalesmrksupport.facade.background.AgencyAndDptBgFacade.deleteSubBranch',
  updateSubBranch:
    'com.thfund.sales.fundsalesmrksupport.facade.background.AgencyAndDptBgFacade.updateSubBranch',
  querySubBranch:
    'com.thfund.sales.fundsalesmrksupport.facade.background.AgencyAndDptBgFacade.querySubBranch',
  queryNetBranch:
    'com.thfund.sales.fundsalesmrksupport.facade.background.AgencyAndDptBgFacade.queryNetBranch',
  queryInfoByParentId:
    'com.thfund.sales.fundsalesmrksupport.facade.background.AgencyAndDptBgFacade.queryInfoByParentId',
  getMrkOssConfig:
    'com.thfund.sales.fundsalesmrksupport.facade.background.OssConfigBgFacade.getOssConfig',
  // 理财师文案配置模块
  addCopyRules:
    'com.thfund.sales.fundsalesmrksupport.facade.background.CopyRulesBgFacade.addCopyRules',
  deleteCopyRules:
    'com.thfund.sales.fundsalesmrksupport.facade.background.CopyRulesBgFacade.deleteCopyRules',
  updateCopyRules:
    'com.thfund.sales.fundsalesmrksupport.facade.background.CopyRulesBgFacade.updateCopyRules',
  queryCopyRules:
    'com.thfund.sales.fundsalesmrksupport.facade.background.CopyRulesBgFacade.queryCopyRules',
  // 理财师物料配置模块
  addMaterials:
    'com.thfund.sales.fundsalesmrksupport.facade.background.MaterialsBgFacade.addMaterials',
  deleteMaterials:
    'com.thfund.sales.fundsalesmrksupport.facade.background.MaterialsBgFacade.deleteMaterials',
  updateMaterials:
    'com.thfund.sales.fundsalesmrksupport.facade.background.MaterialsBgFacade.updateMaterials',
  queryMaterials:
    'com.thfund.sales.fundsalesmrksupport.facade.background.MaterialsBgFacade.queryMaterials',
  // 理财师开奖配置模块
  addPrizeConfig:
    'com.thfund.sales.fundsalesmrksupport.facade.background.PrizeConfigBgFacade.addPrizeConfig',
  deletePrizeConfig:
    'com.thfund.sales.fundsalesmrksupport.facade.background.PrizeConfigBgFacade.deletePrizeConfig',
  updatePrizeConfig:
    'com.thfund.sales.fundsalesmrksupport.facade.background.PrizeConfigBgFacade.updatePrizeConfig',
  queryPrizeConfig:
    'com.thfund.sales.fundsalesmrksupport.facade.background.PrizeConfigBgFacade.queryPrizeConfig',

  queryChallengeCommonProduct:
    'com.thfund.sales.fundsalesmrksupport.facade.background.CommonBgFacade.queryChallengeCommonProduct',
  addChallengeCommonProduct:
    'com.thfund.sales.fundsalesmrksupport.facade.background.CommonBgFacade.addChallengeCommonProduct',
  updateChallengeCommonProduct:
    'com.thfund.sales.fundsalesmrksupport.facade.background.CommonBgFacade.updateChallengeCommonProduct',
  deleteChallengeCommonProduct:
    'com.thfund.sales.fundsalesmrksupport.facade.background.CommonBgFacade.deleteChallengeCommonProduct',

  addProduct: 'com.thfund.sales.fundsalesmrksupport.facade.background.DivisionBgFacade.addProduct',
  deleteDivisionProduct:
    'com.thfund.sales.fundsalesmrksupport.facade.background.DivisionBgFacade.deleteDivisionProduct',
  updateProduct:
    'com.thfund.sales.fundsalesmrksupport.facade.background.DivisionBgFacade.updateProduct',
  queryProducts:
    'com.thfund.sales.fundsalesmrksupport.facade.background.DivisionBgFacade.queryProducts',

  querySalesUserInfo:
    'com.thfund.sales.fundsalesmrksupport.facade.background.UserInfoBgFacade.querySalesUserInfo',
  deleteSalesUserInfo:
    'com.thfund.sales.fundsalesmrksupport.facade.background.UserInfoBgFacade.deleteSalesUserInfo',
  updateSalesUserInfo:
    'com.thfund.sales.fundsalesmrksupport.facade.background.UserInfoBgFacade.updateSalesUserInfo',

  /** 机构服务后台 */
  // 基金经理模块
  queryFundManagerInfo:
    'com.thfund.sales.fundsalescrm.facade.background.fund.FundManagerInfoBgFacade.queryFundManagerInfo',
  addFundManagerInfo:
    'com.thfund.sales.fundsalescrm.facade.background.fund.FundManagerInfoBgFacade.addFundManagerInfo',
  updateFundManagerInfo:
    'com.thfund.sales.fundsalescrm.facade.background.fund.FundManagerInfoBgFacade.updateFundManagerInfo',
  deleteFundManagerInfo:
    'com.thfund.sales.fundsalescrm.facade.background.fund.FundManagerInfoBgFacade.deleteFundManagerInfo',
  //产品推荐
  queryAllProductRecommendInfo:
    'com.thfund.sales.fundsalescrm.facade.background.product.ProductRecommendInfoBgFacade.queryAllProductRecommendInfo',
  getVogTypeList:
    'com.thfund.sales.fundsalescrm.facade.background.product.ProductRecommendInfoBgFacade.getVogTypeList',
  addProductRecommendInfo:
    'com.thfund.sales.fundsalescrm.facade.background.product.ProductRecommendInfoBgFacade.addProductRecommendInfo',
  updateProductRecommendInfo:
    'com.thfund.sales.fundsalescrm.facade.background.product.ProductRecommendInfoBgFacade.updateProductRecommendInfo',
  deleteProductRecommendInfo:
    'com.thfund.sales.fundsalescrm.facade.background.product.ProductRecommendInfoBgFacade.deleteProductRecommendInfo',
  // 基金经理信息列表
  queryAllFundManagerViewpoint:
    'com.thfund.sales.fundsalescrm.facade.background.fund.FundManagerViewpointBgFacade.queryAllFundManagerViewpoint',
  addFundManagerViewpoint:
    'com.thfund.sales.fundsalescrm.facade.background.fund.FundManagerViewpointBgFacade.addFundManagerViewpoint',
  updateFundManagerViewpoint:
    'com.thfund.sales.fundsalescrm.facade.background.fund.FundManagerViewpointBgFacade.updateFundManagerViewpoint',
  deleteFundManagerViewpoint:
    'com.thfund.sales.fundsalescrm.facade.background.fund.FundManagerViewpointBgFacade.deleteFundManagerViewpoint',
  // 策略会
  queryAllStrategyMeeting:
    'com.thfund.sales.fundsalescrm.facade.background.strategy.StrategyMeetingBgFacade.queryAllStrategyMeeting',
  getMeetingTypeList:
    'com.thfund.sales.fundsalescrm.facade.background.strategy.StrategyMeetingBgFacade.getMeetingTypeList',
  addStrategyMeeting:
    'com.thfund.sales.fundsalescrm.facade.background.strategy.StrategyMeetingBgFacade.addStrategyMeeting',
  updateStrategyMeeting:
    'com.thfund.sales.fundsalescrm.facade.background.strategy.StrategyMeetingBgFacade.updateStrategyMeeting',
  deleteStrategyMeeting:
    'com.thfund.sales.fundsalescrm.facade.background.strategy.StrategyMeetingBgFacade.deleteStrategyMeeting',
  // 静态资源图标
  queryPageIcons:
    'com.thfund.sales.fundsalescrm.facade.background.configuration.PageStaticResourceBgFacade.queryPageIcons',
  addPageIcon:
    'com.thfund.sales.fundsalescrm.facade.background.configuration.PageStaticResourceBgFacade.addPageIcon',
  updatePageIcon:
    'com.thfund.sales.fundsalescrm.facade.background.configuration.PageStaticResourceBgFacade.updatePageIcon',
  deleteIcons:
    'com.thfund.sales.fundsalescrm.facade.background.configuration.PageStaticResourceBgFacade.deleteIcons',
  queryPageIconTypeDesc:
    'com.thfund.sales.fundsalescrm.facade.background.configuration.PageStaticResourceBgFacade.queryPageIconTypeDesc',
  queryPageIconSkipTypeDesc:
    'com.thfund.sales.fundsalescrm.facade.background.configuration.PageStaticResourceBgFacade.queryPageIconSkipTypeDesc',
  updatePageIconOrder:
    'com.thfund.sales.fundsalescrm.facade.background.configuration.PageStaticResourceBgFacade.updatePageIconOrder',
  //市场观点
  queryMarketViewPoint:
    'com.thfund.sales.fundsalescrm.facade.background.configuration.PageStaticResourceBgFacade.queryMarketViewPoint',
  addMarketViewPoint:
    'com.thfund.sales.fundsalescrm.facade.background.configuration.PageStaticResourceBgFacade.addMarketViewPoint',
  updateMarketViewPoint:
    'com.thfund.sales.fundsalescrm.facade.background.configuration.PageStaticResourceBgFacade.updateMarketViewPoint',
  deleteMarketViewPoint:
    'com.thfund.sales.fundsalescrm.facade.background.configuration.PageStaticResourceBgFacade.deleteMarketViewPoint',
  queryMarketViewPointTypeDesc:
    'com.thfund.sales.fundsalescrm.facade.background.configuration.PageStaticResourceBgFacade.queryMarketViewPointTypeDesc',
  //模块标题
  queryModuleTitleConfig:
    'com.thfund.sales.fundsalescrm.facade.background.configuration.PageStaticResourceBgFacade.queryModuleTitleConfig',
  addModuleTitleConfig:
    'com.thfund.sales.fundsalescrm.facade.background.configuration.PageStaticResourceBgFacade.addModuleTitleConfig',
  updateModuleTitleConfig:
    'com.thfund.sales.fundsalescrm.facade.background.configuration.PageStaticResourceBgFacade.updateModuleTitleConfig',
  deleteModuleTitleConfig:
    'com.thfund.sales.fundsalescrm.facade.background.configuration.PageStaticResourceBgFacade.deleteModuleTitleConfig',
  queryModuleTitlePageTypeDesc:
    'com.thfund.sales.fundsalescrm.facade.background.configuration.PageStaticResourceBgFacade.queryModuleTitlePageTypeDesc',
  queryModuleTitleModuleTypeDesc:
    'com.thfund.sales.fundsalescrm.facade.background.configuration.PageStaticResourceBgFacade.queryModuleTitleModuleTypeDesc',
  queryModuleTitleTitleTypeDesc:
    'com.thfund.sales.fundsalescrm.facade.background.configuration.PageStaticResourceBgFacade.queryModuleTitleTitleTypeDesc',
  // 机构信息
  queryAgencyInfo:
    'com.thfund.sales.fundsalescrm.facade.background.agency.AgencyInfoBgFacade.queryAgencyInfo',
  addAgencyInfo:
    'com.thfund.sales.fundsalescrm.facade.background.agency.AgencyInfoBgFacade.addAgencyInfo',
  updateAgencyInfo:
    'com.thfund.sales.fundsalescrm.facade.background.agency.AgencyInfoBgFacade.updateAgencyInfo',
  // 部门信息列表
  queryAgencyDeptInfo:
    'com.thfund.sales.fundsalescrm.facade.background.agency.AgencyDeptInfoBgFacade.queryAgencyDeptInfo',
  addAgencyDeptInfo:
    'com.thfund.sales.fundsalescrm.facade.background.agency.AgencyDeptInfoBgFacade.addAgencyDeptInfo',
  updateAgencyDeptInfo:
    'com.thfund.sales.fundsalescrm.facade.background.agency.AgencyDeptInfoBgFacade.updateAgencyDeptInfo',
  deleteAgencyDeptInfo:
    'com.thfund.sales.fundsalescrm.facade.background.agency.AgencyDeptInfoBgFacade.deleteAgencyDeptInfo',
  queryDeptInfoByAgencyNo:
    'com.thfund.sales.fundsalescrm.facade.background.agency.AgencyDeptInfoBgFacade.queryDeptInfoByAgencyNo',
  //同行动态
  queryPeerDynamicState:
    'com.thfund.sales.fundsalescrm.facade.background.configuration.PageStaticResourceBgFacade.queryPeerDynamicState',
  addPeerDynamicState:
    'com.thfund.sales.fundsalescrm.facade.background.configuration.PageStaticResourceBgFacade.addPeerDynamicState',
  updatePeerDynamicState:
    'com.thfund.sales.fundsalescrm.facade.background.configuration.PageStaticResourceBgFacade.updatePeerDynamicState',
  deletePeerDynamicState:
    'com.thfund.sales.fundsalescrm.facade.background.configuration.PageStaticResourceBgFacade.deletePeerDynamicState',
  // 用户信息
  queryUserInfo:
    'com.thfund.sales.fundsalescrm.facade.background.user.UserInfoBgFacade.queryUserInfo',
  userInfoConfig:
    'com.thfund.sales.fundsalescrm.facade.background.user.UserInfoBgFacade.userInfoConfig',
  userInfoConfigUpdate:
    'com.thfund.sales.fundsalescrm.facade.background.user.UserInfoBgFacade.userInfoConfigUpdate',
  // 用户信息绑定户名
  getInvestorNameByAgencyName:
    'com.thfund.sales.fundsalescrm.facade.background.user.UserInfoBgFacade.getInvestorNameByAgencyName',
  queryUserInfoInvestorName:
    'com.thfund.sales.fundsalescrm.facade.background.user.UserInvestorNameBgFacade.queryUserInfoInvestorName',
  updateUserInfoInvestorName:
    'com.thfund.sales.fundsalescrm.facade.background.user.UserInvestorNameBgFacade.updateUserInfoInvestorName',
  // 用户关联关系
  getUserInfoByType:
    'com.thfund.sales.fundsalescrm.facade.background.user.UserInfoBgFacade.getUserInfoByType',
  queryUserRelation:
    'com.thfund.sales.fundsalescrm.facade.background.user.UserRelationBgFacade.queryUserRelation',
  userRelationConfig:
    'com.thfund.sales.fundsalescrm.facade.background.user.UserRelationBgFacade.userRelationConfig',
  //上传获取OSS配置
  getOssConfig:
    'com.thfund.sales.fundsalescrm.facade.background.oss.OssConfigBgFacade.getOssConfig',
  /*移动理财CRM*/
  queryCertificateTypeList:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.AdvisorCustomerInfoQueryFacade.queryCertificateTypeList',
  advisorQueryUserInfoList:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.AdvisorCustomerInfoQueryFacade.advisorQueryUserInfoList',
  advisorQueryUserInfoByThUserId:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.AdvisorCustomerInfoQueryFacade.advisorQueryUserInfoByThUserId',
  advisorQueryUserRemarkInfoByThUserId:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.AdvisorCustomerInfoQueryFacade.advisorQueryUserRemarkInfoByThUserId',
  advisorQueryUserAssetsDetails:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.AdvisorCustomerInfoQueryFacade.advisorQueryUserAssetsDetails',
  advisorQueryUserTransactionRecord:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.AdvisorCustomerInfoQueryFacade.advisorQueryUserTransactionRecord',
  updateUserInformation:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.AdvisorCustomerInfoQueryFacade.updateUserInformation',
  queryFinancialAdvisorCustomerList:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.AdvisorCustomerInfoQueryFacade.queryFinancialAdvisorCustomerList',
  queryFinancialAdvisorList:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.AdvisorCustomerInfoQueryFacade.queryFinancialAdvisorList',
  queryFundCodeNameList:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.AdvisorCustomerInfoQueryFacade.queryFundCodeNameList',
  queryDistributeCodeNameList:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.AdvisorCustomerInfoQueryFacade.queryDistributeCodeNameList',
  queryCustOwnershipInfo:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.CustOwnershipInfoFacade.queryCustOwnershipInfo',
  updateCustomerAdviser:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.CustOwnershipInfoFacade.updateCustomerAdviser',
  batchUpdateCustomerAdviser:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.CustOwnershipInfoFacade.batchUpdateCustomerAdviser',
  downFile: 'com.thfund.sales.fundsalescrm.facade.advisorcrm.CustOwnershipInfoFacade.downFile',
  queryUserOperationLog:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.CustOwnershipInfoFacade.queryUserOperationLog',
  /*CRM-MOT*/
  queryTemplateSelectOptions:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.MotEventTemplateFacade.queryTemplateSelectOptions',
  queryTaskStatus:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.MotEventTemplateFacade.queryTaskStatus',
  queryTriggerAction:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.MotEventTemplateFacade.queryTriggerAction',
  queryMotEventOptions:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.MotEventManageFacade.queryMotEventOptions',
  queryMotEventContactInfo:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.MotEventTemplateFacade.queryMotEventContactInfo',
  queryMotEventTaskList:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.MotEventTaskFacade.queryMotEventTaskList',
  queryMyMotEventTaskList:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.MotEventTaskFacade.queryMyMotEventTaskList',
  exportMotEventTaskList:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.MotEventTaskFacade.exportMotEventTaskList',
  submitProcessingResult:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.MotEventTaskFacade.submitProcessingResult',
  queryLastTaskHandleDetail:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.MotEventTaskFacade.queryLastTaskHandleDetail',
  sendSms: 'com.thfund.sales.fundsalescrm.facade.advisorcrm.MotEventTaskMessageFacade.sendSms',
  updateMotEventTaskSmsStatus:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.MotEventTaskMessageFacade.updateMotEventTaskSmsStatus',
  queryMotEventSmsTaskList:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.MotEventTaskMessageFacade.queryMotEventSmsTaskList',
  createPhoneTask:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.MotEventTaskMessageFacade.createPhoneTask',
  queryPhoneTaskList:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.MotEventTaskMessageFacade.queryPhoneTaskList',
  updatePhoneTaskList:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.MotEventTaskMessageFacade.updatePhoneTaskList',
  queryCustomerIsNoDisturb:
    'com.thfund.sales.fundsalescrm.facade.advisorcrm.AdvisorCustomerInfoQueryFacade.queryCustomerIsNoDisturb',
  /* 销售看板后台配置 */
  //角色部门权限配置
  queryOrgUserInfoTree:
    'com.thfund.sales.fundsalesbi.facade.bd.BdDeptUserFacade.queryOrgUserInfoTree',
  queryDingUserInfoTree:
    'com.thfund.sales.fundsalesbi.facade.dingding.DingDeptUserFacade.queryDingUserInfoTree',
  queryRoles: 'com.thfund.sales.fundsalesbi.facade.role.RoleFacade.queryRoles',
  addRole: 'com.thfund.sales.fundsalesbi.facade.role.RoleFacade.addRole',
  updateRole: 'com.thfund.sales.fundsalesbi.facade.role.RoleFacade.updateRole',
  deleteRole: 'com.thfund.sales.fundsalesbi.facade.role.RoleFacade.deleteRole',
  queryDingUser: 'com.thfund.sales.fundsalesbi.facade.role.RoleFacade.queryDingUser',
  setUserRole: 'com.thfund.sales.fundsalesbi.facade.role.RoleFacade.setUserRole',
  //角色筛选权限配置
  queryRoleScreen: 'com.thfund.sales.fundsalesbi.facade.role.RoleFacade.queryRoleScreen',
  addRoleScreen: 'com.thfund.sales.fundsalesbi.facade.role.RoleFacade.addRoleScreen',
  updateRoleScreen: 'com.thfund.sales.fundsalesbi.facade.role.RoleFacade.updateRoleScreen',
  deleteRoleScreen: 'com.thfund.sales.fundsalesbi.facade.role.RoleFacade.deleteRoleScreen',
  queryScreenValueByType:
    'com.thfund.sales.fundsalesbi.facade.salesBoard.ScreenBoardFacade.queryScreenValueByType',
  //字典信息查询
  getDictInfoByType:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.DictInfoFacade.getDictInfoByType',
  //bd系统部门查询
  querySysDeptInfo:
    'com.thfund.sales.fundsalesdatacenter.facade.bd.BdSysDeptFacade.querySysDeptInfo',
  //产品类型配置
  queryFundBasicInfo:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.FundTypeConfigFacade.queryFundBasicInfo',
  setFundVogType:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.FundTypeConfigFacade.setFundVogType',
  queryFundConfigInfo:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.FundTypeConfigFacade.queryFundConfigInfo',
  setFundPanelShowType:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.FundTypeConfigFacade.setPanelShowType',
  //渠道类型配置
  queryAgencyBasicInfos:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.AgencyTypeConfigFacade.queryAgencyBasicInfo',
  setAgencyKind:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.AgencyTypeConfigFacade.setAgencyKind',
  //区域考核配置
  queryBankRegionInfo:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.BankRegionConfigFacade.queryBankRegionInfo',
  getBankVogRegion:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.BankRegionConfigFacade.getBankVogRegion',
  setBankRegion:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.BankRegionConfigFacade.setBankRegion',
  //考核归属渠道配置
  queryVogChannelInfo:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.AgencyCustomerConfigFacade.queryVogChannelInfo',
  queryBankInfo:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.AgencyCustomerConfigFacade.queryBankInfo',
  getOrgType:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.AgencyCustomerConfigFacade.getOrgType',
  addVogChannel:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.AgencyCustomerConfigFacade.addVogChannel',
  updateVogChannel:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.AgencyCustomerConfigFacade.updateVogChannel',
  deleteVogChannel:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.AgencyCustomerConfigFacade.deleteVogChannel',
  //机构客户配置
  queryOrgCustomerInfo:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.AgencyCustomerConfigFacade.queryOrgCustomerInfo',
  setOrgCustomerInfo:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.AgencyCustomerConfigFacade.setOrgCustomerInfo',
  //客户经理配置
  queryClientManagerInfo:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.ClientManagerConfigFacade.queryClientManagerInfo',
  setClientManagerSalesType:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.ClientManagerConfigFacade.setClientManagerSalesType',
  //字典类型配置
  queryDictType:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.DictInfoFacade.queryDictType',
  addDictType: 'com.thfund.sales.fundsalesdatacenter.facade.web.config.DictInfoFacade.addDictType',
  deleteDictType:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.DictInfoFacade.deleteDictType',
  //考核目标配置
  queryVogTargetInfo:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.VogTargetConfigFacade.queryVogTargetInfo',
  addVogTargetInfo:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.VogTargetConfigFacade.addVogTargetInfo',
  updateVogTargetInfo:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.VogTargetConfigFacade.updateVogTargetInfo',
  deleteVogTargetInfo:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.VogTargetConfigFacade.deleteVogTargetInfo',
  //字典项配置
  getDictTypeTree:
    'com.thfund.sales.fundsalesdatacenter.facade.web.config.DictInfoFacade.getDictType',
  queryDict: 'com.thfund.sales.fundsalesdatacenter.facade.web.config.DictInfoFacade.queryDict',
  addDict: 'com.thfund.sales.fundsalesdatacenter.facade.web.config.DictInfoFacade.addDict',
  updateDict: 'com.thfund.sales.fundsalesdatacenter.facade.web.config.DictInfoFacade.updateDict',
  deleteDict: 'com.thfund.sales.fundsalesdatacenter.facade.web.config.DictInfoFacade.deleteDict',

  // 标签体系
  queryFundMarkData:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundMarkFacade.queryFundMarkData',
  // 保存基金标签树信息
  saveFundMarkData:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundMarkFacade.saveFundMarkData',
  // 基金父级标签下拉
  queryParentMarkDropDown:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundMarkFacade.queryParentMarkDropDown',
  // 查询未包含对象列表
  queryFundMarkNotContainProductData:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundMarkFacade.queryFundMarkNotContainProductData',
  // 查询标签池列表
  queryFundMarkProductData:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundMarkFacade.queryFundMarkProductData',
  // 调入/批量调入
  batchTransInProducts:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundMarkFacade.batchTransInProducts',
  // 调出/批量调出
  batchTransOutProducts:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundMarkFacade.batchTransOutProducts',
  // 全部调入
  allTransInProducts:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundMarkFacade.allTransInProducts',
  // 查询单条数据
  queryMarkEcho:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundMarkFacade.queryMarkEcho',
  // 编辑
  updateFundMarkData:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundMarkFacade.updateFundMarkData',
  // 删除
  deleteFundMarkData:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundMarkFacade.deleteFundMarkData',
  // 模糊查询
  searchUserInfo:
    'com.thfund.fundprocesscore.facade.service.user.ApplicationUserFacadeService.searchUserInfo',
  // 自动打标开关
  saveAutoMark:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundMarkFacade.saveAutoMark',
  // 自动打标-保存方案
  saveMarkSchemesData:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundMarkFacade.saveMarkSchemesData',
  // 自动打标-方案回显
  querySchemEcho:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundMarkFacade.querySchemEcho',
  // 拉黑
  batchMarkBlackList:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundMarkFacade.batchMarkBlackList',
  // 列出查询方案
  queryFundIndexSolution:
    'com.thfund.fundprodindexcore.facade.SearchFacadeService.listQuerySolution',
  // 自动打标方案立即执行
  autoFundMarksSync:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundMarkFacade.autoFundMarksSync',
  // 黑名单标签-全部删除
  batchAllMarkBlackList:
    'com.thfund.product.facade.service.productanalyse.fundportal.FundMarkFacade.batchAllMarkBlackList',

  // 云图应用
  // 搜索入参查询图数据
  queryChartData: 'com.thfund.product.facade.service.CloudChartFacadeService.queryChartData',
  // 查询页面搜索参数配置
  queryPageSearchConfig:
    'com.thfund.product.facade.service.CloudChartFacadeService.queryPageSearchConfig',

  // 销售 VOG 看板
  // 时间组件
  queryDateInfo: 'com.thfund.sales.fundsalesbi.facade.salesBoard.VogBoardFacade.queryDateInfo',
  // 整体达成-卡片
  queryVogOverview:
    'com.thfund.sales.fundsalesbi.facade.salesBoard.VogBoardFacade.queryVogOverview',
  // 重点指标-部门体系达成
  queryVogWithPdept:
    'com.thfund.sales.fundsalesbi.facade.salesBoard.VogBoardFacade.queryVogWithPdept',
  // 重点指标-专户专项业绩
  queryVogWithSpecialAccount:
    'com.thfund.sales.fundsalesbi.facade.salesBoard.VogBoardFacade.queryVogWithSpecialAccount',
  // 存量趋势
  queryAmountTrend:
    'com.thfund.sales.fundsalesbi.facade.salesBoard.VogBoardFacade.queryAmountTrend',
  // 非货公募产品排行-产品类型卡片
  queryVogWithFundVogType:
    'com.thfund.sales.fundsalesbi.facade.salesBoard.VogBoardFacade.queryVogWithFundVogType',
  // 非货公募产品排行-产品排行
  querySellInfoByFund:
    'com.thfund.sales.fundsalesbi.facade.salesBoard.VogBoardFacade.querySellInfoByFund',
  // 非货公募产品排行-产品二级类型卡片
  querySecondCardList:
    'com.thfund.sales.fundsalesbi.facade.salesBoard.VogBoardFacade.queryVogWithFundCustomType',

  /** 素材管理系统 */
  // 查询支持类别
  catSupportQuery: 'com.thfund.sales.funddmcenter.facade.category.CategoryFacade.catSupportQuery',
  // 类别查询
  catQuery: 'com.thfund.sales.funddmcenter.facade.category.CategoryFacade.catQuery',
  // 类别添加
  catAdd: 'com.thfund.sales.funddmcenter.facade.category.CategoryFacade.catAdd',
  // 类别修改
  catUpdate: 'com.thfund.sales.funddmcenter.facade.category.CategoryFacade.catUpdate',
  // 类别删除
  catDelete: 'com.thfund.sales.funddmcenter.facade.category.CategoryFacade.catDel',
  // 标签查询
  labelQuery: 'com.thfund.sales.funddmcenter.facade.material.MaterialLabelFacade.labelQuery',
  // 标签添加
  labelAdd: 'com.thfund.sales.funddmcenter.facade.material.MaterialLabelFacade.labelAdd',
  // 标签修改
  labelUpdate: 'com.thfund.sales.funddmcenter.facade.material.MaterialLabelFacade.labelUpdate',
  // 标签删除
  labelDel: 'com.thfund.sales.funddmcenter.facade.material.MaterialLabelFacade.labelDel',
  // 获取oss参数
  materialGetOss: 'com.thfund.sales.funddmcenter.facade.basic.BasicInfoFacade.queryVirtualConfig',
  // 素材查询
  materialQuery: 'com.thfund.sales.funddmcenter.facade.material.MaterialFacade.query',
  // 素材添加
  materialAdd: 'com.thfund.sales.funddmcenter.facade.material.MaterialFacade.upload',
  // 素材修改
  materialUpdate: 'com.thfund.sales.funddmcenter.facade.material.MaterialFacade.update',
  // 素材相关下拉查询
  catQueryAll: 'com.thfund.sales.funddmcenter.facade.category.CategoryFacade.catQueryAll',
  // 关联标签下拉查询
  labelQueryAll: 'com.thfund.sales.funddmcenter.facade.material.MaterialLabelFacade.labelQueryAll',
  // 产品下拉查询
  queryFunds: 'com.thfund.sales.funddmcenter.facade.basic.BasicInfoFacade.queryFunds',
  // 产品经理下拉查询
  queryFundManagers: 'com.thfund.sales.funddmcenter.facade.basic.BasicInfoFacade.queryFundManagers',
  // 素材管理-删除
  materialDel: 'com.thfund.sales.funddmcenter.facade.material.MaterialFacade.del',
  // 素材下载记录
  downloadTime: 'com.thfund.sales.funddmcenter.facade.material.MaterialFacade.usage',

  // 荣誉堂后台配置
  // 部门信息管理-列表查询
  queryHonorNominateDptList:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorNominateDptBgFacade.queryHonorNominateDptList',
  // 部门信息管理-列表-部门名称下拉查询
  queryHonorNominateDptName:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorNominateDptBgFacade.queryHonorNominateDptName',
  // 部门信息管理-表单-部门名称下拉查询
  queryAddNominateDptList:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorNominateDptBgFacade.queryAddNominateDptList',
  // 部门信息管理-添加
  addHonorNominateDpt:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorNominateDptBgFacade.addHonorNominateDpt',
  // 部门信息管理-修改
  updateHonorNominateDpt:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorNominateDptBgFacade.updateHonorNominateDpt',
  // 部门信息管理-删除
  deleteHonorNominateDpt:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorNominateDptBgFacade.deleteHonorNominateDpt',
  // 奖项配置-列表查询
  queryHonorAwardsList:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorAwardsBgFacade.queryHonorAwardsList',
  // 奖项配置-奖项标签下拉查询
  queryAwardsTypeDesc:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorAwardsBgFacade.queryAwardsTypeDesc',
  // 奖项配置-添加
  addHonorAwards:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorAwardsBgFacade.addHonorAwards',
  // 奖项配置-修改
  updateHonorAwards:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorAwardsBgFacade.updateHonorAwards',
  // 奖项配置-删除
  deleteHonorAwardsById:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorAwardsBgFacade.deleteHonorAwardsById',
  // 榜单配置-列表查询
  queryWinnerList:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorWinnerListBgFacade.queryWinnerList',
  // 榜单配置-榜单周期下拉查询
  queryListCycleTypeAndDesc:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorWinnerListBgFacade.queryListCycleTypeAndDesc',
  // 榜单配置-榜单奖项下拉查询
  queryHonorAwardsName:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorAwardsBgFacade.queryHonorAwardsName',
  // 榜单配置-榜单名称下拉查询
  queryBasisWinnerList:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorWinnerListBgFacade.queryBasisWinnerList',
  // 榜单配置-添加
  addWinnerList:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorWinnerListBgFacade.addWinnerList',
  // 榜单配置-修改
  updateWinnerList:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorWinnerListBgFacade.updateWinnerList',
  // 榜单配置-删除
  deleteWinnerList:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorWinnerListBgFacade.deleteWinnerList',
  // 颁奖配置-列表查询
  queryAwardsWinnerList:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorAwardsWinnerBgFacade.queryAwardsWinnerList',
  // 颁奖配置-获奖部门查询
  queryWinnerCandidate:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorWinnerBgFacade.queryWinnerCandidate',
  // 颁奖配置-获奖人查询
  queryWinnerInfo:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorWinnerBgFacade.queryWinnerInfo',
  // 颁奖配置-添加
  addAwardsWinner:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorAwardsWinnerBgFacade.addAwardsWinner',
  // 颁奖配置-修改
  updateAwardsWinner:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorAwardsWinnerBgFacade.updateAwardsWinner',
  // 颁奖配置-删除
  deleteAwardsWinner:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorAwardsWinnerBgFacade.deleteAwardsWinner',
  // 营销配置-列表查询
  queryMarketingPageIcons:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorPageStaticBgFacade.queryPageIcons',
  // 营销配置-添加
  addMarketingPageIcon:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorPageStaticBgFacade.addPageIcon',
  // 营销配置-修改
  updateMarketingPageIcon:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorPageStaticBgFacade.updatePageIcon',
  // 营销配置-删除
  deleteMarketingIcons:
    'com.thfund.sales.fundsalescrm.facade.honorhall.background.HonorPageStaticBgFacade.deleteIcons',

  // 渠道分布-下载
  queryAgencyListForExcel:
    'com.thfund.sales.fundsalesbi.facade.agency.AgencySummaryFacade.queryAgencyListForExcel',
  // 渠道详情-产品分布-下载
  queryAgencyFundTradeInfoForExcel:
    'com.thfund.sales.fundsalesbi.facade.agency.AgencyTradeDetailFacade.queryAgencyFundTradeInfoForExcel',

  // CRM菜单-Banner
  // 列表查询
  queryScStaticResource:
    'com.thfund.sales.fundsalescrm.facade.sc.background.global.ScStaticResourceBgFacade.queryScStaticResource',
  // 添加
  addScStaticResource:
    'com.thfund.sales.fundsalescrm.facade.sc.background.global.ScStaticResourceBgFacade.addScStaticResource',
  // 修改
  updateScStaticResource:
    'com.thfund.sales.fundsalescrm.facade.sc.background.global.ScStaticResourceBgFacade.updateScStaticResource',
  // 删除
  deleteScStaticResource:
    'com.thfund.sales.fundsalescrm.facade.sc.background.global.ScStaticResourceBgFacade.deleteScStaticResource',

  // CRM菜单-消息
  // 查询
  queryScMessageInfo:
    'com.thfund.sales.fundsalescrm.facade.sc.background.global.ScStaticResourceBgFacade.queryScMessageInfo',
  // 新增
  addScMessage:
    'com.thfund.sales.fundsalescrm.facade.sc.background.global.ScStaticResourceBgFacade.addScMessage',
  // 修改
  updateScMessage:
    'com.thfund.sales.fundsalescrm.facade.sc.background.global.ScStaticResourceBgFacade.updateScMessage',
  // 删除
  deleteScMessage:
    'com.thfund.sales.fundsalescrm.facade.sc.background.global.ScStaticResourceBgFacade.deleteScMessage',

  // 渠道上线情况
  // 获取渠道、产品下拉数据
  queryScTreeData:
    'com.thfund.sales.fundsalescrm.facade.sc.agency.ScAgencyOnlineFacade.queryScTreeData',
  // 渠道上线情况列表查询
  queryAgencyOnlineSituation:
    'com.thfund.sales.fundsalescrm.facade.sc.agency.ScAgencyOnlineFacade.queryAgencyOnlineSituation',
  // 下载
  downLoadAgencyOnlineSituation:
    'com.thfund.sales.fundsalescrm.facade.sc.agency.ScAgencyOnlineFacade.downLoadAgencyOnlineSituation',
};
