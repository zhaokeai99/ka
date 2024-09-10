export interface IndexAnnouncementItem {
  id: string;
  fundCode: string;
  fundName: string;
  oneLevel: string;
  twoLevel: string;
  threeLevel: string;
  fundManagerName: string;
  pureDebt: string;
  deposits: string;
  fundLevel: string;
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
