export interface LinkListItem {
  busiType: string;
  contacts: string;
  department: string;
  email: string;
  fax: string;
  id: string;
  mobile: string;
  telephone: string;
}

export interface Pagination {
  total: number;
  pageSize: number;
  current: number;
}
