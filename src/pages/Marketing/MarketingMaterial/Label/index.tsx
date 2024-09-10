import React, { useRef, useState } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { Button, message, Popconfirm, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import LabelModal from './LabelModal';
import '../index.less';
import { labelDel, labelQuery } from '../service';
import moment from 'moment';

const Label = () => {
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

  const onDelete = async (labelId: any) => {
    const { data } = await labelDel({ labelId });

    if (data) {
      message.success('删除成功');
      actionRef.current?.reload();
    }
  };

  const columns = [
    {
      title: '标签名称',
      key: 'labelName',
      dataIndex: 'labelName',
    },
    {
      title: '标签描述',
      key: 'labelDesc',
      dataIndex: 'labelDesc',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
      hideInSearch: true,
      render: (_: any, record: any) => {
        return record.createTime ? moment(record.createTime).format('YYYY-MM-DD') : '--';
      },
    },
    {
      title: '修改时间',
      key: 'updateTime',
      dataIndex: 'updateTime',
      hideInSearch: true,
      render: (_: any, record: any) => {
        return record.updateTime ? moment(record.updateTime).format('YYYY-MM-DD') : '--';
      },
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
              onConfirm={() => onDelete(record?.labelId)}
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
    const { data, success } = await labelQuery({
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
    <ProCardPlus ghost style={{ padding: '12px 12px' }} gutter={[0, 8]} size="small">
      <ProTable
        size="small"
        actionRef={actionRef}
        rowKey="labelId"
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
      <LabelModal visible={visible} modalType={type} initValues={detailInfo} onClose={onClose} />
    </ProCardPlus>
  );
};

export default Label;
