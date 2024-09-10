/* eslint-disable */
import { useRef, useState } from 'react';
import { Button, Space, Popconfirm } from 'antd';
import ProTable from '@ant-design/pro-table';
import ProCardPlus from '@/components/ProCardPlus';
import { tableEmptyCellRender } from '@/utils/utils';
import {
  queryScriptList,
  queryScriptTypeEnum,
  queryScriptDetail,
  deleteScriptById,
  saveScript,
} from './service';
import MyModalForm from './Form';
import { message } from 'antd/lib';

const ScriptManagement: React.FC = () => {
  const actionRef = useRef();
  const [initialValues, setInitialValues] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'scriptId',
      search: false,
    },
    {
      title: '脚本名称',
      dataIndex: 'scriptName',
    },
    {
      title: '脚本类型',
      dataIndex: 'scriptType',
      valueType: 'select',
      request: async () => await queryScriptTypeEnum(),
    },
    {
      title: '脚本备注',
      dataIndex: 'remark',
      search: false,
    },
    {
      title: '创建用户',
      dataIndex: 'createUser',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      search: false,
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      width: '120px',
      search: false,
      render: (_, record: any) => (
        <Space>
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={async () => {
              const result = await queryScriptDetail({ scriptId: record.scriptId });
              setInitialValues(result);
              setShowEdit(true);
            }}
          >
            修改
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={async () => {
              const result = await queryScriptDetail({ scriptId: record.scriptId });
              setInitialValues(result);
              setShowDetail(true);
            }}
          >
            查看
          </a>
          <Popconfirm
            title="确认删除此项么？"
            onConfirm={async () => {
              const result = await deleteScriptById({ scriptId: record.scriptId });
              if (result) {
                message.success('删除成功！');
                actionRef.current?.reload();
              }
            }}
            okText="删除"
            cancelText="关闭"
          >
            <a target="_blank" rel="noopener noreferrer">
              删除
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ProCardPlus ghost style={{ padding: '12px' }} sn="investment_creditRisks_scriptManagement">
      <ProTable
        actionRef={actionRef}
        size="small"
        options={{ density: false }}
        rowKey="id"
        toolBarRender={() => [
          <Button onClick={() => setShowAdd(true)} key="add">
            新增
          </Button>,
        ]}
        columns={tableEmptyCellRender(columns as any)}
        request={(p: any) =>
          queryScriptList({
            ...p,
          })
        }
        pagination={{
          pageSize: 10,
        }}
        scroll={{ x: 'max-content' }}
      />
      {/** 新增表单 */}
      <MyModalForm
        title="新增"
        type="add"
        visible={showAdd}
        onFinish={async (values: any) => {
          const success = await saveScript(values);
          if (success) {
            message.success('新增成功');
            actionRef.current?.reload();
          }
          return true;
        }}
        onVisibleChange={setShowAdd}
      />

      {/** 修改表单 */}
      <MyModalForm
        title="修改"
        type="edit"
        visible={showEdit}
        initialValues={initialValues}
        onFinish={async (values: any) => {
          const success = await saveScript(values);
          if (success) {
            message.success('修改成功');
            actionRef.current?.reload();
          }
          return true;
        }}
        onVisibleChange={setShowEdit}
      />

      {/** 查看详情 */}
      <MyModalForm
        title="详情"
        type="read"
        visible={showDetail}
        initialValues={initialValues}
        submitter={false}
        destroyOnClose
        onVisibleChange={setShowDetail}
      />
    </ProCardPlus>
  );
};

export default ScriptManagement;
