export interface ProductFundIndex {
  fundCode: number; // 基金编码
  fundName: string; // 基金名称
  fundType: string; // 产品类型
  fundTypeName: string; // 产品类型名称
  purchaseAmt: string; // 累计申购
  redeemAmt: string; // 累计赎回
  netAmt: string; // 净申购
  purchaseCnt: string; // 申购笔数
  redeemCnt: string; // 赎回笔数
  purchaseCumCnt: string; // 申购客户数
  redeemCumCnt: string; // 赎回客户数
  fixPurchaseAmt: string; // 定投金额
  fixPurchaseCnt: string; // 定投笔数
  fixPurchaseCumCnt: string; // 定投客户数
  newPurchaseCumCnt: string; // 新增交易客户数
  stockAmt: string; // 存量规模
  yearHeadStockAmt: string; // 年初规模
  holdNetAmt: string; // 保有净增
}

export interface CastSurelyIndex {
  agencyCode: string;
  agencyName: string;
  fixInvestAmt: string;
  fixInvestAmtInr: string;
  accumFixInvestAmt: string;
  fixInvestTradeCnt: string;
  fixInvestTradeCntInr: string;
  accumFixInvestAcoCnt: string;
  fixInvestAcoCnt: string;
  fixInvestAcoCntInr: string;
  accumFixInvestAcoCnt: string;
}

export interface ChannelIndex {
  agencyCode: string;
  agencyName: string;
  purchaseAmt: string;
  redeemAmt: string;
  netAmt: string;
  purchaseCnt: string;
  redeemCnt: string;
  stockAmt: string;
  holdNetAmt: string;
  stockAmtProportion: string;
}
