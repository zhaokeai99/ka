import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type { APIItem, Pagination } from './data';
import { useState, useRef } from 'react';
import monment from 'moment';
// import { useModel } from 'umi';
import { Space, Button, message, Popconfirm } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/thfund-front-component/src';
import APIForm from './APIForm';
import { querydataList, addItem, updateItem, deleteItem } from './service';
import { tableEmptyCellRender } from '@/utils/utils';
import styles from './index.less';

const APIMng: React.FC = () => {
  // const { initialState } = useModel('@@initialState');
  const actionRef = useRef<ActionType>();
  const [initialValues, setInitialValues] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const columns: ProColumns<APIItem>[] = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   search: false,
    // },
    {
      title: '关键字搜索',
      dataIndex: 'searchWord',
      hideInTable: true,
    },
    {
      title: '方法名',
      dataIndex: 'methodName',
      ellipsis: true,
      search: false,
    },
    {
      title: '操作方式',
      dataIndex: 'operationType',
      ellipsis: true,
      search: false,
    },
    {
      title: '接口类型',
      dataIndex: 'interfaceType',
      ellipsis: true,
      search: false,
    },
    {
      title: '应用名',
      dataIndex: 'applicationName',
      ellipsis: true,
      search: false,
    },
    {
      title: '类型',
      dataIndex: 'type',
      ellipsis: true,
      search: false,
    },
    {
      title: '请求地址',
      dataIndex: 'httpUrl',
      ellipsis: true,
      search: false,
    },
    {
      title: '登录校验',
      dataIndex: 'checkLogin',
      ellipsis: true,
      search: false,
      render: (text, record) => (record.checkLogin ? '是' : '否'),
    },
    {
      title: '鉴权模块',
      dataIndex: 'authModules',
      ellipsis: true,
      search: false,
    },
    {
      title: '序列化',
      dataIndex: 'isProtobuf',
      hideInSearch: true,
      search: false,
      render: (text) => (text === 'YES' ? '是' : '否'),
    },
    {
      title: '参数',
      dataIndex: 'paramtype',
      hideInSearch: true,
      search: false,
    },
    {
      title: '注解',
      dataIndex: 'annotations',
      hideInSearch: true,
      search: false,
    },
    {
      title: '修改时间',
      dataIndex: 'gmtModify',
      hideInSearch: true,
      search: false,
      render: (text) => (text != '--' ? monment(text).format('YY-MM-DD HH:mm') : '--'),
    },
    {
      title: '修改时间',
      dataIndex: 'gmtModify',
      hideInTable: true,
      valueType: 'dateRange',
      search: {
        transform: (values) => ({
          startDate: values[0],
          endDate: values[1],
        }),
      },
    },
    {
      title: '修改人',
      dataIndex: 'modifior',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      width: '120px',
      search: false,
      render: (_, record: APIItem) => {
        return (
          <Space>
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={async () => {
                setInitialValues(record);
                setShowDetail(true);
              }}
            >
              查看
            </a>
            {/* {initialState?.userNo === record.modifior && ( */}
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={async () => {
                setInitialValues(record);
                setShowEdit(true);
              }}
            >
              修改
            </a>
            {/* )} */}
            {/* {initialState?.userNo === record.modifior && ( */}
            <Popconfirm
              title="确认删除此项么？"
              onConfirm={async () => {
                const result = await deleteItem(record);
                if (result.success) {
                  message.success('删除成功！');
                  actionRef.current?.reload();
                } else {
                  message.error('删除失败！');
                }
              }}
              okText="删除"
              cancelText="关闭"
            >
              <a target="_blank" rel="noopener noreferrer">
                删除
              </a>
            </Popconfirm>
            {/* )} */}
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer ghost className={styles.demoCard}>
      <ProTable
        actionRef={actionRef}
        size="small"
        options={{ density: false }}
        rowKey="id"
        request={(p: APIItem & Pagination) => {
          return querydataList({
            ...p,
            pageNo: p.current,
            pageSize: p.pageSize,
          });
        }}
        toolBarRender={() => [
          <Button onClick={() => setShowAdd(true)} key="add">
            新增
          </Button>,
        ]}
        columns={tableEmptyCellRender(columns as any)}
        pagination={{
          pageSize: 10,
        }}
        scroll={{ x: 'max-content' }}
      />
      {/** 新增表单 */}
      {showAdd && (
        <APIForm
          title="新增应用"
          type="add"
          visible={showAdd}
          onFinish={async (values: APIItem) => {
            const success = await addItem(values);
            if (success) {
              message.success('新增成功');
              actionRef.current?.reload();
            }
            return true;
          }}
          onVisibleChange={setShowAdd}
        />
      )}
      {/** 修改表单 */}
      {showEdit && (
        <APIForm
          title="修改应用信息"
          type="edit"
          visible={showEdit}
          initialValues={initialValues}
          onFinish={async (values: APIItem) => {
            const success = await updateItem(values);
            if (success) {
              message.success('修改成功');
              actionRef.current?.reload();
            }
            return true;
          }}
          onVisibleChange={setShowEdit}
        />
      )}

      {/** 查看详情 */}
      {showDetail && (
        <APIForm
          title="应用详情"
          type="read"
          visible={showDetail}
          initialValues={initialValues}
          submitter={false}
          onVisibleChange={setShowDetail}
        />
      )}
    </PageContainer>
  );
};

export default APIMng;
