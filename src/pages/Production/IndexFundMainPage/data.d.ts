export interface HotFundListIndex {
  fundCode: string;
  fundName: string;
  purchaseCumCnt: string;
  purchaseCumCntRadio: string;
  purchaseAmt: string;
  redeemAmt: string;
  netAmt: string;
  stockAmt: string;
  yearHeadInr: string;
}

export interface KeySalesListIndex {
  agencyCode: string;
  agencyName: string;
  purchaseAmt: string;
  redeemAmt: string;
  netAmt: string;
  stockAmt: string;
  holdNetAmt: string;
}

export interface AllMarketCapitalType {
  fiveAverageDealAmount: number;
  fiveInflowAmount: number;
  industryName: string;
  newScale: number;
  oneAverageDealAmount: number;
  oneInflowAmount: number;
  sixtyAverageDealAmount: number;
  sixtyInflowAmount: number;
  thisYearAverageDealAmount: number;
  thisYearInflowAmount: number;
  twentyAverageDealAmount: number;
  twentyInflowAmount: number;
}

export interface ThFundMobilityType {
  fiveAverageDealAmount: number;
  fiveDealRank: number;
  fundCode: string;
  fundName: string;
  mobilityPosition: number;
  newScale: number;
  sampleNum: number;
  scaleRank: number;
  threeMonthsAverageDealAmount: number;
  threeMonthsDealRank: number;
  turnoverRate: number;
  upMarketDate: string;
  upMarketDuration: number;
}

export interface FundCompanyScaleTopType {
  averageScale: number;
  fiveInflowAmount: number;
  fundCompany: string;
  fundScale: number;
  numRank: number;
  oneInflowAmount: number;
  productCount: number;
  scaleRank: number;
  sixtyInflowAmount: number;
  sixtyInflowAmountRank: number;
  thisYearInflowAmount: number;
  thisYearInflowAmountRank: string;
  twentyInflowAmount: number;
}
