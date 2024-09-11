// @ts-nocheck
import React from 'react';
import { ApplyPluginsType, dynamic } from '/Users/zhaoguoyu/project/ka/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';
import LoadingComponent from '@ant-design/pro-layout/es/PageLoading';

export function getRoutes() {
  const routes = [
  {
    "path": "/~demos/:uuid",
    "layout": false,
    "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'../dumi/layout'), loading: LoadingComponent})],
    "component": ((props) => dynamic({
          loader: async () => {
            const React = await import('react');
            const { default: getDemoRenderArgs } = await import(/* webpackChunkName: 'dumi_demos' */ '/Users/zhaoguoyu/project/ka/node_modules/@umijs/preset-dumi/lib/plugins/features/demo/getDemoRenderArgs');
            const { default: Previewer } = await import(/* webpackChunkName: 'dumi_demos' */ 'dumi-theme-default/es/builtins/Previewer.js');
            const { usePrefersColor, context } = await import(/* webpackChunkName: 'dumi_demos' */ 'dumi/theme');

            return props => {
              
      const { demos } = React.useContext(context);
      const [renderArgs, setRenderArgs] = React.useState([]);

      // update render args when props changed
      React.useLayoutEffect(() => {
        setRenderArgs(getDemoRenderArgs(props, demos));
      }, [props.match.params.uuid, props.location.query.wrapper, props.location.query.capture]);

      // for listen prefers-color-schema media change in demo single route
      usePrefersColor();

      switch (renderArgs.length) {
        case 1:
          // render demo directly
          return renderArgs[0];

        case 2:
          // render demo with previewer
          return React.createElement(
            Previewer,
            renderArgs[0],
            renderArgs[1],
          );

        default:
          return `Demo ${props.match.params.uuid} not found :(`;
      }
    
            }
          },
          loading: () => null,
        }))()
  },
  {
    "path": "/_demos/:uuid",
    "redirect": "/~demos/:uuid"
  },
  {
    "__dumiRoot": true,
    "layout": false,
    "path": "/~docs",
    "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'../dumi/layout'), loading: LoadingComponent}), dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'/Users/zhaoguoyu/project/ka/node_modules/dumi-theme-default/es/layout.js'), loading: LoadingComponent})],
    "routes": [
      {
        "path": "/~docs",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'README.md' */'/Users/zhaoguoyu/project/ka/README.md'), loading: LoadingComponent}),
        "exact": true,
        "meta": {
          "locale": "en-US",
          "order": null,
          "filePath": "README.md",
          "updatedTime": 1657176007743,
          "slugs": [
            {
              "depth": 1,
              "value": "产品信息系统",
              "heading": "产品信息系统"
            },
            {
              "depth": 2,
              "value": "Environment Prepare",
              "heading": "environment-prepare"
            },
            {
              "depth": 2,
              "value": "Provided Scripts",
              "heading": "provided-scripts"
            },
            {
              "depth": 3,
              "value": "Start project",
              "heading": "start-project"
            },
            {
              "depth": 3,
              "value": "Build project",
              "heading": "build-project"
            },
            {
              "depth": 3,
              "value": "Check code style",
              "heading": "check-code-style"
            },
            {
              "depth": 3,
              "value": "Test code",
              "heading": "test-code"
            },
            {
              "depth": 2,
              "value": "More",
              "heading": "more"
            },
            {
              "depth": 2,
              "value": "添加左侧导航",
              "heading": "添加左侧导航"
            },
            {
              "depth": 2,
              "value": "添加页面",
              "heading": "添加页面"
            }
          ],
          "title": "产品信息系统"
        },
        "title": "产品信息系统"
      },
      {
        "path": "/~docs/components/thfund-front-component",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'components__thfund-front-component__README.md' */'/Users/zhaoguoyu/project/ka/src/components/thfund-front-component/README.md'), loading: LoadingComponent}),
        "exact": true,
        "meta": {
          "filePath": "src/components/thfund-front-component/README.md",
          "updatedTime": 1657177493279,
          "slugs": [
            {
              "depth": 2,
              "value": "Support",
              "heading": "support"
            },
            {
              "depth": 1,
              "value": "Getting started",
              "heading": "getting-started"
            },
            {
              "depth": 4,
              "value": "Familiar with Git?",
              "heading": "familiar-with-git"
            },
            {
              "depth": 4,
              "value": "Not Familiar with Git?",
              "heading": "not-familiar-with-git"
            },
            {
              "depth": 2,
              "value": "Developing",
              "heading": "developing"
            },
            {
              "depth": 3,
              "value": "Proposals (Babel)",
              "heading": "proposals-babel"
            },
            {
              "depth": 2,
              "value": "Styling your components",
              "heading": "styling-your-components"
            },
            {
              "depth": 2,
              "value": "Testing",
              "heading": "testing"
            },
            {
              "depth": 2,
              "value": "Linting",
              "heading": "linting"
            },
            {
              "depth": 2,
              "value": "Publishing your library to NPM",
              "heading": "publishing-your-library-to-npm"
            },
            {
              "depth": 2,
              "value": "Styleguide",
              "heading": "styleguide"
            },
            {
              "depth": 4,
              "value": "Deploy the Styleguide to GitHub Pages",
              "heading": "deploy-the-styleguide-to-github-pages"
            },
            {
              "depth": 2,
              "value": "Scripts",
              "heading": "scripts"
            },
            {
              "depth": 2,
              "value": "Resources",
              "heading": "resources"
            },
            {
              "depth": 3,
              "value": "Bundler",
              "heading": "bundler"
            },
            {
              "depth": 3,
              "value": "Code Formatter",
              "heading": "code-formatter"
            },
            {
              "depth": 3,
              "value": "Styleguide",
              "heading": "styleguide-1"
            },
            {
              "depth": 3,
              "value": "Testing",
              "heading": "testing-1"
            },
            {
              "depth": 3,
              "value": "Linting",
              "heading": "linting-1"
            },
            {
              "depth": 3,
              "value": "Compiler",
              "heading": "compiler"
            }
          ],
          "title": "Support",
          "group": {
            "path": "/~docs/components",
            "title": "Components"
          }
        },
        "title": "Support - fundportal"
      },
      {
        "path": "/~docs/components/thfund-front-component/src/components/drag-modal",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'components__thfund-front-component__src__components__DragModal__README.md' */'/Users/zhaoguoyu/project/ka/src/components/thfund-front-component/src/components/DragModal/README.md'), loading: LoadingComponent}),
        "exact": true,
        "meta": {
          "filePath": "src/components/thfund-front-component/src/components/DragModal/README.md",
          "updatedTime": 1675833670525,
          "slugs": [
            {
              "depth": 1,
              "value": "原点",
              "heading": "原点"
            },
            {
              "depth": 1,
              "value": "调用",
              "heading": "调用"
            },
            {
              "depth": 1,
              "value": "调用demo",
              "heading": "调用demo"
            }
          ],
          "title": "原点",
          "group": {
            "path": "/~docs/components/thfund-front-component/src/components",
            "title": "Components"
          }
        },
        "title": "原点 - fundportal"
      },
      {
        "path": "/~docs/components/thfund-front-component/src/components/excel-handler",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'components__thfund-front-component__src__components__ExcelHandler__README.md' */'/Users/zhaoguoyu/project/ka/src/components/thfund-front-component/src/components/ExcelHandler/README.md'), loading: LoadingComponent}),
        "exact": true,
        "meta": {
          "filePath": "src/components/thfund-front-component/src/components/ExcelHandler/README.md",
          "updatedTime": 1675833248506,
          "slugs": [
            {
              "depth": 1,
              "value": "Excel Component",
              "heading": "excel-component"
            },
            {
              "depth": 2,
              "value": "Getting Started",
              "heading": "getting-started"
            },
            {
              "depth": 2,
              "value": "Usage",
              "heading": "usage"
            },
            {
              "depth": 3,
              "value": "ExportExcelComponent 导出组件 type = export",
              "heading": "exportexcelcomponent-导出组件-type--export"
            },
            {
              "depth": 4,
              "value": "属性",
              "heading": "属性"
            },
            {
              "depth": 4,
              "value": "使用",
              "heading": "使用"
            },
            {
              "depth": 3,
              "value": "ImportExcelComponent 导入组件 type = import",
              "heading": "importexcelcomponent-导入组件-type--import"
            },
            {
              "depth": 4,
              "value": "属性",
              "heading": "属性-1"
            },
            {
              "depth": 4,
              "value": "使用",
              "heading": "使用-1"
            },
            {
              "depth": 3,
              "value": "PreviewExcelComponent 预览组件 type = preview",
              "heading": "previewexcelcomponent-预览组件-type--preview"
            },
            {
              "depth": 4,
              "value": "属性",
              "heading": "属性-2"
            },
            {
              "depth": 4,
              "value": "使用",
              "heading": "使用-2"
            },
            {
              "depth": 3,
              "value": "ExcelHandler 全量组件 type = all",
              "heading": "excelhandler-全量组件-type--all"
            },
            {
              "depth": 4,
              "value": "属性",
              "heading": "属性-3"
            },
            {
              "depth": 4,
              "value": "使用",
              "heading": "使用-3"
            }
          ],
          "title": "Excel Component",
          "group": {
            "path": "/~docs/components/thfund-front-component/src/components",
            "title": "Components"
          }
        },
        "title": "Excel Component - fundportal"
      },
      {
        "path": "/~docs/components/thfund-front-component/src/components/schema-form-plus",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'components__thfund-front-component__src__components__SchemaFormPlus__README.md' */'/Users/zhaoguoyu/project/ka/src/components/thfund-front-component/src/components/SchemaFormPlus/README.md'), loading: LoadingComponent}),
        "exact": true,
        "meta": {
          "filePath": "src/components/thfund-front-component/src/components/SchemaFormPlus/README.md",
          "updatedTime": 1675833248509,
          "slugs": [
            {
              "depth": 1,
              "value": "动态表单组件",
              "heading": "动态表单组件"
            },
            {
              "depth": 2,
              "value": "changelog",
              "heading": "changelog"
            }
          ],
          "title": "动态表单组件",
          "group": {
            "path": "/~docs/components/thfund-front-component/src/components",
            "title": "Components"
          }
        },
        "title": "动态表单组件 - fundportal"
      },
      {
        "path": "/~docs/pages/low-code/mng/biz-component-mng",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__LowCode__Mng__BizComponentMng__README.md' */'/Users/zhaoguoyu/project/ka/src/pages/LowCode/Mng/BizComponentMng/README.md'), loading: LoadingComponent}),
        "exact": true,
        "meta": {
          "filePath": "src/pages/LowCode/Mng/BizComponentMng/README.md",
          "updatedTime": 1657176007802,
          "slugs": [
            {
              "depth": 1,
              "value": "业务 组件管理页面，包含业务组件注册，录入，复制，编辑，删除，查询等能力",
              "heading": "业务-组件管理页面包含业务组件注册录入复制编辑删除查询等能力"
            }
          ],
          "title": "业务 组件管理页面，包含业务组件注册，录入，复制，编辑，删除，查询等能力",
          "group": {
            "path": "/~docs/pages/low-code/mng",
            "title": "Pages"
          }
        },
        "title": "业务 组件管理页面，包含业务组件注册，录入，复制，编辑，删除，查询等能力 - fundportal"
      },
      {
        "path": "/~docs/pages/low-code/mng/page-mng",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__LowCode__Mng__PageMng__README.md' */'/Users/zhaoguoyu/project/ka/src/pages/LowCode/Mng/PageMng/README.md'), loading: LoadingComponent}),
        "exact": true,
        "meta": {
          "filePath": "src/pages/LowCode/Mng/PageMng/README.md",
          "updatedTime": 1657176007803,
          "slugs": [
            {
              "depth": 1,
              "value": "页面 管理页面，包含页面注册，录入，编辑，删除，查询等能力",
              "heading": "页面-管理页面包含页面注册录入编辑删除查询等能力"
            }
          ],
          "title": "页面 管理页面，包含页面注册，录入，编辑，删除，查询等能力",
          "group": {
            "path": "/~docs/pages/low-code/mng",
            "title": "Pages"
          }
        },
        "title": "页面 管理页面，包含页面注册，录入，编辑，删除，查询等能力 - fundportal"
      },
      {
        "path": "/~docs/pages/low-code/mng/uicomponent-mng",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__LowCode__Mng__UIComponentMng__README.md' */'/Users/zhaoguoyu/project/ka/src/pages/LowCode/Mng/UIComponentMng/README.md'), loading: LoadingComponent}),
        "exact": true,
        "meta": {
          "filePath": "src/pages/LowCode/Mng/UIComponentMng/README.md",
          "updatedTime": 1657176007804,
          "slugs": [
            {
              "depth": 1,
              "value": "UI 组件管理页面，包含 UI 组件注册，录入，编辑，删除，查询等能力",
              "heading": "ui-组件管理页面包含-ui-组件注册录入编辑删除查询等能力"
            }
          ],
          "title": "UI 组件管理页面，包含 UI 组件注册，录入，编辑，删除，查询等能力",
          "group": {
            "path": "/~docs/pages/low-code/mng",
            "title": "Pages"
          }
        },
        "title": "UI 组件管理页面，包含 UI 组件注册，录入，编辑，删除，查询等能力 - fundportal"
      },
      {
        "path": "/~docs/components",
        "meta": {},
        "exact": true,
        "redirect": "/~docs/components/thfund-front-component"
      },
      {
        "path": "/~docs/components/thfund-front-component/src/components",
        "meta": {},
        "exact": true,
        "redirect": "/~docs/components/thfund-front-component/src/components/drag-modal"
      },
      {
        "path": "/~docs/pages/low-code/mng",
        "meta": {},
        "exact": true,
        "redirect": "/~docs/pages/low-code/mng/biz-component-mng"
      }
    ],
    "title": "fundportal",
    "component": (props) => props.children
  },
  {
    "path": "/",
    "exact": true,
    "redirect": "/production/summary/hotFundIndex/_single_"
  },
  {
    "path": "/404",
    "exact": true,
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'/Users/zhaoguoyu/project/ka/src/pages/404'), loading: LoadingComponent})
  },
  {
    "path": "/",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__BaseLayout' */'/Users/zhaoguoyu/project/ka/src/layouts/BaseLayout'), loading: LoadingComponent}),
    "routes": [
      {
        "path": "/dashboard/my",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Dashboard' */'/Users/zhaoguoyu/project/ka/src/pages/Dashboard'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/summary/hotFundIndex/_single_",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__HotFundIndex' */'/Users/zhaoguoyu/project/ka/src/pages/Production/HotFundIndex'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/summary/index",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__Index' */'/Users/zhaoguoyu/project/ka/src/pages/Production/Index'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/summary/hotFundDetailList",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__HotFundDetailList' */'/Users/zhaoguoyu/project/ka/src/pages/Production/HotFundDetailList'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/summary/hotFundIndex/_single_/:type?",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__HotFundIndex' */'/Users/zhaoguoyu/project/ka/src/pages/Production/HotFundIndex'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/summary/indexFundMainPage",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__IndexFundMainPage' */'/Users/zhaoguoyu/project/ka/src/pages/Production/IndexFundMainPage'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/summary/fundPk/_single_/:fundCodes?",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__Pk__Fund' */'/Users/zhaoguoyu/project/ka/src/pages/Production/Pk/Fund'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/summary/fundPk/_single_",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__Pk__Fund' */'/Users/zhaoguoyu/project/ka/src/pages/Production/Pk/Fund'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/summary/managerPk/_single_/:managerCodes?",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__Pk__Manager' */'/Users/zhaoguoyu/project/ka/src/pages/Production/Pk/Manager'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/summary/managerPk/_single_",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__Pk__Manager' */'/Users/zhaoguoyu/project/ka/src/pages/Production/Pk/Manager'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/summary/companyPk/_single_/:fundCodes?",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__Pk__Company' */'/Users/zhaoguoyu/project/ka/src/pages/Production/Pk/Company'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/summary/companyPk/_single_",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__Pk__Company' */'/Users/zhaoguoyu/project/ka/src/pages/Production/Pk/Company'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/report/competitorRegister",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__CompetitorRegister' */'/Users/zhaoguoyu/project/ka/src/pages/Production/CompetitorRegister'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/report/indexWeight",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__IndexWeight' */'/Users/zhaoguoyu/project/ka/src/pages/Production/IndexWeight'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/report/endDate",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__Manufacturer__EndDate' */'/Users/zhaoguoyu/project/ka/src/pages/Production/Manufacturer/EndDate'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/report/pdAuditPolicy",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__PdAuditPolicy' */'/Users/zhaoguoyu/project/ka/src/pages/Production/PdAuditPolicy'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/report/raiseReport",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__Raisereport' */'/Users/zhaoguoyu/project/ka/src/pages/Production/Raisereport'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/report/announcementList",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__AnnouncementList' */'/Users/zhaoguoyu/project/ka/src/pages/Production/AnnouncementList'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/report/indexFee",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__Manufacturer__IndexFee' */'/Users/zhaoguoyu/project/ka/src/pages/Production/Manufacturer/IndexFee'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/report/indexParameters",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__IndexParameters' */'/Users/zhaoguoyu/project/ka/src/pages/Production/IndexParameters'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/report/indexStock",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__IndexStock' */'/Users/zhaoguoyu/project/ka/src/pages/Production/IndexStock'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/report/indexMap",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__IndexMap' */'/Users/zhaoguoyu/project/ka/src/pages/Production/IndexMap'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/report/indexControl",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__IndexControl' */'/Users/zhaoguoyu/project/ka/src/pages/Production/IndexControl'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/report/fundMonitoring",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__FundMonitoring' */'/Users/zhaoguoyu/project/ka/src/pages/Production/FundMonitoring'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/report/publicPlacement",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__PublicPlacement' */'/Users/zhaoguoyu/project/ka/src/pages/Production/PublicPlacement'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/businessManage/complianceLibrary",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__complianceLibrary' */'/Users/zhaoguoyu/project/ka/src/pages/Production/complianceLibrary'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/businessManage/trailingCommission",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__trailingCommission' */'/Users/zhaoguoyu/project/ka/src/pages/Production/trailingCommission'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/businessManage/fundOpenAccount",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__FundOpenAccount__Apply' */'/Users/zhaoguoyu/project/ka/src/pages/Production/FundOpenAccount/Apply'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/businessManage/registrationManage",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__FundOpenAccount__RegistrationManage' */'/Users/zhaoguoyu/project/ka/src/pages/Production/FundOpenAccount/RegistrationManage'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/businessManage/documentPrepare",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__FundOpenAccount__DocumentPrepare' */'/Users/zhaoguoyu/project/ka/src/pages/Production/FundOpenAccount/DocumentPrepare'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/businessManage/messageManage",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__FundOpenAccount__MessageMange' */'/Users/zhaoguoyu/project/ka/src/pages/Production/FundOpenAccount/MessageMange'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/businessManage/seatManage",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__FundOpenAccount__SeatManage' */'/Users/zhaoguoyu/project/ka/src/pages/Production/FundOpenAccount/SeatManage'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/setting/classify",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__Classify' */'/Users/zhaoguoyu/project/ka/src/pages/Production/Classify'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/setting/dataBrowser",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__DataBrowser' */'/Users/zhaoguoyu/project/ka/src/pages/Production/DataBrowser'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/setting/securityIndustrySystem",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__SecurityIndustrySystem' */'/Users/zhaoguoyu/project/ka/src/pages/Production/SecurityIndustrySystem'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/setting/portfolio",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__Portfolio' */'/Users/zhaoguoyu/project/ka/src/pages/Production/Portfolio'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/setting/parameterTable",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__ParameterTable' */'/Users/zhaoguoyu/project/ka/src/pages/Production/ParameterTable'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/setting/parameterConfig/:fundId/:actionType",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__ParameterTable__ParameterConfig' */'/Users/zhaoguoyu/project/ka/src/pages/Production/ParameterTable/ParameterConfig'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/setting/parameterConfig/:fundId/:actionType/:versionId?",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__ParameterTable__ParameterConfig' */'/Users/zhaoguoyu/project/ka/src/pages/Production/ParameterTable/ParameterConfig'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/setting/linkList",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__LinkList' */'/Users/zhaoguoyu/project/ka/src/pages/Production/LinkList'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/setting/parameterManage",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__ParameterManage' */'/Users/zhaoguoyu/project/ka/src/pages/Production/ParameterManage'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/setting/parameterManage/detailFile/:fundId/:type",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__ParameterManage__DetailFile' */'/Users/zhaoguoyu/project/ka/src/pages/Production/ParameterManage/DetailFile'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/setting/labelSystem",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__LabelSystem' */'/Users/zhaoguoyu/project/ka/src/pages/Production/LabelSystem'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/index/detail/:fundId",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__IndexDetail' */'/Users/zhaoguoyu/project/ka/src/pages/Production/IndexDetail'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/index/newDetail/:fundCode",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__IndexDetail' */'/Users/zhaoguoyu/project/ka/src/pages/Production/IndexDetail'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/fundManager/:code",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__FundManager' */'/Users/zhaoguoyu/project/ka/src/pages/Production/FundManager'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/fundCompany/:code",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__FundCompany' */'/Users/zhaoguoyu/project/ka/src/pages/Production/FundCompany'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/indexStock/detail/:indexCode",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__IndexStock__Detail' */'/Users/zhaoguoyu/project/ka/src/pages/Production/IndexStock/Detail'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/indexStock/compare/_single_/:indexCodes",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__IndexStock__Compare' */'/Users/zhaoguoyu/project/ka/src/pages/Production/IndexStock/Compare'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/production/securityIndustrySystem/detail/:id/:name/:isCustom",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Production__SecurityIndustrySystem__Detail' */'/Users/zhaoguoyu/project/ka/src/pages/Production/SecurityIndustrySystem/Detail'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/app/marketing/mainPage",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__MainPage' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/MainPage'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/app/channelDistribution",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__ChannelDistribution' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/ChannelDistribution'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/app/roadShow/mainPage",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__RoadShow__MainPage' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/RoadShow/MainPage'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/app/cloudMapApplication",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__CloudMapApplication' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/CloudMapApplication'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/app/vogBoard",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__VogBoard' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/VogBoard'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/app/product",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__Product' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/Product'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/app/channelOnLine",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__ChannelOnLine' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/ChannelOnLine'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/app/roadShow/edit",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__RoadShow__EditPage' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/RoadShow/EditPage'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/app/roadShow/new",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__RoadShow__NewPage' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/RoadShow/NewPage'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/app/product/detail/:fundCode",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__Product__Detail' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/Product/Detail'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/sellconfig/saleBoard",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__SaleBoard' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/SaleBoard'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/sellconfig/dataConfig/panel",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__DataConfig__Panel' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/DataConfig/Panel'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/sellconfig/menuCrm",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__MenuCRM' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/MenuCRM'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/sellconfig/dataConfig/authority",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__DataConfig__Authority' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/DataConfig/Authority'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/sellconfig/honorHall",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__HonorHall' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/HonorHall'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/sellconfig/agencyService",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__AgencyService' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/AgencyService'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/sellconfig/fundsalesmrksupport",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Fundsalesmrksupport__Manage' */'/Users/zhaoguoyu/project/ka/src/pages/Fundsalesmrksupport/Manage'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/sellconfig/channelDistribution/detail/:agencyCode",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__ChannelDistribution__Detail' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/ChannelDistribution/Detail'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/marketingMaterial/category",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__MarketingMaterial__Category' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/MarketingMaterial/Category'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/marketingMaterial/material",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__MarketingMaterial__Material' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/MarketingMaterial/Material'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/marketingMaterial/label",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__MarketingMaterial__Label' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/MarketingMaterial/Label'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/advisorCRM/customerQuery",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__AdvisorCRM__CustomerQuery' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/AdvisorCRM/CustomerQuery'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/advisorCRM/customerBelongTo",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__AdvisorCRM__CustomerBelongTo' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/AdvisorCRM/CustomerBelongTo'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/advisorCRM/myCustomers",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__AdvisorCRM__MyCustomers' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/AdvisorCRM/MyCustomers'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/advisorCRM/motTriggerResult",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__AdvisorCRM__MotTriggerResult' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/AdvisorCRM/MotTriggerResult'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/advisorCRM/myMotTask",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__AdvisorCRM__MyMotTask' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/AdvisorCRM/MyMotTask'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/marketing/advisorCRM/customerQueryLog",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__AdvisorCRM__AccessLog__CustomerQueryLog' */'/Users/zhaoguoyu/project/ka/src/pages/Marketing/AdvisorCRM/AccessLog/CustomerQueryLog'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/data_browser/index",
        "microName": "data_browser",
        "exact": true
      },
      {
        "path": "/industry_chaincore/index",
        "microName": "industry_chaincore",
        "exact": true
      },
      {
        "path": "/fundoper/works",
        "microName": "oper_mng",
        "exact": true
      },
      {
        "path": "/fundoper/admin/organizer/users",
        "microName": "oper_mng",
        "exact": true
      },
      {
        "path": "/fundoper/admin/organizer/group",
        "microName": "oper_mng",
        "exact": true
      },
      {
        "path": "/fundoper/admin/organizer/post",
        "microName": "oper_mng",
        "exact": true
      },
      {
        "path": "/fundoper/admin/fund",
        "microName": "oper_mng",
        "exact": true
      },
      {
        "path": "/fundoper/admin/flow",
        "microName": "oper_mng",
        "exact": true
      },
      {
        "path": "/fundoper/admin/sys/dictionary",
        "microName": "oper_mng",
        "exact": true
      },
      {
        "path": "/fundoper/admin/sys/taskSchedule",
        "microName": "oper_mng",
        "exact": true
      },
      {
        "path": "/industrialChain/index",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__IndustrialChain__HomePage' */'/Users/zhaoguoyu/project/ka/src/pages/IndustrialChain/HomePage'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/industrialChain/allChain",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__IndustrialChain__AllChain' */'/Users/zhaoguoyu/project/ka/src/pages/IndustrialChain/AllChain'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/industrialChain/chainDetail/:name/:id",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__IndustrialChain__ChainDetail' */'/Users/zhaoguoyu/project/ka/src/pages/IndustrialChain/ChainDetail'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/industrialChain/industryCenter/:name/:id/:chain",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__IndustrialChain__IndustryCenter' */'/Users/zhaoguoyu/project/ka/src/pages/IndustrialChain/IndustryCenter'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/industrialChain/restoAnalyse",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__IndustrialChain__Restoanalyse' */'/Users/zhaoguoyu/project/ka/src/pages/IndustrialChain/Restoanalyse'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/industrialChain/modelData/景气度因子",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__IndustrialChain__ModelData' */'/Users/zhaoguoyu/project/ka/src/pages/IndustrialChain/ModelData'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/industrialChain/modelData/:name",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__IndustrialChain__ModelData' */'/Users/zhaoguoyu/project/ka/src/pages/IndustrialChain/ModelData'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/industrialChain/industryPO",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__IndustrialChain__IndustryPO' */'/Users/zhaoguoyu/project/ka/src/pages/IndustrialChain/IndustryPO'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/industrialChain/IndustryPolicy",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__IndustrialChain__IndustryPolicy' */'/Users/zhaoguoyu/project/ka/src/pages/IndustrialChain/IndustryPolicy'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/industrialChain/policyDetail/:id",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__IndustrialChain__IndustryPolicy__PolicyDetail' */'/Users/zhaoguoyu/project/ka/src/pages/IndustrialChain/IndustryPolicy/PolicyDetail'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/industrialChain/publicOpinionDetail/:id",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__IndustrialChain__IndustryPO__PublicOpinionDetail' */'/Users/zhaoguoyu/project/ka/src/pages/IndustrialChain/IndustryPO/PublicOpinionDetail'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/industrialChain/reportDetail/:id",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__IndustrialChain__ReportDetail' */'/Users/zhaoguoyu/project/ka/src/pages/IndustrialChain/ReportDetail'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/industrialChain/tracking/:name/:id",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__IndustrialChain__Tracking' */'/Users/zhaoguoyu/project/ka/src/pages/IndustrialChain/Tracking'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/industrialChain/set/movePush",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__IndustrialChain__Set__MovePush' */'/Users/zhaoguoyu/project/ka/src/pages/IndustrialChain/Set/MovePush'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/industrialChain/tracking/光伏/S004955673发电量:太阳能:当月值",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__IndustrialChain__Tracking' */'/Users/zhaoguoyu/project/ka/src/pages/IndustrialChain/Tracking'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/information/publicOpinion/narrow",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Information__PublicOpinion__Narrow' */'/Users/zhaoguoyu/project/ka/src/pages/Information/PublicOpinion/Narrow'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/information/publicOpinion/industry",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Information__PublicOpinion__Industry' */'/Users/zhaoguoyu/project/ka/src/pages/Information/PublicOpinion/Industry'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/information/publicOpinion/publicOpinionDetail/:id",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Information__PublicOpinion__PublicOpinionDetail' */'/Users/zhaoguoyu/project/ka/src/pages/Information/PublicOpinion/PublicOpinionDetail'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/information/publicOpinion/fundManager",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Information__PublicOpinion__FundManager' */'/Users/zhaoguoyu/project/ka/src/pages/Information/PublicOpinion/FundManager'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/information/publicOpinion/riskReport",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Information__RiskReport' */'/Users/zhaoguoyu/project/ka/src/pages/Information/RiskReport'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/information/priceChanges/bond",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Information__PriceChanges__Bond' */'/Users/zhaoguoyu/project/ka/src/pages/Information/PriceChanges/Bond'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/information/priceChanges/stock",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Information__PriceChanges__Stock' */'/Users/zhaoguoyu/project/ka/src/pages/Information/PriceChanges/Stock'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/information/priceChanges/couponIntraday/:id",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Information__PriceChanges__CouponIntraday' */'/Users/zhaoguoyu/project/ka/src/pages/Information/PriceChanges/CouponIntraday'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/information/priceChanges/couponAfter/:id",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Information__PriceChanges__CouponAfter' */'/Users/zhaoguoyu/project/ka/src/pages/Information/PriceChanges/CouponAfter'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/information/priceChanges/stockDetail/:name/:id",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Information__PriceChanges__StockDetail' */'/Users/zhaoguoyu/project/ka/src/pages/Information/PriceChanges/StockDetail'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/information/priceChanges/subjectDetail/:name/:id",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Information__PriceChanges__SubjectDetail' */'/Users/zhaoguoyu/project/ka/src/pages/Information/PriceChanges/SubjectDetail'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/information/dataManager/rateAgency",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Information__RateAgency' */'/Users/zhaoguoyu/project/ka/src/pages/Information/RateAgency'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/information/dataManager/defaultedBonds",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Information__DefaultedBonds' */'/Users/zhaoguoyu/project/ka/src/pages/Information/DefaultedBonds'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/information/dataManager/codeTable",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Information__CodeTable' */'/Users/zhaoguoyu/project/ka/src/pages/Information/CodeTable'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/investmentInfoManagement/brokerInfoManagement",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__investmentInfoManagement__BrokerInfoManagement' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/investmentInfoManagement/BrokerInfoManagement'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/investmentInfoManagement/marketResearchReportData",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__investmentInfoManagement__MarketResearchReport' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/investmentInfoManagement/MarketResearchReport'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/investmentInfoManagement/liveInfoManagement",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__investmentInfoManagement__LiveInfoManagement' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/investmentInfoManagement/LiveInfoManagement'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/stockresearch/alphaview",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__StockResearch__AlphaView' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/StockResearch/AlphaView'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/stockresearch/irUserManage",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__StockResearch__irUserManage' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/StockResearch/irUserManage'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/portfolio/portfolioManagement/_single_",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__Simulation__PortfolioManagement' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/Simulation/PortfolioManagement'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/portfolio/portfolioManagement/_single_/:params?",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__Simulation__PortfolioManagement' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/Simulation/PortfolioManagement'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/portfolio/mpHoldItemSearch/_single_/:params",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__Simulation__PortfolioManagement__Tabs__HistorySearch__MpHoldItemSearch' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/Simulation/PortfolioManagement/Tabs/HistorySearch/MpHoldItemSearch'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/portfolio/mpHoldChgSearch/_single_/:params",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__Simulation__PortfolioManagement__Tabs__HistorySearch__MpHoldChgSearch' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/Simulation/PortfolioManagement/Tabs/HistorySearch/MpHoldChgSearch'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/portfolio/mpDealSearch/_single_/:params",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__Simulation__PortfolioManagement__Tabs__HistorySearch__MpDealSearch' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/Simulation/PortfolioManagement/Tabs/HistorySearch/MpDealSearch'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/portfolio/mpAnalysis",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__Simulation__MpAnalysis' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/Simulation/MpAnalysis'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/simulation/mainBenchmark",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__Simulation__MainBenchmark' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/Simulation/MainBenchmark'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/simulation/benchmarks",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__Simulation__Benchmarks' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/Simulation/Benchmarks'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/simulation/singleIndexBenchmark",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__Simulation__SingleIndexBenchmark' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/Simulation/SingleIndexBenchmark'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/simulation/customBenchmark",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__Simulation__CustomBenchmark' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/Simulation/CustomBenchmark'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/BackEndManagement/esTaskView",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__BackEndManagement__EsTaskView' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/BackEndManagement/EsTaskView'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/BackEndManagement/dataSyncTaskManagement",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__BackEndManagement__DataSyncTaskManagement' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/BackEndManagement/DataSyncTaskManagement'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/creditRisks/principalMarket",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__CreditRisks__PrincipalMarket' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/CreditRisks/PrincipalMarket'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/creditRisks/subjectComparison/_single_/:fundCodes?",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__CreditRisks__SubjectComparison' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/CreditRisks/SubjectComparison'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/creditRisks/subjectComparison/_single_",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__CreditRisks__SubjectComparison' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/CreditRisks/SubjectComparison'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/creditRisks/mainMarketDaily",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__CreditRisks__MainMarketDaily' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/CreditRisks/MainMarketDaily'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/creditRisks/details/:id",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__CreditRisks__Details' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/CreditRisks/Details'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/creditRisks/scriptManagement",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__CreditRisks__ScriptManagement' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/CreditRisks/ScriptManagement'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/creditRisks/moduleMng",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__FixedIncome__ConfigMng' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/FixedIncome/ConfigMng'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/creditRisks/fixedIncome",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__FixedIncome__FixedIncomePage' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/FixedIncome/FixedIncomePage'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/stockresearch/hold",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__MpAnalysis__Hold' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/MpAnalysis/Hold'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/creditRisks/riskDataSourceManagement",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__RiskIndex__DataSource' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/RiskIndex/DataSource'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/creditRisks/riskViewManagement",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__RiskIndex__View' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/RiskIndex/View'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/investment/creditRisks/riskIndexManagement",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Investment__RiskIndex__Index' */'/Users/zhaoguoyu/project/ka/src/pages/Investment/RiskIndex/Index'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/lowcode/mng/uiComponentMng",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__LowCode__Mng__UIComponentMng' */'/Users/zhaoguoyu/project/ka/src/pages/LowCode/Mng/UIComponentMng'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/lowcode/mng/bizComponentMng",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__LowCode__Mng__BizComponentMng' */'/Users/zhaoguoyu/project/ka/src/pages/LowCode/Mng/BizComponentMng'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/lowcode/mng/pageMng",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__LowCode__Mng__PageMng' */'/Users/zhaoguoyu/project/ka/src/pages/LowCode/Mng/PageMng'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/lowcode/mng/EditBizComponent",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__LowCode__Mng__BizComponentMng__EditBizComponent' */'/Users/zhaoguoyu/project/ka/src/pages/LowCode/Mng/BizComponentMng/EditBizComponent'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/lowcode/mng/EditLayout",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__LowCode__Mng__PageMng__EditLayout' */'/Users/zhaoguoyu/project/ka/src/pages/LowCode/Mng/PageMng/EditLayout'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/gateway/app",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Gateway__AppMng' */'/Users/zhaoguoyu/project/ka/src/pages/Gateway/AppMng'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/gateway/api",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Gateway__APIMng' */'/Users/zhaoguoyu/project/ka/src/pages/Gateway/APIMng'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'/Users/zhaoguoyu/project/ka/src/pages/404'), loading: LoadingComponent}),
        "exact": true
      }
    ]
  },
  {
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'/Users/zhaoguoyu/project/ka/src/pages/404'), loading: LoadingComponent})
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
