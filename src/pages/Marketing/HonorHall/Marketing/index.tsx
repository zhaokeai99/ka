import React, { useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { MarketingTableIndex } from '../data';
import { deleteIcons, queryPageIcons } from '../service';
import { Button, message, Popconfirm, Space, Image, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import MarketingModal from './MarketingModal';

const { Link } = Typography;

// 营销管理
const Marketing = ({ pageId, activeKey }: any) => {
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
  const handleDel = async (id: any) => {
    const { success } = await deleteIcons({ id });

    if (success) {
      message.success('删除成功！');
      actionRef.current?.reload();
      return;
    }
  };

  const column: ProColumns<MarketingTableIndex>[] = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '物料名称',
      key: 'pictureDesc',
      dataIndex: 'pictureDesc',
      sorter: true,
    },
    {
      title: '物料顺序',
      key: 'pictureOrder',
      dataIndex: 'pictureOrder',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '背景图片',
      key: 'pageStaticPath',
      dataIndex: 'pageStaticPath',
      hideInSearch: true,
      render: (url: any, record: any) =>
        record?.pageStaticPath ? <Image width="80px" height="50px" src={url} /> : '-',
    },
    {
      title: '访问地址',
      key: 'pptOrPdfUrl',
      hideInSearch: true,
      render: (_: any, record: any) => {
        if (!record?.pptOrPdfUrl && !record?.skipUrl) {
          return '-';
        }
        return (
          <Link
            href={record?.pptOrPdfUrl || record?.skipUrl}
            target="_blank"
            copyable={{ text: record?.pptOrPdfUrl || record?.skipUrl }}
          >
            查看
          </Link>
        );
      },
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
            title={'确定要删除此条营销信息吗?'}
            onConfirm={() => {
              handleDel(record?.id);
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
    const { data, success }: any = await queryPageIcons({
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
      <ProTable<MarketingTableIndex>
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
      <MarketingModal type={modalType} visible={visible} onClose={onClose} initValues={editInfo} />
    </>
  );
};

export default Marketing;
