import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 主体信息--主体基础信息查询
export async function getCompanyInfo(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.StockPriceChangeFacadeGetCompanyInfo,
    params,
  );
  return {
    data,
    success,
  };
}
// 主体信息--主体发行股票
export async function getStockInfoByCompanyCode(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.StockPriceChangeFacadeGetStockInfoByCompanyCode,
    params,
  );
  return {
    data,
    success,
  };
}
// 主体查询--发行债券列表查询
export async function getBondByCompanyCode(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.BondPriceChangeFacadeFacadeGetBondByCompanyCode,
    params,
  );
  return {
    data,
    success,
  };
}
