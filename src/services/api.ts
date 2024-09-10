import industrialChain from './api.industrialChain';
import informationApi from './api.information';
import investmentApi from './api.Investment';
import mainPage from './api.mainPage';
import marketingApi from './api.marketing';
import productionApi from './api.production';

export const API = {
  /** 全局 */
  login: '/login',
  logout: '/logout',
  dispatchPass: '/dispatchByThssoLogin',
  getUserInfo:
    'com.thfund.fundprocesscore.facade.service.user.ApplicationUserFacadeService.getUserInfo',
  getPersonalMenu:
    'com.thfund.fundprocesscore.facade.service.module.ThfundModuleService.retrieveFavoriteModulesByUser',
  productionApi,
  marketingApi,
  informationApi,
  mainPage,
  investmentApi,
  industrialChain,
  uploadUrl: '/object',
};
