export interface IndexItem {
  indexCode: string;
  indexName: string;
  indexShortName: string;
  releaseDate: string;
  publisher: string;
  indexType: string;
  sampleNum: number;
  exchange: string;
  indexTypeCode: string;
  indexStyle: string;
  weightingMethod: string;
  basePeriod: string;
  basePoint: string;
  indexWebsite: string;
}

export interface Pagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface IndexList {
  list: IndexItem[];
  pagination: Partial<Pagination>;
}

export interface IndexListParams {
  pageSize?: number;
  current?: number;
  offsetId?: number;
  indexCode?: number;
  indexName?: number;
  publisher?: string;
  indexType?: string;
  sampleNumStart?: number;
  sampleNumEnd?: number;
  startDate?: string;
  endDate?: string;
  noticeType?: string; // 公告类型
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}

export interface IndexLineParams {
  indexCode: string | [];
  bizType: string;
  startDate: string;
  endDate: string;
}

export interface StockInfoParams {
  pageSize?: number | undefined;
  current?: number | undefined;
  keyword?: string | undefined;
  indexCode?: string | [];
  stockCode?: string;
  stockName?: string;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
  topNum?: number | undefined;
}

export enum IndustryTypeEnum {
  ZX1 = 'zx_1',
  ZX2 = 'zx_2',
  ZX3 = 'zx_3',
  ZX4 = 'zx_4',
  SW1 = 'sw_1',
  SW2 = 'sw_2',
  SW3 = 'sw_3',
  SW4 = 'sw_4',
}

export interface IndustryParams {
  indexCode?: string | string[];
  industryType?: IndustryTypeEnum;
}

export interface IndexCoreParams {
  indexCode?: string | string[];
}
