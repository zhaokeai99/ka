import { Switch, message } from 'antd';
import React, { useRef, useCallback } from 'react';
import { useModel } from 'umi';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { queryRatageMag, updataStatus } from './service';
import moment from 'moment';

// 评级机构管理
const RateAgency: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');

  const handleChangeStatus = useCallback(async (params) => {
    const { success, errorMsg } = await updataStatus({ ...params });
    if (success) {
      message.success('状态更新成功');
      actionRef.current?.reload();
    } else {
      message.error(errorMsg || '状态更新失败');
    }
  }, []);

  const columns: ProColumns[] = [
    {
      title: '评级机构代码',
      dataIndex: 'windCreditratingagency',
      hideInSearch: true,
    },
    {
      title: '评级机构名称',
      key: 'windCreditratingName',
      dataIndex: 'windCreditratingName',
    },
    {
      title: '公司ID',
      dataIndex: 'windCompcode',
      hideInSearch: true,
    },
    {
      title: '维护人',
      dataIndex: 'staticUser',
      hideInSearch: true,
    },
    {
      title: '统计状态',
      dataIndex: 'staticStatus',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        0: '未加入',
        1: '加入',
      },
    },
    {
      title: '统计状态',
      dataIndex: 'staticStatus',
      hideInSearch: true,
      render: (text, record) => (
        <Switch
          style={{ width: 70 }}
          checkedChildren=" 加入 "
          unCheckedChildren="未加入"
          checked={!!text}
          onChange={(checked) => {
            handleChangeStatus({
              windCreditratingagency: record.windCreditratingagency,
              staticUser: initialState?.userName || '',
              staticStatus: checked ? 1 : 0,
            });
          }}
        />
      ),
    },
    {
      title: '创建日期',
      dataIndex: 'addDate',
      hideInSearch: true,
      render: (text: any) => (text && text != '-' ? moment(text).format('YYYY/MM/DD') : ''),
    },

    {
      title: '修改时间',
      dataIndex: 'updateTime',
      hideInSearch: true,
      render: (text: any) =>
        text && text != '-' ? moment(text).format('YYYY/MM/DD HH:mm:ss') : '',
    },
  ];
  return (
    <ProTable
      actionRef={actionRef}
      rowKey="windCreditratingagency"
      toolBarRender={false}
      style={{ padding: 10 }}
      search={{ labelWidth: 'auto' }}
      request={(params) => queryRatageMag(params)}
      columns={columns}
      pagination={{
        pageSize: 10,
      }}
    />
  );
};

export default RateAgency;
