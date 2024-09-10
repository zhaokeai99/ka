import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import DetailModal from './DetailModal';
import { deleteDivisionProduct, queryProducts } from './service';
import type { TableListItem } from './service';
import { queryDivisionManager } from '@/pages/Fundsalesmrksupport/Manage/CopyRules/service';

// 理财师公共产品池管理
const DivisionProductPool = () => {
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

  const handleDelete = useCallback(async (record) => {
    const { success, errorMsg } = await deleteDivisionProduct({ ...record });
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
        title: '赛区名称',
        align: 'center',
        dataIndex: 'divisionId',
        ellipsis: true,
        valueType: 'select',
        request: async () => {
          const data = await queryDivisionManager();
          return data?.map((item: any) => {
            return {
              label: item?.divisionName,
              value: item?.divisionId,
            };
          });
        },
        fieldProps: { showSearch: true },
      },
      {
        title: '基金代码',
        align: 'center',
        dataIndex: 'fundCode',
      },
      {
        title: 'wind代码',
        align: 'center',
        dataIndex: 'wProductCode',
        hideInSearch: true,
      },
      {
        title: '基金名称',
        align: 'center',
        dataIndex: 'fundName',
      },
      {
        title: '买入费率',
        hideInSearch: true,
        align: 'center',
        dataIndex: 'buyRate',
      },
      {
        title: '赎回费率',
        hideInSearch: true,
        align: 'center',
        dataIndex: 'redeemRate',
      },
      {
        title: '基金公司名称',
        hideInSearch: true,
        align: 'center',
        dataIndex: 'companyName',
      },
      {
        title: '创建时间',
        hideInSearch: true,
        align: 'center',
        ellipsis: true,
        dataIndex: 'gmtCreate',
        sorter: (a: any, b: any) =>
          new Date(a.gmtCreate).getTime() - new Date(b.gmtCreate).getTime(),
      },
      {
        title: '修改时间',
        hideInSearch: true,
        align: 'center',
        ellipsis: true,
        dataIndex: 'gmtModified',
        sorter: (a: any, b: any) =>
          new Date(a.gmtModified).getTime() - new Date(b.gmtModified).getTime(),
      },
      {
        title: '操作',
        fixed: 'right',
        align: 'center',
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
                title={'您确定要删除吗'}
                onConfirm={() => {
                  handleDelete(record);
                }}
                okText="确定"
                cancelText="取消"
              >
                <Button type="text" danger>
                  删除
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
        scroll={{ x: 'max-content' }}
        rowKey={`${+new Date() + Math.random()}`}
        request={async (params) => {
          const result = await queryProducts({
            ...params,
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

export default DivisionProductPool;
