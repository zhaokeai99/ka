import ProCardPlus from '@/components/ProCardPlus';
import { tableEmptyCellRender } from '@/utils/utils';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { FormInstance } from 'antd';
import { Button, message, Modal, Space } from 'antd';
import { useRef, useState } from 'react';
import type { LinkListItem } from './data';
import ModalForm from './form';
import {
  addFundParamContacts,
  delFundParamContacts,
  queryContactsList,
  updateFundParamContacts,
} from './service';

const { confirm } = Modal;

const LinkList: React.FC<any> = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [editValues, setEditValues] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleEdit = (params: LinkListItem) => {
    setEditValues(params);
    setShowEdit(true);
  };

  const handleRemove = async (id: string) => {
    confirm({
      title: '您确认删除此条数据么？',
      icon: <ExclamationCircleOutlined />,
      content: null,
      okText: '确定删除',
      okType: 'danger',
      cancelText: '放弃',
      onOk: async () => {
        const { success } = await delFundParamContacts(id);
        if (success) {
          message.success('删除成功！');
          actionRef.current?.reload();
        }
      },
    });
  };

  const columns: ProColumns<LinkListItem>[] = [
    {
      title: '',
      dataIndex: 'id',
      hideInTable: true,
      search: false,
    },
    {
      title: '部门',
      dataIndex: 'department',
      search: false,
    },
    {
      title: '业务类型',
      dataIndex: 'busiType',
      search: false,
    },
    {
      title: '联系人',
      dataIndex: 'contacts',
      search: false,
    },
    {
      title: '手机',
      dataIndex: 'mobile',
      search: false,
    },
    {
      title: '座机',
      dataIndex: 'telephone',
      search: false,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      search: false,
    },
    {
      title: '传真',
      dataIndex: 'fax',
      search: false,
    },
    {
      fixed: 'right',
      title: '操作',
      dataIndex: '',
      width: 100,
      search: false,
      render: (text, record: any) => {
        return (
          <Space size={10}>
            <a onClick={() => handleEdit(record)}>修改</a>
            <a onClick={() => handleRemove(record.id)}>删除</a>
          </Space>
        );
      },
    },
  ];

  return (
    <ProCardPlus ghost style={{ padding: '12px' }} sn="_production_setting__linklist">
      <ProTable<LinkListItem>
        size="small"
        options={false}
        actionRef={actionRef}
        formRef={formRef}
        search={false}
        request={() => {
          return queryContactsList({
            pageNo: 1,
            pageSize: 1000,
          });
        }}
        toolBarRender={() => [
          <Button
            key="add_button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setShowAdd(true)}
          >
            新增
          </Button>,
        ]}
        columns={tableEmptyCellRender(columns as any)}
        pagination={{
          pageSize: 1000,
        }}
        scroll={{ x: 'max-content' }}
      />
      {/** 新建表单 */}
      <ModalForm
        title="新增"
        type="add"
        visible={showAdd}
        onFinish={async (values) => {
          const { success } = await addFundParamContacts(values);
          if (success) {
            message.success('新增成功！');
            actionRef.current?.reload();
            return true;
          }
          return false;
        }}
        onVisibleChange={setShowAdd}
      />

      {/** 编辑表单 */}
      <ModalForm
        title="编辑"
        type="edit"
        visible={showEdit}
        initialValues={editValues}
        onFinish={async (values) => {
          const { success } = await updateFundParamContacts(values);
          if (success) {
            message.success('修改成功！');
            actionRef.current?.reload();
          }
          return true;
        }}
        onVisibleChange={setShowEdit}
      />
    </ProCardPlus>
  );
};

export default LinkList;
