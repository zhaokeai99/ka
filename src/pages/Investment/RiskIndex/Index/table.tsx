import { useRef, useState } from 'react';
import { Button } from 'antd';
import ProTable from '@ant-design/pro-table';
import ProCardPlus from '@/components/ProCardPlus';
import { PlusOutlined } from '@ant-design/icons';
// import ModalForm from './form';
import ConditionForm from './conditionForm';

// 过滤条件组件
const FilterConditionTable = () => {
  const [showConditionAdd, setShowConditionAdd] = useState(false);
  const [showConditionEdit, setShowConditionEdit] = useState(false);
  const actionRef = useRef();
  const formRef = useRef();

  const columns: any = [
    {
      title: '',
      dataIndex: 'id',
      hideInTable: true,
      search: false,
    },
    {
      title: '参数名称',
      dataIndex: '',
    },
    {
      title: '字段类型',
      dataIndex: '',
    },
    {
      title: '条件类型',
      dataIndex: '',
      search: false,
    },
    {
      title: '参数类型',
      dataIndex: '',
    },
    {
      title: '描述',
      dataIndex: 'creator',
      search: false,
    },
    {
      title: '操作',
      dataIndex: '',
      search: false,
      render: () => {},
    },
  ];

  return (
    <ProCardPlus
      ghost
      style={{ padding: '12px' }}
      title="过滤条件"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowConditionAdd(true)}>
          新建
        </Button>
      }
    >
      <ProTable
        search={false}
        toolBarRender={false}
        size="small"
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        // request={(params: any) => fetchDataSource({ ...params })}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
        scroll={{ x: 'max-content' }}
        options={{
          density: false,
        }}
      />

      {/** 新建表单 */}
      <ConditionForm
        title="新增"
        type="add"
        visible={showConditionAdd}
        onFinish={() => {}}
        onVisibleChange={setShowConditionAdd}
      />

      {/** 编辑表单 */}
      <ConditionForm
        title="编辑"
        type="edit"
        visible={showConditionEdit}
        onFinish={() => {}}
        onVisibleChange={setShowConditionEdit}
      />
    </ProCardPlus>
  );
};

export default FilterConditionTable;
