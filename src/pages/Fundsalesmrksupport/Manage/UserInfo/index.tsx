import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Popconfirm } from 'antd';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import type { TableListItem } from './service';
import DetailModal from './DetailModal';
import {
  querySalesUserInfo,
  deleteSalesUserInfo,
  queryAgency,
  queryDivisionManager,
  queryDpt,
  queryNetBranch,
  querySubBranch,
} from './service';
import ProCardPlus from '@/components/ProCardPlus';

//  用户信息
const UserInfoManager = () => {
  const actionRef = useRef<ActionType>();
  const [editValues, setEditValues] = useState({});
  const [isShowModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');

  const handleColse = useCallback((key) => {
    setShowModal(false);
    if (key === 'reload') {
      actionRef.current?.reload();
    }
  }, []);

  const handleShowModal = useCallback((type, values) => {
    setModalType(type);
    setEditValues(values);
    setShowModal(true);
  }, []);

  const handleDelete = useCallback(async (id) => {
    const { success, errorMsg } = await deleteSalesUserInfo({ userId: id });
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
        title: '赛区名称',
        align: 'center',
        dataIndex: 'divisionId',
        valueType: 'select',
        request: async () => {
          const data = await queryDivisionManager();
          return data?.map((item: any) => {
            return {
              label: item?.divisionName,
              value: item?.divisionId,
            };
          });
        },
        fieldProps: { showSearch: true },
      },
      {
        title: '用户名称',
        align: 'center',
        dataIndex: 'userName',
      },
      {
        title: '用户ID',
        align: 'center',
        dataIndex: 'userId',
        hideInSearch: true,
        ellipsis: true,
      },
      {
        title: '手机号',
        align: 'center',
        dataIndex: 'mobile',
      },
      {
        title: '机构名称',
        dataIndex: 'agencyId',
        align: 'center',
        hideInSearch: true,
        valueType: 'select',
        request: async () => {
          const data = await queryAgency();
          return data?.map((item: any) => {
            return {
              label: item?.agencyName,
              value: item?.agencyId,
            };
          });
        },
        fieldProps: { showSearch: true },
      },
      {
        title: '分行名称',
        align: 'center',
        dataIndex: 'dptId',
        valueType: 'select',
        request: async () => {
          const data = await queryDpt();
          return data?.map((item: any) => {
            return {
              label: item?.dptName,
              value: item?.dptId,
            };
          });
        },
        fieldProps: { showSearch: true },
      },
      {
        title: '支行名称',
        align: 'center',
        dataIndex: 'subBranchId',
        valueType: 'select',
        request: async () => {
          const result = await querySubBranch();
          for (let i = 0; i < result.length; i++) {
            if (result[i].subBranchName.startsWith('front-')) {
              result[i].subBranchName = result[i].subBranchName.replace('front-', '');
            }
            if (result[i].subBranchName.startsWith('back-')) {
              result[i].subBranchName = result[i].subBranchName.replace('back-', '');
            }
          }
          return result?.map((item: any) => {
            return {
              label: item?.subBranchName,
              value: item?.subBranchId,
            };
          });
          // return transOptions(result, 'subBranchName', 'subBranchId', false);
        },
        fieldProps: { showSearch: true },
      },
      {
        title: '网点名称',
        align: 'center',
        dataIndex: 'netId',
        valueType: 'select',
        request: async () => {
          const data = await queryNetBranch();
          return data?.map((item: any) => {
            return {
              label: item?.netName,
              value: item?.netId,
            };
          });
        },
        fieldProps: { showSearch: true },
      },
      {
        title: '注册时间',
        align: 'center',
        dataIndex: 'gmtCreate',
        ellipsis: true,
        hideInSearch: true,
        sorter: (a: any, b: any) =>
          new Date(a.gmtCreate).getTime() - new Date(b.gmtCreate).getTime(),
      },
      {
        title: '操作',
        fixed: 'right',
        align: 'center',
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
                title={'删除不可恢复，确认删除吗？'}
                onConfirm={() => {
                  handleDelete(record.userId);
                }}
                okText="确定"
                cancelText="取消"
              >
                <Button type="text" danger>
                  删除
                </Button>
              </Popconfirm>
            </>
          );
        },
      },
    ];
  }, []);

  return (
    <ProCardPlus ghost style={{ padding: '12px' }} sn="_marketing_fundsalesmrksupport_userInfo">
      <>
        <ProTable<TableListItem>
          search={{ labelWidth: 120 }}
          size="small"
          actionRef={actionRef}
          scroll={{ x: 'max-content' }}
          rowKey="userId"
          request={async (params) => {
            const result = await querySalesUserInfo({
              ...params,
              currentPage: params.current,
              pageSize: params.pageSize,
            });
            return {
              data: result || [],
            };
          }}
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
    </ProCardPlus>
  );
};

export default UserInfoManager;
