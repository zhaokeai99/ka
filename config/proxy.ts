/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
// const BaseUrl = 'http://10.111.164.76:8081'; // 竞品库测试
const BaseUrl = 'http://10.111.169.185:8080';
const MockUrl = 'http://thyapi.thfund.com.cn/mock/222/';
// export default {
//   dev: [
//     {
//       context: ['/index/', '/announcement/', '/stock/', '/report/'],
//       target: BaseUrl,
//       changeOrigin: true,
//       pathRewrite: { '^': '' },
//     },
//     {
//       context: ['/ui/', '/logout', '/roadshow', '/ehr'],
//       target: 'http://10.111.164.137:8081/',
//       changeOrigin: true,
//       pathRewrite: { '^': '' },
//     },
//     {
//       context: ['/dispatchByThssoLogin'],
//       target: 'http://10.2.191.75:8081', // 裴荣康
//     },
//     {
//       context: (_, requestObject) => {
//         if (requestObject?.query?.thssoAuthCode) {
//           return true;
//         }
//         return false;
//       },
//       target: 'http://10.2.191.75:8081', // 裴荣康
//     },
//   ],
//   mock: [
//     {
//       context: ['/index/', '/announcement/', '/stock/', '/report/'],
//       target: BaseUrl,
//       changeOrigin: true,
//       pathRewrite: { '^': '' },
//     },
//     {
//       context: ['/ui/', '/logout', '/roadshow', '/ehr'],
//       target: 'http://10.111.164.137:8081/',
//       changeOrigin: true,
//       pathRewrite: { '^': '' },
//     },
//     {
//       context: ['/dispatchByThssoLogin'],
//       target: 'http://10.2.191.75:8081', // 裴荣康
//     },
//     { context: ['/mock/'], target: MockUrl, changeOrigin: true, pathRewrite: { '^/mock': '/' } },
//     {
//       context: (_, requestObject) => {
//         if (requestObject?.query?.thssoAuthCode) {
//           return true;
//         }
//         return false;
//       },
//       target: 'http://10.2.191.75:8081', // 裴荣康
//     },
//   ],
// };
export default {
  dev: {
    context: (pathName: string, requestObject: any) =>
      pathName.includes('dispatchByThssoLogin') ||
      pathName.includes('logout') ||
      requestObject.query.thssoAuthCode,
    target: 'http://10.111.164.78:8081/',
  },
  // dev: {
  //   '/index/': {
  //     target: BaseUrl,
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  //   '/announcement/': {
  //     target: BaseUrl,
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  //   '/stock/': {
  //     target: BaseUrl,
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  //   '/report/': {
  //     target: BaseUrl,
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  //   '/ui/': {
  //     target: 'http://10.111.164.137:8081/',
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  //   '/login': {
  //     // target: 'http://fundportal-pre.tianhongjijin.com.cn',
  //     target: 'http://10.111.23.213:8081',
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  //   '/logout': {
  //     target: 'http://10.111.164.137:8081',
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  //   '/dispatchByThssoLogin': {
  //     // target: 'http://fundportal-pre.tianhongjijin.com.cn',
  //     // target: 'http://10.2.191.75:8081', // 裴荣康
  //     target: 'http://10.111.23.202:8081',
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  //   '/roadshow': {
  //     // target: 'http://fundportal-pre.tianhongjijin.com.cn',
  //     target: 'http://10.2.191.79:8081',
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  //   '/ehr': {
  //     // target: 'http://fundportal-pre.tianhongjijin.com.cn',
  //     target: 'http://10.2.191.79:8081',
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  //   '/object': {
  //     target: 'http://10.111.23.202:8081', // o3 测试
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  // },
  mock: {
    '/index/': {
      target: BaseUrl,
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/announcement/': {
      target: BaseUrl,
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/stock/': {
      target: BaseUrl,
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/report/': {
      target: BaseUrl,
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/ui/': {
      target: 'http://10.111.164.137:8081/',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/login': {
      // target: 'http://10.111.164.66:8081',
      target: 'http://10.111.164.137:8081',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/logout': {
      target: 'http://10.111.164.66:8081',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/dispatch': {
      target: 'http://10.111.164.137:8081',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/mock/': {
      target: MockUrl,
      changeOrigin: true,
      pathRewrite: { '^/mock': '/' },
    },
  },
  test: {
    '/index/': {
      target: BaseUrl,
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/announcement/': {
      target: BaseUrl,
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/stock/': {
      target: BaseUrl,
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/report/': {
      target: BaseUrl,
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  prod: {
    '/api/': {
      target: '',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
    '/index/': {
      target: '',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/announcement/': {
      target: '',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/stock/': {
      target: '',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
