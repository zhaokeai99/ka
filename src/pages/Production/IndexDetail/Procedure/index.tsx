import { memo } from 'react';
import { ExportOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { tableEmptyCellRender } from '@/utils/utils';
import { queryProcessRelatedList } from '../service';

const columns: ProColumns<any>[] = [
  {
    title: '流程名称',
    dataIndex: 'processName',
  },
  {
    title: '流程状态',
    dataIndex: 'processStatus',
    search: false,
  },
  {
    title: '发起人',
    dataIndex: 'originator',
  },
  {
    title: '流程描述',
    dataIndex: 'processDescribe',
  },
  {
    title: '流程编号',
    dataIndex: 'processNumber',
  },
  {
    title: '步骤名称',
    dataIndex: 'stepName',
    search: false,
  },
  {
    title: '步骤类型',
    dataIndex: 'stepType',
    search: false,
  },
  {
    title: '流程发起时间',
    dataIndex: 'processStartDate',
    search: false,
  },
  {
    title: '步骤开始时间',
    dataIndex: 'stepStartDate',
    search: false,
  },
  {
    title: '处理人',
    dataIndex: 'solve',
    search: false,
  },
  {
    title: '完结状态',
    dataIndex: 'endStatus',
    search: false,
  },
  {
    title: '操作',
    dataIndex: 'jumpUrl',
    valueType: 'option',
    render: (_: any, row: any) => {
      return (
        <a href={row.jumpUrl} target="_blank" rel="noopener noreferrer">
          查看
          <ExportOutlined style={{ marginLeft: '5px' }} />
        </a>
      );
    },
  },
];

function Procedure({ fundId }: { fundId: string }) {
  return (
    <ProTable
      columns={tableEmptyCellRender(columns as any)}
      request={async (params = {}) => {
        const { current = 1 } = params;
        return queryProcessRelatedList({
          ...params,
          fundId,
          pageNo: current,
        });
      }}
      rowKey="id"
      search={{ labelWidth: 'auto' }}
      toolBarRender={false}
      pagination={{ pageSize: 10 }}
      scroll={{ x: 'max-content' }}
    />
  );
}

export default memo(Procedure);
