import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Popconfirm } from 'antd';
import { useCallback, useMemo, useRef, useState } from 'react';
import DetailModal from './DetailModal';
import type { TableListItem } from './service';
import {
  deleteSubBranch,
  queryAgency,
  queryDivisionManager,
  queryDpt,
  querySubBranch,
} from './service';

// 机构信息
const SubbranchManager = () => {
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
    const { success, errorMsg } = await deleteSubBranch({ dptId: id, dptType: 1 });
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
        title: '支行ID',
        align: 'center',
        dataIndex: 'dptId',
        hideInSearch: true,
      },
      {
        title: '支行名称',
        align: 'center',
        dataIndex: 'dptName',
      },
      {
        title: '赛区名称',
        dataIndex: 'divisionId',
        align: 'center',
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
        title: '机构名称',
        align: 'center',
        dataIndex: 'agencyId',
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
        dataIndex: 'parentId',
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
        title: '创建时间',
        align: 'center',
        dataIndex: 'gmtCreate',
        ellipsis: true,
        hideInSearch: true,
        sorter: (a: any, b: any) =>
          new Date(a.gmtCreate).getTime() - new Date(b.gmtCreate).getTime(),
      },
      {
        title: '修改时间',
        align: 'center',
        ellipsis: true,
        dataIndex: 'gmtModified',
        hideInSearch: true,
        sorter: (a: any, b: any) =>
          new Date(a.gmtModified).getTime() - new Date(b.gmtModified).getTime(),
      },
      {
        title: '操作',
        align: 'center',
        fixed: 'right',
        key: 'option',
        width: 230,
        valueType: 'option',
        render: (text, record) => {
          return (
            <>
              <Button type="link" onClick={() => handleShowModal('addNet', record)}>
                新增网点
              </Button>
              <Button type="link" onClick={() => handleShowModal('edit', record)}>
                编辑
              </Button>
              <Popconfirm
                placement="topLeft"
                title={'您确定要删除该部门吗?'}
                onConfirm={() => {
                  handleDelete(record.dptId);
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
    <>
      <ProTable<TableListItem>
        search={{ labelWidth: 120 }}
        size="small"
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        rowKey="dptId"
        request={async (params) => {
          const result = await querySubBranch({
            ...params,
            currentPage: params.current,
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
  );
};

export default SubbranchManager;
