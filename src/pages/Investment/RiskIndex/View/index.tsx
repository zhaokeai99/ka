import { useRef, useState } from 'react';
import { Button, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import ProCardPlus from '@/components/ProCardPlus';
import { PlusOutlined } from '@ant-design/icons';
import ModalForm from './form';
import moment from 'moment';
import {
  queryTable, // 查询数据视图列表
  queryTableById, // 查询单个报表
  saveTableInfo, // 新增数据表
  updateTableInfo, // 修改数据表
} from './service';

// 视图管理
const RiskViewManagement = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const actionRef = useRef();
  const formRef = useRef();

  const edits = async (id: number) => {
    setShowEdit(true);
    const { data } = await queryTableById({
      id,
    });
    setEditData(data);
  };

  const deletes = () => {};

  const changeStatus = () => {};
  const columns: any = [
    {
      title: '',
      dataIndex: 'dataSourceId',
      hideInTable: true,
      search: false,
    },
    {
      title: '数据源名称',
      dataIndex: 'dataSourceName',
    },
    {
      title: '数据源类型',
      dataIndex: 'sourceType',
    },
    {
      title: '视图名称',
      dataIndex: 'tableName',
    },
    {
      title: '视图状态',
      dataIndex: 'enableStatus',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      search: false,
      render: (text: any) => <div>{moment(text).format('YYYY-MM-DD hh:mm:ss')}</div>,
    },
    {
      title: '操作',
      dataIndex: '',
      search: false,
      render: (text: any, record: any) => (
        <div>
          <Button type="link" onClick={() => edits(record.id)}>
            编辑
          </Button>
          <Button type="link" onClick={() => deletes()}>
            删除
          </Button>
          <Button type="link" onClick={() => changeStatus()}>
            修改状态
          </Button>
        </div>
      ),
    },
  ];

  return (
    <ProCardPlus ghost style={{ padding: '12px' }}>
      <ProTable
        size="small"
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={(params: any) => queryTable({ ...params })}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
        scroll={{ x: 'max-content' }}
        options={{
          density: false,
        }}
        toolBarRender={() => [
          <Button key="new" type="primary" icon={<PlusOutlined />} onClick={() => setShowAdd(true)}>
            新建视图
          </Button>,
        ]}
      />

      {/** 新建表单 */}
      <ModalForm
        title="新增"
        type="add"
        visible={showAdd}
        onFinish={async ({
          dataSourceId,
          tableDesc,
          tableName,
          table,
          schema,
          fieldModelList,
        }: any) => {
          const { success } = await saveTableInfo({
            dataSourceId: dataSourceId.value[0],
            dataSourceName: dataSourceId.value[1],
            sourceType: dataSourceId.value[2],
            table: table.value[1],
            schema,
            tableName,
            tableDesc,
            fieldModelList,
            tableView: table.value[1],
          });
          if (success) {
            message.success('新建视图成功');
            actionRef?.current.reload();
          }
        }}
        onVisibleChange={setShowAdd}
      />

      {/** 编辑表单 */}
      <ModalForm
        title="编辑"
        type="edit"
        initialValues={editData}
        visible={showEdit}
        onFinish={async ({
          dataSourceId,
          tableDesc,
          tableName,
          table,
          schema,
          fieldModelList,
        }: any) => {
          const { success } = await updateTableInfo({
            id: editData?.id,
            dataSourceId: dataSourceId.value[0],
            table: table.value[1],
            dataSourceName: dataSourceId.value[1],
            sourceType: dataSourceId.value[2],
            schema,
            tableName,
            tableView: table.value[1],
            tableDesc,
            fieldModelList,
          });
          if (success) {
            message.success('修改成功');
          }
        }}
        onVisibleChange={setShowEdit}
      />
    </ProCardPlus>
  );
};

export default RiskViewManagement;
