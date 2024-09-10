import React, { useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { MessageTableIndex } from '../data';
import { Button, Image, message, Popconfirm, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import BannerModal from './BannerModal';
import { deleteScStaticResource, queryScStaticResource } from '../service';
import '../index.less';

const Banner = () => {
  const actionRef = useRef<ActionType>();
  const [modalType, setModalType] = useState('');
  const [visible, setVisible] = useState(false);
  const [orderByParam, setOrderByParam] = useState({});
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
  const handleDel = async (id: any) => {
    const { success } = await deleteScStaticResource({ id });

    if (success) {
      message.success('删除成功！');
      actionRef.current?.reload();
    }
  };

  const columns: ProColumns<MessageTableIndex>[] = [
    {
      title: '图片名称',
      key: 'pictureDesc',
      dataIndex: 'pictureDesc',
      sorter: true,
    },
    {
      title: '图片地址',
      key: 'pageStaticPath',
      dataIndex: 'pageStaticPath',
      hideInSearch: true,
      render: (url: any) => (url ? <Image width="80px" height="50px" src={url} /> : '-'),
    },
    {
      title: '排序',
      key: 'pictureOrder',
      dataIndex: 'pictureOrder',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '跳转链接',
      key: 'skipUrl',
      dataIndex: 'skipUrl',
      hideInSearch: true,
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
            title={'确定要删除此Banner信息吗?'}
            onConfirm={() => {
              handleDel(record.id);
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

  const onClose = (val: any) => {
    setVisible(false);
    if (val === 'RELOAD') {
      actionRef.current?.reload();
    }
  };

  const queryTableList = async (params: any) => {
    const { current, ...others } = params || {};
    const { success, data } = await queryScStaticResource({
      ...others,
      ...orderByParam,
      currentPage: current,
    });

    if (success) {
      setPagination({
        current: data?.currentPage,
        pageSize: data?.pageSize,
      });
    }

    return data;
  };

  const handleOrderColumn = (__: any, _: any, sorter: any) => {
    const { column, order } = sorter || {};
    const { key } = column || {};
    const orderBy = order
      ? {
          orderFields: key,
          orderType: order === 'ascend' ? 'asc' : 'desc',
        }
      : null;
    setOrderByParam({ ...orderBy });
  };

  return (
    <>
      <ProTable<MessageTableIndex>
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        params={{ ...orderByParam }}
        request={queryTableList}
        pagination={pagination}
        onChange={handleOrderColumn}
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
      <BannerModal type={modalType} visible={visible} onClose={onClose} initValues={editInfo} />
    </>
  );
};

export default Banner;
