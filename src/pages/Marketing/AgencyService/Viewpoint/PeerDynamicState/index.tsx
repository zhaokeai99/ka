import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import DetailModal from './DetailModal';
import { queryPeerDynamicState, deletePeerDynamicState } from './service';
import type { TableListItem } from './service';

// 基金经理信息列表
const PeerDynamicState = () => {
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
    const { success, errorMsg } = await deletePeerDynamicState({ id: id });
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
        title: '动态日期',
        width: 50,
        ellipsis: true,
        dataIndex: 'dynamicDate',
        valueType: 'dateRange',
        hideInTable: true,
      },
      {
        title: '动态日期',
        width: 50,
        ellipsis: true,
        dataIndex: 'dynamicDate',
        hideInSearch: true,
      },
      {
        title: '资金流入比例',
        width: 50,
        ellipsis: true,
        dataIndex: 'fundFlowIntoRatio',
        hideInSearch: true,
      },
      {
        title: '资金流入产品名称',
        width: 50,
        dataIndex: 'fundFlowIntoProductName',
      },
      {
        title: '扩展信息 ',
        width: 50,
        ellipsis: true,
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
          const { dynamicDate = ['', ''], ...other } = params;
          const result = await queryPeerDynamicState({
            ...other,
            startDynamicDate: dynamicDate[0],
            endDynamicDate: dynamicDate[1],
            currentPage: params.current,
            pageSize: params.pageSize,
          });
          return {
            data: result || [],
            total: result.length || 0,
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

export default PeerDynamicState;
