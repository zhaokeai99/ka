import React, { useRef, useState } from 'react';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { Button, message, Popconfirm, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CategoryModal from '../CategoryModal';
import '../../index.less';
import { catDelete, catQuery } from '../../service';

type PropsType = {
  tabId: string;
};

const CategoryTable = (props: PropsType) => {
  const { tabId } = props;
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState('');
  const [detailInfo, setDetailInfo] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const showModal = (val: string) => {
    setType(val);
    setVisible(true);
  };

  const onEdit = (item: any) => {
    showModal('EDIT');
    setDetailInfo(item);
  };

  const onDelete = async (catId: any) => {
    const { success } = await catDelete({ catModule: tabId, catId });
    if (success) {
      message.success('删除成功');
      actionRef.current?.reload();
    }
  };

  const columns = [
    {
      title: '名称',
      key: 'catName',
      dataIndex: 'catName',
    },
    {
      title: '描述',
      key: 'catDesc',
      dataIndex: 'catDesc',
      hideInSearch: true,
    },
    {
      title: '创建人',
      key: 'creator',
      dataIndex: 'creator',
    },
    {
      title: '操作',
      key: 'action',
      hideInSearch: true,
      render: (_: any, record: any) => {
        return (
          <Space size={12}>
            <a onClick={() => onEdit(record)}>编辑</a>
            <Popconfirm
              placement="topLeft"
              title={'您确定要删除吗?'}
              onConfirm={() => onDelete(record?.catId)}
              okText="确定"
              cancelText="取消"
            >
              <a className="table-action-del">删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const queryTableList = async (params: any) => {
    const { data, success } = await catQuery({
      ...params,
      currentPage: params.current,
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
      <ProTable
        key={tabId}
        size="small"
        actionRef={actionRef}
        rowKey="catId"
        params={{ catModule: tabId }}
        request={queryTableList}
        toolBarRender={() => {
          return [
            <Button icon={<PlusOutlined />} type="primary" onClick={() => showModal('ADD')}>
              新增
            </Button>,
          ];
        }}
        columns={columns}
        pagination={pagination}
      />
      <CategoryModal
        tabId={tabId}
        visible={visible}
        modalType={type}
        initValues={detailInfo}
        onClose={onClose}
      />
    </>
  );
};

export default CategoryTable;
