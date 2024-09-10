import ProCardPlus from '@/components/ProCardPlus';
import { Button, message, Modal, Space, Steps } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import {
  ExclamationCircleOutlined,
  InteractionOutlined,
  PhoneOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import {
  createPhoneTask,
  queryCustomerIsNoDisturb,
  queryPhoneTaskList,
  updatePhoneTaskList,
} from './service';
import { ProTable } from '@ant-design/pro-components';
import { secondFormat } from '@/utils/utils';
import moment from 'moment';
import { ActionType } from '@ant-design/pro-table';

const CallTask: React.FC<any> = (props) => {
  const [stepCurrent, setStepCurrent] = useState<number>(0);
  const [phoneDisturb, setPhoneDisturb] = useState<boolean>(false);
  const [stepLoading, setStepLoading] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();

  const { eventTaskId, thUserId, source } = props;
  const stepItems = [
    {
      title: '生成外呼任务',
      icon: <InteractionOutlined />,
    },
    {
      title: '去外呼',
      icon: <PhoneOutlined />,
    },
  ];

  const whRecordColumns: any[] = [
    {
      title: '通话时间',
      key: 'callBeginDate',
      dataIndex: 'callBeginDate',
      width: 40,
      renderText: (text: any, record: any) => {
        const callEndDate = record?.callEndDate;
        if (!text || !callEndDate) {
          return '';
        }
        const startDate = moment(text).format('YYYY-MM-DD');
        const startTime = moment(text).format('HH:mm:ss');
        const endTime = moment(callEndDate).format('HH:mm:ss');
        return `${startTime}~${endTime}(${startDate})`;
      },
    },
    {
      title: '通话时长',
      key: 'talkTime',
      dataIndex: 'talkTime',
      width: 15,
      renderText: (text: any) => {
        if (typeof text != 'undefined' && text !== null) {
          return secondFormat(text, '');
        }
        return undefined;
      },
    },
    {
      title: '通话录音',
      key: 'callRecordingAddress',
      dataIndex: 'callRecordingAddress',
      width: 60,
      render: (text: any) => {
        return (
          <audio
            src={text}
            controls
            style={{
              height: '30px',
              width: '300px',
            }}
          />
        );
      },
    },
    {
      title: '外呼处理人',
      key: 'advisorName',
      dataIndex: 'advisorName',
      width: 20,
    },
    {
      title: '外呼结果',
      key: 'callStatus',
      dataIndex: 'callStatus',
      width: 15,
    },
    {
      title: '未接通原因',
      key: 'callResult',
      dataIndex: 'callResult',
      ellipsis: true,
      width: 20,
    },
    {
      title: '外呼任务编号',
      key: 'taskNo',
      dataIndex: 'taskNo',
      ellipsis: true,
      width: 20,
    },
  ];

  const toNext = () => {
    setStepLoading(false);
    const next = stepCurrent + 1;
    if (next > 1) {
      return;
    }
    setStepCurrent(next);
  };

  const createWhTask = () => {
    createPhoneTask({
      eventTaskId: eventTaskId,
      thUserId: [thUserId],
      type: source,
    }).then(async (isOk) => {
      if (isOk) {
        toNext();
        message.success('外呼任务创建成功！');
      } else {
        setStepLoading(false);
        message.error('外呼任务创建失败，请联系管理员！');
      }
    });
  };

  const nextStep = () => {
    setStepLoading(true);
    switch (stepCurrent) {
      case 0:
        Modal.confirm({
          title: '提醒',
          content: '确定在外呼系统生成面向该客户的外呼任务?',
          icon: <ExclamationCircleOutlined />,
          onCancel() {
            setStepLoading(false);
          },
          onOk() {
            if (phoneDisturb) {
              Modal.confirm({
                title: '提醒',
                content: '该客户已被标记为“禁止电话”，是否确定创建外呼任务？',
                icon: <ExclamationCircleOutlined />,
                onCancel() {
                  setStepLoading(false);
                },
                onOk() {
                  createWhTask();
                },
              });
            } else {
              createWhTask();
            }
          },
        });
        break;
      case 1:
        toNext();
        window.open('http://thbscc3ob.thfund.com.cn/crmhomepageV3.jsp', '呼叫中心3.0');
        //window.open('http://10.1.93.94:9080/crmhomepageV3.jsp', '呼叫中心3.0');
        break;
      default:
        setStepLoading(false);
    }
  };

  const refreshPhoneTaskList = async (current: number, pageSize: number) => {
    const phoneTaskList = await queryPhoneTaskList({
      currentPage: current,
      pageSize: pageSize,
      eventTaskId: eventTaskId,
      thUserId: [thUserId],
      type: source,
    });
    return {
      data: phoneTaskList.data,
      total: phoneTaskList.total,
      success: true,
    };
  };

  useEffect(() => {
    queryCustomerIsNoDisturb({
      thUserIds: [thUserId],
    }).then((data) => {
      if (data && data[0]?.isNoPhoneDisturb == '0') {
        setPhoneDisturb(true);
      }
    });
  }, []);
  return (
    <ProCardPlus ghost>
      <Steps current={stepCurrent} items={stepItems} size={'small'} />
      <div style={{ width: '100%', padding: '20px 0px', textAlign: 'center' }}>
        <Space align="center">
          <Button
            type="primary"
            loading={stepLoading}
            onClick={nextStep}
            icon={stepItems[stepCurrent].icon}
          >
            {stepItems[stepCurrent].title}
          </Button>
          <Button
            onClick={() => {
              updatePhoneTaskList({
                eventTaskId: eventTaskId,
                thUserId: [thUserId],
                type: source,
              }).then(async (data) => {
                setStepLoading(false);
                if (data) {
                  actionRef.current?.reload();
                  message.success('已更新！');
                } else {
                  message.error('更新失败，请重试！');
                }
              });
            }}
            icon={<SyncOutlined />}
          >
            更新外呼结果
          </Button>
        </Space>
      </div>
      <ProTable
        title={() => '外呼记录'}
        size="small"
        rowKey="callUniqueId"
        actionRef={actionRef}
        toolBarRender={false}
        search={false}
        request={async (params) => {
          return await refreshPhoneTaskList(
            params?.current ? params.current : 1,
            params?.pageSize ? params.pageSize : 20,
          );
        }}
        columns={whRecordColumns}
        bordered={true}
        options={false}
      />
    </ProCardPlus>
  );
};

export default CallTask;
