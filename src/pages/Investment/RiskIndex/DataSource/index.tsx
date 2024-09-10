import { useRef, useState } from 'react';
import { Button, Switch, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import ProCardPlus from '@/components/ProCardPlus';
import { PlusOutlined } from '@ant-design/icons';
import ModalForm from './form';
import moment from 'moment';
import {
  queryIntegrationSource, // 数据源列表
  modifyIntegrationSource, // 修改数据源
  querySingleIntegrationSource, // 查询单个数据源信息
  saveIntegrationSource, // 保存数据源
  testSourceConn, // 测试数据源链接
} from './service';
import styles from './style.less';

// 风控数据源管理
const RiskDataSourceManagement = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({});

  const actionRef = useRef();
  const formRef = useRef();

  const edit = (id: number) => {
    querySingleIntegrationSource({ id }).then((res) => {
      setEditData({
        ...res.data,
        ...res.data.rdbModel,
        dataSourceType: res.data.sourceType,
      });
    });
    setShowEdit(true);
  };

  const deletes = () => {};

  const clones = () => {};

  const columns: any = [
    {
      title: '',
      dataIndex: 'id',
      hideInTable: true,
      search: false,
    },
    {
      title: '数据源名称',
      fixed: 'left',
      dataIndex: 'sourceName',
    },
    {
      title: '数据源类型',
      dataIndex: 'sourceType',
    },
    {
      title: '链接信息',
      dataIndex: 'rdbModel',
      // width: '20px',
      search: false,
      render: (text: any, record: any) => {
        return (
          <div className={styles.urlInfo}>
            <p>{record.rdbModel.jdbcUrl}</p>
            <p>用户名：{record.rdbModel.userName}</p>
          </div>
        );
      },
    },
    {
      title: '数据源状态',
      dataIndex: 'connectStatus',
      render: (text: number) => {
        switch (text) {
          case 0:
            return <div>未测试</div>;
          case 1:
            return <div>可连通</div>;
          case 2:
            return <div>不可连通</div>;
        }
      },
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
      render: (text: number) => <div>{moment(text).format('YYYY-MM-DD hh:mm:ss')}</div>,
    },
    {
      title: '生效暂停',
      dataIndex: '',
      fixed: 'right',
      search: false,
      width: '100px',
      render: () => (
        <Switch
          // checked={v}
          style={{ width: '58px' }}
          // onChange={(checked) => onChange(checked, item)}
          checkedChildren="生效"
          unCheckedChildren="暂停"
          defaultChecked
        />
      ),
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: '',
      search: false,
      render: (text: any, record: any) => {
        if (record.connectStatus === 0 || record.connectStatus === 2) {
          return (
            <Button
              type="link"
              onClick={async () => {
                const { success } = await testSourceConn({ id: record.id });
                if (success) {
                  message.success('可连通');
                }
              }}
            >
              测试连通性
            </Button>
          );
        } else {
          return (
            <div className={styles.options}>
              <Button type="link" onClick={() => edit(record.id)}>
                编辑
              </Button>
              <Button type="link" onClick={() => deletes()}>
                删除
              </Button>
              <Button type="link" onClick={() => clones()}>
                克隆
              </Button>
            </div>
          );
        }
      },
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
        request={(params: any) => queryIntegrationSource(params)}
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
            新增数据源
          </Button>,
        ]}
      />

      {/** 新建表单 */}
      <ModalForm
        title="新增"
        type="add"
        visible={showAdd}
        onFinish={(value: any) => {
          saveIntegrationSource({
            sourceType: value.dataSourceType,
            rdbModel: {
              jdbcUrl: value.jdbcUrl,
              password: value.password,
              userName: value.userName,
            },
            ...value,
          }).then((res) => {
            if (res.success) {
              message.success('新增成功');
              actionRef.current?.reload();
            }
          });
        }}
        onVisibleChange={setShowAdd}
      />

      {/** 编辑表单 */}
      <ModalForm
        title="编辑"
        type="edit"
        initialValues={editData}
        visible={showEdit}
        onFinish={(value: { dataSourceType: any; jdbcUrl: any; password: any; userName: any }) => {
          modifyIntegrationSource({
            sourceType: value.dataSourceType,
            rdbModel: {
              jdbcUrl: value.jdbcUrl,
              password: value.password,
              userName: value.userName,
            },
            ...value,
          }).then((res) => {
            if (res.success) {
              message.success('修改成功');
              actionRef.current?.reload();
            }
          });
        }}
        onVisibleChange={(v: boolean) => {
          setShowEdit(v);
          setEditData({});
        }}
      />
    </ProCardPlus>
  );
};

export default RiskDataSourceManagement;
