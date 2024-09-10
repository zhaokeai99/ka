// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';
import qiankunConfig from './qiankun';

const { REACT_APP_ENV, UMI_ENV }: any = process.env;

export default defineConfig({
  publicPath: '/',
  history: { type: 'hash' },
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  // layout: {
  //   name: 'taclient',
  //   locale: true,
  //   siderWidth: 208,
  //   ...defaultSettings,
  // },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  fastRefresh: {},
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'root-entry-name': 'variable',
    // '@layout-header-background': defaultSettings.primaryColor,
    '@primary-color': defaultSettings.primaryColor,
    '@btn-primary-bg': defaultSettings.primaryColor,
  },
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  define: {
    consoleLogOpen: false, // 是否打开日志开关
    footerMenuConfig: ['back', 'consult'], // 是否打开底部右下角快捷小功能, 'back'返回上一个页面, 'subcribe' 订阅该页面, 'consult'咨询该页面负责人
    _QIANKUN_ENTRY_CONFIG: {
      // 临时设置，将来从接口获取配置项
      _DATA_BROWSER: qiankunConfig.dataBrowser[UMI_ENV || 'dev'],
      _OPER_MNG: qiankunConfig.operMng[UMI_ENV || 'dev'],
      _INDUSTRY_CHAINCORE: qiankunConfig.industryChaincore[UMI_ENV || 'dev'],
    },
    isPublic: false, // 是否外网访问 如想关闭哀悼模式（特殊日变黑白）可设false
  },
  mfsu: {},
  chainWebpack(config) {
    // 解决 ejs 等打包问题【https://github.com/umijs/umi/issues/6766】
    config.module.rule('mjs-rule').test(/.m?js/).resolve.set('fullySpecified', false);
  },
  // nodeModulesTransform: { type: 'none' },
  devServer: {
    port: 8080,
  },
  openAPI: false,
  qiankun: {
    master: {},
  },
  // openAPI: {
  //   requestLibPath: "import { request } from 'umi'",
  //   // 这里使用 copy 的 url
  //   schemaPath: 'http://10.111.167.248:8081/v2/api-docs',
  //   mock: false,
  // },
});
