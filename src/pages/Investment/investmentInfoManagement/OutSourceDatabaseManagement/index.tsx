import React, { memo, useEffect, useRef, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { cardGutter, contentPadding } from '@/themes';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType } from '@ant-design/pro-table';
import { ProFormText, ProList, QueryFilter } from '@ant-design/pro-components';
import type { TableListItem } from './service';
import { IrOutsourceFacadeQueryIrOutsourceList } from './service';
import AddForm from './components/add';
import EditForm from './components/edit';
import './index.css';

const OutSourceDataBase = () => {
  const actionRef = useRef<ActionType>();
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [editData, setEditData] = useState<any>(undefined);
  const [dataList, setDataList] = useState<any>([]);
  const [pageInfo, setPageInfo] = useState<any>({ current: 1, pageSize: 20, total: 0 });
  const [loading, setLoading] = useState<boolean>(false);
  const loadData = async (params?: any) => {
    setLoading(true);
    const result = await IrOutsourceFacadeQueryIrOutsourceList({
      current: pageInfo.current,
      pageSize: pageInfo.pageSize,

      bizNameLike: params?.bizName,
      bizThemeLike: params?.bizTheme,
      status: params?.status,
    });

    const { data = [], current, pageSize, pages, total } = result;
    setLoading(false);
    setDataList(data);
    setPageInfo({ current, pageSize, pages, total });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddModal = () => {
    setAddVisible(true);
  };
  const handleEditModal = (row: TableListItem) => {
    setEditVisible(true);
    setEditData(row);
    console.log('editData', row);
  };

  const remove = (row: TableListItem) => {
    console.log('delete', row);
  };

  const addClose = (key: any) => {
    setAddVisible(false);
    if (key === 'reload') {
      actionRef?.current?.reload();
      return;
    }
  };
  const editClose = (key: any) => {
    setEditVisible(false);
    setEditData(undefined);
    if (key === 'reload') {
      actionRef?.current?.reload();
      return;
    }
  };

  const search = async (values: any) => {
    console.log(values);
    loadData(values);
  };

  return (
    <>
      <ProCard
        style={{ padding: contentPadding }}
        direction="column"
        ghost
        gutter={[0, cardGutter]}
        size="small"
      >
        <div className={'out-source-query-filter'}>
          <QueryFilter<TableListItem> onFinish={search}>
            <ProFormText name="bizName" label="名称" />
            <ProFormText name="bizTheme" label="主题/行业" />
          </QueryFilter>
        </div>

        <ProList<TableListItem>
          loading={loading}
          pagination={{
            defaultPageSize: 18,
            showSizeChanger: false,
            current: pageInfo.current,
            total: pageInfo.total,
          }}
          onItem={() => {
            return {
              onClick: () => {},
            };
          }}
          showActions="hover"
          rowSelection={{}}
          grid={{ gutter: 16, column: 4 }}
          metas={{
            title: {
              dataIndex: 'bizName',
              render: (text) => <span style={{ fontSize: 14, fontWeight: 600 }}>{text}</span>,
            },
            subTitle: {
              dataIndex: 'bizTheme',
              render: (text) => (
                <span
                  style={{
                    color: '#f27c49',
                    background: '#fff2eb',
                    paddingLeft: 5,
                    paddingRight: 5,
                  }}
                >
                  {text}
                </span>
              ),
            },
            type: {},
            content: { dataIndex: 'creator', render: (text) => <span>联系人：{text}</span> },
            actions: {
              render: (text, row) => [
                <a key="run" onClick={() => handleEditModal(row)}>
                  修改
                </a>,
                <a key="delete" onClick={() => remove(row)}>
                  删除
                </a>,
              ],
            },
          }}
          toolBarRender={() => [
            <Button
              key="add_button"
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => handleAddModal()}
            >
              新建
            </Button>,
          ]}
          headerTitle="数据门户"
          dataSource={dataList}
        />
        <AddForm visible={addVisible} onClose={addClose} />
        <EditForm visible={editVisible} onClose={editClose} data={editData} />
      </ProCard>
    </>
  );
};

export default memo(OutSourceDataBase);
