import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Cascader } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import DetailModal from './DetailModal';
import { queryDingUser, queryDingUserInfoTree } from './service';
import type { TableListItem } from './service';

const User = () => {
  const actionRef = useRef<ActionType>();
  const [isShowModal, setShowModal] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [userIds, setUserIds] = useState<any>([]);
  const [treeData, setTreeData] = useState([]);

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

  const dataFn = useCallback((data) => {
    return data?.map((item: any) => {
      return {
        label: item?.deptName,
        value: item?.deptId,
        children: dataFn(item?.childDepts || []),
      };
    });
  }, []);

  useEffect(() => {
    queryDingUserInfoTree().then((res) => {
      const obj = dataFn(res?.data);
      setTreeData(obj);
    });
  }, []);

  const columns: ProColumns<TableListItem>[] = useMemo(() => {
    return [
      {
        title: '用户姓名',
        dataIndex: 'userName',
        fixed: 'left',
      },
      {
        title: '昵称',
        ellipsis: true,
        dataIndex: 'nickName',
        hideInSearch: true,
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        hideInSearch: true,
      },
      {
        title: '角色信息',
        align: 'center',
        dataIndex: 'roles',
        hideInSearch: true,
        render: (roles) => {
          return roles?.map((i: any) => i.roleName).join(',');
        },
      },
      {
        title: '所属部门',
        dataIndex: 'department',
        hideInTable: true,
        renderFormItem: (item, { type }) => {
          if (type === 'form') {
            return null;
          }
          return <Cascader options={treeData} placeholder="请选择部门" changeOnSelect />;
        },
      },
      {
        title: '操作',
        key: 'option',
        valueType: 'option',
        render: (text, record) => {
          return (
            <>
              <Button type="link" disabled={userIds.length} onClick={() => handleShowModal(record)}>
                配置
              </Button>
            </>
          );
        },
      },
    ];
  }, [userIds, treeData]);

  return (
    <>
      <ProTable<TableListItem>
        rowSelection={{
          onChange: (selectedRowKeys) => setUserIds(selectedRowKeys),
        }}
        scroll={{ x: 'max-content' }}
        search={{ labelWidth: 120 }}
        size="small"
        actionRef={actionRef}
        rowKey="userId"
        request={async (params) => {
          const { current, pageSize, department } = params;
          const obj: any = {
            ...params,
            currentPage: current,
            pageSize: pageSize,
          };
          if (department) obj.department = department[department?.length - 1] || '';
          const result = await queryDingUser(obj);
          return {
            data: result || [],
          };
        }}
        columns={columns}
        pagination={{ pageSize: 10 }}
        toolBarRender={() => [
          <Button
            key="add_button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => handleShowModal({})}
            disabled={!userIds.length}
          >
            批量配置
          </Button>,
        ]}
      />
      <DetailModal
        visible={isShowModal}
        initValues={editValues}
        onClose={handleColse}
        userIds={userIds}
      />
    </>
  );
};

export default User;
