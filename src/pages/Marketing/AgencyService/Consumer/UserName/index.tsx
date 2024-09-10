import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button } from 'antd';
import ProTable from '@ant-design/pro-table';
import DetailModal from './DetailModal';
import { queryUserInfo } from './service';
import type { TableListItem } from './service';

// 用户绑定户名
const UserName = () => {
  const actionRef = useRef<ActionType>();
  const [isShowModal, setShowModal] = useState(false);
  const [editValues, setEditValues] = useState({});

  const handleShowModal = useCallback((type, values) => {
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
        title: '用户ID',
        width: 80,
        dataIndex: 'userId',
        hideInSearch: true,
      },
      {
        title: '用户名称',
        width: 50,
        ellipsis: true,
        dataIndex: 'userName',
      },
      {
        title: '手机号',
        width: 80,
        ellipsis: true,
        dataIndex: 'mobile',
      },
      {
        title: '机构名称',
        width: 80,
        ellipsis: true,
        dataIndex: 'agencyName',
        hideInSearch: true,
      },
      {
        title: '用户名下的户名',
        width: 150,
        align: 'center',
        dataIndex: 'investorNames',
        hideInSearch: true,
        render: (text, record) => {
          if (!Array.isArray(record.investorNames) || record.investorNames.length <= 0) {
            return '--';
          }
          return record.investorNames.join(',');
        },
      },
      {
        title: '操作',
        width: 50,
        key: 'option',
        valueType: 'option',
        align: 'center',
        render: (text, record) => {
          return (
            <Button type="link" onClick={() => handleShowModal('edit', record)}>
              配置用户户名
            </Button>
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
          const data = await queryUserInfo(params);
          return {
            data: data || [],
          };
        }}
        columns={columns}
        pagination={false}
      />
      <DetailModal visible={isShowModal} initValues={editValues} onClose={handleColse} />
    </>
  );
};

export default UserName;
