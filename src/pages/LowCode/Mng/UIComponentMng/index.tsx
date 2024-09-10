import React, { useCallback, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Popover } from 'antd';
import { PictureTwoTone, PlusOutlined } from '@ant-design/icons';
import type { UIComponentItem } from '../../Types';
import {
  queryUIComponentList,
  // deleteDataItem,
  getItemDetail,
  addItem,
  updateItem,
} from './service';
import EditDlg from './EditDlg';

import styles from './index.less';

const UIComponentList: React.FC = () => {
  // 表格引用
  const ref = useRef<ActionType>();
  // 编辑数据设置
  const [editItemData, setEditItemData] = useState({});
  // 编辑弹框状态设置
  const [showEdit, showEditDlg] = useState(false);
  const [showNew, showNewDlg] = useState(false);
  // 更新老版本内容
  // const [lastVersion, setLastVersion] = useState('');
  // 新增UI组件逻辑
  const addNew = useCallback(() => {
    // 新增组件调用编辑弹框
    setEditItemData({});
    showNewDlg(true);
  }, []);

  // 编辑UI组件逻辑
  const editItem = useCallback((record) => {
    // 编辑组件调用编辑弹框

    getItemDetail(record)
      .then((res) => {
        if (res.success) {
          setEditItemData(res.data);
          showEditDlg(true);
          // setLastVersion(res.data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  // // 删除UI组件逻辑，这个不建议暴露出来
  // const deleteItem = useCallback((record) => {
  //   // 编辑组件调用编辑弹框
  //   confirm({
  //     icon: <DeleteTwoTone />,
  //     content: '确认删除该组件？',
  //     onOk() {
  //       message.warn('删除UI组件点击' + record.id);
  //       deleteDataItem({ id: record.id });
  //       if (ref && ref.current) {
  //         ref.current.reload();
  //       }
  //     },
  //     onCancel() {},
  //   });
  // }, []);

  const columns: ProColumns<UIComponentItem>[] = [
    {
      title: '关键字查询',
      dataIndex: 'searchWord',
      hideInTable: true,
    },
    {
      title: '组件ID',
      dataIndex: 'componentId',
      hideInSearch: true,
    },
    {
      title: '组件名',
      dataIndex: 'componentName',
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
      title: 'APP',
      dataIndex: 'app',
      hideInSearch: true,
    },
    {
      title: '缩略图',
      dataIndex: 'imgUrl',
      hideInSearch: true,
      render: (text, record) => {
        const content = <img src={record.imgUrl} style={{ height: 200, width: 300 }} />;
        return (
          <Popover content={content}>
            <PictureTwoTone />
          </Popover>
        );
      },
    },
    {
      title: '组件属性描述',
      dataIndex: 'props',
      hideInSearch: true,
      render: (text, record) => (
        <div className={styles['eclipse-text']} title={record.props}>
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
      hideInSearch: true,
      dataIndex: 'modifier',
    },
    {
      title: '修改时间',
      hideInSearch: true,
      dataIndex: 'modifiedTime',
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
      <ProTable<UIComponentItem>
        className={styles['container']}
        actionRef={ref}
        headerTitle="UI组件列表"
        size="small"
        rowKey="id"
        search={{
          labelWidth: 120,
          // collapsed: true,
        }}
        request={(params) => queryUIComponentList(params)}
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
          const { success } = await addItem(values);
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
          const params = values;
          const { success } = await updateItem(params);
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

export default UIComponentList;
