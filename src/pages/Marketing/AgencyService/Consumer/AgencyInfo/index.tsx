import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import DetailModal from './DetailModal';
import { queryAgencyInfo } from './service';
import type { TableListItem } from './service';

// 机构信息
const AgencyInfo = () => {
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
        title: '机构名称',
        width: 50,
        ellipsis: true,
        dataIndex: 'agencyName',
      },
      {
        title: '机构类型',
        width: 50,
        dataIndex: 'agencyType',
        valueType: 'select',
        valueEnum: { '1': '内部机构', '0': '外部机构' },
        hideInTable: true,
      },
      {
        title: '机构类型',
        width: 50,
        dataIndex: 'agencyTypeDesc',
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
        rowKey="agencyNo"
        request={async (params) => {
          const result = await queryAgencyInfo({
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

export default AgencyInfo;
