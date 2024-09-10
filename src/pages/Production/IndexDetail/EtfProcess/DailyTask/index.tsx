import { memo, useState, useMemo } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { tableEmptyCellRender } from '@/utils/utils';
import { Badge } from 'antd';
import moment from 'moment';
import Details from './details';
import { queryTaskList } from './service';
interface propsType {
  fundId: string;
}
const statusValue = {
  '0': { color: 'blue', text: '未办理' },
  '1': { color: 'green', text: '已办理' },
  '2': { color: 'gold', text: '超时未办理' },
};
const autoFlagResultValue = {
  '0': { color: 'blue', text: '未开启' },
  '1': { color: 'green', text: '通过校验' },
  '2': { color: 'red', text: '未通过校验' },
  '3': { color: 'green', text: '已开启' },
};
function DailyTask(props: propsType) {
  const [visible, setVisible] = useState<boolean>(false);
  const [subTaskId, setSubTaskId] = useState<any>(null);
  const columns: ProColumns<any>[] = useMemo(() => {
    return [
      {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
      },
      {
        title: '基金代码',
        dataIndex: 'fundCode',
        search: false,
      },
      {
        title: '基金名称',
        dataIndex: 'fundName',
        search: false,
      },
      {
        title: '业务日期',
        valueType: 'date',
        initialValue: moment().format('YYYY-MM-DD'),
        dataIndex: 'businessDate',
        hideInTable: true,
      },
      {
        title: '办理岗位',
        dataIndex: 'handlePost',
        search: false,
      },
      {
        title: '子任务',
        dataIndex: 'subTaskName',
        search: false,
      },
      {
        title: '开始时间',
        dataIndex: 'startDate',
        search: false,
      },
      {
        title: '结束时间',
        dataIndex: 'endDate',
        search: false,
      },
      {
        title: '自动办理',
        dataIndex: 'autoFlag',
        search: false,
        render: (text: any) => {
          return <Badge color={text ? 'green' : 'red'} text={text ? '已开启' : '未开启'} />;
        },
      },
      {
        title: '办理校验',
        dataIndex: 'autoFlagResult',
        search: false,
        render: (text: any) => {
          return (
            <Badge
              color={autoFlagResultValue[text]?.color}
              text={autoFlagResultValue[text]?.text}
            />
          );
        },
      },
      {
        title: '任务状态',
        dataIndex: 'taskStatus',
        search: false,
        render: (text: any) => {
          return <Badge color={statusValue[text]?.color} text={statusValue[text]?.text} />;
        },
      },
      {
        title: '操作',
        valueType: 'option',
        render: (_: any, record: any) => {
          return (
            <a
              onClick={() => {
                setSubTaskId(record.id);
                setVisible(true);
              }}
            >
              查看
            </a>
          );
        },
      },
    ];
  }, []);
  return (
    <>
      <ProTable
        columns={tableEmptyCellRender(columns as any)}
        request={async (params) => {
          return await queryTaskList({
            fundCode: props.fundId,
            ...params,
          });
        }}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
      {visible && (
        <Details
          fundCode={props.fundId}
          subTaskId={subTaskId}
          handleCancel={() => {
            setVisible(false);
          }}
        />
      )}
    </>
  );
}

export default memo(DailyTask);
