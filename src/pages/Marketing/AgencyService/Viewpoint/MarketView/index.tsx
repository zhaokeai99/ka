import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import DetailModal from './DetailModal';
import {
  queryMarketViewPoint,
  deleteMarketViewPoint,
  queryMarketViewPointTypeDesc,
} from './service';
import type { TableListItem } from './service';

// 市场观点
const MarketView = () => {
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
    const { success, errorMsg } = await deleteMarketViewPoint({ id });
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
        title: '观点类型',
        width: 50,
        dataIndex: 'viewpointType',
        valueType: 'select',
        request: async () => {
          return await queryMarketViewPointTypeDesc();
        },
      },
      {
        title: '观点时间',
        width: 50,
        valueType: 'dateRange',
        dataIndex: 'viewpointDate',
        hideInTable: true,
      },
      {
        title: '观点时间',
        width: 50,
        dataIndex: 'viewpointDate',
        hideInSearch: true,
      },
      {
        title: '乐观机构个数',
        width: 35,
        ellipsis: true,
        dataIndex: 'optimismAgencyNumber',
        hideInSearch: true,
      },
      {
        title: '中立机构个数',
        width: 35,
        ellipsis: true,
        dataIndex: 'neutralityAgencyNumber',
        hideInSearch: true,
      },
      {
        title: '谨慎机构个数',
        width: 35,
        ellipsis: true,
        dataIndex: 'cautiousAgencyNumber',
        hideInSearch: true,
      },
      {
        title: '机构总数',
        width: 30,
        dataIndex: 'agencySum',
        hideInSearch: true,
      },
      {
        title: '扩展信息',
        width: 50,
        dataIndex: 'extInfo',
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
        title: '更新时间',
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
        render: (text, record) => {
          return (
            <>
              <Button type="link" onClick={() => handleShowModal('edit', record)}>
                编辑
              </Button>
              <Popconfirm
                placement="topLeft"
                title={'删除后不可恢复，您确定要删除吗?'}
                onConfirm={() => {
                  handleDelete(record.id);
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
        rowKey="id"
        request={async (params) => {
          const { viewpointDate = ['', ''], ...other } = params;
          const result = await queryMarketViewPoint({
            ...other,
            startDate: viewpointDate[0],
            endDate: viewpointDate[1],
            currentPage: params.current,
            pageSize: params.pageSize,
          });
          return {
            data: result || [],
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

export default MarketView;
