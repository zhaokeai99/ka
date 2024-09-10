import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 个股详情--股票基础信息查询
export async function getStockInfo(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.StockPriceChangeFacadeGetStockInfo,
    params,
  );
  return {
    data,
    success,
  };
}

// 个股详情--持仓产品
export async function getHoldProducts(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.StockPriceChangeFacadeGetHoldProducts,
    params,
  );
  return {
    data,
    success,
  };
}

//个股详情-价格趋势
export async function getPerformanceChart(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.StockPriceChangeFacadeGetPerformanceChart,
    params,
  );
  return {
    data,
    success,
  };
}

//异动归因-异动风险图
export async function getEventChart(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.StockPriceChangeFacadeGetEventChart,
    params,
  );
  return {
    data,
    success,
  };
}

//异动归因-异动风险分页报表
export async function getEventReport(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.StockPriceChangeFacadeGetEventReport,
    params,
  );
  return {
    data,
    success,
  };
}

//异动归因-异动风险分页报表
export async function getEventType(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.StockPriceChangeFacadeGetEventType,
    params,
  );
  return {
    data,
    success,
  };
}
