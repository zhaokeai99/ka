import ProCardPlus from '@/components/ProCardPlus';
import { ModalForm, ProTable } from '@ant-design/pro-components';
import React, { useEffect, useRef, useState } from 'react';
import type { ProFormInstance } from '@ant-design/pro-form';
import { Button, List, message, Modal, Select, Space } from 'antd';
import {
  ExclamationCircleOutlined,
  MessageOutlined,
  PhoneOutlined,
  PushpinOutlined,
} from '@ant-design/icons';
import CallTask from '@/pages/Marketing/AdvisorCRM/CallTask';
import SmsTask from '@/pages/Marketing/AdvisorCRM/SmsTask';
import moment from 'moment';
import { queryMotEventOptions, queryMyMotEventTaskList, queryTaskStatus } from './service';
import { emptyToUndefined } from '@/pages/Marketing/AdvisorCRM/util';
import { Link } from 'umi';
import TaskProcessResult from '@/pages/Marketing/AdvisorCRM/TaskProcessResult';

const DIRECT_TRANSFER = {
  ascend: 'asc',
  descend: 'desc',
};

const MotConfig: React.FC<any> = () => {
  const [msgVisit, setMsgVisit] = useState<boolean>(false);
  const [callVisit, setCallVisit] = useState<boolean>(false);
  const [processVisit, setProcessVisit] = useState<boolean>(false);

  const [eventOptions, setEventOptions] = useState<[]>([]);
  const [dealStatusOptions, setDealStatusOptions] = useState<[]>([]);

  const [currEventTaskId, setCurrEventTaskId] = useState<string | null>(null);
  const [currThUserId, setCurrThUserId] = useState<string | null>(null);

  const formRef = useRef<ProFormInstance>();

  const callClick = (eventTaskId: string, thUserId: string) => {
    setCurrEventTaskId(eventTaskId);
    setCurrThUserId(thUserId);
    setCallVisit(true);
  };

  const msgClick = (eventTaskId: string, thUserId: string) => {
    setCurrEventTaskId(eventTaskId);
    setCurrThUserId(thUserId);
    setMsgVisit(true);
  };

  const submitProcessResultClick = (eventTaskId: string, thUserId: string) => {
    setCurrEventTaskId(eventTaskId);
    setCurrThUserId(thUserId);
    setProcessVisit(true);
  };

  const columns: any[] = [
    {
      title: '任务编号',
      key: 'eventTaskId',
      dataIndex: 'eventTaskId',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '触发时间',
      key: 'triggerDate',
      dataIndex: 'triggerDate',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '触发时间',
      key: 'triggerDateRange',
      dataIndex: 'triggerDateRange',
      valueType: 'dateRange',
      hideInTable: true,
      initialValue: [moment().add(-7, 'day'), moment()],
    },
    {
      title: '事件编号',
      key: 'eventCode',
      dataIndex: 'eventCode',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '事件类型',
      key: 'eventType',
      dataIndex: 'eventType',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '事件名称',
      key: 'eventName',
      dataIndex: 'eventName',
      sorter: true,
      renderFormItem: () => {
        return <Select allowClear={true} options={eventOptions} />;
      },
    },
    {
      title: '触发原因',
      key: 'triggerReasonList',
      dataIndex: 'triggerReasonList',
      hideInSearch: true,
      render: (text: any) => {
        return (
          <List
            size={'small'}
            dataSource={text}
            style={{
              width: '200px',
            }}
            renderItem={(item: any) => {
              return <List.Item>{item}</List.Item>;
            }}
          />
        );
        /*return (
          <Tooltip
            placement={'right'}
            color={'#2db7f5'}
            overlayInnerStyle={{ backgroundColor: '#2db7f5', color: '#FFF', width: 'max-content' }}
            title={() => {
              return (
                <List
                  size={'small'}
                  dataSource={text}
                  renderItem={(item: any) => {
                    return <List.Item>{item}</List.Item>;
                  }}
                />
              );
            }}
          >
            <Button>具体原因</Button>
          </Tooltip>
        );*/
      },
    },
    {
      title: '客户名称',
      key: 'customerName',
      dataIndex: 'customerName',
      hideInSearch: true,
      render: (text: any, record: any) => {
        return (
          <Link to={`/marketing/advisorCRM/customerQuery?thUserId=${record.thUserId}`}>{text}</Link>
        );
      },
    },
    {
      title: '公司员工',
      key: 'isNoCompanyEmployee',
      dataIndex: 'isNoCompanyEmployee',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '理财顾问',
      key: 'adviserName',
      dataIndex: 'adviserName',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '处理人',
      key: 'dealPeople',
      dataIndex: 'dealPeople',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '处理状态',
      key: 'dealStatus',
      dataIndex: 'dealStatus',
      sorter: true,
      renderFormItem: () => {
        return <Select allowClear={true} options={dealStatusOptions} />;
      },
    },
    {
      title: '处理结果',
      key: 'dealResult',
      dataIndex: 'dealResult',
      hideInSearch: true,
      render: (text: any) => {
        return (
          <List
            size={'small'}
            dataSource={text}
            style={{
              width: '200px',
            }}
            renderItem={(item: any) => {
              return <List.Item>{item}</List.Item>;
            }}
          />
        );
        /*return (
          <Tooltip
            placement={'left'}
            overlayInnerStyle={{ width: '220px' }}
            title={() => {

            }}
          >
            <Button>处理结果</Button>
          </Tooltip>
        );*/
      },
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      hideInSearch: true,
      render: (text: any, record: any) => {
        return (
          <>
            <Space>
              <Button
                type="primary"
                size={'small'}
                icon={<PhoneOutlined />}
                onClick={() => {
                  callClick(record.eventTaskId, record.thUserId);
                }}
              >
                电话
              </Button>
              <Button
                type="primary"
                size={'small'}
                icon={<MessageOutlined />}
                onClick={() => {
                  msgClick(record.eventTaskId, record.thUserId);
                }}
              >
                短信
              </Button>
            </Space>
            <Space
              style={{
                display: 'flex',
                paddingTop: '8px',
              }}
            >
              <Button
                type="primary"
                size={'small'}
                icon={<PushpinOutlined />}
                onClick={() => {
                  submitProcessResultClick(record.eventTaskId, record.thUserId);
                }}
              >
                提交处理结果
              </Button>
            </Space>
          </>
        );
      },
    },
  ];

  const loadConfig = async () => {
    const motEventOptionsResult = await queryMotEventOptions({});
    if (motEventOptionsResult) {
      setEventOptions(motEventOptionsResult);
    }
    const taskStatusResult = await queryTaskStatus({});
    if (taskStatusResult) {
      setDealStatusOptions(taskStatusResult);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return (
    <ProCardPlus
      sn={'_marketing_advisorCRM_myMotTask'}
      ghost
      style={{ padding: '12px 12px' }}
      gutter={[0, 8]}
      size="small"
    >
      <ModalForm
        title="电话触达"
        width={'1100px'}
        submitter={false}
        visible={callVisit}
        modalProps={{
          maskClosable: false,
          centered: true,
          destroyOnClose: true,
          onCancel: () => {
            Modal.confirm({
              title: '提醒',
              content: '确定要关闭吗?',
              icon: <ExclamationCircleOutlined />,
              onCancel() {
                setCallVisit(true);
              },
              onOk() {
                setCallVisit(false);
              },
            });
          },
        }}
      >
        <CallTask eventTaskId={currEventTaskId} thUserId={currThUserId} source={'1'} />
      </ModalForm>
      <ModalForm
        title="短信触达"
        width={'1100px'}
        submitter={false}
        visible={msgVisit}
        modalProps={{
          maskClosable: false,
          centered: true,
          destroyOnClose: true,
          onCancel: () => {
            Modal.confirm({
              title: '提醒',
              content: '确定要关闭吗?',
              icon: <ExclamationCircleOutlined />,
              onCancel() {
                setMsgVisit(true);
              },
              onOk() {
                setMsgVisit(false);
              },
            });
          },
        }}
      >
        <SmsTask eventTaskId={currEventTaskId} thUserId={currThUserId} source={'1'} />
      </ModalForm>
      <ModalForm
        title="提交处理结果"
        width={'1100px'}
        submitter={false}
        visible={processVisit}
        modalProps={{
          maskClosable: false,
          centered: true,
          destroyOnClose: true,
          onCancel: () => {
            Modal.confirm({
              title: '提醒',
              content: '确定要关闭吗?',
              icon: <ExclamationCircleOutlined />,
              onCancel() {
                setProcessVisit(true);
              },
              onOk() {
                setProcessVisit(false);
                formRef?.current?.submit();
              },
            });
          },
        }}
      >
        <TaskProcessResult eventTaskId={currEventTaskId} />
      </ModalForm>
      <ProTable
        size="small"
        formRef={formRef}
        rowKey="eventTaskId"
        scroll={{ x: 'max-content' }}
        request={async (params, sort) => {
          const sortKeys = Object.keys(sort);
          const orderBy = sortKeys.length === 0 ? undefined : sortKeys[0];
          const direct = orderBy === undefined ? undefined : sort[orderBy];
          let startDate;
          let endDate;
          if (params?.triggerDateRange?.length == 2) {
            startDate = params.triggerDateRange[0];
            endDate = params.triggerDateRange[1];
          } else {
            message.warn('必须选择触发时间');
            return {
              data: [],
              total: 0,
              success: true,
            };
          }
          const queryMyMotEventTaskListResult = await queryMyMotEventTaskList({
            startDate: emptyToUndefined(startDate),
            endDate: emptyToUndefined(endDate),
            eventCodes: emptyToUndefined(params?.eventName) ? [params.eventName] : undefined,
            status: emptyToUndefined(params?.dealStatus) ? [params.dealStatus] : undefined,
            orderFields: orderBy,
            orderType: direct ? DIRECT_TRANSFER[direct] : undefined,
            currentPage: params?.current,
            pageSize: params?.pageSize,
          });
          return {
            data: queryMyMotEventTaskListResult.data,
            total: queryMyMotEventTaskListResult.total,
            success: true,
          };
        }}
        columns={columns}
        search={{
          defaultCollapsed: false,
        }}
      />
    </ProCardPlus>
  );
};

export default MotConfig;
