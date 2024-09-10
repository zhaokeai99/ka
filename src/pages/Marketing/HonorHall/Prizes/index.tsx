import React, { useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, message, Popconfirm, Space } from 'antd';
import { PrizesTableIndex } from '../data';
import '../index.less';
import { deleteHonorAwardsById, queryAwardsTypeDesc, queryHonorAwardsList } from '../service';
import { PlusOutlined } from '@ant-design/icons';
import PrizesModal from './PrizesModal';

// 奖项配置
const Prizes = ({ pageId, activeKey }: any) => {
  const actionRef = useRef<ActionType>();
  const [modalType, setModalType] = useState('');
  const [visible, setVisible] = useState(false);
  const [editInfo, setEditInfo] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const showModal = (type: string) => {
    setModalType(type);
    setVisible(true);
  };

  // 编辑
  const onEdit = async (value: any) => {
    setEditInfo(value);
    showModal('EDIT');
  };

  // 删除
  const handleDel = async (awardsId: any) => {
    const { success } = await deleteHonorAwardsById({ awardsId });
    if (success) {
      message.success('删除成功！');
      actionRef.current?.reload();
      return;
    }
  };

  const column: ProColumns<PrizesTableIndex>[] = [
    {
      title: '奖项名称',
      key: 'awardsName',
      dataIndex: 'awardsName',
      sorter: true,
    },
    {
      title: '奖项标签',
      key: 'awardsType',
      dataIndex: 'awardsType',
      valueType: 'select',
      request: async () => {
        return await queryAwardsTypeDesc();
      },
      hideInTable: true,
    },
    {
      title: '奖项标签',
      key: 'awardsType',
      dataIndex: 'awardsType',
      hideInSearch: true,
      sorter: true,
      render: (_: any, record: any) => record?.awardsTypeDesc,
    },
    {
      title: '创建日期',
      key: 'gmtCreate',
      dataIndex: 'gmtCreate',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '更新日期',
      key: 'gmtModified',
      dataIndex: 'gmtModified',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '操作',
      key: 'action',
      hideInSearch: true,
      render: (_: any, record: any) => (
        <Space size={12}>
          <a onClick={() => onEdit(record)}>编辑</a>
          <Popconfirm
            placement="topLeft"
            title={'确定要删除此条奖项信息吗?'}
            onConfirm={() => {
              handleDel(record.awardsId);
            }}
            okText="确定"
            cancelText="取消"
          >
            <a className="table-action-del">删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const queryTableList = async (params: any, sorter: any) => {
    if (activeKey !== pageId) return;
    const { data, success } = await queryHonorAwardsList({
      ...params,
      currentPage: params.current,
      orderFields: Object.keys(sorter)[0] || '',
      orderType: Object.values(sorter)[0] === 'ascend' ? 'asc' : 'desc',
    });
    if (success) {
      setPagination({
        current: data?.currentPage,
        pageSize: data?.pageSize,
      });
    }
    return data;
  };

  const onClose = (val: any) => {
    setVisible(false);
    if (val === 'RELOAD') {
      actionRef.current?.reload();
    }
  };

  return (
    <>
      <ProTable<PrizesTableIndex>
        rowKey="awardsId"
        columns={column}
        params={{ activeKey }}
        request={queryTableList}
        pagination={pagination}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button
            key="add_button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => showModal('ADD')}
          >
            新增
          </Button>,
        ]}
      />
      <PrizesModal type={modalType} visible={visible} onClose={onClose} initValues={editInfo} />
    </>
  );
};

export default Prizes;
