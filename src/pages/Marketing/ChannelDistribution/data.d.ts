export interface ChannelTableIndex {
  agencyCode: string; // 渠道编码
  agencyName: string; // 客户全称
  agencyType: string; // 渠道类别
  agencyTypeName: string; // 渠道类别名称
  agencyNickName: string; // 客户简称
  purchaseAmt: string; // 申购
  redeemAmt: string; // 赎回
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

export interface ProductPositionIndex {
  fundCode: string;
  fundName: string;
  fundType: string;
  fundTypeName: string;
  purchaseAmt: string;
  redeemAmt: string;
  netAmt: string;
  purchaseCnt: string;
  redeemCnt: string;
  stockAmt: string;
  profitAmt: string;
  accumProfitAmt: string;
  newPurchaseCumCnt: string;
}

export interface FundAllocationIndex {
  fundType: string;
  fundTypeName: string;
  purchaseAmt: string;
  redeemAmt: string;
  netAmt: string;
  purchaseCnt: string;
  redeemCnt: string;
  stockAmt: string;
  profitAmt: string;
  accumProfitAmt: string;
}
