import ProCardPlus from '@/components/ProCardPlus';
import { Button, message, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { ActionType } from '@ant-design/pro-table';
import {
  queryCustomerIsNoDisturb,
  queryMotEventSmsTaskList,
  sendSms,
  updateMotEventTaskSmsStatus,
} from './service';
import { ProForm, ProFormTextArea, ProTable } from '@ant-design/pro-components';
import { ExclamationCircleOutlined, SendOutlined, SyncOutlined } from '@ant-design/icons';
import { ProFormInstance } from '@ant-design/pro-form';

const SmsTask: React.FC<any> = (props) => {
  const [smsDisturb, setSmsDisturb] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const { eventTaskId, thUserId, source } = props;

  const smsRecordColumns: any[] = [
    {
      title: '发送时间',
      key: 'sendDate',
      dataIndex: 'sendDate',
      width: '20%',
    },
    {
      title: '发送状态',
      key: 'status',
      dataIndex: 'status',
      width: '10%',
    },
    {
      title: '发送人',
      key: 'advisorName',
      dataIndex: 'advisorName',
      width: '10%',
    },
    {
      title: '发送内容',
      key: 'content',
      dataIndex: 'content',
      ellipsis: true,
      width: '40%',
    },
    {
      title: '短信任务编号',
      key: 'msgId',
      dataIndex: 'msgId',
      width: '20%',
    },
  ];

  const createSmsTask = (_smsContent: any) => {
    sendSms({
      sendMotEnentMessageRequest: {
        eventTaskId: eventTaskId,
        thUserId: [thUserId],
        type: source,
      },
      content: _smsContent,
    }).then(async (isOk) => {
      if (isOk) {
        formRef?.current?.resetFields();
        message.success('已执行发送动作！');
      } else {
        message.error('发送失败，请联系管理员！');
      }
    });
  };

  const sendSmsTask = () => {
    const _smsContent = formRef?.current?.getFieldValue('smsContent');
    if (!_smsContent || _smsContent.length < 10) {
      message.warn('内容不允许为空，且至少大于十个字！');
      return;
    }
    Modal.confirm({
      title: '提醒',
      content: '确定向该客户发送短信？',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        if (smsDisturb) {
          Modal.confirm({
            title: '提醒',
            content: '该客户已被标记为“禁止短信”，是否确定发送短信？',
            icon: <ExclamationCircleOutlined />,
            onOk() {
              createSmsTask(_smsContent);
            },
          });
        } else {
          createSmsTask(_smsContent);
        }
      },
    });
  };

  const refreshSmsTaskList = async (current: number, pageSize: number) => {
    const smsTaskList = await queryMotEventSmsTaskList({
      currentPage: current,
      pageSize: pageSize,
      eventTaskId: eventTaskId,
      thUserId: [thUserId],
      type: source,
    });
    return {
      data: smsTaskList.data,
      total: smsTaskList.total,
      success: true,
    };
  };

  useEffect(() => {
    queryCustomerIsNoDisturb({
      thUserIds: [thUserId],
    }).then((data) => {
      if (data && data[0]?.isNoSmsDisturb == '0') {
        setSmsDisturb(true);
      }
    });
  }, []);
  return (
    <ProCardPlus ghost>
      <ProForm
        formRef={formRef}
        submitter={{
          render: () => {
            return [
              <Button type="primary" icon={<SendOutlined />} onClick={sendSmsTask}>
                提交处理结果
              </Button>,
              <Button
                icon={<SyncOutlined />}
                onClick={() => {
                  updateMotEventTaskSmsStatus({
                    eventTaskId: eventTaskId,
                    thUserId: [thUserId],
                    type: source,
                  }).then(async (data) => {
                    if (data) {
                      actionRef.current?.reload();
                      message.success('已更新！');
                    } else {
                      message.error('更新失败，请重试！');
                    }
                  });
                }}
              >
                更新短信发送记录
              </Button>,
            ];
          },
        }}
      >
        <ProFormTextArea colProps={{ span: 24 }} name="smsContent" label="短信内容：" />
      </ProForm>
      <ProTable
        title={() => '短信发送记录'}
        size="small"
        rowKey="msgId"
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        toolBarRender={false}
        search={false}
        request={async (params) => {
          return await refreshSmsTaskList(
            params?.current ? params.current : 1,
            params?.pageSize ? params.pageSize : 20,
          );
        }}
        columns={smsRecordColumns}
        bordered={true}
        options={false}
      />
    </ProCardPlus>
  );
};

export default SmsTask;
