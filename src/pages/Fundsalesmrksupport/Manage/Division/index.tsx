import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Popconfirm } from 'antd';
import { useCallback, useMemo, useRef, useState } from 'react';
import DetailModal from './DetailModal';
import type { TableListItem } from './service';
import { deleteFundManager, queryDivisionManager } from './service';

// 理财师赛区管理
const DivisionManager = () => {
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
    const { success, errorMsg } = await deleteFundManager({ divisionId: id });
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
        title: '赛区id',
        align: 'center',
        dataIndex: 'divisionId',
        hideInSearch: true,
      },
      {
        title: '赛区名称',
        align: 'center',
        ellipsis: true,
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
        title: '赛区排序',
        hideInSearch: true,
        align: 'center',
        dataIndex: 'sortNum',
      },
      {
        title: '赛区状态',
        dataIndex: 'state',
        hideInTable: true,
        align: 'center',
        valueType: 'select',
        valueEnum: {
          1: '已开启',
          2: '已结束',
        },
      },
      {
        title: '赛区状态',
        hideInSearch: true,
        align: 'center',
        ellipsis: true,
        render: (ReactChild, state) => {
          if (state.state == 1) {
            return '已开启';
          }
          if (state.state == 2) {
            return '已结束';
          }
          return '-';
        },
      },
      {
        title: '创建时间',
        hideInSearch: true,
        ellipsis: true,
        align: 'center',
        dataIndex: 'gmtCreate',
        sorter: (a: any, b: any) =>
          new Date(a.gmtCreate).getTime() - new Date(b.gmtCreate).getTime(),
      },
      {
        title: '修改时间',
        hideInSearch: true,
        align: 'center',
        ellipsis: true,
        dataIndex: 'gmtModified',
        sorter: (a: any, b: any) =>
          new Date(a.gmtModified).getTime() - new Date(b.gmtModified).getTime(),
      },
      {
        title: '操作',
        key: 'option',
        align: 'center',
        fixed: 'right',
        valueType: 'option',
        render: (text, record) => {
          return (
            <>
              <Button type="link" onClick={() => handleShowModal('edit', record)}>
                编辑
              </Button>
              <Popconfirm
                placement="topLeft"
                title={'删除赛区，赛区下的配置也会删除，您确定要删除当前赛区吗?'}
                onConfirm={() => {
                  handleDelete(record.divisionId);
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
        rowKey="divisionId"
        request={async (params) => {
          const result = await queryDivisionManager({
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

export default DivisionManager;
