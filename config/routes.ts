import routesTotal from './routes.total';

export default [
  {
    path: '/',
    exact: true,
    redirect: '/production/summary/hotFundIndex/_single_',
  },
  {
    path: '404',
    exact: true,
    component: './404',
  },
  {
    path: '/',
    component: '../layouts/BaseLayout',
    routes: routesTotal,
  },
];
