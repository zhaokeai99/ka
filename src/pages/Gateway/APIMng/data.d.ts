export interface APIItem {
  id?: string;
  operateType?: string;
  appName?: string;
  authority?: string;
  description?: string;
  modifior?: string;
  createTime?: string;
  modifyTime?: string;
}

export interface Pagination {
  total?: number;
  pageSize?: number;
  pageNo?: number;
  current?: number;
}

export interface FormProps {
  visible?: boolean;
  title?: string;
  type?: string;
  submitter?:
    | false
    | SubmitterProps<{
        form?: FormInstance<any> | undefined;
      }>;
  initialValues?: Record<string, unknown>;
  onVisibleChange?: (value: boolean) => void;
  onFinish?: (values: AppItem) => Promise;
}
