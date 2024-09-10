import React, { useMemo, useRef, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListItem } from './service';
import {
  QueryLogByPage,
  EsIndexInfoFacadeStopTask,
  EsIndexInfoFacadeGetRunTaskInfo,
} from './service';
import { cardGutter } from '@/themes';
import { Button, message, Modal } from 'antd';
import RunTaskForm from './taskRunTask';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const { confirm } = Modal;
// 任务监控
const TaskLog = () => {
  const actionRef = useRef<ActionType>();

  const [editFormShow, setEditFormShow] = useState<boolean>(false);
  const [editFormValue, setEditFormValue] = useState<any>(undefined);
  const [taskLogId, setTaskLogId] = useState<number | undefined>(undefined);
  const [refreshLoading, setRefreshLoading] = useState<boolean>(false);

  const request = async (params: any) => {
    const result = await QueryLogByPage({
      ...params,
      current: params.current,
      pageSize: params.pageSize,
      sortField: 'taskLogId',
      sortOrder: 'desc',
      execDate: params.execDate ? params.execDate.replace(/-/g, '') : undefined,
    });

    const { data = [], current, pageSize, pages, total } = result || {};

    if (JSON.stringify(result) !== '{}') {
      return {
        data,
        current,
        pageSize,
        pages,
        total,
        success: true,
      };
    }

    return {
      data: [],
      success: true,
    };
  };
  //中止任务
  const stopTask = async (record: TableListItem) => {
    confirm({
      title: '中止任务',
      content: '确认中止任务吗?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        const data = await EsIndexInfoFacadeStopTask({ taskName: record.execFlag });
        if (data === 'success') {
          message.success('操作成功!');
          actionRef.current?.reload();
        } else {
          message.error('操作失败');
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  //查看任务
  const viewTask = async (record: TableListItem) => {
    setTaskLogId(record.taskLogId);
    const data = await EsIndexInfoFacadeGetRunTaskInfo({
      taskLogId: record.taskLogId,
    });
    if (data === undefined || data === null || data === {} || data === '') {
      message.warn('执行记录已删除');
      return;
    }
    setEditFormValue(data);
    setEditFormShow(true);
  };
  const refreshTask = async () => {
    setRefreshLoading(true);
    const data = await EsIndexInfoFacadeGetRunTaskInfo({ taskLogId: taskLogId });
    setRefreshLoading(false);
    if (data === undefined || data === null || data === {} || data === '') {
      message.warn('执行记录已删除');
      return;
    }
    setEditFormValue(data);
  };

  const viewButtonValid = (record: any) => {
    let time = record.taskExecTime;
    if (record.taskEndTime !== undefined && record.taskEndTime !== null) {
      time = record.taskEndTime;
    }
    const curr = moment().subtract(10, 'minute');
    const exec = moment(time);
    const diff = curr.diff(exec);
    console.log(
      'viewButtonValid',
      curr,
      exec,
      curr.diff(exec, 'minute'),
      exec.diff(curr, 'minute'),
    );

    return diff <= 0;
  };

  const columns: ProColumns<TableListItem>[] = useMemo(() => {
    return [
      {
        title: '执行日期',
        ellipsis: true,
        dataIndex: 'execDate',
        valueType: 'date',
        width: 100,
      },
      {
        title: '任务名称',
        ellipsis: true,
        dataIndex: 'execFlag',
        width: 250,
      },
      {
        title: '任务描述',
        ellipsis: true,
        dataIndex: 'taskLogRemark',
        hideInSearch: true,
        width: 250,
      },
      {
        title: '业务日期',
        ellipsis: true,
        dataIndex: 'busiDate',
        hideInSearch: true,
        width: 100,
      },
      {
        title: '执行结果',
        ellipsis: true,
        dataIndex: 'taskResult',
        hideInSearch: true,
        width: 100,
      },
      {
        title: '参数',
        ellipsis: true,
        dataIndex: 'taskParams',
        hideInSearch: true,
        width: 200,
      },
      {
        title: '开始时间',
        ellipsis: true,
        dataIndex: 'taskExecTime',
        hideInSearch: true,
        valueType: 'dateTime',
        width: 180,
      },
      {
        title: '结束时间',
        ellipsis: true,
        dataIndex: 'taskEndTime',
        hideInSearch: true,
        valueType: 'dateTime',
        width: 180,
      },
      {
        title: '结果说明',
        ellipsis: true,
        dataIndex: 'taskRemark',
        hideInSearch: true,
        width: 600,
      },
      {
        title: '操作',
        valueType: 'option',
        ellipsis: true,
        fixed: 'right',
        width: 200,
        render: (text, record) => [
          viewButtonValid(record) ? (
            <a
              onClick={() => {
                viewTask(record);
              }}
            >
              查看情况
            </a>
          ) : undefined,
          record.taskResult === 'RUNNING' ? (
            <a
              onClick={() => {
                stopTask(record);
              }}
            >
              中止任务
            </a>
          ) : undefined,
          ,
        ],
      },
    ];
  }, []);

  return (
    <>
      <ProCard ghost direction="column" gutter={[0, cardGutter]}>
        <ProTable
          headerTitle={'任务日志'}
          rowKey={`${+new Date() + Math.random()}`}
          size="small"
          actionRef={actionRef}
          columnEmptyText={false}
          search={{ labelWidth: 'auto' }}
          form={{ ignoreRules: true }}
          request={request}
          columns={columns}
          scroll={{ x: 1960 }}
          pagination={{ current: 1, pageSize: 10 }}
          options={{ density: false }}
        />
      </ProCard>
      <Modal
        title={'执行情况'}
        visible={editFormShow}
        width={1000}
        destroyOnClose={true}
        onCancel={() => setEditFormShow(false)}
        footer={[
          <Button
            key="back"
            onClick={() => refreshTask()}
            loading={refreshLoading}
            type={'primary'}
          >
            刷新
          </Button>,
          <Button key="back" onClick={() => setEditFormShow(false)}>
            关闭
          </Button>,
        ]}
      >
        <RunTaskForm formValue={editFormValue} />
      </Modal>
    </>
  );
};

TaskLog.isProCard = true;

export default TaskLog;
