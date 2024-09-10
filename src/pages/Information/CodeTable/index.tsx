import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import DetailModal from './DetailModal';
import { getType, getPageDataByQuery } from './service';
import type { TableListItem } from './service';

// 码表管理
const CodeTable = () => {
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

  const columns: ProColumns<TableListItem>[] = useMemo(() => {
    return [
      {
        title: '类型编码',
        width: 80,
        dataIndex: 'typeCode',
        hideInSearch: true,
      },
      {
        title: '类型名称',
        width: 80,
        dataIndex: 'typeName',
        valueType: 'select',
        request: async () => {
          const result = await getType();
          return result;
        },
      },
      {
        title: '编码',
        width: 50,
        dataIndex: 'subTypeCode',
        hideInSearch: true,
      },
      {
        title: '名称',
        width: 50,
        dataIndex: 'subTypeName',
        hideInSearch: true,
      },
      {
        title: '值',
        width: 50,
        ellipsis: true,
        dataIndex: 'dataValue',
        hideInSearch: true,
      },
      {
        title: '排序',
        width: 20,
        align: 'center',
        dataIndex: 'orderNum',
        hideInSearch: true,
      },
      {
        title: '备注',
        width: 100,
        ellipsis: true,
        dataIndex: 'remark',
        hideInSearch: true,
      },
      {
        title: '修改时间',
        width: 80,
        dataIndex: 'insertTimeFormat',
        hideInSearch: true,
      },
      {
        title: '操作',
        width: 30,
        key: 'option',
        valueType: 'option',
        render: (text, record) => {
          return (
            <a
              onClick={() => {
                handleShowModal('edit', record);
              }}
            >
              修改
            </a>
          );
        },
      },
    ];
  }, []);

  return (
    <ProCard style={{ padding: '12px 12px' }} ghost gutter={[0, 8]} size="small">
      <ProTable<TableListItem>
        size="small"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={async (params) => {
          const result = await getPageDataByQuery({
            typeCode: params.typeName || '',
            pageNum: params.current,
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
    </ProCard>
  );
};

export default CodeTable;
