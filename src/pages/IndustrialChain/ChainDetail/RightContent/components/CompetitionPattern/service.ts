import type { ColumnsType } from 'antd/lib/table';

export interface SearchTableProps {
  marginTop?: string;
  list: any;
  title?: string;
  columns: any;
  data: any;
  loading: boolean;
  onChange: (value: any) => void;
}

interface columnsType {
  fundName: string;
  fundCode: string;
  navUnit: string;
  dqPctchange: string;
  netassetTotal: string;
}

export const columns: ColumnsType<columnsType> = [
  {
    title: '公司名称',
    dataIndex: 'companyName',
    key: 'companyName',
  },
  {
    title: '主营业务收入公司占比',
    dataIndex: 'companyWeight',
    key: 'companyWeight',
  },
  {
    title: '主营收入同产品占比',
    dataIndex: 'nodeWeight',
    key: 'nodeWeight',
  },
  {
    title: '主营业务收入(亿)',
    dataIndex: 'productIncome',
    key: 'productIncome',
  },
  {
    title: '节点名称',
    dataIndex: 'chainNodeName',
    key: 'chainNodeName',
  },
];
