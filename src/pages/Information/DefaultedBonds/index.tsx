import { Switch, message, Button, Popconfirm } from 'antd';
import React, { useRef, useCallback, useState } from 'react';
import { useModel } from 'umi';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import {
  queryDefReport,
  updataStatus,
  addDefReportform,
  removeDefReportform,
  AddParams,
} from './service';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText, ProFormRadio, ProFormInstance } from '@ant-design/pro-form';

// 违约债管理
const DefaultedBonds: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance<{}>>();
  const [formVisible, setFormVisible] = useState(false);
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
      title: '债券代码',
      key: 'bondCode',
      dataIndex: 'bondCode',
      hideInSearch: true,
    },
    {
      title: '债券名称',
      key: 'bondName',
      dataIndex: 'bondName',
    },
    {
      title: '发行方',
      dataIndex: 'issuerName',
      key: 'issuerName',
      hideInSearch: true,
    },
    {
      title: '维护人',
      dataIndex: 'insertUser',
      key: 'insertUser',
      hideInSearch: true,
    },
    {
      title: '是否有效',
      dataIndex: 'isStatus',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        1: '是',
        0: '否',
      },
    },
    {
      title: '是否有效',
      dataIndex: 'isStatus',
      hideInSearch: true,
      render: (text, record) => (
        <Switch
          style={{ width: 50 }}
          checkedChildren="是"
          unCheckedChildren="否"
          checked={!!text}
          onChange={(checked) => {
            handleChangeStatus({
              bondCode: record.bondCode,
              insertUser: initialState?.userName || '',
              isStatus: checked ? 1 : 0,
            });
          }}
        />
      ),
    },
    {
      title: '创建日期',
      dataIndex: 'creationTime',
      key: 'creationTime',
      // valueType: 'date',
      hideInSearch: true,
      render: (text: any) =>
        text && text != '-' ? moment(text).format('YYYY/MM/DD  HH:mm:ss') : '',
    },
    {
      title: '操作',
      hideInSearch: true,
      dataIndex: 'bondCode',
      key: 'bondCode',
      render: (text: string) => (
        <Popconfirm
          key="delPopConfirm"
          onConfirm={async () => {
            const { success = false, error } = await removeDefReportform({ bondCode: text });
            if (success) {
              message.success(`成功了删除一条违约债管理数据`);
              actionRef.current.reload();
            } else {
              message.error(error);
            }
          }}
          title={`确认删除吗`}
          okText="是"
          cancelText="否"
        >
          <Button type="link" size="small" href="#" onClick={(e) => e.preventDefault()}>
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];
  return (
    <>
      <ProTable
        actionRef={actionRef}
        rowKey="bondCode"
        toolBarRender={false}
        style={{ padding: 10 }}
        search={{
          defaultCollapsed: false,
          labelWidth: 'auto',
          optionRender: (searchConfig, formProps, dom) => [
            dom[1],
            <Button
              key="new"
              type="primary"
              onClick={() => {
                setFormVisible(true);
              }}
            >
              <PlusOutlined />
              新增
            </Button>,
          ],
        }}
        request={(params) => queryDefReport(params)}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
      />
      <ModalForm
        // initialValues={editDomain}
        title="新增"
        formRef={formRef}
        visible={formVisible}
        modalProps={{
          onCancel: () => {
            // 重置表单
            formRef?.current?.resetFields();
            setFormVisible(false);
          },
        }}
        onFinish={async (values: AddParams) => {
          const result = await addDefReportform({
            ...values,
            insertUser: initialState?.userName || '',
          });
          if (result.success) {
            message.success('新增成功');
            // 重置表单
            formRef?.current?.resetFields();
            setFormVisible(false);
          } else {
            message.error(result.errorMsg || '新增失败');
          }
          return true;
        }}
      >
        <ProFormText rules={[{ required: true }]} width="md" name="bondCode" label="债券代码" />
        <ProFormText rules={[{ required: true }]} width="md" name="bondName" label="债券名称" />
        <ProFormText rules={[{ required: true }]} width="md" name="issuerName" label="发行方" />
        <ProFormRadio.Group
          name="isStatus"
          label="是否有效"
          rules={[{ required: true }]}
          options={[
            {
              label: '是',
              value: 1,
            },
            {
              label: '否',
              value: 0,
            },
          ]}
        />
      </ModalForm>
    </>
  );
};

export default DefaultedBonds;
