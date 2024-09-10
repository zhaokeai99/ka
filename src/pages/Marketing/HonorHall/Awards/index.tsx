import React, { useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { AwardsTableIndex } from '../data';
import { Button, message, Popconfirm, Space } from 'antd';
import '../index.less';
import { deleteAwardsWinner, queryAwardsWinnerList, queryListCycleTypeAndDesc } from '../service';
import { PlusOutlined } from '@ant-design/icons';
import AwardsModal from './AwardsModal';

// 颁奖配置
const Awards = ({ pageId, activeKey }: any) => {
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
  const handleDel = async ({ awardsId, winnerId, listId, listYear, listCycle }: any) => {
    const { success } = await deleteAwardsWinner({
      awardsId,
      winnerId,
      listId,
      listYear,
      listCycle,
    });

    if (success) {
      message.success('删除成功！');
      actionRef.current?.reload();
      return;
    }
  };

  const column: ProColumns<AwardsTableIndex>[] = [
    {
      title: '榜单名称',
      key: 'listName',
      dataIndex: 'listName',
      sorter: true,
    },
    {
      title: '奖项名称',
      key: 'awardsName',
      dataIndex: 'awardsName',
      sorter: true,
    },
    {
      title: '颁奖年份',
      key: 'listYear',
      dataIndex: 'listYear',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '颁奖年份',
      key: 'listYear',
      dataIndex: 'listYear',
      valueType: 'dateYear',
      hideInTable: true,
    },
    {
      title: '颁奖周期',
      key: 'listCycle',
      dataIndex: 'listCycle',
      hideInSearch: true,
      sorter: true,
      render: (_: any, record: any) => record?.listCycleDesc,
    },
    {
      title: '颁奖周期',
      key: 'listCycle',
      dataIndex: 'listCycle',
      valueType: 'select',
      request: async () => await queryListCycleTypeAndDesc(),
      fieldProps: {
        fieldNames: { label: 'typeDesc', value: 'type' },
      },
      hideInTable: true,
    },
    {
      title: '获奖人',
      key: 'winnerName',
      dataIndex: 'winnerName',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '获奖简介',
      key: 'winnerDesc',
      dataIndex: 'winnerDesc',
      width: 200,
      ellipsis: true,
      hideInSearch: true,
      sorter: true,
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
            title={'确定要删除此条颁奖信息吗?'}
            onConfirm={() => {
              handleDel(record);
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
    const { data, success } = await queryAwardsWinnerList({
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
      <ProTable<AwardsTableIndex>
        rowKey="id"
        columns={column}
        params={{ activeKey }}
        request={queryTableList}
        pagination={pagination}
        scroll={{ x: 'max-content' }}
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
      <AwardsModal type={modalType} visible={visible} onClose={onClose} initValues={editInfo} />
    </>
  );
};

export default Awards;
