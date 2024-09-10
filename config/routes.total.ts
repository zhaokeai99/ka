export default [
  {
    path: '/dashboard/my',
    component: './Dashboard',
  },
  {
    path: '/production/summary/hotFundIndex/_single_',
    component: './Production/HotFundIndex',
  },
  {
    path: '/production/summary/index',
    component: './Production/Index',
  },
  {
    path: '/production/summary/hotFundDetailList',
    component: './Production/HotFundDetailList',
  },
  {
    path: '/production/summary/hotFundIndex/_single_/:type?',
    component: './Production/HotFundIndex',
  },
  {
    path: '/production/summary/indexFundMainPage',
    component: './Production/IndexFundMainPage',
  },
  {
    path: '/production/summary/fundPk/_single_/:fundCodes?',
    component: './Production/Pk/Fund',
  },
  {
    path: '/production/summary/fundPk/_single_',
    component: './Production/Pk/Fund',
  },
  {
    path: '/production/summary/managerPk/_single_/:managerCodes?',
    component: './Production/Pk/Manager',
  },
  {
    path: '/production/summary/managerPk/_single_',
    component: './Production/Pk/Manager',
  },
  {
    path: '/production/summary/companyPk/_single_/:fundCodes?',
    component: './Production/Pk/Company',
  },
  {
    path: '/production/summary/companyPk/_single_',
    component: './Production/Pk/Company',
  },
  {
    path: '/production/report/competitorRegister',
    component: './Production/CompetitorRegister',
  },
  {
    path: '/production/report/indexWeight',
    component: './Production/IndexWeight',
  },
  {
    path: '/production/report/endDate',
    component: './Production/Manufacturer/EndDate',
  },
  {
    path: '/production/report/pdAuditPolicy',
    component: './Production/PdAuditPolicy',
  },
  {
    path: '/production/report/raiseReport',
    component: './Production/Raisereport',
  },
  {
    path: '/production/report/announcementList',
    component: './Production/AnnouncementList',
  },
  {
    path: '/production/report/indexFee',
    component: './Production/Manufacturer/IndexFee',
  },
  {
    path: '/production/report/indexParameters',
    component: './Production/IndexParameters',
  },
  {
    path: '/production/report/indexStock',
    component: './Production/IndexStock',
  },
  {
    path: '/production/report/indexMap',
    component: './Production/IndexMap',
  },
  {
    path: '/production/report/indexControl',
    component: './Production/IndexControl',
  },
  {
    path: '/production/report/fundMonitoring',
    component: './Production/FundMonitoring',
  },
  {
    path: '/production/report/publicPlacement',
    component: './Production/PublicPlacement',
  },
  {
    path: '/production/businessManage/complianceLibrary',
    component: './Production/complianceLibrary',
  },
  {
    path: '/production/businessManage/trailingCommission',
    component: './Production/trailingCommission',
  },
  {
    path: '/production/businessManage/fundOpenAccount',
    component: './Production/FundOpenAccount/Apply',
  },
  {
    path: '/production/businessManage/registrationManage',
    component: './Production/FundOpenAccount/RegistrationManage',
  },
  {
    path: '/production/businessManage/documentPrepare',
    component: './Production/FundOpenAccount/DocumentPrepare',
  },
  {
    path: '/production/businessManage/messageManage',
    component: './Production/FundOpenAccount/MessageMange',
  },
  {
    path: '/production/businessManage/seatManage',
    component: './Production/FundOpenAccount/SeatManage',
  },
  {
    path: '/production/setting/classify',
    component: './Production/Classify',
  },
  {
    path: '/production/setting/dataBrowser',
    component: './Production/DataBrowser',
  },
  {
    path: '/production/setting/securityIndustrySystem',
    component: './Production/SecurityIndustrySystem',
  },
  {
    path: '/production/setting/portfolio',
    component: './Production/Portfolio',
  },
  {
    path: '/production/setting/parameterTable',
    component: './Production/ParameterTable',
  },
  {
    path: '/production/setting/parameterConfig/:fundId/:actionType',
    component: './Production/ParameterTable/ParameterConfig',
  },
  {
    path: '/production/setting/parameterConfig/:fundId/:actionType/:versionId?',
    component: './Production/ParameterTable/ParameterConfig',
  },
  {
    path: '/production/setting/linkList',
    component: './Production/LinkList',
  },
  {
    path: '/production/setting/parameterManage',
    component: './Production/ParameterManage',
  },
  {
    path: '/production/setting/parameterManage/detailFile/:fundId/:type',
    component: './Production/ParameterManage/DetailFile',
  },
  {
    path: '/production/setting/labelSystem',
    component: './Production/LabelSystem',
  },
  {
    path: '/production/index/detail/:fundId',
    component: './Production/IndexDetail',
  },
  {
    path: '/production/index/newDetail/:fundCode',
    component: './Production/IndexDetail',
  },
  {
    path: '/production/fundManager/:code',
    component: './Production/FundManager',
  },
  {
    path: '/production/fundCompany/:code',
    component: './Production/FundCompany',
  },
  {
    path: '/production/indexStock/detail/:indexCode',
    component: './Production/IndexStock/Detail',
  },
  {
    path: '/production/indexStock/compare/_single_/:indexCodes',
    component: './Production/IndexStock/Compare',
  },
  {
    path: '/production/securityIndustrySystem/detail/:id/:name/:isCustom',
    component: './Production/SecurityIndustrySystem/Detail',
  },
  {
    path: '/marketing/app/marketing/mainPage',
    component: './Marketing/MainPage',
  },
  {
    path: '/marketing/app/channelDistribution',
    component: './Marketing/ChannelDistribution',
  },
  {
    path: '/marketing/app/roadShow/mainPage',
    component: './Marketing/RoadShow/MainPage',
  },
  {
    path: '/marketing/app/cloudMapApplication',
    component: './Marketing/CloudMapApplication',
  },
  {
    path: '/marketing/app/vogBoard',
    component: './Marketing/VogBoard',
  },
  {
    path: '/marketing/app/product',
    component: './Marketing/Product',
  },
  {
    path: '/marketing/app/channelOnLine',
    component: './Marketing/ChannelOnLine',
  },
  {
    path: '/marketing/app/roadShow/edit',
    component: './Marketing/RoadShow/EditPage',
  },
  {
    path: '/marketing/app/roadShow/new',
    component: './Marketing/RoadShow/NewPage',
  },
  {
    path: '/marketing/app/product/detail/:fundCode',
    component: './Marketing/Product/Detail',
  },
  {
    path: '/marketing/sellconfig/saleBoard',
    component: './Marketing/SaleBoard',
  },
  {
    path: '/marketing/sellconfig/dataConfig/panel',
    component: './Marketing/DataConfig/Panel',
  },
  {
    path: '/marketing/sellconfig/menuCrm',
    component: './Marketing/MenuCRM',
  },
  {
    path: '/marketing/sellconfig/dataConfig/authority',
    component: './Marketing/DataConfig/Authority',
  },
  {
    path: '/marketing/sellconfig/honorHall',
    component: './Marketing/HonorHall',
  },
  {
    path: '/marketing/sellconfig/agencyService',
    component: './Marketing/AgencyService',
  },
  {
    path: '/marketing/sellconfig/fundsalesmrksupport',
    component: './Fundsalesmrksupport/Manage',
  },
  {
    path: '/marketing/sellconfig/channelDistribution/detail/:agencyCode',
    component: './Marketing/ChannelDistribution/Detail',
  },
  {
    path: '/marketing/marketingMaterial/category',
    component: './Marketing/MarketingMaterial/Category',
  },
  {
    path: '/marketing/marketingMaterial/material',
    component: './Marketing/MarketingMaterial/Material',
  },
  {
    path: '/marketing/marketingMaterial/label',
    component: './Marketing/MarketingMaterial/Label',
  },
  {
    path: '/marketing/advisorCRM/customerQuery',
    component: './Marketing/AdvisorCRM/CustomerQuery',
  },
  {
    path: '/marketing/advisorCRM/customerBelongTo',
    component: './Marketing/AdvisorCRM/CustomerBelongTo',
  },
  {
    path: '/marketing/advisorCRM/myCustomers',
    component: './Marketing/AdvisorCRM/MyCustomers',
  },
  {
    path: '/marketing/advisorCRM/motTriggerResult',
    component: './Marketing/AdvisorCRM/MotTriggerResult',
  },
  {
    path: '/marketing/advisorCRM/myMotTask',
    component: './Marketing/AdvisorCRM/MyMotTask',
  },
  {
    path: '/marketing/advisorCRM/customerQueryLog',
    component: './Marketing/AdvisorCRM/AccessLog/CustomerQueryLog',
  },
  {
    path: '/data_browser/index',
    microName: 'data_browser',
  },
  {
    path: '/industry_chaincore/index',
    microName: 'industry_chaincore',
  },
  {
    path: '/fundoper/works',
    microName: 'oper_mng',
  },
  {
    path: '/fundoper/admin/organizer/users',
    microName: 'oper_mng',
  },
  {
    path: '/fundoper/admin/organizer/group',
    microName: 'oper_mng',
  },
  {
    path: '/fundoper/admin/organizer/post',
    microName: 'oper_mng',
  },
  {
    path: '/fundoper/admin/fund',
    microName: 'oper_mng',
  },
  {
    path: '/fundoper/admin/flow',
    microName: 'oper_mng',
  },
  {
    path: '/fundoper/admin/sys/dictionary',
    microName: 'oper_mng',
  },
  {
    path: '/fundoper/admin/sys/taskSchedule',
    microName: 'oper_mng',
  },
  {
    path: '/industrialChain/index',
    component: './IndustrialChain/HomePage',
  },
  {
    path: '/industrialChain/allChain',
    component: './IndustrialChain/AllChain',
  },
  {
    path: '/industrialChain/chainDetail/:name/:id',
    component: './IndustrialChain/ChainDetail',
  },
  {
    path: '/industrialChain/industryCenter/:name/:id/:chain',
    component: './IndustrialChain/IndustryCenter',
  },
  {
    path: '/industrialChain/restoAnalyse',
    component: './IndustrialChain/Restoanalyse',
  },
  {
    path: '/industrialChain/modelData/景气度因子',
    component: './IndustrialChain/ModelData',
  },
  {
    path: '/industrialChain/modelData/:name',
    component: './IndustrialChain/ModelData',
  },
  {
    path: '/industrialChain/industryPO',
    component: './IndustrialChain/IndustryPO',
  },
  {
    path: '/industrialChain/IndustryPolicy',
    component: './IndustrialChain/IndustryPolicy',
  },
  {
    path: '/industrialChain/policyDetail/:id',
    component: './IndustrialChain/IndustryPolicy/PolicyDetail',
  },
  {
    path: '/industrialChain/publicOpinionDetail/:id',
    component: './IndustrialChain/IndustryPO/PublicOpinionDetail',
  },
  {
    path: '/industrialChain/reportDetail/:id',
    component: './IndustrialChain/ReportDetail',
  },
  {
    path: '/industrialChain/tracking/:name/:id',
    component: './IndustrialChain/Tracking',
  },
  {
    path: '/industrialChain/set/movePush',
    component: './IndustrialChain/Set/MovePush',
  },
  {
    path: '/industrialChain/tracking/光伏/S004955673发电量:太阳能:当月值',
    component: './IndustrialChain/Tracking',
  },
  {
    path: '/information/publicOpinion/narrow',
    component: './Information/PublicOpinion/Narrow',
  },
  {
    path: '/information/publicOpinion/industry',
    component: './Information/PublicOpinion/Industry',
  },
  {
    path: '/information/publicOpinion/publicOpinionDetail/:id',
    component: './Information/PublicOpinion/PublicOpinionDetail',
  },
  {
    path: '/information/publicOpinion/fundManager',
    component: './Information/PublicOpinion/FundManager',
  },
  {
    path: '/information/publicOpinion/riskReport',
    component: './Information/RiskReport',
  },
  {
    path: '/information/priceChanges/bond',
    component: './Information/PriceChanges/Bond',
  },
  {
    path: '/information/priceChanges/stock',
    component: './Information/PriceChanges/Stock',
  },
  {
    path: '/information/priceChanges/couponIntraday/:id',
    component: './Information/PriceChanges/CouponIntraday',
  },
  {
    path: '/information/priceChanges/couponAfter/:id',
    component: './Information/PriceChanges/CouponAfter',
  },
  {
    path: '/information/priceChanges/stockDetail/:name/:id',
    component: './Information/PriceChanges/StockDetail',
  },
  {
    path: '/information/priceChanges/subjectDetail/:name/:id',
    component: './Information/PriceChanges/SubjectDetail',
  },
  {
    path: '/information/dataManager/rateAgency',
    component: './Information/RateAgency',
  },
  {
    path: '/information/dataManager/defaultedBonds',
    component: './Information/DefaultedBonds',
  },
  {
    path: '/information/dataManager/codeTable',
    component: './Information/CodeTable',
  },
  {
    path: '/investment/investmentInfoManagement/brokerInfoManagement',
    component: './Investment/investmentInfoManagement/BrokerInfoManagement',
  },
  {
    path: '/investment/investmentInfoManagement/marketResearchReportData',
    component: './Investment/investmentInfoManagement/MarketResearchReport',
  },
  {
    path: '/investment/investmentInfoManagement/liveInfoManagement',
    component: './Investment/investmentInfoManagement/LiveInfoManagement',
  },
  // {
  //   path: '/investment/investmentInfoManagement/dataCenterIndexManagement',
  //   component: './Investment/investmentInfoManagement/DataCenterIndexManagement',
  // },
  {
    path: '/investment/stockresearch/alphaview',
    component: './Investment/StockResearch/AlphaView',
  },
  {
    path: '/investment/stockresearch/irUserManage',
    component: './Investment/StockResearch/irUserManage',
  },
  {
    path: '/investment/portfolio/portfolioManagement/_single_',
    component: './Investment/Simulation/PortfolioManagement',
  },
  {
    path: '/investment/portfolio/portfolioManagement/_single_/:params?',
    component: './Investment/Simulation/PortfolioManagement',
  },
  {
    path: '/investment/portfolio/mpHoldItemSearch/_single_/:params',
    component: './Investment/Simulation/PortfolioManagement/Tabs/HistorySearch/MpHoldItemSearch',
  },
  {
    path: '/investment/portfolio/mpHoldChgSearch/_single_/:params',
    component: './Investment/Simulation/PortfolioManagement/Tabs/HistorySearch/MpHoldChgSearch',
  },
  {
    path: '/investment/portfolio/mpDealSearch/_single_/:params',
    component: './Investment/Simulation/PortfolioManagement/Tabs/HistorySearch/MpDealSearch',
  },
  {
    path: '/investment/portfolio/mpAnalysis',
    component: './Investment/Simulation/MpAnalysis',
  },
  {
    path: '/investment/simulation/mainBenchmark',
    component: './Investment/Simulation/MainBenchmark',
  },
  {
    path: '/investment/simulation/benchmarks',
    component: './Investment/Simulation/Benchmarks',
  },
  {
    path: '/investment/simulation/singleIndexBenchmark',
    component: './Investment/Simulation/SingleIndexBenchmark',
  },
  {
    path: '/investment/simulation/customBenchmark',
    component: './Investment/Simulation/CustomBenchmark',
  },
  {
    path: '/investment/BackEndManagement/esTaskView',
    component: './Investment/BackEndManagement/EsTaskView',
  },
  {
    path: '/investment/BackEndManagement/dataSyncTaskManagement',
    component: './Investment/BackEndManagement/DataSyncTaskManagement',
  },
  {
    path: '/investment/creditRisks/principalMarket',
    component: './Investment/CreditRisks/PrincipalMarket',
  },
  {
    path: '/investment/creditRisks/subjectComparison/_single_/:fundCodes?',
    component: './Investment/CreditRisks/SubjectComparison',
  },
  {
    path: '/investment/creditRisks/subjectComparison/_single_',
    component: './Investment/CreditRisks/SubjectComparison',
  },
  {
    path: '/investment/creditRisks/mainMarketDaily',
    component: './Investment/CreditRisks/MainMarketDaily',
  },
  {
    path: '/investment/creditRisks/details/:id',
    component: './Investment/CreditRisks/Details',
  },
  {
    path: '/investment/creditRisks/scriptManagement',
    component: './Investment/CreditRisks/ScriptManagement',
  },
  {
    path: '/investment/creditRisks/moduleMng',
    component: './Investment/FixedIncome/ConfigMng',
  },
  {
    path: '/investment/creditRisks/fixedIncome',
    component: './Investment/FixedIncome/FixedIncomePage',
  },
  {
    path: '/investment/stockresearch/hold',
    component: './Investment/MpAnalysis/Hold',
  },
  {
    path: '/investment/creditRisks/riskDataSourceManagement',
    component: './Investment/RiskIndex/DataSource',
  },
  {
    path: '/investment/creditRisks/riskViewManagement',
    component: './Investment/RiskIndex/View',
  },
  {
    path: '/investment/creditRisks/riskIndexManagement',
    component: './Investment/RiskIndex/Index',
  },
  {
    path: '/lowcode/mng/uiComponentMng',
    component: './LowCode/Mng/UIComponentMng',
  },
  {
    path: '/lowcode/mng/bizComponentMng',
    component: './LowCode/Mng/BizComponentMng',
  },
  {
    path: '/lowcode/mng/pageMng',
    component: './LowCode/Mng/PageMng',
  },
  {
    path: '/lowcode/mng/EditBizComponent',
    component: './LowCode/Mng/BizComponentMng/EditBizComponent',
  },
  {
    path: '/lowcode/mng/EditLayout',
    component: './LowCode/Mng/PageMng/EditLayout',
  },
  {
    path: '/gateway/app',
    component: './Gateway/AppMng',
  },
  {
    path: '/gateway/api',
    component: './Gateway/APIMng',
  },
  // {
  //   redirect: '/404',
  // },
  {
    component: './404',
  },
];
