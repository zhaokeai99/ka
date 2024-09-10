import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import DetailModal from './DetailModal';
import {
  queryVogTargetInfo,
  deleteVogTargetInfo,
  getDictInfoByType,
  querySysDeptInfo,
} from './service';
import type { TableListItem } from './service';
import { ProFormSelect } from '@ant-design/pro-form';
import ProCardPlus from '@/components/ProCardPlus';
import useAuth from '@/components/Hooks/useAuth';
import NoPermissionCard from '@/components/NoPermissionCard';

// 考核归属渠道
const VogTarget = () => {
  const actionRef = useRef<ActionType>();
  const auth = useAuth({ sn: '_marketing_dataConfig_vogTarget' });
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
    const { success, errorMsg } = await deleteVogTargetInfo({ id });
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
        title: 'vog数据维度',
        dataIndex: 'vogTypeValue',
        hideInSearch: true,
      },
      {
        title: 'vog数据维度',
        dataIndex: 'vogType',
        hideInTable: true,
        renderFormItem: (item, { type }) => {
          if (type === 'form') {
            return null;
          }
          return (
            <ProFormSelect
              params={{
                dictType: 'vog_target_type',
              }}
              request={(params) => getDictInfoByType(params)}
            />
          );
        },
      },
      {
        title: '考核年份',
        dataIndex: 'vogYear',
      },
      {
        title: '考核目标(单位:亿)',
        dataIndex: 'vogTarget',
        hideInSearch: true,
      },
      {
        title: '体系',
        dataIndex: 'sysValue',
        hideInSearch: true,
      },
      {
        title: '体系',
        dataIndex: 'sys',
        hideInTable: true,
        renderFormItem: (item, { type }) => {
          if (type === 'form') {
            return null;
          }
          return (
            <ProFormSelect
              request={async () => {
                return await querySysDeptInfo({ departType: 1 });
              }}
            />
          );
        },
      },
      {
        title: '部门',
        dataIndex: 'deptValue',
        hideInSearch: true,
      },
      {
        title: '产品类型',
        dataIndex: 'fundTypeValue',
        hideInSearch: true,
      },
      {
        title: '产品类型',
        dataIndex: 'fundType',
        hideInTable: true,
        renderFormItem: (item, { type }) => {
          if (type === 'form') {
            return null;
          }
          return (
            <ProFormSelect
              params={{
                dictType: 'fund_vog_type',
              }}
              request={(params) => getDictInfoByType(params)}
            />
          );
        },
      },
      {
        title: '销售类型',
        dataIndex: 'salesTypeValue',
        hideInSearch: true,
      },
      {
        title: '销售类型',
        dataIndex: 'salesType',
        hideInTable: true,
        renderFormItem: (item, { type }) => {
          if (type === 'form') {
            return null;
          }
          return (
            <ProFormSelect
              params={{
                dictType: 'sales_kind',
              }}
              request={(params) => getDictInfoByType(params)}
            />
          );
        },
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
    <ProCardPlus ghost style={{ paddingTop: '4px' }} gutter={[0, 8]} size="small">
      {auth ? (
        <>
          <ProTable<TableListItem>
            scroll={{ x: 'max-content' }}
            search={{ labelWidth: 120 }}
            size="small"
            actionRef={actionRef}
            rowKey="id"
            request={async (params) => {
              const { current, pageSize } = params;
              const result = await queryVogTargetInfo({
                ...params,
                pageNo: current,
                pageSize: pageSize,
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
      ) : (
        <NoPermissionCard />
      )}
    </ProCardPlus>
  );
};

export default VogTarget;
