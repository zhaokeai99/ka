import React, { useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { ProptTableIndex } from '../data';
import { Button, Space, Image, Popconfirm, message } from 'antd';
import '../index.less';
import {
  deleteHonorNominateDpt,
  queryAddNominateDptList,
  queryHonorNominateDptList,
} from '../service';
import { PlusOutlined } from '@ant-design/icons';
import ProptModal from './ProptModal';

// 部门信息管理
const Propt = ({ pageId, activeKey }: any) => {
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

  const handleDel = async (deptId: any) => {
    const { success } = await deleteHonorNominateDpt({ deptId });
    if (success) {
      message.success('删除成功！');
      actionRef.current?.reload();
      return;
    }
  };

  const column: ProColumns<ProptTableIndex>[] = [
    {
      title: '部门名称',
      key: 'deptName',
      dataIndex: 'deptName',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '部门名称',
      key: 'deptName',
      dataIndex: 'deptName',
      valueType: 'select',
      request: async () => await queryAddNominateDptList(),
      fieldProps: {
        labelInValue: true,
        fieldNames: { label: 'deptName', value: 'deptId' },
      },
      hideInTable: true,
    },
    {
      title: '部门头像',
      key: 'deptPhoto',
      dataIndex: 'deptPhoto',
      hideInSearch: true,
      render: (url: any, record: any) =>
        record?.deptPhoto ? <Image width="80px" height="50px" src={url} /> : '-',
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
            title={'确定要删除此条部门信息吗?'}
            onConfirm={() => {
              handleDel(record.deptId);
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
    const { data, success } = await queryHonorNominateDptList({
      ...params,
      deptName: params?.deptName?.label,
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
      <ProTable<ProptTableIndex>
        rowKey="id"
        actionRef={actionRef}
        columns={column}
        params={{ activeKey }}
        request={queryTableList}
        pagination={pagination}
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
      <ProptModal type={modalType} visible={visible} onClose={onClose} initValues={editInfo} />
    </>
  );
};

export default Propt;
