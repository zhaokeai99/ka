import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button } from 'antd';
import ProTable from '@ant-design/pro-table';
import { ProFormSelect } from '@ant-design/pro-form';
import ProCardPlus from '@/components/ProCardPlus';
import DetailModal from './DetailModal';
import { queryClientManagerInfo, getDictInfoByType } from './service';
import type { TableListItem } from './service';
import useAuth from '@/components/Hooks/useAuth';
import NoPermissionCard from '@/components/NoPermissionCard';

// 客户经理信息列表
const ClientManager = () => {
  const actionRef = useRef<ActionType>();
  const [isShowModal, setShowModal] = useState(false);
  const [editValues, setEditValues] = useState({});
  const auth = useAuth({ sn: '_marketing_dataConfig_clientManager' });

  const handleShowModal = useCallback((values) => {
    setEditValues(values);
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
        title: '域账号',
        dataIndex: 'userDomain',
        hideInSearch: true,
      },
      {
        title: '姓名',
        dataIndex: 'userTrueName',
      },
      {
        title: '邮箱',
        dataIndex: 'userEmail',
        hideInSearch: true,
      },
      {
        title: '所属部门',
        dataIndex: 'deptName',
      },
      {
        title: '销售类别',
        dataIndex: 'salesKind',
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
              request={async (params) => {
                const list = await getDictInfoByType(params);
                return [...list, { label: '未配置', value: '-' }];
              }}
            />
          );
        },
      },
      {
        title: '销售类别',
        dataIndex: 'salesKindName',
        hideInSearch: true,
      },

      {
        title: '操作',
        key: 'option',
        valueType: 'option',
        render: (text, record) => {
          return (
            <>
              <Button type="link" onClick={() => handleShowModal(record)}>
                配置
              </Button>
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
            rowKey="fundCode"
            request={async (params) => {
              const result = await queryClientManagerInfo({
                ...params,
                pageNo: params.current,
                pageSize: params.pageSize,
              });
              return {
                data: result.data || [],
                total: result.total || 0,
              };
            }}
            columns={columns}
            pagination={{ pageSize: 10 }}
          />
          <DetailModal visible={isShowModal} initValues={editValues} onClose={handleColse} />
        </>
      ) : (
        <NoPermissionCard />
      )}
    </ProCardPlus>
  );
};

export default ClientManager;
