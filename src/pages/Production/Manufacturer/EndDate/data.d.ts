export interface EndDataItem {
  id: string;
  fundName: string;
  fundCode: string;
  endDate: string;
  isNotify: number;
  projectManager: string;
  projectOperator: string;
  earlyStopDate: string;
  skipUrl: string;
  actionRemark: string;
  buttonState: boolean;
}

export interface Pagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface DailyReportListParams {
  bizDate?: string;
  endDate?: string;
  fundName?: string;
  offsetId?: number;
  pageNo?: number;
  pageSize?: number;
  current?: number;
  remainingPeriod?: number;
  startDate?: string;
  userName?: string;
}
