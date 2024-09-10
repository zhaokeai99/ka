import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Popconfirm, message, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import DetailModal from './DetailModal';
import { queryAllFundManagerViewpoint, deleteFundManagerViewpoint, getTypeList } from './service';
import type { TableListItem } from './service';

const { Link } = Typography;

// 基金经理信息列表
const FundManagerViewpoint = () => {
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
    const { success, errorMsg } = await deleteFundManagerViewpoint({ viewPointId: id });
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
        title: '基金经理',
        width: 30,
        ellipsis: true,
        dataIndex: 'fundManagerName',
      },
      {
        title: '标题',
        width: 50,
        dataIndex: 'title',
      },
      {
        title: '摘要',
        width: 50,
        ellipsis: true,
        dataIndex: 'summary',
      },
      {
        title: '观点链接',
        width: 30,
        ellipsis: true,
        dataIndex: 'viewpointInfoUrl',
        hideInSearch: true,
        render: (text, record) => {
          if (!record.viewpointInfoUrl) {
            return '--';
          }
          return (
            <Link
              href={record.viewpointInfoUrl}
              target="_blank"
              copyable={{ text: record.viewpointInfoUrl }}
            >
              查看
            </Link>
          );
        },
      },
      {
        title: '观点类型',
        width: 30,
        ellipsis: true,
        dataIndex: 'vogType',
        valueType: 'select',
        hideInTable: true,
        request: async () => {
          return await getTypeList();
        },
      },
      {
        title: '观点类型',
        width: 30,
        ellipsis: true,
        dataIndex: 'vogTypeDesc',
        hideInSearch: true,
      },
      {
        title: '观点时间',
        width: 50,
        ellipsis: true,
        valueType: 'dateRange',
        dataIndex: 'viewDate',
        hideInTable: true,
      },
      {
        title: '观点时间',
        width: 50,
        ellipsis: true,
        dataIndex: 'viewDate',
        hideInSearch: true,
      },
      {
        title: '发布时间',
        width: 50,
        ellipsis: true,
        dataIndex: 'publishDate',
        hideInSearch: true,
      },
      {
        title: '创建时间',
        width: 50,
        ellipsis: true,
        dataIndex: 'createTime',
        hideInSearch: true,
        sorter: (a: any, b: any) =>
          new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
      },
      {
        title: '修改时间',
        width: 50,
        ellipsis: true,
        dataIndex: 'updateTime',
        hideInSearch: true,
        sorter: (a: any, b: any) =>
          new Date(a.updateTime).getTime() - new Date(b.updateTime).getTime(),
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
                  handleDelete(record.viewPointId);
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
        rowKey="viewPointId"
        request={async (params) => {
          const { viewDate = ['', ''], ...other } = params;
          const result = await queryAllFundManagerViewpoint({
            ...other,
            beginViewDate: viewDate[0],
            endViewDate: viewDate[1],
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

export default FundManagerViewpoint;
