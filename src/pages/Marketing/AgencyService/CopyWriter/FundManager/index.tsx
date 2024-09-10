import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import DetailModal from './DetailModal';
import { queryFundManager, deleteFundManager } from './service';
import type { TableListItem } from './service';

// 基金经理
const FundManager = () => {
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
    const { success, errorMsg } = await deleteFundManager({ fundManagerId: id });
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
        title: '基金经理姓名',
        width: 50,
        dataIndex: 'fundManagerName',
      },
      {
        title: '基金经理简介',
        width: 120,
        ellipsis: true,
        dataIndex: 'defaultIntroduction',
      },
      {
        title: '头像',
        width: 30,
        ellipsis: true,
        dataIndex: 'photoUrl',
        hideInSearch: true,
        valueType: 'image',
        align: 'center',
      },
      {
        title: '创建时间',
        width: 50,
        align: 'center',
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
        render: (text, record) => {
          return (
            <>
              <Button type="link" onClick={() => handleShowModal('edit', record)}>
                编辑
              </Button>
              <Popconfirm
                placement="topLeft"
                title={'删除基金经理其对应观点也会删除，您确定要删除吗?'}
                onConfirm={() => {
                  handleDelete(record.fundManagerId);
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
        rowKey="fundManagerId"
        request={async (params) => {
          const result = await queryFundManager({
            ...params,
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

export default FundManager;
