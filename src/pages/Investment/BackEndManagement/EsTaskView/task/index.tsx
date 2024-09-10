import React, { useCallback, useMemo, useRef, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { Form, message, Modal } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListItem } from './service';
import {
  EsDataSyncTaskFacadeGetDataSyncTask,
  EsIndexInfoFacadeDeleteIndex,
  EsIndexInfoFacadeQueryTaskManageByPage,
  EsIndexInfoFacadeRunIndexTask,
} from './service';
import { cardGutter } from '@/themes';
import RunTaskForm from './runtask';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;
// 索引监控
const IndexStatus = () => {
  const actionRef = useRef<ActionType>();
  const [editFormShow, setEditFormShow] = useState<boolean>(false);
  const [editFormValue, setEditFormValue] = useState<any>(undefined);
  const [runLoading, setRunLoading] = useState<boolean>(false);

  const [runForm] = Form.useForm();

  const request = async (params: any) => {
    const p = {
      ...params,
      current: params.current,
      pageSize: params.pageSize,
      sortField: 'id',
      sortOrder: 'desc',
      indexName: params.indexName,
    };
    const result = await EsIndexInfoFacadeQueryTaskManageByPage(p);

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

  const deleteIndex = (record: any) => {
    confirm({
      title: '删除',
      content: `确认在ES中删除 [${record.indexName}] 索引吗?`,
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        const params = { indexName: record.indexName };
        const data = await EsIndexInfoFacadeDeleteIndex(params);
        if (data) {
          actionRef?.current?.reload();
          message.success(record.indexName + '删除成功！');
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const runTask = async (record: any) => {
    const params = { id: record.id };
    const data = await EsDataSyncTaskFacadeGetDataSyncTask(params);
    if (data.syncType === 0) {
      //增量
      data.publishId = record.publishId;
      setEditFormValue(data);
      setEditFormShow(true);
    } else {
      confirm({
        title: '执行任务',
        content: `确认执行 [${record.taskName}] 任务吗?`,
        icon: <ExclamationCircleOutlined />,
        async onOk() {
          setRunLoading(true);
          const runParams = { dataTaskId: record.publishId };
          const success = await EsIndexInfoFacadeRunIndexTask(runParams);
          if (success === 'success') {
            actionRef?.current?.reload();
            message.success(record.taskName + '执行成功！');
          } else if (success === 'async running') {
            actionRef?.current?.reload();
            message.success(record.taskName + ' 异步执行中！');
          } else {
            message.error(record.taskName + '执行失败！');
          }
          setRunLoading(false);
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  };

  const runTaskSave = useCallback(async () => {
    setRunLoading(true);
    const values = await runForm?.validateFields();
    const params = {
      dataTaskId: values.publishId,
      pkParam: values.runParam,
    };
    const success = await EsIndexInfoFacadeRunIndexTask(params);
    console.log(success);
    if (success === 'success') {
      actionRef?.current?.reload();
      setEditFormShow(false);
      message.success(values.taskName + '执行成功！');
    } else if (success === 'async running') {
      actionRef?.current?.reload();
      setEditFormShow(false);
      message.success(values.taskName + ' 开始执行！');
    } else {
      message.error(values.taskName + '执行失败！');
    }
    setRunLoading(false);
  }, [runForm]);

  const columns: ProColumns<TableListItem>[] = useMemo(() => {
    return [
      {
        title: '任务名称',
        ellipsis: true,
        dataIndex: 'taskName',
      },
      {
        title: '任务描述',
        ellipsis: true,
        dataIndex: 'taskDesc',
        hideInSearch: true,
      },
      {
        title: '数据源类型',
        ellipsis: true,
        dataIndex: 'sourceType',
        valueType: 'select',
        valueEnum: { MYSQL: 'MYSQL', ORACLE: 'ORACLE' },
      },
      {
        title: '索引名称',
        ellipsis: true,
        dataIndex: 'indexName',
      },
      {
        title: '任务状态',
        ellipsis: true,
        dataIndex: 'taskStatus',
        valueType: 'select',
        valueEnum: { 0: '待发布', 1: '已发布', 2: '废除' },
      },
      {
        title: '发布状态',
        ellipsis: true,
        dataIndex: 'publishStatus',
        valueType: 'select',
        valueEnum: { 0: '未发布', 1: '已发布' },
      },
      {
        title: '文档总数',
        ellipsis: true,
        dataIndex: 'docsCount',
        hideInSearch: true,
      },
      {
        title: '操作',
        valueType: 'option',
        ellipsis: true,
        render: (text, record) => [
          record.docsCount !== undefined && record.docsCount !== null ? (
            <a
              onClick={() => {
                deleteIndex(record);
              }}
            >
              删除索引
            </a>
          ) : undefined,

          record.publishStatus === 1 ? (
            <a
              onClick={() => {
                runTask(record);
              }}
            >
              执行任务
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
          headerTitle={'任务管理'}
          rowKey={'id'}
          size="small"
          actionRef={actionRef}
          columnEmptyText={false}
          search={{ labelWidth: 'auto' }}
          form={{ ignoreRules: true }}
          request={request}
          columns={columns}
          pagination={{ current: 1, pageSize: 10 }}
          options={{ density: false }}
        />
      </ProCard>
      <Modal
        title={'任务执行'}
        visible={editFormShow}
        width={1000}
        destroyOnClose={true}
        onOk={runTaskSave}
        onCancel={() => setEditFormShow(false)}
        confirmLoading={runLoading}
      >
        <RunTaskForm form={runForm} formValue={editFormValue} />
      </Modal>
    </>
  );
};

export default IndexStatus;
