export default [
  {
    path: '/dashboard_',
    name: '我的',
    children: [
      {
        path: '/dashboard/my',
        name: '我的主页',
        isFirst: true,
        authDingId: 'ytfjcr5',
        icon: 'ContactsOutlined',
      },
    ],
  },
  {
    path: '/production_',
    name: '产品',
    children: [
      {
        path: '/production/summary/hotFundIndex/_single_',
        name: '产品索引',
        isFirst: true,
        authDingId: 'ytfjcr5',
        icon: 'ProfileOutlined',
        solutionCode: 'PAGE_GUIDE_PRODUCTION_SUMMAY_HOTFUNDINDEX_SOLUTION',
        positionCode: 'PAGE_GUIDE_PRODUCTION_SUMMAY_HOTFUNDINDEX',
      },
      {
        path: '/fundoper/works',
        name: '运营工作台',
        microName: 'oper_mng',
        isFirst: true,
        authDingId: 'dw6mm0z',
        icon: 'TableOutlined',
      },
      {
        path: '/productionAnalysis',
        name: '产品分析',
        icon: 'AreaChartOutlined',
        children: [
          {
            path: '/production/summary/index',
            name: '基金概览',
            authDingId: 'ytfjcr5',
          },
          {
            path: '/production/report/competitorRegister',
            name: '竞品注册动态',
            authDingId: 'ytfjcr5',
          },
          {
            path: '/production/report/pdAuditPolicy',
            name: '公募产品审核政策',
            authDingId: 'ytfjcr5',
          },
          {
            path: '/production/report/publicPlacement',
            name: '公募产品变动管理',
            authDingId: 'ytfjcr5',
          },
        ],
      },
      {
        path: '/indexTopics',
        name: '指数专题',
        icon: 'FundOutlined',
        children: [
          {
            path: '/production/summary/indexFundMainPage',
            name: 'ETF实时大盘',
            authDingId: 'ytfjcr5',
          },
          {
            path: '/production/report/indexStock',
            name: '指数索引',
            authDingId: 'ytfjcr5',
          },
          {
            path: '/production/report/indexWeight',
            name: '指数权重',
            authDingId: 'ytfjcr5',
          },
          {
            path: '/production/report/indexParameters',
            name: '指数参数配置',
            authDingId: 'ytfjcr5',
          },
          {
            path: '/production/report/indexControl',
            name: '指数资金分析',
            authDingId: 'ytfjcr5',
          },
          {
            path: '/production/report/announcementList',
            name: '指数动态公告',
            authDingId: 'ytfjcr5',
          },
          {
            path: '/production/report/indexMap',
            name: '指数产品地图',
            authDingId: 'ytfjcr5',
          },
          {
            path: '/production/report/fundMonitoring',
            name: 'ETF资金监控',
            authDingId: 'ytfjcr5',
          },
        ],
      },
      {
        path: '/productOperating',
        name: '产品运营',
        icon: 'DesktopOutlined',
        children: [
          {
            path: '/production/setting/parameterManage',
            name: 'O3参数表',
            authDingId: 'ytfjcr5',
          },
          {
            path: '/production/setting/parameterTable',
            name: 'TA参数表',
            authDingId: 'ytfjcr5',
          },
          {
            path: '/production/setting/linkList',
            name: '运营业务联系人',
            authDingId: 'ytfjcr5',
          },
          {
            path: '/production/businessManage/fundOpenAccount',
            name: '开户申请',
            authDingId: 'ytfjcr5',
          },
          {
            path: '/production/businessManage/trailingCommission',
            name: '尾佣管理',
            authDingId: 'ytfjcr5',
          },
          {
            path: '/production/businessManage/documentPrepare',
            name: '开户材料准备',
            authDingId: 'ytfjcr5',
          },
          {
            path: '/production/report/raiseReport',
            name: '产品募集报告',
            authDingId: 'ytfjcr5',
          },
          {
            path: '/production/setting/portfolio',
            name: '产品资产组合',
            authDingId: 'ytfjcr5',
          },
          {
            path: '/production/report/indexFee',
            name: '指数使用费',
            authDingId: 'ytfjcr5',
          },
          {
            path: '/production/report/endDate',
            name: '终止日报告管理',
            authDingId: 'ytfjcr5',
          },
          {
            path: '/production/businessManage/registrationManage',
            name: '备案管理',
            authDingId: 'ytfjcr5',
          },
          {
            path: '/production/businessManage/messageManage',
            name: '开户信息管理',
            authDingId: 'ytfjcr5',
          },
          {
            path: '/production/businessManage/seatManage',
            name: '席位管理',
            authDingId: 'ytfjcr5',
          },
        ],
      },
      {
        path: '/configManage',
        name: '配置管理',
        icon: 'SettingOutlined',
        children: [
          {
            path: '/production/setting/classify',
            name: '产品分类树',
            authDingId: 'ytfjcr5',
          },
          {
            path: '/production/setting/securityIndustrySystem',
            name: '证券行业分类树',
            authDingId: 'ytfjcr5',
          },
          {
            path: '/production/setting/labelSystem',
            name: '业务标签树',
            authDingId: 'ytfjcr5',
          },
          {
            path: '/operateConfig',
            name: '运营配置',
            children: [
              {
                path: '/fundoper/admin/fund',
                name: '产品信息管理',
                microName: 'oper_mng',
                authDingId: 'dw6mm0z',
              },
              {
                path: '/personOrganMgt',
                name: '人员组织管理',
                children: [
                  {
                    path: '/fundoper/admin/organizer/users',
                    name: '业务人员信息',
                    microName: 'oper_mng',
                    authDingId: 'dw6mm0z',
                  },
                  {
                    path: '/fundoper/admin/organizer/group',
                    name: '业务分组信息',
                    microName: 'oper_mng',
                    authDingId: 'dw6mm0z',
                  },
                  {
                    path: '/fundoper/admin/organizer/post',
                    name: '业务岗位信息',
                    microName: 'oper_mng',
                    authDingId: 'dw6mm0z',
                  },
                ],
              },
              {
                path: '/fundoper/admin/flow',
                name: '业务流程管理',
                microName: 'oper_mng',
                authDingId: 'dw6mm0z',
              },
              {
                path: '/fundoper/admin/sys/dictionary',
                name: '字典管理',
                microName: 'oper_mng',
                authDingId: 'dw6mm0z',
              },
              {
                path: '/fundoper/admin/sys/taskSchedule',
                name: '定时任务',
                microName: 'oper_mng',
                authDingId: 'dw6mm0z',
              },
            ],
          },
          {
            path: '/production/businessManage/complianceLibrary',
            name: '合规文库',
            authDingId: 'ytfjcr5',
          },
        ],
      },
      {
        path: '/production/index/detail/:fundId',
        name: '基金详情',
        authDingId: 'ytfjcr5',
        hideInMenu: true,
      },
      {
        path: '/production/summary/hotFundDetailList',
        name: '基金索引',
        authDingId: 'ytfjcr5',
        hideInMenu: true,
      },
      {
        path: '/production/summary/hotFundIndex/_single_/:type?',
        name: '基金索引',
        authDingId: 'ytfjcr5',
        hideInMenu: true,
      },
      {
        path: '/production/summary/fundPk/_single_/:fundCodes?',
        name: '基金PK',
        authDingId: 'ytfjcr5',
        hideInMenu: true,
      },
      {
        path: '/production/summary/fundPk/_single_',
        name: '基金PK',
        authDingId: 'ytfjcr5',
        hideInMenu: true,
      },
      {
        path: '/production/summary/managerPk/_single_/:managerCodes?',
        name: '基金经理PK',
        authDingId: 'ytfjcr5',
        hideInMenu: true,
      },
      {
        path: '/production/summary/managerPk/_single_',
        name: '基金经理PK',
        authDingId: 'ytfjcr5',
        hideInMenu: true,
      },
      {
        path: '/production/summary/companyPk/_single_',
        name: '基金公司PK',
        authDingId: 'ytfjcr5',
        hideInMenu: true,
      },
      {
        path: '/production/summary/companyPk/_single_/:fundCodes?',
        name: '基金公司PK',
        authDingId: 'ytfjcr5',
        hideInMenu: true,
      },
      {
        path: '/production/index/newDetail/:fundCode',
        name: '基金详情',
        authDingId: 'ytfjcr5',
        hideInMenu: true,
      },
      {
        path: '/production/fundManager/:code',
        name: '基金经理详情',
        authDingId: 'ytfjcr5',
        hideInMenu: true,
      },
      {
        path: '/production/fundCompany/:code',
        name: '基金公司详情',
        authDingId: 'ytfjcr5',
        hideInMenu: true,
      },
      {
        path: '/production/indexStock/detail/:indexCode',
        name: '指数详情',
        authDingId: 'ytfjcr5',
        hideInMenu: true,
      },
      {
        path: '/production/indexStock/compare/_single_/:indexCodes',
        name: '指数对比',
        authDingId: 'ytfjcr5',
        hideInMenu: true,
      },
      {
        path: '/data_browser/index',
        name: '数据浏览器',
        microName: 'data_browser',
        authDingId: 'dcx93gn',
        // hideInMenu: true,
      },
      {
        path: '/industry_chaincore/index',
        name: '产业链',
        microName: 'industry_chaincore',
        authDingId: 'dcx93gn',
      },
      {
        path: '/production/setting/parameterConfig/:fundId/:actionType',
        name: 'TA参数表配置',
        hideInMenu: true,
        authDingId: 'ytfjcr5',
      },
      {
        path: '/production/setting/parameterConfig/:fundId/:actionType/:versionId?',
        name: 'TA参数表配置',
        hideInMenu: true,
        authDingId: 'ytfjcr5',
      },
      {
        path: '/production/setting/parameterManage/detailFile/:fundId/:type',
        name: 'O3参数表详情',
        hideInMenu: true,
        authDingId: 'ytfjcr5',
      },
      {
        path: '/production/securityIndustrySystem/detail/:id/:name/:isCustom',
        name: '配置详情',
        hideInMenu: true,
        authDingId: 'ytfjcr5',
      },
      {
        path: '/lowcode/mng/uiComponentMng',
        name: 'uiComponentMng',
        hideInMenu: true,
        authDingId: 'ytfjcr5',
      },
      {
        path: '/lowcode/mng/bizComponentMng',
        name: 'bizComponentMng',
        hideInMenu: true,
        authDingId: 'ytfjcr5',
      },
      {
        path: '/lowcode/mng/pageMng',
        name: 'pageMng',
        hideInMenu: true,
        authDingId: 'ytfjcr5',
      },
      {
        path: '/lowcode/mng/EditBizComponent',
        name: 'editBizComponent',
        hideInMenu: true,
        authDingId: 'ytfjcr5',
      },
      {
        path: '/lowcode/mng/EditLayout',
        name: 'editLayout',
        hideInMenu: true,
        authDingId: 'ytfjcr5',
      },
      {
        path: '/gateway/app',
        name: '网关应用管理',
        hideInMenu: true,
        authDingId: 'fenglvming',
      },
      {
        path: '/gateway/api',
        name: '网关接口管理',
        hideInMenu: true,
        authDingId: 'fenglvming',
      },
    ],
  },
  {
    path: '/investmentResearch_',
    name: '投研+',
    children: [
      {
        path: '/investmentInfoManagement',
        name: '投资数据聚合',
        icon: 'GlobalOutlined',
        children: [
          {
            path: '/investment/investmentInfoManagement/brokerInfoManagement',
            name: '天弘投条',
            authDingId: 'fenglvming',
            isFirst: true,
          },
          {
            path: '/investment/investmentInfoManagement/marketResearchReportData',
            name: '天弘研报',
            authDingId: 'fenglvming',
          },
          {
            path: '/investment/investmentInfoManagement/liveInfoManagement',
            name: '路演中心',
            authDingId: 'fenglvming',
          },
        ],
      },
      {
        path: '/stockResearch',
        name: '股票研究',
        icon: 'SlidersOutlined',
        children: [
          {
            path: '/investment/stockresearch/alphaview',
            name: 'AlphaView',
            authDingId: 'fenglvming',
          },
          {
            path: '/investment/stockresearch/hold',
            name: '权益雷达',
            authDingId: 'fenglvming',
          },
          // {
          //   path: '/investment/investmentInfoManagement/dataCenterIndexManagement',
          //   name: '行业数据库',
          //   authDingId: 'fenglvming',
          // },
          {
            path: '/investment/stockresearch/irUserManage',
            name: '用户管理',
            authDingId: 'fenglvming',
          },
        ],
      },
      {
        path: '/investmentPortfolio',
        name: '模拟组合',
        icon: 'BarChartOutlined',
        children: [
          {
            path: '/investment/portfolio/portfolioManagement/_single_',
            name: '组合管理',
            authDingId: 'fenglvming',
          },
          {
            path: '/investment/portfolio/mpAnalysis',
            name: '组合收益分析',
            authDingId: 'fenglvming',
          },
        ],
      },
      {
        path: '/investmentSimulation',
        name: '基准管理',
        icon: 'PullRequestOutlined',
        children: [
          {
            path: '/investment/simulation/mainBenchmark',
            name: '主基准管理',
            authDingId: 'fenglvming',
          },
          {
            path: '/investment/simulation/benchmarks',
            name: '复合基准',
            authDingId: 'fenglvming',
          },
          {
            path: '/investment/simulation/singleIndexBenchmark',
            name: '单市场基准',
            authDingId: 'fenglvming',
          },
          {
            path: '/investment/simulation/customBenchmark',
            name: '自定义基准',
            authDingId: 'fenglvming',
          },
        ],
      },
      {
        path: '/information',
        name: '资讯',
        icon: 'GlobalOutlined',
        children: [
          {
            path: '/informationPublicOpinion',
            name: '舆情',
            children: [
              {
                path: '/information/publicOpinion/narrow',
                name: '狭义负面舆情',
                authDingId: 'kgpjt53',
              },
              {
                path: '/information/publicOpinion/industry',
                name: '行业舆情',
                authDingId: 'kgpjt53',
              },
              {
                path: '/information/publicOpinion/fundManager',
                name: '基金经理面板',
                authDingId: 'kgpjt53',
              },
              {
                path: '/information/publicOpinion/riskReport',
                name: '个券信用风险报告',
                authDingId: 'kgpjt53',
              },
            ],
          },
          {
            path: '/informationPriceChanges',
            name: '价格异动',
            children: [
              {
                path: '/information/priceChanges/bond',
                name: '债券价格异动',
                authDingId: '1u2_vexans9c22',
              },
              {
                path: '/information/priceChanges/stock',
                name: '股票价格异动',
                authDingId: '1u2_vexans9c22',
              },
            ],
          },
          {
            path: '/informationDataManager',
            name: '管理',
            children: [
              {
                path: '/information/dataManager/rateAgency',
                name: '评级机构管理',
                authDingId: 'kgpjt53',
              },
              {
                path: '/information/dataManager/defaultedBonds',
                name: '违约债管理',
                authDingId: 'kgpjt53',
              },
              {
                path: '/information/dataManager/codeTable',
                name: '码表管理',
                authDingId: 'kgpjt53',
              },
            ],
          },
        ],
      },
      {
        path: '/quanFengOperating',
        name: '风险管理',
        icon: 'IssuesCloseOutlined',
        children: [
          {
            path: '/investment/creditRisks/principalMarket',
            name: '主体市场',
            authDingId: 'goldcomb',
          },
          {
            path: '/investment/creditRisks/subjectComparison/_single_',
            name: '主体对比',
            authDingId: 'zaqhzcf',
          },
          {
            path: '/investment/creditRisks/mainMarketDaily',
            name: '主体市场日报',
            authDingId: 'zaqhzcf',
          },
          {
            path: '/investment/creditRisks/scriptManagement',
            name: '脚本管理',
            authDingId: 'zaqhzcf',
          },
          {
            path: '/investment/creditRisks/riskDataSourceManagement',
            name: '数据源管理',
            authDingId: 'zaqhzcf',
          },
          {
            path: '/investment/creditRisks/riskViewManagement',
            name: '视图管理',
            authDingId: 'zaqhzcf',
          },
          {
            path: '/investment/creditRisks/riskIndexManagement',
            name: '指标管理',
            authDingId: 'zaqhzcf',
          },
          {
            path: '/investment/creditRisks/fixedIncome',
            name: '固收量化平台',
            authDingId: 'goldcomb',
          },
        ],
      },
      {
        path: '/investmentBackEndManagement',
        name: '管理后台',
        icon: 'SettingOutlined',
        children: [
          {
            path: '/investment/BackEndManagement/esTaskView',
            name: '搜索任务管理',
            authDingId: 'kgpjt53',
          },
          {
            path: '/investment/BackEndManagement/dataSyncTaskManagement',
            name: '任务配置',
            authDingId: 'kgpjt53',
          },
        ],
      },
      {
        path: '/information/publicOpinion/publicOpinionDetail/:id',
        name: '舆情详情',
        hideInMenu: true,
        authDingId: '138-4udgtxb7z3',
      },
      {
        path: '/information/priceChanges/couponIntraday/:id',
        name: '个券异动分析',
        hideInMenu: true,
        authDingId: '1u2_vexans9c22',
      },
      {
        path: '/information/priceChanges/couponAfter/:id',
        name: '个券异动分析',
        hideInMenu: true,
        authDingId: '1u2_vexans9c22',
      },
      {
        path: '/information/priceChanges/stockDetail/:name/:id',
        name: '股票详情',
        hideInMenu: true,
        authDingId: '1u2_vexans9c22',
      },
      {
        path: '/information/priceChanges/subjectDetail/:name/:id',
        name: '主体详情',
        hideInMenu: true,
        authDingId: '1u2_vexans9c22',
      },
      {
        path: '/investment/portfolio/portfolioManagement/_single_/:params?',
        name: '组合管理',
        hideInMenu: true,
        authDingId: 'fenglvming',
      },
      {
        path: '/investment/portfolio/mpHoldItemSearch/_single_/:params',
        name: '组合持仓',
        hideInMenu: true,
        authDingId: 'fenglvming',
      },
      {
        path: '/investment/portfolio/mpHoldChgSearch/_single_/:params',
        name: '组合调整',
        hideInMenu: true,
        authDingId: 'fenglvming',
      },
      {
        path: '/investment/portfolio/mpDealSearch/_single_/:params',
        name: '成交明细',
        hideInMenu: true,
        authDingId: 'fenglvming',
      },
      {
        path: '/investment/creditRisks/subjectComparison/_single_/:fundCodes?',
        name: '主体对比',
        hideInMenu: true,
        authDingId: 'zaqhzcf',
      },
      {
        path: '/investment/creditRisks/details/:id',
        name: '主体详情',
        hideInMenu: true,
        authDingId: '1u2_vexans9c22',
      },
      {
        path: '/investment/creditRisks/moduleMng',
        name: '模型管理',
        hideInMenu: true,
        authDingId: 'goldcomb',
      },
    ],
  },
  {
    path: '/market_',
    name: '销售+',
    children: [
      {
        path: '/marketingApp',
        name: '应用',
        icon: 'AppstoreOutlined',
        children: [
          {
            path: '/marketing/app/marketing/mainPage',
            name: '销售监控大盘',
            isFirst: true,
            authDingId: 'mmonway',
          },
          {
            path: '/marketing/app/channelDistribution',
            name: '渠道分布',
            authDingId: 'mmonway',
          },
          {
            path: '/marketing/app/roadShow/mainPage',
            name: '路演主页',
            authDingId: 'mmonway',
          },
          {
            path: '/marketing/app/cloudMapApplication',
            name: '云图应用',
            authDingId: 'mmonway',
          },
          {
            path: '/marketing/app/vogBoard',
            name: '销售VOG看板',
            authDingId: 'dcx93gn',
          },
          {
            path: '/marketing/app/product',
            name: '基金产品',
            authDingId: 'mmonway',
          },
          {
            path: '/marketing/app/channelOnLine',
            name: '渠道上线情况',
            authDingId: 'mmonway',
          },
        ],
      },
      {
        path: '/marketingSellconfig',
        name: '销售管理配置',
        icon: 'SettingOutlined',
        children: [
          {
            path: '/marketing/sellconfig/saleBoard',
            name: '销售考核配置',
            authDingId: 'mmonway',
          },
          {
            path: '/marketing/sellconfig/dataConfig/panel',
            name: '销售大盘配置',
            authDingId: 'mmonway',
          },
          {
            path: '/marketing/sellconfig/menuCrm',
            name: 'CRM菜单配置',
            authDingId: 'mmonway',
          },
          {
            path: '/marketing/sellconfig/dataConfig/authority',
            name: '销售看板配置',
            authDingId: 'mmonway',
          },
          {
            path: '/marketing/sellconfig/honorHall',
            name: '荣誉堂配置',
            authDingId: 'mmonway',
          },
          {
            path: '/marketing/sellconfig/agencyService',
            name: '机构服务配置',
            authDingId: 'mmonway',
          },
          {
            path: '/marketing/sellconfig/fundsalesmrksupport',
            name: '理财师服务配置',
            authDingId: 'mmonway',
          },
        ],
      },
      {
        path: '/marketingTools',
        name: '营销工具',
        icon: 'ToolOutlined',
        children: [
          {
            name: 'H5页面编辑器',
            path: 'http://10.253.113.212/h5_plus/',
            isUrl: true,
            authDingId: 'mmonway',
          },
          {
            name: '报表工具',
            path: 'http://10.111.164.93:8081/#/gateway-robot',
            isUrl: true,
            authDingId: 'mmonway',
          },
          {
            name: '用户工作台',
            path: 'http://10.2.184.236:8080/static/signon',
            isUrl: true,
            authDingId: 'mmonway',
          },
          {
            name: '配置管理',
            path: 'http://10.2.184.236:8080/static/domain',
            isUrl: true,
            authDingId: 'mmonway',
          },
          {
            name: '应用开发',
            path: 'http://10.2.184.236:8080/designer',
            isUrl: true,
            authDingId: 'mmonway',
          },
        ],
      },
      {
        path: '/marketingMarketingMaterial',
        name: '营销素材',
        icon: 'ContainerOutlined',
        children: [
          {
            path: '/marketing/marketingMaterial/category',
            name: '类别管理',
            authDingId: 'mmonway',
          },
          {
            path: '/marketing/marketingMaterial/material',
            name: '素材管理',
            authDingId: 'mmonway',
          },
          {
            path: '/marketing/marketingMaterial/label',
            name: '标签管理',
            authDingId: 'mmonway',
          },
        ],
      },
      {
        path: '/marketingAdvisorCRM',
        name: '直销CRM',
        icon: 'AuditOutlined',
        children: [
          {
            path: '/marketing/advisorCRM/customerQuery',
            name: '客户查询',
            authDingId: 'qxy0616',
          },
          {
            path: '/marketing/advisorCRM/customerBelongTo',
            name: '客户归属',
            authDingId: 'qxy0616',
          },
          {
            path: '/marketing/advisorCRM/myCustomers',
            name: '我的客户',
            authDingId: 'qxy0616',
          },
          {
            path: '/marketing/advisorCRM/motTriggerResult',
            name: 'MOT事件触发结果',
            authDingId: 'qxy0616',
          },
          {
            path: '/marketing/advisorCRM/myMotTask',
            name: '我的MOT待办',
            authDingId: 'qxy0616',
          },
          {
            path: '/marketing/advisorCRM/customerQueryLog',
            name: '客户查询日志',
            authDingId: 'qxy0616', // xiaoyang
          },
        ],
      },
      {
        path: '/registerOperating',
        name: '登记运营',
        icon: 'AuditOutlined',
        children: [
          {
            path: '/directSale',
            name: '直销',
            children: [
              {
                path: 'http://10.111.164.46:8080/count-center/',
                name: '业务管理',
                isUrl: true,
                authDingId: 'qxy0616',
              },
            ],
          },
          {
            path: '/registerCheckIn',
            name: '注册登记',
            children: [
              {
                path: '/registerInfo',
                name: '信息',
                children: [
                  {
                    path: 'http://taclient.thfund.com.cn/#/info/fundInfo',
                    name: '基金信息',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                  {
                    path: 'http://taclient.thfund.com.cn/#/info/agencyInfo',
                    name: '销售商信息',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                  {
                    path: 'http://taclient.thfund.com.cn/#/info/currencyInfo',
                    name: '认购利率',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                  {
                    path: 'http://taclient.thfund.com.cn/#/info/custodian',
                    name: '托管行信息',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                  {
                    path: 'http://taclient.thfund.com.cn/#/info/branchCode',
                    name: '销售商网点',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                  {
                    path: 'http://taclient.thfund.com.cn/#/info/fundAgency',
                    name: '销售商代理信息',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                  {
                    path: 'http://taclient.thfund.com.cn/#/info/fundBusiness',
                    name: '销售商业务参数',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                  {
                    path: 'http://taclient.thfund.com.cn/#/info/fpublishday',
                    name: '特殊净值日公布',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                  {
                    path: 'http://taclient.thfund.com.cn/#/info/fundStatus',
                    name: '预设基金状态',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                  {
                    path: 'http://taclient.thfund.com.cn/#/info/fundBusinessTemplate',
                    name: '代理参数模板',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                  {
                    path: 'http://taclient.thfund.com.cn/#/info/blackList',
                    name: '黑名单维护',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                  {
                    path: 'http://taclient.thfund.com.cn/#/info/calendarInfo',
                    name: '日历',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                ],
              },
              {
                path: '/registerSpecial',
                name: '特殊',
                children: [
                  {
                    path: 'http://taclient.thfund.com.cn/#/special/fundTer',
                    name: '清盘方案',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                  {
                    path: 'http://taclient.thfund.com.cn/#/special/transferInfo',
                    name: '货币T+0方案',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                  {
                    path: 'http://taclient.thfund.com.cn/#/special/dividend',
                    name: '分红方案',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                  {
                    path: 'http://taclient.thfund.com.cn/#/special/foFInvestAccount',
                    name: '投资账户设置',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                  {
                    path: 'http://taclient.thfund.com.cn/#/special/fundTrust',
                    name: '跨TA转换产品',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                ],
              },
              {
                path: '/registerFee',
                name: '费用',
                children: [
                  {
                    path: 'http://taclient.thfund.com.cn/#/fee/feeZone',
                    name: '基金费率',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                  {
                    path: 'http://taclient.thfund.com.cn/#/fee/fundAssign',
                    name: '基金资产费用分成',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                  {
                    path: 'http://taclient.thfund.com.cn/#/fee/feeAssign',
                    name: '销售商费用分成',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                  {
                    path: 'http://taclient.thfund.com.cn/#/fee/managerAgio',
                    name: '促销折扣',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                  {
                    path: 'http://taclient.thfund.com.cn/#/info/fundConvert',
                    name: '转换限制',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                  {
                    path: 'http://taclient.thfund.com.cn/#/fee/agioLimit',
                    name: '折扣限制',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                ],
              },
              {
                path: '/registerClear',
                name: '清算',
                children: [
                  {
                    path: 'http://taclient.thfund.com.cn/#/yun/link',
                    name: 'TA清算流程',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                  {
                    path: 'http://taclient.thfund.com.cn/#/yun/taLaunch/dealRecord',
                    name: 'TA发起业务',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                  {
                    path: 'http://taclient.thfund.com.cn/#/yun/adjust',
                    name: 'TA单笔调整',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                  {
                    path: 'http://taclient.thfund.com.cn/#/yun/redemption',
                    name: '赎回比例调整',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                  {
                    path: 'http://taclient.thfund.com.cn/#/yun/subscribe',
                    name: '认购比例调整',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                  {
                    path: 'http://taclient.thfund.com.cn/#/yun/veto',
                    name: '认购人工否决',
                    isUrl: true,
                    authDingId: 'fpjvxr5',
                  },
                ],
              },
            ],
          },
          {
            path: '/finance',
            name: '资金',
            children: [
              {
                path: 'http://10.1.103.63:8080/WebReport/ReportServer?op=fs',
                name: '资金交收',
                isUrl: true,
                authDingId: 'fpjvxr5',
              },
            ],
          },
        ],
      },
      {
        path: '/marketing/app/roadShow/edit',
        name: '编辑路演',
        hideInMenu: true,
        authDingId: 'mmonway',
      },
      {
        path: '/marketing/sellconfig/channelDistribution/detail/:agencyCode',
        name: '渠道详情',
        hideInMenu: true,
        authDingId: 'mmonway',
      },
    ],
  },
  {
    path: '/industrialChain',
    name: '产业链',
    children: [
      {
        path: '/industrialChain/index',
        name: '产业链首页',
        isFirst: true,
        authDingId: '138-4udgtxb7z3',
        icon: 'DragOutlined',
      },
      {
        path: '/industrialChain/restoAnalyse',
        name: '研报分析',
        authDingId: '138-4udgtxb7z3',
        icon: 'ProfileOutlined',
      },
      {
        path: '/industrialChain/modelData/景气度因子',
        name: '模型说明',
        authDingId: '138-4udgtxb7z3',
        icon: 'InfoCircleOutlined',
      },
      {
        path: '/industrialChain/industryPO',
        name: '行业舆情',
        authDingId: '138-4udgtxb7z3',
        icon: 'ForkOutlined',
      },
      {
        path: '/industrialChain/IndustryPolicy',
        name: '行业政策',
        authDingId: '138-4udgtxb7z3',
        icon: 'NodeIndexOutlined',
      },
      {
        path: '/industrialChainSet',
        name: '设置',
        icon: 'SettingOutlined',
        children: [
          {
            path: '/industrialChain/set/movePush',
            name: '异动推送审核',
            authDingId: '138-4udgtxb7z3',
          },
        ],
      },
      {
        path: '/industrialChain/tracking/光伏/S004955673发电量:太阳能:当月值',
        name: '异动追踪',
        authDingId: '138-4udgtxb7z3',
        icon: 'AppstoreOutlined',
      },
      {
        path: '/industrialChain/allChain',
        name: '行业列表',
        hideInMenu: true,
        authDingId: '138-4udgtxb7z3',
      },
      {
        path: '/industrialChain/chainDetail/:name/:id',
        name: '全景产业链',
        hideInMenu: true,
        authDingId: '138-4udgtxb7z3',
      },
      {
        path: '/industrialChain/industryCenter/:name/:id/:chain',
        name: '行业中心',
        hideInMenu: true,
        authDingId: '138-4udgtxb7z3',
      },
      {
        path: '/industrialChain/modelData/:name',
        name: '模型说明',
        hideInMenu: true,
        authDingId: '138-4udgtxb7z3',
      },
      {
        path: '/industrialChain/policyDetail/:id',
        name: '政策详情',
        hideInMenu: true,
        authDingId: '138-4udgtxb7z3',
      },
      {
        path: '/industrialChain/publicOpinionDetail/:id',
        name: '舆情详情',
        hideInMenu: true,
        authDingId: '138-4udgtxb7z3',
      },
      {
        path: '/industrialChain/reportDetail/:id',
        name: '研报详情',
        hideInMenu: true,
        authDingId: '138-4udgtxb7z3',
      },
      {
        path: '/industrialChain/tracking/:name/:id',
        name: '异动追踪',
        hideInMenu: true,
        authDingId: '138-4udgtxb7z3',
      },
    ],
  },
];
