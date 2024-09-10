export interface IndexAnnouncementItem {
  title: string;
  indexSeries: string;
  publisher: string;
  noticeType: string;
  linkUrl: string;
  releaseDate: string;
}

export interface Pagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface IndexAnnouncementList {
  list: IndexAnnouncementItem[];
  pagination: Partial<Pagination>;
}

export interface IndexAnnouncementParams {
  pageSize?: number;
  pageNo?: number;
  publisher?: string;
  current?: number;
  title?: string;
  indexSeries?: string; // 相关指数系列
  startDate?: string;
  endDate?: string;
  noticeType?: string; // 公告类型
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
}
