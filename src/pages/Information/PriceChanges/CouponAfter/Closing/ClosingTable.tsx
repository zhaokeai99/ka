import React, { useContext, useMemo } from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { CouponAfterContext, ICAProps, ITableItemType } from '../data.d';
import { getEventReport } from '../service';

interface IClosingTable extends Omit<ICAProps<string>, 'onChangeParams'> {}

const ClosingTable: React.FC<IClosingTable> = ({ params }) => {
  const { valueEnum, bondCode, onOpen } = useContext(CouponAfterContext);

  const onEventTypeClick =
    <T,>(record: T, title?: T): any =>
    () => {
      onOpen({
        record: record,
        visible: true,
        title: title ?? '',
      });
    };

  const columns: ProColumns<ITableItemType>[] = useMemo(() => {
    return [
      {
        title: '时间',
        align: 'left',
        dataIndex: 'tradeDate',
        width: 140,
        hideInSearch: true,
        hideInForm: true,
      },
      {
        title: '事件时间',
        align: 'left',
        dataIndex: 'eventDate',
        width: 140,
        hideInSearch: true,
        hideInForm: true,
      },
      {
        title: '事件类型',
        align: 'left',
        dataIndex: 'eventType',
        width: 160,
        hideInSearch: true,
        onFilter: true,
        ellipsis: true,
        valueType: 'select',
        filters: true,
        valueEnum: valueEnum,
      },
      {
        title: '事件标题',
        align: 'left',
        dataIndex: 'eventTitle',
        hideInSearch: true,
        hideInForm: true,
        ellipsis: true,
      },
      {
        title: '事件详情',
        align: 'left',
        dataIndex: 'eventDetail',
        hideInSearch: true,
        hideInForm: true,
        width: 120,
        render: (_, record) => {
          return (
            <a target="__block" onClick={onEventTypeClick<React.ReactNode>(record, '事件详情')}>
              查看详情
            </a>
          );
        },
      },
    ];
  }, [valueEnum]);

  return (
    <>
      <ProTable
        toolBarRender={false}
        search={false}
        columns={columns}
        size="small"
        rowKey={(record: any, index?: number) => `${record?.eventTitle}${index}`}
        params={{
          date: params,
          bondCode: bondCode,
        }}
        request={async (value, _, filter) => {
          const { data } = await getEventReport({
            bondCode: bondCode,
            date: value?.date,
            pageNum: value?.current,
            pageSize: value?.pageSize,
            type: 'closePrice',
            eventType: filter?.eventType?.join(','),
          });
          return {
            data: data?.data,
            total: data?.total,
          };
        }}
        pagination={{ defaultPageSize: 10 }}
      />
    </>
  );
};

export default ClosingTable;
