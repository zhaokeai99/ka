import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface IAFColumnsType {
  csi300IndexRiseAndFallPct?: string; // 沪深300指数涨跌幅
  oppositeHs300IncomeRate?: string; // 相对沪深300指数涨跌幅
  csi500IndexRiseAndFallPct?: string; // 中证500指数涨跌幅
  oppositeZz500IncomeRate?: string; // 相对中证500涨跌幅
  gemIndexRiseAndFallPct?: string; // 创业板指数涨跌幅
  oppositeCybIncomeRate?: string; // 相对创业板指数涨跌幅
  hsiIndexRiseAndFallPct?: string; // 恒生指数涨跌幅
  oppositeHsIncomeRate?: string; // 相对恒生指数涨跌幅
  hsTechIndexRiseAndFallPct?: string; // 恒生科技指数涨跌幅
  oppositeHskjIncomeRate?: string; // 相对恒生科技指数涨跌幅
}

export interface ITableColumnsType extends IAFColumnsType {
  pTradeDate?: string; //时间
  stockName?: string; //股票简称
  windStockCode?: string; //股票代码
  closeAmt?: string; //现价
  incomeRate?: string; //涨跌幅
  citicsOneIncomeRate?: string; //指数涨跌幅
  relativeIndustryIndexRiseAndFallPct?: string; //相对行业指数涨跌幅
  citicClassifyOneTypeName?: string; //行业
  tradeCnt?: string; //成交量（手）
  tradeAmt?: string; //成交金额（千元）
  turnover?: string; //换手率
}

// 股票行情报表查询
export async function getStockReport(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.StockPriceChangeFacadeGetStockReport,
    params,
  );
  return {
    data,
    success,
  };
}

// 中信一级行业列表
export async function getCiticIndustryList(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.StockPriceChangeFacadeGetCiticIndustryList,
    params,
  );
  return {
    data,
    success,
  };
}

// 筛选条件-股票简称模糊查询
export async function likeStockName(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.StockPriceChangeFacadeLikeStockName,
    params,
  );
  return {
    data,
    success,
  };
}
