import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Popconfirm, message, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import DetailModal from './DetailModal';
import { queryAllStrategyMeeting, deleteStrategyMeeting, getTypeList } from './service';
import type { TableListItem } from './service';
const { Link } = Typography;

// 基金经理信息列表
const StrategyMeeting = () => {
  const actionRef = useRef<ActionType>();
  const [isShowModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editValues, setEditValues] = useState({});

  const handleShowModal = useCallback((type, values) => {
    setEditValues(values);
    setModalType(type);
    setShowModal(true);
  }, []);

  const handleColse = useCallback((key) => {
    setShowModal(false);
    if (key === 'reload') {
      actionRef.current?.reload();
    }
  }, []);

  const handleDelete = useCallback(async (id) => {
    const { success, errorMsg } = await deleteStrategyMeeting({ meetingId: id });
    if (success) {
      message.success('删除成功');
      actionRef.current?.reload();
    } else {
      message.error(errorMsg || '删除失败');
    }
  }, []);

  const columns: ProColumns<TableListItem>[] = useMemo(() => {
    return [
      {
        title: '标题',
        width: 50,
        dataIndex: 'title',
      },
      {
        title: '概要 ',
        width: 50,
        ellipsis: true,
        dataIndex: 'summary',
      },
      {
        title: '策略会类型',
        width: 30,
        ellipsis: true,
        dataIndex: 'meetingType',
        hideInTable: true,
        request: async () => {
          return await getTypeList();
        },
      },
      {
        title: '类型',
        width: 30,
        ellipsis: true,
        dataIndex: 'meetingTypeDesc',
        hideInSearch: true,
      },
      {
        title: '策略会信息url',
        width: 30,
        ellipsis: true,
        dataIndex: 'meetingInfoUrl',
        hideInSearch: true,
        render: (text, record) => {
          if (!record.meetingInfoUrl) {
            return '--';
          }
          return (
            <Link
              href={record.meetingInfoUrl}
              target="_blank"
              copyable={{ text: record.meetingInfoUrl }}
            >
              查看
            </Link>
          );
        },
      },
      {
        title: '策略会时间',
        width: 50,
        ellipsis: true,
        dataIndex: 'meetingDate',
        valueType: 'dateRange',
        hideInTable: true,
      },
      {
        title: '策略会时间',
        width: 50,
        ellipsis: true,
        dataIndex: 'meetingDate',
        hideInSearch: true,
      },
      {
        title: '创建时间',
        width: 50,
        ellipsis: true,
        dataIndex: 'gmtCreate',
        hideInSearch: true,
        sorter: (a: any, b: any) =>
          new Date(a.gmtCreate).getTime() - new Date(b.gmtCreate).getTime(),
      },
      {
        title: '修改时间',
        width: 50,
        ellipsis: true,
        dataIndex: 'gmtModified',
        hideInSearch: true,
        sorter: (a: any, b: any) =>
          new Date(a.gmtModified).getTime() - new Date(b.gmtModified).getTime(),
      },
      {
        title: '操作',
        width: 50,
        key: 'option',
        valueType: 'option',
        render: (text: any, record: any) => {
          return (
            <>
              <Button type="link" onClick={() => handleShowModal('edit', record)}>
                编辑
              </Button>
              <Popconfirm
                placement="topLeft"
                title={'删除后不可恢复，您确定要删除吗?'}
                onConfirm={() => {
                  handleDelete(record.meetingId);
                }}
                okText="确定"
                cancelText="取消"
              >
                <Button type="text" danger>
                  删除{' '}
                </Button>
              </Popconfirm>
            </>
          );
        },
      },
    ];
  }, []);

  return (
    <>
      <ProTable<TableListItem>
        search={{ labelWidth: 120 }}
        size="small"
        actionRef={actionRef}
        rowKey="meetingId"
        request={async (params) => {
          const { meetingDate = ['', ''], ...other } = params;
          const result = await queryAllStrategyMeeting({
            ...other,
            beginMeetingDate: meetingDate[0],
            endMeetingDate: meetingDate[1],
            currentPage: params.current,
            pageSize: params.pageSize,
          });
          return {
            data: result.data || [],
            total: result.total || 0,
          };
        }}
        toolBarRender={() => [
          <Button
            key="add_button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => handleShowModal('add', {})}
          >
            新增
          </Button>,
        ]}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
      <DetailModal
        visible={isShowModal}
        modalType={modalType}
        initValues={editValues}
        onClose={handleColse}
      />
    </>
  );
};

export default StrategyMeeting;
