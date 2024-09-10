import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import DetailModal from './DetailModal';
import {
  queryRoleScreen,
  deleteRoleScreen,
  booleEnum,
  queryRoles,
  getDictInfoByType,
} from './service';
import type { TableListItem } from './service';
import { ProFormSelect } from '@ant-design/pro-form';

// 角色信息
const RoleScreen = () => {
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
    const { success, errorMsg } = await deleteRoleScreen({ id: id });
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
        title: '角色名称',
        dataIndex: 'roleId',
        hideInTable: true,
        renderFormItem: (item, { type }) => {
          if (type === 'form') {
            return null;
          }
          return (
            <ProFormSelect
              request={async () => {
                return await queryRoles();
              }}
            />
          );
        },
      },
      {
        title: '角色名称',
        ellipsis: true,
        dataIndex: 'roleName',
        hideInSearch: true,
      },
      {
        title: '筛选项类型',
        dataIndex: 'screenType',
        hideInTable: true,
        renderFormItem: (item, { type }) => {
          if (type === 'form') {
            return null;
          }
          return (
            <ProFormSelect
              params={{
                dictType: 'screen',
              }}
              request={async (params) => {
                return await getDictInfoByType(params);
              }}
            />
          );
        },
      },
      {
        title: '筛选项类型',
        dataIndex: 'screenTypeName',
        ellipsis: true,
        hideInSearch: true,
      },
      {
        title: '是否展示',
        dataIndex: 'display',
        valueEnum: booleEnum,
        hideInSearch: true,
      },
      {
        title: '展示条件类型',
        dataIndex: 'conditionTypeName',
        ellipsis: true,
        hideInSearch: true,
      },
      {
        title: '展示条件',
        dataIndex: 'displayConditionName',
        ellipsis: true,
        hideInSearch: true,
      },
      {
        title: '筛选项值是否受控',
        dataIndex: 'control',
        valueEnum: booleEnum,
        ellipsis: true,
        hideInSearch: true,
      },
      {
        title: '筛选项值',
        dataIndex: 'screenValueName',
        ellipsis: true,
        hideInSearch: true,
      },
      {
        title: '排序',
        dataIndex: 'sorted',
        ellipsis: true,
        hideInSearch: true,
      },
      {
        title: '操作',
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
        scroll={{ x: 'max-content' }}
        search={{ labelWidth: 120 }}
        size="small"
        actionRef={actionRef}
        rowKey="id"
        request={async (params) => {
          const result = await queryRoleScreen({
            ...params,
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

export default RoleScreen;
