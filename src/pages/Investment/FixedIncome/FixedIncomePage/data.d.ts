export interface TemplateItem {
  modelId?: string;
  modelName?: string;
  paramList?: string;
  modelLogic?: string;
  columnList?: string;
  modelRemark?: string;
  createUser?: string;
  createTime?: string;
  updateUser?: string;
  updateTime?: string;
}

export interface Pagination {
  total?: number;
  pageIndex?: number;
  size?: number;
  current?: number;
  pageSize?: number;
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
  onFinish?: (values: TemplateItem) => Promise;
}
