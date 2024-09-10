import React, { useMemo, useRef, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { message, Button, Modal, Form } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListItem } from './service';
import { QueryStatusByPage, EsIndexInfoFacadeDeleteIndex } from './service';
import { cardGutter } from '@/themes';
import CatForm from './catForm';
import ExecForm from './execForm';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;
// 索引监控
const IndexStatus = () => {
  const actionRef = useRef<ActionType>();
  const [catFormShow, setCatFormShow] = useState<boolean>(false);
  const [runFormShow, setRunFormShow] = useState<boolean>(false);
  const [runFormValue, setRunFormValue] = useState<any>({});

  const [runForm] = Form.useForm();

  const request = async (params: any) => {
    const result = await QueryStatusByPage({
      current: params.current,
      pageSize: params.pageSize,
      sortField: 'id',
      sortOrder: 'ASC',
      indexName: params.indexName,
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

  const showRun = (record: any) => {
    setRunFormValue(record);
    setRunFormShow(true);
  };

  const columns: ProColumns<TableListItem>[] = useMemo(() => {
    return [
      {
        title: '索引名称',
        ellipsis: true,
        dataIndex: 'indexName',
        valueType: 'select',
        fieldProps: { showSearch: true },
      },
      {
        title: '索引描述',
        ellipsis: true,
        dataIndex: 'indexDesc',
        hideInSearch: true,
      },
      {
        title: '磁盘占用空间',
        ellipsis: true,
        dataIndex: 'storeSize',
        hideInSearch: true,
      },
      {
        title: '文档总数',
        ellipsis: true,
        dataIndex: 'docsCount',
        hideInSearch: true,
      },
      {
        title: '主分片数',
        ellipsis: true,
        dataIndex: 'numberOfShards',
        hideInSearch: true,
      },
      {
        title: '副本数',
        ellipsis: true,
        dataIndex: 'numberOfReplicas',
        hideInSearch: true,
      },
      {
        title: '操作',
        valueType: 'option',
        ellipsis: true,
        render: (text, record) => [
          <a
            onClick={() => {
              deleteIndex(record);
            }}
          >
            删除索引
          </a>,
          <a
            onClick={() => {
              showRun(record);
            }}
          >
            查询
          </a>,
        ],
      },
    ];
  }, []);

  return (
    <>
      <ProCard ghost direction="column" gutter={[0, cardGutter]}>
        <ProTable
          headerTitle={'索引管理'}
          rowKey={`${+new Date() + Math.random()}`}
          size="small"
          actionRef={actionRef}
          columnEmptyText={false}
          search={{ labelWidth: 'auto' }}
          form={{ ignoreRules: true }}
          request={request}
          columns={columns}
          pagination={{ current: 1, pageSize: 10 }}
          options={{ density: false }}
          toolBarRender={() => [
            <Button key="show" size={'small'} onClick={() => setCatFormShow(true)}>
              es管理
            </Button>,
          ]}
        />
      </ProCard>
      <Modal
        title={'es cat指令'}
        visible={catFormShow}
        width={1000}
        onOk={() => setCatFormShow(false)}
        onCancel={() => setCatFormShow(false)}
        destroyOnClose={true}
        footer={[
          <Button key="back" onClick={() => setCatFormShow(false)}>
            关闭
          </Button>,
        ]}
      >
        <CatForm />
      </Modal>
      <Modal
        title={'es查询'}
        visible={runFormShow}
        width={1000}
        onOk={() => setRunFormShow(false)}
        onCancel={() => setRunFormShow(false)}
        destroyOnClose={true}
        maskClosable={false}
        footer={[
          <Button key="back" onClick={() => setRunFormShow(false)}>
            关闭
          </Button>,
        ]}
      >
        <ExecForm form={runForm} formValue={runFormValue} />
      </Modal>
    </>
  );
};

export default IndexStatus;
