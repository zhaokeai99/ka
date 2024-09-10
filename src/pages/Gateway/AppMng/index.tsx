import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type { AppItem, Pagination } from './data';
import { useState, useRef } from 'react';
import { Space, Button, message, Popconfirm } from 'antd';
import monment from 'moment';
// import { useModel } from 'umi';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/thfund-front-component/src';
import AppForm from './AppForm';
import { queryAppList, addItem, updateItem, deleteItem } from './service';
import { tableEmptyCellRender } from '@/utils/utils';
import styles from './index.less';

const AppMng: React.FC = () => {
  // const { initialState } = useModel('@@initialState');
  const actionRef = useRef<ActionType>();
  const [initialValues, setInitialValues] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const columns: ProColumns<AppItem>[] = [
    {
      title: '关键字搜索',
      dataIndex: 'searchWord',
      hideInTable: true,
    },
    {
      title: '应用系统名',
      dataIndex: 'appName',
      hideInSearch: true,
    },
    {
      title: 'Access Key',
      dataIndex: 'ak',
      render: (text) => text || '--',
      search: false,
    },
    {
      title: 'Secret Access Key',
      dataIndex: 'sk',
      render: (text) => text || '--',
      search: false,
    },
    {
      title: '是否校验sign',
      dataIndex: 'checkSign',
      render: (text, record) => (record.checkSign ? '是' : '否'),
      search: false,
    },
    {
      title: '是否可重试',
      dataIndex: 'retryable',
      render: (text, record) => (record.retryable ? '是' : '否'),
      search: false,
    },
    {
      title: '超时时间(秒)',
      dataIndex: 'timeout',
      render: (text) => text || '--',
      search: false,
    },
    {
      title: '修改时间',
      dataIndex: 'gmtModified',
      render: (text) => (text != '--' ? monment(text).format('YY-MM-DD HH:mm') : '--'),
      hideInSearch: true,
    },
    {
      title: '修改时间',
      dataIndex: 'gmtModified',
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
      render: (text) => text || '--',
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      width: '120px',
      search: false,
      render: (_, record: AppItem) => {
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
        request={(p: AppItem & Pagination) => {
          return queryAppList({
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
        // scroll={{ x: 'max-content' }}
      />
      {/** 新增表单 */}
      {showAdd && (
        <AppForm
          title="新增应用"
          type="add"
          visible={showAdd}
          onFinish={async (values: AppItem) => {
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
        <AppForm
          title="修改应用信息"
          type="edit"
          visible={showEdit}
          initialValues={initialValues}
          onFinish={async (values: AppItem) => {
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
        <AppForm
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

export default AppMng;
