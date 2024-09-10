import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Popconfirm } from 'antd';
import { useCallback, useMemo, useRef, useState } from 'react';
import DetailModal from './DetailModal';
import type { TableListItem } from './service';
import { deleteAgency, queryAgency } from './service';

// 机构信息
const AgencyManager = () => {
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
    const { success, errorMsg } = await deleteAgency({ agencyId: id });
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
        title: '机构ID',
        dataIndex: 'agencyId',
        align: 'center',
      },
      {
        title: '机构名称',
        dataIndex: 'agencyName',
        align: 'center',
      },
      {
        title: '机构类型',
        align: 'center',
        ellipsis: true,
        dataIndex: 'agencyType',
        hideInSearch: true,
      },
      {
        title: '创建时间',
        align: 'center',
        ellipsis: true,
        dataIndex: 'gmtCreate',
        hideInSearch: true,
        sorter: (a: any, b: any) =>
          new Date(a.gmtCreate).getTime() - new Date(b.gmtCreate).getTime(),
      },
      {
        title: '修改时间',
        ellipsis: true,
        align: 'center',
        dataIndex: 'gmtModified',
        hideInSearch: true,
        sorter: (a: any, b: any) =>
          new Date(a.gmtModified).getTime() - new Date(b.gmtModified).getTime(),
      },
      {
        title: '操作',
        align: 'center',
        key: 'option',
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
                title={'您确定要删除该机构吗?'}
                onConfirm={() => {
                  handleDelete(record.agencyId);
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
        search={{ labelWidth: 120 }}
        size="small"
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        rowKey="agencyId"
        request={async (params) => {
          const result = await queryAgency({
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

export default AgencyManager;
