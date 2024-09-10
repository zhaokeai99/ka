import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button } from 'antd';
import ProTable from '@ant-design/pro-table';
import ModalTable from './ModalTable';
import ModalEdit from './ModalEdit';
import { queryUserRelation } from './service';
import type { TableListItem } from './service';

// 用户绑定户名
const UserName = () => {
  const actionRef = useRef<ActionType>();
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [agencyUserList, setAgencyUserList] = useState<any[]>([]);
  const [isShowTableModal, setShowTableModal] = useState(false);
  const [isShowEditModal, setShowEditModal] = useState(false);

  const handleOpenAgency = useCallback((record, type) => {
    setUserName(record.userName || '');
    setUserId(record.userId || '');
    setAgencyUserList(record.agencyUser || []);
    if (type === 'add') {
      setShowTableModal(true);
    } else {
      setShowEditModal(true);
    }
  }, []);

  const handleColse = useCallback(() => {
    setShowEditModal(false);
    actionRef.current?.reload();
  }, []);

  const columns: ProColumns<TableListItem>[] = useMemo(() => {
    return [
      {
        title: '用户ID',
        width: 100,
        dataIndex: 'userId',
        hideInSearch: true,
      },
      {
        title: '用户名',
        width: 100,
        ellipsis: true,
        dataIndex: 'userName',
      },
      {
        title: '手机号',
        width: 100,
        ellipsis: true,
        dataIndex: 'mobile',
      },
      {
        title: '关联机构用户',
        width: 150,
        align: 'center',
        dataIndex: 'agencyUser',
        hideInSearch: true,
        render: (text, record) => {
          return (
            <>
              <Button type="link" onClick={() => handleOpenAgency(record, 'add')}>
                查看
              </Button>
              <Button type="link" onClick={() => handleOpenAgency(record, 'edit')}>
                配置
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
        rowKey="mobile"
        request={async (params) => {
          const data = await queryUserRelation(params);
          return {
            data: data || [],
          };
        }}
        columns={columns}
        pagination={false}
      />
      <ModalTable
        title={userName}
        visible={isShowTableModal}
        dataList={agencyUserList}
        onClose={() => setShowTableModal(false)}
      />
      <ModalEdit
        userId={userId}
        title={userName}
        visible={isShowEditModal}
        dataList={agencyUserList}
        onClose={handleColse}
      />
    </>
  );
};

export default UserName;
