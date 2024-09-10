export interface IndexFeeItem {
  title: string;
  indexSeries: string;
  publisher: string;
  noticeType: string;
  linkUrl: string;
  releaseDate: string;
  indexWebsite: string;
  id: string;
  fundCode: string;
  businessCycle: string;
}

export interface Pagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface QueryReportListParams {
  businessCycle?: string;
  companyName?: string;
  fundCode?: string;
  publisher?: string;
  indexFollow?: string;
  offsetId?: number;
  pageNo?: number;
  pageSize?: number;
  current?: number;
}
