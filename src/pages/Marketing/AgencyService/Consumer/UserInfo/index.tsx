import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import DetailModal from './DetailModal';
import {
  queryFundManager,
  userTypeEnum,
  verifyEnum,
  registerStateEnum,
  wechatBindEnum,
} from './service';
import type { TableListItem } from './service';

// 用户关联关系
const UserAssociation = () => {
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
        title: '客户名称',
        width: 50,
        dataIndex: 'userName',
      },
      {
        title: '客户类型',
        width: 50,
        dataIndex: 'userType',
        valueType: 'select',
        valueEnum: userTypeEnum,
      },
      {
        title: '手机号',
        width: 50,
        dataIndex: 'mobile',
      },
      {
        title: '机构名称',
        width: 50,
        dataIndex: 'agencyName',
        hideInSearch: true,
      },
      {
        title: '部门名称',
        width: 30,
        align: 'center',
        dataIndex: 'deptName',
        hideInSearch: true,
      },
      {
        title: '审核状态',
        width: 50,
        dataIndex: 'verify',
        hideInSearch: true,
        valueType: 'select',
        valueEnum: verifyEnum,
      },
      {
        title: '注册状态',
        width: 50,
        dataIndex: 'registerState',
        hideInSearch: true,
        valueType: 'select',
        valueEnum: registerStateEnum,
      },
      {
        title: '微信绑定状态',
        width: 50,
        dataIndex: 'wechatBind',
        hideInSearch: true,
        valueType: 'select',
        align: 'center',
        valueEnum: wechatBindEnum,
      },
      {
        title: '操作',
        width: 30,
        key: 'option',
        valueType: 'option',
        align: 'center',
        render: (text, record) => {
          return (
            <>
              <Button type="link" onClick={() => handleShowModal('edit', record)}>
                修改配置
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
        rowKey="userId"
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
            配置
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

export default UserAssociation;
