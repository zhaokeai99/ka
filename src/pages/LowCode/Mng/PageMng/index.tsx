import React, { useCallback, useRef, useState, useEffect } from 'react';
import { history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { PageItem } from '../../Types';
import {
  queryPageList,
  // deletePageItem,
  getPageDetail,
  addPageItem,
  updatePageItem,
} from './service';
import EditDlg from './EditDlg';

import styles from './index.less';

const PageList: React.FC = () => {
  // 表格引用
  const ref = useRef<ActionType>();
  const timestamp = history?.location?.query?.timestamp;
  useEffect(() => {
    if (ref && ref.current) {
      ref.current.reload();
    }
  }, [timestamp]); // 编辑页面返回时，带回一个时间戳，触发刷新

  // 编辑数据设置
  const [editItemData, setEditItemData] = useState({});
  // 编辑弹框状态设置
  const [showEdit, showEditDlg] = useState(false);
  const [showNew, showNewDlg] = useState(false);
  // 新增页面逻辑
  const addNew = useCallback(() => {
    // 新增组件调用编辑弹框
    setEditItemData({});
    showNewDlg(true);
  }, []);

  // 编辑页面逻辑
  const editItem = useCallback((record) => {
    // 编辑组件调用编辑弹框

    getPageDetail(record)
      .then((res) => {
        if (res.success) {
          setEditItemData(res.data);
          showEditDlg(true);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  // // 删除页面逻辑，这个不建议暴露出来
  // const deleteItem = useCallback((record) => {
  //   // 编辑组件调用编辑弹框
  //   confirm({
  //     icon: <DeleteTwoTone />,
  //     content: '确认删除改页面？',
  //     onOk() {
  //       message.warn('删除页面点击' + record.pageId);
  //       deletePageItem({ pageId: record.pageId });
  //       if (ref && ref.current) {
  //         ref.current.reload();
  //       }
  //     },
  //     onCancel() {},
  //   });
  // }, []);

  const columns: ProColumns<PageItem>[] = [
    {
      title: '关键字查询',
      dataIndex: 'searchWord',
      hideInTable: true,
    },
    {
      title: '页面ID',
      dataIndex: 'pageId',
      hideInSearch: true,
    },
    {
      title: '标题',
      dataIndex: 'title',
      hideInSearch: true,
      render: (text, record) => (
        <div className={styles['eclipse-text']} title={record.title}>
          {text}
        </div>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      hideInSearch: true,
      render: (text, record) => (
        <div className={styles['eclipse-text']} title={record.description}>
          {text}
        </div>
      ),
    },
    {
      title: '搜索关键字',
      dataIndex: 'keywords',
      hideInSearch: true,
    },
    {
      title: '类目',
      dataIndex: 'category',
      hideInSearch: true,
    },
    {
      title: '页面布局',
      dataIndex: 'layout',
      hideInSearch: true,
      render: (text, record) => (
        <div className={styles['eclipse-text']} title={record.layout}>
          {text}
        </div>
      ),
    },
    // {
    //   title: '上一版本',
    //   dataIndex: 'lastVersion',
    //   hideInSearch: true,
    //   render: (text, record) => (
    //     <div className={styles['eclipse-text']} title={record.lastVersion}>
    //       {text}
    //     </div>
    //   ),
    // },
    {
      title: '最近修改者',
      dataIndex: 'modifier',
      hideInSearch: true,
    },
    {
      title: '修改时间',
      dataIndex: 'modifiedTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: '',
      hideInSearch: true,
      render: (text, record) => {
        return (
          <>
            <Button type="link" onClick={() => editItem(record)}>
              编辑
            </Button>
            <Button href={`#/lowcode/mng/EditLayout?id=${record.id}`} type="link">
              编辑布局
            </Button>
            {/* <Button type="link" onClick={() => deleteItem(record)}>
              删除
            </Button> */}
          </>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<PageItem>
        className={styles['container']}
        actionRef={ref}
        headerTitle="页面列表"
        size="small"
        rowKey="id"
        search={{
          labelWidth: 120,
          // collapsed: true,
        }}
        request={(params) => queryPageList(params)}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
        options={{
          density: false,
        }}
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => addNew()}>
            新建
          </Button>,
        ]}
      />
      {/** 新建表单 */}
      <EditDlg
        title="新增"
        type="add"
        visible={showNew}
        onFinish={async (values) => {
          const { success } = await addPageItem(values);
          if (success) {
            message.success('新增成功！');
            if (ref && ref.current) {
              ref.current.reload();
            }
          } else {
            message.error('新增失败！');
          }
          return true;
        }}
        onVisibleChange={showNewDlg}
      />

      {/** 编辑表单 */}
      <EditDlg
        title="编辑"
        type="edit"
        visible={showEdit}
        initialValues={editItemData}
        onFinish={async (values) => {
          const { success } = await updatePageItem(values);
          if (success) {
            message.success('修改成功！');
            if (ref && ref.current) {
              ref.current.reload();
            }
          } else {
            message.error('修改失败！');
          }
          return true;
        }}
        onVisibleChange={showEditDlg}
      />
    </PageContainer>
  );
};

export default PageList;
