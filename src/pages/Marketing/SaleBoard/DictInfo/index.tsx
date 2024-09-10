import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { ProFormSelect } from '@ant-design/pro-form';
import DetailModal from './DetailModal';
import { queryDict, deleteDict, getDictType, displayEnum } from './service';
import type { TableListItem } from './service';
import ProCardPlus from '@/components/ProCardPlus';
import useAuth from '@/components/Hooks/useAuth';
import NoPermissionCard from '@/components/NoPermissionCard';

// 考核归属渠道
const DictInfo = () => {
  const actionRef = useRef<ActionType>();
  const auth = useAuth({ sn: '_marketing_dataConfig_dict' });
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
    const { success, errorMsg } = await deleteDict({ id: id });
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
        title: '字典类型',
        dataIndex: 'dictTypeId',
        renderFormItem: (item, { type }) => {
          if (type === 'form') {
            return null;
          }
          return <ProFormSelect request={() => getDictType()} />;
        },
      },
      {
        title: '字典类型描述',
        dataIndex: 'dictTypeName',
        hideInSearch: true,
      },
      {
        title: '字典项key',
        dataIndex: 'dictKey',
      },
      {
        title: '字典项名称',
        dataIndex: 'dictValue',
      },
      {
        title: '父级字典项key',
        dataIndex: 'parentKey',
      },
      {
        title: '是否展示',
        dataIndex: 'display',
        valueEnum: displayEnum,
      },
      {
        title: '排序',
        dataIndex: 'sorted',
      },
      {
        title: '备注',
        dataIndex: 'memo',
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
    <ProCardPlus style={{ paddingTop: '4px' }} ghost gutter={[0, 8]} size="small">
      {auth ? (
        <>
          <ProTable<TableListItem>
            scroll={{ x: 'max-content' }}
            search={{ labelWidth: 120 }}
            size="small"
            actionRef={actionRef}
            rowKey="id"
            request={async (params) => {
              const result = await queryDict({
                ...params,
                pageNo: params.current,
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
      ) : (
        <NoPermissionCard />
      )}
    </ProCardPlus>
  );
};

export default DictInfo;
