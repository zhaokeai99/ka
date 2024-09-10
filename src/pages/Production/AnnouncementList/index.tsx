import React, { useRef } from 'react';
// import ProCard from '@ant-design/pro-card';
import { ExportOutlined } from '@ant-design/icons';
import ProCardPlus from '@/components/ProCardPlus';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { IndexAnnouncementItem } from './data';
import { queryIndexAnnouncementPageList } from './service';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<IndexAnnouncementItem>[] = [
    {
      title: '',
      dataIndex: 'id',
      hideInTable: true,
      search: false,
    },
    {
      title: '公告标题',
      dataIndex: 'title',
      render: (_, item) => (
        <a target="_blank" href={item.linkUrl} rel="noopener noreferrer">
          {_}
          <ExportOutlined style={{ marginLeft: '5px' }} />
        </a>
      ),
    },

    {
      title: '公告类型',
      dataIndex: 'noticeType',
      tip: '公告类型',
      valueType: 'select',
      valueEnum: {
        '': { text: '全部' },
        NEW: { text: '新指数发布' },
        MODIFY: { text: '指数调整' },
        OTHER: { text: '其他' },
      },
    },
    {
      title: '相关指数系列',
      dataIndex: 'indexSeries',
      // renderText: (val: string) => `${val}公告`,
    },
    {
      title: '发布方',
      dataIndex: 'publisher',
      valueEnum: {
        '': { text: '全部' },
        CSI: { text: '中证' },
        CNI: { text: '国证' },
        SSI: { text: '新华' },
        CESC: { text: '华证' },
      },
    },
    {
      title: '发布时间',
      dataIndex: 'releaseDate',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '发布时间',
      dataIndex: 'releaseDate',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startDate: value[0],
            endDate: value[1],
          };
        },
      },
    },
  ];

  return (
    <ProCardPlus ghost style={{ padding: '12px' }}>
      <ProTable<IndexAnnouncementItem>
        // headerTitle="基金详情"
        size="small"
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
          // collapsed: true,
        }}
        request={(params) => queryIndexAnnouncementPageList(params)}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
        options={{
          density: false,
        }}
      />
    </ProCardPlus>
  );
};

export default TableList;
