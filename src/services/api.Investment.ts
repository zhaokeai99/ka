// import { getBaseApi } from './service';

// const ServerApi = getBaseApi();

export default {
  // 业务域查询接口
  MpDomainQuery: 'com.thfund.fundmp.service.facade.sales.mppro.mp.impl.MpDomainFacadeImpl.query',
  // 基准信息查询
  MpBenchmarkQuery:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.impl.MpBenchmarkFacadeImpl.query',
  // 基准信息
  MpBenchmarkQuerySecurities:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.impl.MpBenchmarkFacadeImpl.querySecurities',

  // 主基准查询
  MpBenchmarkQueryByPage:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.impl.MpBenchmarkFacadeImpl.queryByPage',
  // 主基准创建
  MpBenchmarkAdd: 'com.thfund.fundmp.service.facade.sales.mppro.mp.impl.MpBenchmarkFacadeImpl.add',
  // 主基准修改
  MpBenchmarkEdit:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.impl.MpBenchmarkFacadeImpl.edit',
  // 主基准删除
  MpBenchmarkDelete:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.impl.MpBenchmarkFacadeImpl.delete',

  // 查询复合基准净值
  MpBmComplexNvQuery:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.bm.impl.MpBmComplexNvFacadeImpl.query',
  // 查询复合基准
  MpBmComplexQuery:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.bm.impl.MpBmComplexFacadeImpl.query',
  // 查询复合基准分页
  MpBmComplexQueryByPage:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.bm.impl.MpBmComplexFacadeImpl.queryByPage',
  // 查询复合基准净值分页
  MpBmComplexNvQueryByPage:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.bm.impl.MpBmComplexNvFacadeImpl.queryByPage',
  // 通过id删除复合基准
  MpBmComplexDelete:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.bm.impl.MpBmComplexFacadeImpl.delete',
  // 复合基准新增
  MpBmComplexAddList:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.bm.impl.MpBmComplexFacadeImpl.addList',
  // 复合基准修改
  MpBmComplexEditList:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.bm.impl.MpBmComplexFacadeImpl.editList',
  // 查询复合基准
  MpBmComplexQueryWithCloseByPage:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.bm.impl.MpBmComplexFacadeImpl.queryWithCloseByPage',

  // 查询市场指数
  MpBmMarketIndexQuery:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.bm.impl.MpBmMarketIndexFacadeImpl.query',
  // 查询市场指数分页
  MpBmMarketIndexQueryByPage:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.bm.impl.MpBmMarketIndexFacadeImpl.queryByPage',
  // 新增市场指数
  MpBmMarketIndexAdd:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.bm.impl.MpBmMarketIndexFacadeImpl.add',
  // 编辑市场指数
  MpBmMarketIndexEdit:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.bm.impl.MpBmMarketIndexFacadeImpl.edit',
  // 删除市场指数
  MpBmMarketIndexDelete:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.bm.impl.MpBmMarketIndexFacadeImpl.delete',
  // 查询市场指数净值
  MpBmMarketIndexNvQuery:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.bm.impl.MpBmMarketIndexNvFacadeImpl.query',
  // 查询市场指数(收盘价)分页
  MpBmMarketIndexNvQueryWithCloseByPage:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.bm.impl.MpBmMarketIndexFacadeImpl.queryWithCloseByPage',

  // 查询自定义基准定义分页
  MpBmSelfdefQueryByPage:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.bm.impl.MpBmSelfdefFacadeImpl.queryByPage',
  // 查询自定义基准定义权重分页
  MpBmSelfdefWeightQueryByPage:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.bm.impl.MpBmSelfdefWeightFacadeImpl.queryByPage',
  // 查询自定义基准净值
  MpBmSelfdefNvQuery:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.bm.impl.MpBmSelfdefNvFacadeImpl.query',

  // 组合管理接口 start

  // 组合初始调整查询
  MpRsHoldChgQuery: 'com.thfund.fundmp.facade.mppro.mp.research.MpRsHoldChgFacade.query',
  // 组合调整(分页)查询
  MpRsHoldChgQueryByPage:
    'com.thfund.fundmp.facade.mppro.mp.research.MpRsHoldChgFacade.queryByPage',
  // 组合调整日志(分页)查询
  MpAdjustLogQueryByPage:
    'com.thfund.fundmp.facade.mppro.mp.research.MpAdjustLogFacade.queryByPage',
  // 成交明细查询
  MpRsDealQueryByPage:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.research.MpRsDealFacadeImpl.queryByPage',
  // 组合换手查询
  MpTurnOverQueryByPage:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.research.MpRsTurnoverImpl.queryByPage',

  // 查询sirm证券分类
  SirmStockQuery:
    'com.thfund.fundmp.facade.mppro.mp.research.MpRsHoldChgFacade.querySirmStockByPage',
  // 查询证券信息集合
  StkInfoListQuery: 'com.thfund.fundmp.facade.mppro.mp.StkInfoFacade.queryStkInfoList',
  // 组合调整提交
  EditChgHold: 'com.thfund.fundmp.facade.mppro.mp.research.MpRsHoldChgFacade.editChgHold',

  // 组合管理查询
  MpRsPortfolioFacadeQueryByPage:
    'com.thfund.fundmp.facade.mppro.mp.research.MpRsPortfolioFacade.queryByPage',
  // 组合管理查询我创建的
  MpRsPortfolioFacadeMyPortfolio:
    'com.thfund.fundmp.facade.mppro.mp.research.MpRsPortfolioFacade.MyPortfolio',
  // 组合管理新增
  MpRsPortfolioFacadeAdd: 'com.thfund.fundmp.facade.mppro.mp.research.MpRsPortfolioFacade.add',
  // 组合管理修改
  MpRsPortfolioFacadeEdit: 'com.thfund.fundmp.facade.mppro.mp.research.MpRsPortfolioFacade.edit',
  // 组合管理获取
  MpRsPortfolioFacadeGet: 'com.thfund.fundmp.facade.mppro.mp.research.MpRsPortfolioFacade.get',

  // 组合分析因子结果
  MpRsAnaIndexValueFacadeQuery:
    'com.thfund.fundmp.facade.mppro.mp.research.MpRsAnaIndexValueFacade.query',
  // 收益走势图
  MpRsAnaIndexValueFacadeQueryDetail:
    'com.thfund.fundmp.facade.mppro.mp.research.MpAnaMddDetailFacade.queryDetail',
  // 查询调仓手工主动调整的日期-用于收益走势图X轴标点
  MpRsAnaIndexValueFacadeQueryChgWayATradeDate:
    'com.thfund.fundmp.facade.mppro.mp.research.MpAnaMddDetailFacade.queryChgWayATradeDate',
  // 组合分析因子结果最新记录
  MpRsAnaIndexValueFacadeByNew:
    'com.thfund.fundmp.facade.mppro.mp.research.MpRsAnaIndexValueFacade.queryByNew',
  // 组合持仓
  MpRsHoldItemFacadeQueryByPage:
    'com.thfund.fundmp.facade.mppro.mp.research.MpRsHoldItemFacade.queryByPage',
  // 组合净值
  MpRsNvFacadeQueryByPage: 'com.thfund.fundmp.facade.mppro.mp.research.MpRsNvFacade.queryByPage',
  // 上一交易日
  MpRsSysBaseInfoFacadeGetPrevTrade:
    'com.thfund.fundmp.facade.mppro.mp.research.MpRsSysBaseInfoFacade.getPrevTrade',
  // 获取组合持仓最新日期信息
  MpRsSysBaseInfoFacadeGetDateInfo:
    'com.thfund.fundmp.facade.mppro.mp.research.MpRsHoldItemFacade.queryNewHoldItemData',

  // 组合最大回撤分析
  MpAnaMddDetailInfoQuery:
    'com.thfund.fundmp.facade.mppro.mp.research.MpAnaMddDetailFacade.queryMpAnaMddDetailInfo',
  //wind日历交易日,前几天的交易日
  MpWindFacadeGetPrevTradeByNum:
    'com.thfund.fundmp.facade.mppro.mp.wind.MpWindFacade.getPrevTradeByNum',
  //wind日历交易日,后几天的交易日
  MpWindFacadeGetNextTradeByNum:
    'com.thfund.fundmp.facade.mppro.mp.wind.MpWindFacade.getNextTradeByNum',
  //实时查询
  MpRsHoldChgFacadeQueryMpRsRealanalysis:
    'com.thfund.fundmp.facade.mppro.mp.research.MpRsHoldChgFacade.queryMpRsRealanalysis',
  //实时范围日期
  MpRsHoldChgFacadeGetCircleDate:
    'com.thfund.fundmp.facade.mppro.mp.research.MpRsHoldChgFacade.getCircleDate',
  //查询导入excel地址
  MpRsDicInfoGetExcelHost:
    'com.thfund.fundmp.facade.mppro.mp.research.MpRsSysBaseInfoFacade.getExcelHost',
  // 查询业务域股票池树
  MpDomainPoolFacadeQueryDomainPoolTree:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.research.MpDomainPoolFacade.queryDomainPoolTree',
  // 股票收益贡献查询
  MpRsAnaIndexValueFacadeStkIndex:
    'com.thfund.fundmp.facade.mppro.mp.research.MpRsAnaIndexValueFacade.queryStkIndex',
  // 组合管理接口 end

  //投资数据聚合
  //卖方信息聚合 查询
  SelmRoadShowInfoFacadeQueryRoadShowInfoByPage:
    'com.thfund.fundmp.facade.selm.SelmRoadShowInfoFacade.queryRoadShowInfoByPage',
  //卖方信息聚合 查询
  SelmRoadShowInfoFacadeGetSelmRoadShowInfo:
    'com.thfund.fundmp.facade.selm.SelmRoadShowInfoFacade.getSelmRoadShowInfo',
  //卖方信息聚合 字典
  SelmRoadShowInfoFacadeGetRoadShowDic:
    'com.thfund.fundmp.facade.selm.SelmRoadShowInfoFacade.getRoadShowDic',
  //微信群收录查询
  SelmWechatGroupQueryWechatGroup:
    'com.thfund.fundmp.facade.selm.SelmWechatGroupFacade.queryWechatGroup',
  //搜索历史记录
  SelmRoadShowOpLogFacadeQueryRoadShowOpInfoByPage:
    'com.thfund.fundmp.facade.selm.SelmRoadShowOpLogFacade.queryRoadShowOpInfoByPage',
  //搜索历史记录(去重)
  SelmRoadShowOpLogFacadeQueryRoadShowOpUnique:
    'com.thfund.fundmp.facade.selm.SelmRoadShowOpLogFacade.queryRoadShowOpUnique',
  //统计搜索历史记录
  SelmRoadShowOpLogFacadeCountRoadShowOpInfoByUsername:
    'com.thfund.fundmp.facade.selm.SelmRoadShowOpLogFacade.countRoadShowOpInfoByUsername',
  //新增搜索历史记录
  SelmRoadShowOpLogFacadeAddRoadShowOpInfo:
    'com.thfund.fundmp.facade.selm.SelmRoadShowOpLogFacade.addRoadShowOpInfo',
  //删除搜索历史记录
  SelmRoadShowOpLogFacadeDeleteRoadShowOpInfo:
    'com.thfund.fundmp.facade.selm.SelmRoadShowOpLogFacade.deleteRoadShowOpInfo',
  //搜索热度
  SelmRoadShowOpLogFacadeQuerySearchRoadShowOpTopByPage:
    'com.thfund.fundmp.facade.selm.SelmRoadShowOpLogFacade.querySearchRoadShowOpTopByPage',
  //wind股票公司
  WindCompIntroductionFacadeQueryCompIntroductionByPage:
    'com.thfund.fundmp.facade.wind.WindCompIntroductionFacade.queryCompIntroductionByPage',
  //会议日历
  SelmRoadShowInfoFacadeQueryRoadShowSimple:
    'com.thfund.fundmp.facade.selm.SelmRoadShowInfoFacade.queryRoadShowSimple',
  //会议统计
  SelmRoadShowInfoFacadeQueryRoadShowStatistics:
    'com.thfund.fundmp.facade.selm.SelmRoadShowInfoFacade.queryRoadShowStatistics',
  //保存搜索
  SelmRoadShowInfoFacadeSaveKeywordOpLog:
    'com.thfund.fundmp.facade.selm.SelmRoadShowInfoFacade.saveKeywordOpLog',
  //投资数据聚合管理
  //卖方信息查询
  SelmWechatMsgInfoQueryWechatMsgInfoByPage:
    'com.thfund.fundmp.facade.selm.SelmRoadShowInfoMngFacade.queryByPage',
  //路演中心查询
  SelmLiveRoadShowInfoFacadeQueryLiveRoadShowInfoByPage:
    'com.thfund.fundmp.facade.selm.SelmLiveRoadShowInfoFacade.queryLiveRoadShowInfoByPage',
  //获取路演中心
  SelmLiveRoadShowInfoFacadeGetLiveRoadShowInfo:
    'com.thfund.fundmp.facade.selm.SelmLiveRoadShowInfoFacade.getLiveRoadShowInfo',
  //路演中心保存
  SelmLiveRoadShowInfoFacadeSaveLiveRoadShowInfo:
    'com.thfund.fundmp.facade.selm.SelmLiveRoadShowInfoFacade.saveLiveRoadShowInfo',
  //路演中心新增
  SelmLiveRoadShowInfoFacadeAddLiveRoadShowInfo:
    'com.thfund.fundmp.facade.selm.SelmLiveRoadShowInfoFacade.addLiveRoadShowInfo',
  //路演中心日志查询
  SelmLiveRoadShowInfoFacadeQueryLogByPage:
    'com.thfund.fundmp.facade.selm.SelmLiveRoadShowInfoFacade.queryLogByPage',
  //路演中心忽略
  SelmLiveRoadShowInfoFacadeIgnoreLog:
    'com.thfund.fundmp.facade.selm.SelmLiveRoadShowInfoFacade.ignoreLog',
  //路演中心统计信息
  SelmLiveRoadShowInfoFacadeCountLiveInfo:
    'com.thfund.fundmp.facade.selm.SelmLiveRoadShowInfoFacade.countLiveInfo',
  //路演中心发送邮件
  SelmLiveRoadShowInfoFacadeMailSend:
    'com.thfund.fundmp.facade.selm.SelmLiveRoadShowInfoFacade.mailSend',
  //路演中心字典
  SelmLiveRoadShowInfoFacadeGetLiveInfoDic:
    'com.thfund.fundmp.facade.selm.SelmLiveRoadShowInfoFacade.getLiveInfoDic',
  //数据门户查询
  IrOutsourceFacadeQueryIrOutsourceList:
    'com.thfund.fundmp.facade.ir.IrOutsourceFacade.queryIrOutsourceList',
  //数据门户新增
  IrOutsourceFacadeInsertIrOutsourceList:
    'com.thfund.fundmp.facade.ir.IrOutsourceFacade.InsertIrOutsourceList',
  //数据门户更新
  IrOutsourceFacadeUpdateIrOutsourceList:
    'com.thfund.fundmp.facade.ir.IrOutsourceFacade.updateIrOutsourceList',

  // 信用风险
  // 查询模型标签列表接口
  queryModelTagList: 'com.thfund.riskcenter.facade.api.rpt.RptFacade.queryModelTagList',
  // 业务/我的模板列表
  queryModelTemplateList: 'com.thfund.riskcenter.facade.api.rpt.RptFacade.queryModelTemplateList',
  // 查询业务模板/我的模板
  queryTemplateDetail: 'com.thfund.riskcenter.facade.api.rpt.RptFacade.queryTemplateDetail',
  // 保存模板
  saveTemplate: 'com.thfund.riskcenter.facade.api.rpt.RptFacade.saveTemplate',
  // 删除模板
  deleteTemplate: 'com.thfund.riskcenter.facade.api.rpt.RptFacade.deleteTemplate',
  // 查询模板
  queryReport: 'com.thfund.riskcenter.facade.api.rpt.RptFacade.queryReport',
  // 主体列表查询接口
  query: 'com.thfund.riskcenter.facade.api.companydetail.CompanyDetailFacade.query',
  // 获取报表季度信息
  queryQuarterList:
    'com.thfund.riskcenter.facade.api.companydetail.CompanyDetailFacade.queryQuarterList',
  // 获取财务指标信息（主体报表）
  queryFinancialRepByQuarter:
    'com.thfund.riskcenter.facade.api.companydetail.CompanyDetailFacade.queryFinancialRepByQuarter',
  // 获取财务指标信息（季度报表）
  queryFinancialRepByComp:
    'com.thfund.riskcenter.facade.api.companydetail.CompanyDetailFacade.queryFinancialRepByComp',
  // 主体下拉框查询
  queryCompanySelect:
    'com.thfund.riskcenter.facade.api.companydetail.CompanyDetailFacade.queryCompanySelect',
  // 获取基金主体信息
  queryCompInfoByCompId:
    'com.thfund.riskcenter.facade.api.companydetail.CompanyDetailFacade.queryCompInfoByCompId',
  // 获取债券列表
  queryBondList: 'com.thfund.riskcenter.facade.api.companydetail.CompanyDetailFacade.queryBondList',

  queryLastWkDayByNow: 'com.thfund.riskcenter.facade.api.common.CalendarFacade.queryLastWkDayByNow',

  // 数据源管理
  // 查询数据源列表 checked
  queryIntegrationSource:
    'com.thfund.riskcenter.facade.api.IntegrationSourceFacade.queryIntegrationSource',

  // 查询单个数据源信息 checked
  querySingleIntegrationSource:
    'com.thfund.riskcenter.facade.api.IntegrationSourceFacade.querySingleIntegrationSource',

  // 修改数据源  checked
  modifyIntegrationSource:
    'com.thfund.riskcenter.facade.api.IntegrationSourceFacade.modifyIntegrationSource',

  // 保存数据源 checked
  saveIntegrationSource:
    'com.thfund.riskcenter.facade.api.IntegrationSourceFacade.saveIntegrationSource',

  // 测试数据源链接
  testSourceConn: 'com.thfund.riskcenter.facade.api.IntegrationSourceFacade.testSourceConn',

  // 视图管理

  // 查询数据视图列表 checked
  queryTable: 'com.thfund.riskcenter.facade.api.IntegrationSourceFacade.queryTable',

  // 查询单个报表 checked
  queryTableById: 'com.thfund.riskcenter.facade.api.IntegrationSourceFacade.queryTableById',

  // 查看数据源下所有表信息 checked
  querySourceTable: 'com.thfund.riskcenter.facade.api.IntegrationSourceFacade.querySourceTable',

  // 查看表字段 checked
  searchColumn: 'com.thfund.riskcenter.facade.api.IntegrationSourceFacade.searchColumn',

  // 修改表状态 checked
  modifyEnable: 'com.thfund.riskcenter.facade.api.IntegrationSourceFacade.modifyEnable',

  // 新增数据表 checked
  saveTableInfo: 'com.thfund.riskcenter.facade.api.IntegrationSourceFacade.saveTableInfo',

  // 修改数据表  checked
  updateTableInfo: 'com.thfund.riskcenter.facade.api.IntegrationSourceFacade.updateTableInfo',

  // 修改表字段描述 never used
  modifyFieldComment: 'com.thfund.riskcenter.facade.api.IntegrationSourceFacade.modifyFieldComment',

  // 指标管理
  // 查看指标节点管理列表
  getIndexNodeManageList:
    'com.thfund.riskcenter.facade.api.MonitorIndexFacade.getIndexNodeManageList',

  // 新增指标指标节点
  addIndexCalculationNodeInfo:
    'com.thfund.riskcenter.facade.api.MonitorIndexFacade.addIndexCalculationNodeInfo',

  // 修改指标节点
  changeIndexCalculationNodeInfo:
    'com.thfund.riskcenter.facade.api.MonitorIndexFacade.changeIndexCalculationNodeInfo',

  // 删除指标节点
  deleteIndexNodeInfo: 'com.thfund.riskcenter.facade.api.MonitorIndexFacade.deleteIndexNodeInfo',

  // 修改指标节点发布状态
  changeIndexNodePublishStatus:
    'com.thfund.riskcenter.facade.api.MonitorIndexFacade.changeIndexNodePublishStatus',

  // 新增指标指标分组
  addIndexGroupInfo: 'com.thfund.riskcenter.facade.api.MonitorIndexFacade.addIndexGroupInfo',

  // 测试指标节点
  calIndexNode: 'com.thfund.riskcenter.facade.api.MonitorIndexFacade.calIndexNode',

  // 查看指标节点信息
  getIndexNodeInfo: 'com.thfund.riskcenter.facade.api.MonitorIndexFacade.getIndexNodeInfo',

  // 查看发布的指标节点列表
  getPublishIndexNodeList:
    'com.thfund.riskcenter.facade.api.MonitorIndexFacade.getPublishIndexNodeList',

  // 查看指标分组结果
  getIndexGroupInfo: 'com.thfund.riskcenter.facade.api.MonitorIndexFacade.getIndexGroupInfo',

  getIndexGroupList: 'com.thfund.riskcenter.facade.api.MonitorIndexFacade.getIndexGroupList',

  // 复合子过滤条件
  getNodeByOriginIdAndNodeId:
    'com.thfund.riskcenter.facade.api.MonitorIndexFacade.getNodeByOriginIdAndNodeId',

  // 通过类型查看指标节点信息
  getIndexNodeInfoByType:
    'com.thfund.riskcenter.facade.api.MonitorIndexFacade.getIndexNodeInfoByType',

  // 查看指标节点结果列表
  getIndexNodeResultList:
    'com.thfund.riskcenter.facade.api.MonitorIndexFacade.getIndexNodeResultList',

  //后台管理
  //数据源分页查询
  EsQueryIntegrationSourceByPage:
    'com.thfund.fundmp.facade.es.EsIntegrationSourceFacade.queryIntegrationSourceByPage',
  //数据源分页查询
  EsIntegrationSourceQuery:
    'com.thfund.fundmp.facade.es.EsIntegrationSourceFacade.queryIntegrationSource',
  //数据源新建
  EsAddIntegrationSource:
    'com.thfund.fundmp.facade.es.EsIntegrationSourceFacade.addIntegrationSource',
  //数据源修改`
  EsEditIntegrationSource:
    'com.thfund.fundmp.facade.es.EsIntegrationSourceFacade.editIntegrationSource',
  //数据源删除
  EsDeleteIntegrationSource:
    'com.thfund.fundmp.facade.es.EsIntegrationSourceFacade.deleteIntegrationSource',
  //数据源删除
  EsTestConn: 'com.thfund.fundmp.facade.es.EsIntegrationSourceFacade.testConn',

  //后台管理
  //es任务监控
  QueryIndexInfo: 'com.thfund.fundmp.facade.es.EsIndexInfoFacade.queryIndexInfo',

  //es状态查询
  queryStatusByPage: 'com.thfund.fundmp.facade.es.EsIndexInfoFacade.queryStatusByPage',
  //es任务查询
  queryLogByPage: 'com.thfund.fundmp.facade.es.EsIndexInfoFacade.queryLogByPage',

  //es查询数据及列信息
  EsIntegrationSourceFacadeRunSqlWithColumn:
    'com.thfund.fundmp.facade.es.EsIntegrationSourceFacade.runSqlWithColumn',
  //es查询表的列信息
  EsIntegrationSourceFacadeQueryColumnInfo:
    'com.thfund.fundmp.facade.es.EsIntegrationSourceFacade.queryColumnInfo',
  //es查询表的表信息
  EsIntegrationSourceFacadeQueryTableInfo:
    'com.thfund.fundmp.facade.es.EsIntegrationSourceFacade.queryTableInfo',
  //es查询表的表信息
  EsIntegrationSourceFacadeQueryTableInfoPart:
    'com.thfund.fundmp.facade.es.EsIntegrationSourceFacade.queryTableInfoPart',

  //es索引信息查询
  EsIndexInfoFacadeQueryIndexInfo: 'com.thfund.fundmp.facade.es.EsIndexInfoFacade.queryIndexInfo',

  //es索引任务获取字典
  EsDataSyncTaskFacadeGetEsDic: 'com.thfund.fundmp.facade.es.EsDataSyncTaskFacade.getEsDic',
  //es索引任务查询记录
  EsDataSyncTaskFacadeQueryDataSyncTask:
    'com.thfund.fundmp.facade.es.EsDataSyncTaskFacade.queryDataSyncTask',
  //es索引任务查询记录
  EsDataSyncTaskFacadeQueryDataSyncTaskSimple:
    'com.thfund.fundmp.facade.es.EsDataSyncTaskFacade.queryDataSyncTaskSimple',
  //es索引任务查询记录
  EsDataSyncTaskFacadeGetDataSyncTask:
    'com.thfund.fundmp.facade.es.EsDataSyncTaskFacade.getDataSyncTask',
  //es索引任务保存
  EsDataSyncTaskFacadeSaveDataSyncTask:
    'com.thfund.fundmp.facade.es.EsDataSyncTaskFacade.saveDataSyncTask',
  //es索引任务获取字典
  EsDataSyncTaskFacadeCancelDataSyncTask:
    'com.thfund.fundmp.facade.es.EsDataSyncTaskFacade.cancelDataSyncTask',
  //es索引任务发布
  EsDataSyncTaskFacadePublishDataSyncTask:
    'com.thfund.fundmp.facade.es.EsDataSyncTaskFacade.publishDataSyncTask',
  //es索引任务放弃修改
  EsDataSyncTaskFacadeForgoDataSyncTask:
    'com.thfund.fundmp.facade.es.EsDataSyncTaskFacade.forgoDataSyncTask',

  //研报其它新闻信息
  ResearchReportDataFacadeGetOtherWebNewsInfo:
    'com.thfund.fundmp.facade.research.ResearchReportDataFacade.getOtherWebNewsInfo',

  //es数据查询
  EsIndexDataInfoFacadeQueryEsDataByPage:
    'com.thfund.fundmp.facade.es.EsIndexDataInfoFacade.queryEsDataByPage',
  //es数据查询
  EsIndexDataInfoFacadeQuerySimpleEsDataByPage:
    'com.thfund.fundmp.facade.es.EsIndexDataInfoFacade.querySimpleEsDataByPage',
  //es,json查询
  EsIndexDataInfoFacadeSearchIndexByJson:
    'com.thfund.fundmp.facade.es.EsIndexDataInfoFacade.searchIndexByJson',
  //es.agg
  EsIndexDataInfoFacadeAggEsData: 'com.thfund.fundmp.facade.es.EsIndexDataInfoFacade.aggEsData',
  //es数据总数查询
  EsIndexDataInfoFacadeCountRecord: 'com.thfund.fundmp.facade.es.EsIndexDataInfoFacade.countRecord',
  //cat查询
  EsIndexInfoFacadeExecuteCat: 'com.thfund.fundmp.facade.es.EsIndexInfoFacade.executeCat',
  //删除索引
  EsIndexInfoFacadeDeleteIndex: 'com.thfund.fundmp.facade.es.EsIndexInfoFacade.deleteIndex',
  //执行任务
  EsIndexInfoFacadeRunIndexTask: 'com.thfund.fundmp.facade.es.EsIndexInfoFacade.runIndexTask',
  //中止任务
  EsIndexInfoFacadeStopTask: 'com.thfund.fundmp.facade.es.EsIndexInfoFacade.stopTask',
  //查看情况
  EsIndexInfoFacadeGetRunTaskInfo: 'com.thfund.fundmp.facade.es.EsIndexInfoFacade.getRunTaskInfo',
  //管理查询
  EsIndexInfoFacadeQueryTaskManageByPage:
    'com.thfund.fundmp.facade.es.EsIndexInfoFacade.queryTaskManageByPage',
  //机构查询
  EsStockInfoFacadeQueryBrokerInfo: 'com.thfund.fundmp.facade.es.EsStockInfoFacade.queryBrokerInfo',
  //证券查询
  EsStockInfoFacadeQueryStockInfo: 'com.thfund.fundmp.facade.es.EsStockInfoFacade.queryStockInfo',

  /**
   *  股票研究页面相关接口
   */
  // 证券树查询
  IrReportFacadeQueryIrStockTree: 'com.thfund.fundmp.facade.ir.IrReportFacade.queryIrStockTree',
  IrReportFacadeQueryIrStockTreeByUserName:
    'com.thfund.fundmp.facade.ir.IrReportFacade.queryIrStockTreeByUserName',
  // 研究动态查询
  IrReportFacadeQueryByPage: 'com.thfund.fundmp.facade.ir.IrReportFacade.queryIrReportInfoByPage',
  // 研究动态分组查询
  IrReportFacadeQueryIrReportInfoGroupByPage:
    'com.thfund.fundmp.facade.ir.IrReportFacade.queryIrReportInfoGroupByPage',
  // 内部用户信息查询
  IrReportFacadeQueryIrUserInfo: 'com.thfund.fundmp.facade.ir.IrReportFacade.queryIrUserInfo',
  // 内部研究码表查询
  IrReportFacadeQuerySysConfigCode: 'com.thfund.fundmp.facade.ir.IrReportFacade.querySysConfigCode',
  //datarun.stock
  DataRunFacadeQuerySecurityDayHistoryRange:
    'com.thfund.fundmp.facade.datarun.DataRunFacade.querySecurityDayHistoryRange',
  //权限验证
  IrReportFacadeAuthUser: 'com.thfund.fundmp.facade.ir.IrReportFacade.authUser',
  //datarun股票信息
  DataRunFacadeGetSecurityDayDerivativeRangeNew:
    'com.thfund.fundmp.facade.datarun.DataRunFacade.getSecurityDayDerivativeRangeNew',
  //datarun股票信息
  DataRunFacadeQuerySecurityDayDerivativeRange:
    'com.thfund.fundmp.facade.datarun.DataRunFacade.querySecurityDayDerivativeRange',
  //查询交易标签
  IrReportFacadeQueryRecommendRecord:
    'com.thfund.fundmp.facade.ir.IrReportFacade.queryRecommendRecord',
  //查询范围
  IrReportFacadeQueryTargetRand: 'com.thfund.fundmp.facade.ir.IrReportFacade.queryTargetRand',
  //oss
  IrReportFacadeGetOssUrl: 'com.thfund.fundmp.facade.ir.IrReportFacade.getOssUrl',
  //user.add
  IrReportFacadeAddIrUserInfo: 'com.thfund.fundmp.facade.ir.IrReportFacade.addIrUserInfo',
  //user.edit
  IrReportFacadeEditIrUserInfo: 'com.thfund.fundmp.facade.ir.IrReportFacade.editIrUserInfo',
  //user.delete
  IrReportFacadeDeleteIrUserInfo: 'com.thfund.fundmp.facade.ir.IrReportFacade.deleteIrUserInfo',
  //user.query
  IrReportFacadeQueryIrUserInfoByPage:
    'com.thfund.fundmp.facade.ir.IrReportFacade.queryIrUserInfoByPage',
  //sysaccount
  IrReportFacadeQuerySysAccount: 'com.thfund.fundmp.facade.ir.IrReportFacade.querySysAccount',
  //wxuser
  IrReportFacadeQueryWxUser: 'com.thfund.fundmp.facade.ir.IrReportFacade.queryWxUser',
  //wxuserpart
  IrReportFacadeQueryWxUserPart: 'com.thfund.fundmp.facade.ir.IrReportFacade.queryWxUserPart',
  //wechatgroup
  IrReportFacadeQueryWechatGroup: 'com.thfund.fundmp.facade.ir.IrReportFacade.queryWechatGroup',
  //权限验证
  IrReportFacadeAuthUserManage: 'com.thfund.fundmp.facade.ir.IrReportFacade.authUserManage',
  //用户关注列表查询
  IrFollowFacadeQueryIrFollowList: 'com.thfund.fundmp.facade.ir.IrFollowFacade.queryIrFollowList',
  //用户关注列表新增
  IrFollowFacadeInsertIrFollowList: 'com.thfund.fundmp.facade.ir.IrFollowFacade.insertIrFollowList',
  //用户关注列表修改
  IrFollowFacadeUpdateIrFollowList: 'com.thfund.fundmp.facade.ir.IrFollowFacade.updateIrFollowList',
  //用户关注列表删除
  IrFollowFacadeDeleteIrFollowList: 'com.thfund.fundmp.facade.ir.IrFollowFacade.deleteIrFollowList',

  /** 行业数据库 */
  //行业树查询
  IndexDataInfoFacadeQueryIndexTypeInfo:
    'com.thfund.fundmp.facade.index.IndexDataInfoFacade.queryIndexTypeInfo',
  //指标查询
  IndexDataInfoFacadeQueryMasterInfo:
    'com.thfund.fundmp.facade.index.IndexDataInfoFacade.queryMasterInfo',
  //新增指标
  IndexDataInfoFacadeAddMasterInfo:
    'com.thfund.fundmp.facade.index.IndexDataInfoFacade.addMasterInfo',
  //指标数据
  IndexDataInfoFacadeQueryMasterData:
    'com.thfund.fundmp.facade.index.IndexDataInfoFacade.queryMasterData',
  //查询模板
  IndustryTemplateInfoFacadeQueryTemplateInfo:
    'com.thfund.fundmp.facade.index.IndustryTemplateInfoFacade.queryTemplateInfo',
  //获取模板
  IndustryTemplateInfoFacadeGetTemplateInfo:
    'com.thfund.fundmp.facade.index.IndustryTemplateInfoFacade.getTemplateInfo',
  //保存模板
  IndustryTemplateInfoFacadeAddTemplateInfo:
    'com.thfund.fundmp.facade.index.IndustryTemplateInfoFacade.addTemplateInfo',
  //修改模板
  IndustryTemplateInfoFacadeEditTemplateInfo:
    'com.thfund.fundmp.facade.index.IndustryTemplateInfoFacade.editTemplateInfo',
  //删除模板
  IndustryTemplateInfoFacadeDeleteTemplateInfo:
    'com.thfund.fundmp.facade.index.IndustryTemplateInfoFacade.deleteTemplateInfo',

  /** 报告配置管理 */
  // 列表查询
  QueryScriptList: 'com.thfund.riskcenter.facade.api.rpt.RptScriptFacade.queryScriptList',
  // 新增or修改
  SaveScript: 'com.thfund.riskcenter.facade.api.rpt.RptScriptFacade.saveScript',
  // 删除
  DeleteScriptById: 'com.thfund.riskcenter.facade.api.rpt.RptScriptFacade.deleteScriptById',
  // 查看详情
  QueryScriptDetail: 'com.thfund.riskcenter.facade.api.rpt.RptScriptFacade.queryScriptDetail',
  // 参数查询
  QueryScriptTypeEnum: 'com.thfund.riskcenter.facade.api.rpt.RptScriptFacade.queryScriptTypeEnum',

  // 收益详情列表查询
  MpPortfolioAnalyseFacadeQuery: 'com.thfund.fundmp.facade.mppro.mp.MpPortfolioAnalyseFacade.query',
  // 收益分析视图查询
  MpPortfolioAnalyseFacadeQueryCharts:
    'com.thfund.fundmp.facade.mppro.mp.MpPortfolioAnalyseFacade.queryCharts',
  // 收益详情子列表查询
  MpPortfolioAnalyseFacadeQueryChildrenList:
    'com.thfund.fundmp.facade.mppro.mp.MpPortfolioAnalyseFacade.queryChildrenList',
  // 收益详情导出
  MpPortfolioAnalyseFacadeExportData:
    'com.thfund.fundmp.facade.mppro.mp.MpPortfolioAnalyseFacade.exportData',

  // 组合页面-业务域查询
  MpDomainFacadeImplQueryMpDomain:
    'com.thfund.fundmp.service.facade.sales.mppro.mp.impl.MpDomainFacadeImpl.queryMpDomain',
  // 撤销调整
  MpRsHoldChgFacadeRevokeAdjustment:
    'com.thfund.fundmp.facade.mppro.mp.research.MpRsHoldChgFacade.revokeAdjustment',
  MpRsHoldChgFacadeGetExcelTempleUrl:
    'com.thfund.fundmp.facade.mppro.mp.research.MpRsHoldChgFacade.getExcelTempleUrl',

  // 固收量化平台
  // 查询业务数据信息列表接口
  getBizInfoList:
    'com.thfund.riskcenter.facade.api.analysisplatform.ApModelFacade.queryModelAppDataList',
  // 查询用户侧展示用模板详情
  getUseTemplateDetail:
    'com.thfund.riskcenter.facade.api.analysisplatform.ApModelFacade.queryModelApp',
  // 查询所有模型模板
  getAllTemplate:
    'com.thfund.riskcenter.facade.api.analysisplatform.ApModelFacade.queryModelIdList',
  // 下载查询的业务信息文件
  downloadBizInfoList:
    'com.thfund.riskcenter.facade.api.analysisplatform.ApModelFacade.downloadModelAppDataList',

  // 管理态查询模型信息列表
  queryTemplateList:
    'com.thfund.riskcenter.facade.api.analysisplatform.ApModelFacade.queryModelSummaryList',
  // 查询管理态侧展示用模板详情
  queryEditTemplateDetail:
    'com.thfund.riskcenter.facade.api.analysisplatform.ApModelFacade.queryModelMgt',
  // 添加模型模板
  addModuleTemplate: 'com.thfund.riskcenter.facade.api.analysisplatform.ApModelFacade.editModelMgt',
  // 修改模型模板 同添加
  updateModuleTemplate:
    'com.thfund.riskcenter.facade.api.analysisplatform.ApModelFacade.editModelMgt',
  // 删除模型模板
  deleteModuleTemplate:
    'com.thfund.riskcenter.facade.api.analysisplatform.ApModelFacade.deleteModelMgt',

  //组合分析
  // 股票查询
  queryStockByPage: 'com.thfund.fundmp.facade.pra.PortfolioHoldFacade.queryStockByPage',
  // 转债查询
  queryBondByPage: 'com.thfund.fundmp.facade.pra.PortfolioHoldFacade.queryBondByPage',
  // 获取股票导出url
  getStockExportUrl: 'com.thfund.fundmp.facade.pra.PortfolioHoldFacade.getStockExportUrl',
  // 获取转债导出url
  getBondExportUrl: 'com.thfund.fundmp.facade.pra.PortfolioHoldFacade.getBondExportUrl',
  // 查询申万行业
  querySwClassifyLevelOne:
    'com.thfund.fundmp.facade.pra.PortfolioHoldFacade.querySwClassifyLevelOne',
};
