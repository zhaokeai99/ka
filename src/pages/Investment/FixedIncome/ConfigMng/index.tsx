import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type { TemplateItem, Pagination } from './data';
import { useState, useRef } from 'react';
import moment from 'moment';
import { Space, Button, message, Popconfirm } from 'antd';
import ProTable from '@ant-design/pro-table';
import ProCardPlus from '@/components/ProCardPlus';
import MyModalForm from './Form';
import {
  queryTemplateList,
  addTemplate,
  updateTemplate,
  deleteTemplate,
  queryTemplateDetail,
} from './service';
import { tableEmptyCellRender } from '@/utils/utils';
import styles from './index.less';

const toDisplayString = (data) => {
  const displayData = JSON.stringify(data, null, '\t');
  return displayData;
};

const dataToDisplay = (data) => {
  const newData = {
    ...data,
    paramList: toDisplayString(data.paramList),
    columnList: toDisplayString(data.columnList),
  };
  return newData;
};

const toSaveData = (data) => {
  const saveData = JSON.parse(data);
  return saveData;
};

const dataToSave = (data) => {
  const newData = {
    ...data,
    paramList: toSaveData(data.paramList),
    columnList: toSaveData(data.columnList),
  };
  return newData;
};

const ConfigMng: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [initialValues, setInitialValues] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const columns: ProColumns<any>[] = [
    {
      title: '模型名称',
      dataIndex: 'modelName',
    },
    {
      title: '模型备注',
      dataIndex: 'modelRemark',
      search: false,
      render: (text) => (
        <div title={text} className={styles.lineEllipse}>
          {text}
        </div>
      ),
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      search: false,
      render: (_, record) => (
        <span>{record.createTime ? moment(record.createTime).format('YY-MM-DD HH:mm') : '--'}</span>
      ),
    },
    {
      title: '修改人',
      dataIndex: 'updateUser',
      search: false,
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      search: false,
      render: (_, record) => (
        <span>{record.updateTime ? moment(record.updateTime).format('YY-MM-DD HH:mm') : '--'}</span>
      ),
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      width: '120px',
      search: false,
      render: (_, record: TemplateItem) => {
        return (
          <Space>
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={async () => {
                const result = await queryTemplateDetail({ modelId: record.modelId });
                if (result && result.success && result.data) {
                  setInitialValues(dataToDisplay(result.data));
                  setShowDetail(true);
                } else {
                  message.error('查询模型详情失败！');
                }
              }}
            >
              查看
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={async () => {
                const result = await queryTemplateDetail({ modelId: record.modelId });
                if (result && result.success && result.data) {
                  setInitialValues(dataToDisplay(result.data));
                  setShowEdit(true);
                } else {
                  message.error('查询编辑模型信息失败！');
                }
              }}
            >
              修改
            </a>
            <Popconfirm
              title="确认删除此项么？"
              onConfirm={async () => {
                const result = await deleteTemplate({ modelId: record.modelId });
                if (result && result.success) {
                  message.success('删除成功！');
                  actionRef.current?.reload();
                } else {
                  message.error('删除模型信息失败！');
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
        );
      },
    },
  ];

  return (
    <ProCardPlus ghost className={styles.demoCard}>
      <ProTable
        actionRef={actionRef}
        size="small"
        options={{ density: false }}
        rowKey="id"
        request={(p: TemplateItem & Pagination) => {
          return queryTemplateList({
            ...p,
            pageIndex: p.current,
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
        <MyModalForm
          title="新增模型"
          type="add"
          visible={showAdd}
          onFinish={async (values: TemplateItem) => {
            const { success, message: errorMsg } = await addTemplate({
              ...dataToSave(values),
            });
            if (success) {
              message.success('新增成功');
              actionRef.current?.reload();
            } else {
              message.error(errorMsg || '新增失败！');
            }
            return success;
          }}
          onVisibleChange={setShowAdd}
        />
      )}

      {/** 查看详情 */}
      {showDetail && (
        <MyModalForm
          title="查看详情"
          type="read"
          visible={showDetail}
          initialValues={initialValues}
          onVisibleChange={setShowDetail}
        />
      )}
      {showEdit && (
        <MyModalForm
          title="编辑模型"
          type="edit"
          visible={showEdit}
          initialValues={initialValues}
          onVisibleChange={setShowEdit}
          onFinish={async (values: TemplateItem) => {
            const { success, message: errorMsg } = await updateTemplate({
              ...dataToSave(values),
            });
            if (success) {
              message.success('更新成功');
              actionRef.current?.reload();
            } else {
              message.error(errorMsg || '新增失败！');
            }
            return true;
          }}
        />
      )}
    </ProCardPlus>
  );
};

export default ConfigMng;
