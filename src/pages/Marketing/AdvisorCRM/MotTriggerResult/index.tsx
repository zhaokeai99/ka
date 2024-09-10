import ProCardPlus from '@/components/ProCardPlus';
import { ProTable } from '@ant-design/pro-components';
import React, { useEffect, useRef, useState } from 'react';
import type { ProFormInstance } from '@ant-design/pro-form';
import {
  queryFinancialAdvisorList,
  queryMotEventOptions,
  queryMotEventTaskList,
  queryTaskStatus,
  queryTriggerAction,
} from './service';
import { emptyToUndefined } from '@/pages/Marketing/AdvisorCRM/util';
import { List, message, Select } from 'antd';
import moment from 'moment';
import { Link } from 'umi';

const DIRECT_TRANSFER = {
  ascend: 'asc',
  descend: 'desc',
};

const MotTriggerResult: React.FC<any> = () => {
  const [eventOptions, setEventOptions] = useState<[]>([]);
  const [triggerActionOptions, setTriggerActionOptions] = useState<[]>([]);
  const [advisorOptions, setAdvisorOptions] = useState<[]>([]);
  const [dealStatusOptions, setDealStatusOptions] = useState<[]>([]);

  const formRef = useRef<ProFormInstance>();

  const columns: any[] = [
    {
      title: '任务编号',
      key: 'eventTaskId',
      dataIndex: 'eventTaskId',
      hideInSearch: true,
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

            }}
          >
            <Button>具体原因</Button>
          </Tooltip>
        );*/
      },
    },
    {
      title: '触发动作',
      key: 'triggerAction',
      dataIndex: 'triggerAction',
      renderFormItem: () => {
        return <Select allowClear={true} options={triggerActionOptions} />;
      },
    },
    {
      title: '客户名称',
      key: 'customerName',
      dataIndex: 'customerName',
      sorter: true,
      render: (text: any, record: any) => {
        return (
          <Link to={`/marketing/advisorCRM/customerQuery?thUserId=${record.thUserId}`}>{text}</Link>
        );
      },
    },
    {
      title: 'appUserId',
      key: 'appUserId',
      dataIndex: 'appUserId',
      hideInSearch: true,
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
      sorter: true,
      renderFormItem: () => {
        return <Select allowClear={true} options={advisorOptions} />;
      },
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
  ];

  const loadConfig = async () => {
    const motEventOptionsResult = await queryMotEventOptions({});
    if (motEventOptionsResult) {
      setEventOptions(motEventOptionsResult);
    }
    const triggerActionResult = await queryTriggerAction({});
    if (triggerActionResult) {
      setTriggerActionOptions(triggerActionResult);
    }
    const advisorListResult = await queryFinancialAdvisorList({});
    if (advisorListResult) {
      setAdvisorOptions(advisorListResult);
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
      sn={'_marketing_advisorCRM_motTriggerResult'}
      ghost
      style={{ padding: '12px 12px' }}
      gutter={[0, 8]}
      size="small"
    >
      <ProTable
        size="small"
        formRef={formRef}
        rowKey="eventTaskId"
        scroll={{ x: 'max-content' }}
        request={async (params: any, sort: any) => {
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
          const queryMotEventTaskListResult = await queryMotEventTaskList({
            startDate: emptyToUndefined(startDate),
            endDate: emptyToUndefined(endDate),
            eventCodes: emptyToUndefined(params?.eventName) ? [params.eventName] : undefined,
            triggerActions: emptyToUndefined(params?.triggerAction)
              ? [params.triggerAction]
              : undefined,
            userName: emptyToUndefined(params?.customerName),
            advisorIds: emptyToUndefined(params?.adviserName) ? [params.adviserName] : undefined,
            status: emptyToUndefined(params?.dealStatus) ? [params.dealStatus] : undefined,
            orderFields: orderBy,
            orderType: direct ? DIRECT_TRANSFER[direct] : undefined,
            currentPage: params?.current,
            pageSize: params?.pageSize,
          });
          return {
            data: queryMotEventTaskListResult.data,
            total: queryMotEventTaskListResult.total,
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

export default MotTriggerResult;
