export default {
  // 获取前一个工作日日期
  queryTransactionCalendarFacadeLastWorkDay:
    'com.thfund.fundinfo.facade.TransactionCalendarFacade.getLastWorkDay',
  // 事件时间范围
  queryTypeCodeInfoFacadeEventDateRange:
    'com.thfund.fundinfo.facade.TypeCodeInfoFacade.getEventDateRange',

  /** 狭义舆情 */
  // 查询所属类目
  TypeCodeInfoFacadeGetSentType: 'com.thfund.fundinfo.facade.TypeCodeInfoFacade.getSentType',
  // 查询前后
  TransactionCalendarFacadeGetWorkDayRange:
    'com.thfund.fundinfo.facade.TransactionCalendarFacade.getWorkDayRange',
  // 获取狭义舆情列表
  getXyNegativeSentimentEventByPage:
    'com.thfund.fundinfo.facade.XyNegativeSentimentInfoFacade.getXyNegativeSentimentEventByPage',
  // 今日重点关注Top5]
  XyNegativeSentimentInfoFacadeGetNewKeyBondTop:
    'com.thfund.fundinfo.facade.XyNegativeSentimentInfoFacade.getNewKeyBondTop',
  // 舆情增长趋势
  XyNegativeSentimentInfoFacadeGetNewSentimentTrend:
    'com.thfund.fundinfo.facade.XyNegativeSentimentInfoFacade.getNewSentimentTrend',
  // 舆情分布
  XyNegativeSentimentInfoFacadeGetNewOfflineSentimentDistribution:
    'com.thfund.fundinfo.facade.XyNegativeSentimentInfoFacade.getNewOfflineSentimentDistribution',
  // 舆情详情
  XyNegativeSentimentInfoFacadeGetXyNegativeSentimentDetailByEvent:
    'com.thfund.fundinfo.facade.XyNegativeSentimentInfoFacade.getXyNegativeSentimentDetailByEvent',

  /** 行业舆情*/
  // 分页查询行业舆情列表
  IndustryNewsFacadeQueryIndustryNewsLimit:
    'com.thfund.fundinfo.facade.IndustryNewsFacade.queryIndustryNewsLimit',
  // 查询行业树
  IndustryNewsFacadeQueryIndustryTree:
    'com.thfund.fundinfo.facade.IndustryNewsFacade.queryIndustryTree',
  // 查询行业舆情统计图表
  IndustryNewsFacadeQueryStatChart: 'com.thfund.fundinfo.facade.IndustryNewsFacade.queryStatChart',
  // 查询行业舆情趋势图表
  IndustryNewsFacadeQueryTrendChart:
    'com.thfund.fundinfo.facade.IndustryNewsFacade.queryTrendChart',
  // 查询行业舆情详细信息
  IndustryNewsFacadeQueryIndustryNewsInfo:
    'com.thfund.fundinfo.facade.IndustryNewsFacade.queryIndustryNewsInfo',

  /** 基金经理面板 */
  // 持仓舆情债券查询
  queryFundManagerPanelInfoFacadeHoldBondInfo:
    'com.thfund.fundinfo.facade.FundManagerPanelInfoFacade.getHoldBondInfoWithSentiment',
  // 组合持仓查询
  queryFundManagerPanelInfoFacadeCombinationInfo:
    'com.thfund.fundinfo.facade.FundManagerPanelInfoFacade.getCombinationInfoByBond',
  // 持仓债券舆情事件查询
  queryFundManagerPanelInfoFacadeHoldBondSenEvent:
    'com.thfund.fundinfo.facade.FundManagerPanelInfoFacade.getHoldBondSenEventInfo',

  /** 数据管理 -- 评级机构管理 */
  // 评级机构管理查询
  queryInfoRatingAgencyManagementFacadeRatageMag:
    'com.thfund.fundinfo.facade.InfoRatingAgencyManagementFacade.getRatageMagPageByQuery',
  // 评级机构管理状态更新
  updateInfoRatingAgencyManagementFacadeStaticStatus:
    'com.thfund.fundinfo.facade.InfoRatingAgencyManagementFacade.checkStaticStatusByWindCreditratingagency',

  /** 数据管理 -- 违约债管理 */
  // 违约债管理查询
  queryDefReportformManagementFacadeDefReportform:
    'com.thfund.fundinfo.facade.DefReportformManagementFacade.getDefReportformPageByQuery',
  // 违约债管理状态更新
  updateDefReportformManagementFacadeDefReportformStatus:
    'com.thfund.fundinfo.facade.DefReportformManagementFacade.updateByBondCode',
  // 新增违约债管理
  addDefReportformManagementFacadeDefReportform:
    'com.thfund.fundinfo.facade.DefReportformManagementFacade.addDefReportform',
  // 删除违约债管理
  removeDefReportformManagementFacadeDefReportform:
    'com.thfund.fundinfo.facade.DefReportformManagementFacade.removeByBondCode',

  /** 个券信用风险 */
  // 个券信用风险提示报告舆情事件查询
  EveryBondCreditRisksReportSentInfoFacadeGetSentEventPageByQuery:
    'com.thfund.fundinfo.facade.EveryBondCreditRisksReportSentInfoFacade.getSentEventPageByQuery',
  // 个券信用风险提示报告关联债券查询
  EveryBondCreditRisksReportSentInfoFacadeGetSentBondByEvent:
    'com.thfund.fundinfo.facade.EveryBondCreditRisksReportSentInfoFacade.getSentBondByEvent',
  // 个券信用风险提示报告持仓查询
  EveryBondCreditRisksReportSentInfoFacadeGetHlDetailByBondCode:
    'com.thfund.fundinfo.facade.EveryBondCreditRisksReportSentInfoFacade.getHlDetailByBondCode',

  /** 债券价格异动 */
  // 盘中价格异动-昨收偏离
  BondPriceChangeGetDayPreValOffset:
    'com.thfund.fundinfo.facade.BondPriceChangeFacade.getDayPreValOffset',
  // 盘中价格异动-估值偏离
  BondPriceChangeGetDayValOffset:
    'com.thfund.fundinfo.facade.BondPriceChangeFacade.getDayValOffset',
  // 盘后价格异动-收盘价格异动
  BondPriceChangeGetYestDayClosePriceOffsett:
    'com.thfund.fundinfo.facade.BondPriceChangeFacade.getYestDayClosePriceOffset',
  // 盘后价格异动-估值异动
  BondPriceChangeGetYestDayValChange:
    'com.thfund.fundinfo.facade.BondPriceChangeFacade.getYestDayValChange',
  // 盘后价格异动-相对估值偏离
  BondPriceChangeGetYestDayValOffset:
    'com.thfund.fundinfo.facade.BondPriceChangeFacade.getYestDayValOffset',
  // 筛选条件-债券模糊查询
  BondPriceChangeLikeBondName: 'com.thfund.fundinfo.facade.BondPriceChangeFacade.likeBondName',
  // 筛选条件-主体模糊查询
  BondPriceChangeLikeCompanyName:
    'com.thfund.fundinfo.facade.BondPriceChangeFacade.likeCompanyName',
  // 筛选条件-债券类型查询
  BondPriceChangeGetBondType: 'com.thfund.fundinfo.facade.BondPriceChangeFacade.getBondType',
  // 筛选条件-一级行业查询
  BondPriceChangeGetIndustry: 'com.thfund.fundinfo.facade.BondPriceChangeFacade.getIndustry',

  /** 个券异动分析 */
  // 个券异动-个券及主体基础信息
  BondPriceChangeGetBondBaseInfo:
    'com.thfund.fundinfo.facade.BondPriceChangeFacade.getBondBaseInfo',
  // 个券异动-收盘价趋势
  BondPriceChangeGetClosePriceChart:
    'com.thfund.fundinfo.facade.BondPriceChangeFacade.getClosePriceChart',
  // 个券异动-成交曲线-历史
  BondPriceChangeGetHistoryVolChart:
    'com.thfund.fundinfo.facade.BondPriceChangeFacade.getHistoryVolChart',
  // 个券异动-估值趋势
  BondPriceChangeGetValChart: 'com.thfund.fundinfo.facade.BondPriceChangeFacade.getValChart',
  // 个券异动-相对估值偏离趋势
  BondPriceChangeGetValOffsetChart:
    'com.thfund.fundinfo.facade.BondPriceChangeFacade.getValOffsetChart',
  // 个券异动-成交曲线
  BondPriceChangeGetVolChart: 'com.thfund.fundinfo.facade.BondPriceChangeFacade.getVolChart',
  // 个券异动-筛选条件-异动类型查询
  BondPriceChangeGetEventType: 'com.thfund.fundinfo.facade.BondPriceChangeFacade.getEventType',
  // 个券异动-异动归因-异动风险图
  BondPriceChangeGetEventChart: 'com.thfund.fundinfo.facade.BondPriceChangeFacade.getEventChart',
  // 个券异动-异动归因-异动风险分页报表
  BondPriceChangeGetEventReport: 'com.thfund.fundinfo.facade.BondPriceChangeFacade.getEventReport',
  // 个券异动-债券持仓-持仓基本信息查询
  BondPriceChangeGetBondThfundHold:
    'com.thfund.fundinfo.facade.BondPriceChangeFacade.getBondThfundHold',
  // 个券异动--债券偿还信息
  BondPriceChangeGetBondAmountChange:
    'com.thfund.fundinfo.facade.BondPriceChangeFacade.getBondAmountChange',

  /** 股票价格异动分析 */
  // 分页报表-股票行情报表查询
  StockPriceChangeFacadeGetStockReport:
    'com.thfund.fundinfo.facade.StockPriceChangeFacade.getStockReport',
  // 筛选条件-中信一级行业列表
  StockPriceChangeFacadeGetCiticIndustryList:
    'com.thfund.fundinfo.facade.StockPriceChangeFacade.getCiticIndustryList',
  // 筛选条件-股票简称模糊查询
  StockPriceChangeFacadeLikeStockName:
    'com.thfund.fundinfo.facade.StockPriceChangeFacade.likeStockName',

  /** 股票价格异动分析 详情*/
  // 个股详情--股票基础信息查询
  StockPriceChangeFacadeGetStockInfo:
    'com.thfund.fundinfo.facade.StockPriceChangeFacade.getStockInfo',
  // 个股详情--持仓产品
  StockPriceChangeFacadeGetHoldProducts:
    'com.thfund.fundinfo.facade.StockPriceChangeFacade.getHoldProducts',
  //个股详情-价格趋势
  StockPriceChangeFacadeGetPerformanceChart:
    'com.thfund.fundinfo.facade.StockPriceChangeFacade.getPerformanceChart',
  //异动归因-异动风险图
  StockPriceChangeFacadeGetEventChart:
    'com.thfund.fundinfo.facade.StockPriceChangeFacade.getEventChart',
  //异动归因-异动风险柱状图
  StockPriceChangeFacadeGetEventReport:
    'com.thfund.fundinfo.facade.StockPriceChangeFacade.getEventReport',
  //异动归因-事件类型查询
  StockPriceChangeFacadeGetEventType:
    'com.thfund.fundinfo.facade.StockPriceChangeFacade.getEventType',

  /** 主体信息 详情*/
  // 主体信息--主体基础信息查询
  StockPriceChangeFacadeGetCompanyInfo:
    'com.thfund.fundinfo.facade.StockPriceChangeFacade.getCompanyInfo',
  // 主体信息--主体发行股票
  StockPriceChangeFacadeGetStockInfoByCompanyCode:
    'com.thfund.fundinfo.facade.StockPriceChangeFacade.getStockInfoByCompanyCode',
  // 主体查询--发行债券列表查询
  BondPriceChangeFacadeFacadeGetBondByCompanyCode:
    'com.thfund.fundinfo.facade.BondPriceChangeFacade.getBondByCompanyCode',

  /** 码表管理 */
  // 码表管理类型接口
  TypeCodeInfoFacadeGetType: 'com.thfund.fundinfo.facade.TypeCodeInfoFacade.getType',
  // 码表管理查询
  TypeCodeInfoFacadeGetPageDataByQuery:
    'com.thfund.fundinfo.facade.TypeCodeInfoFacade.getPageDataByQuery',
  // 码表管理新增
  TypeCodeInfoFacadeAddTypeCode: 'com.thfund.fundinfo.facade.TypeCodeInfoFacade.addTypeCode',
  // 码表管理类型修改
  TypeCodeInfoFacadeUpdateTypeCode: 'com.thfund.fundinfo.facade.TypeCodeInfoFacade.updateTypeCode',
};
