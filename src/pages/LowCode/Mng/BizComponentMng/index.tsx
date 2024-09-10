import React, { useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Popover } from 'antd';
import { history } from 'umi';
import { PictureTwoTone, PlusOutlined } from '@ant-design/icons';
import type { BizComponentItem } from '../../Types';
import {
  queryBizComponentList,
  //  deleteDataItem
} from './service';
// import EditDlg from './EditBizComponent';
import styles from './index.less';

const BizComponentList: React.FC = () => {
  // 表格引用
  const ref = useRef<ActionType>();
  const timestamp = history?.location?.query?.timestamp;
  useEffect(() => {
    if (ref && ref.current) {
      ref.current.reload();
    }
  }, [timestamp]); // 编辑页面返回时，带回一个时间戳，触发刷新

  // // 删除业务组件逻辑，这个不建议暴露出来
  // const deleteItem = useCallback((record) => {
  //   // 编辑组件调用编辑弹框
  //   confirm({
  //     icon: <DeleteTwoTone />,
  //     content: '确认删除改业务组件？',
  //     onOk() {
  //       message.warn('删除业务组件点击' + record.id);
  //       deleteDataItem({ id: record.id });
  //       if (ref && ref.current) {
  //         ref.current.reload();
  //       }
  //     },
  //     onCancel() {},
  //   });
  // }, []);

  const columns: ProColumns<BizComponentItem>[] = [
    {
      title: '关键字查询',
      dataIndex: 'searchWord',
      hideInTable: true,
    },
    {
      title: '模块ID',
      dataIndex: 'moduleId',
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
      title: '所属应用',
      dataIndex: 'app',
      hideInSearch: true,
    },
    {
      title: '类目',
      dataIndex: 'category',
      hideInSearch: true,
    },
    {
      title: '前端组件',
      dataIndex: 'uiComponent',
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
            <Button href={`#/lowcode/mng/EditBizComponent?type=edit&id=${record.id}`} type="link">
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
      <ProTable<BizComponentItem>
        className={styles['container']}
        actionRef={ref}
        headerTitle="业务组件列表"
        size="small"
        rowKey="id"
        search={{
          labelWidth: 120,
          // collapsed: true,
        }}
        request={(params) => queryBizComponentList(params)}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
        options={{
          density: false,
        }}
        toolBarRender={() => [
          // <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => addNew()}>
          //   新建
          // </Button>,
          <Button href="#/lowcode/mng/EditBizComponent?type=new" type="primary">
            <PlusOutlined />
            新建
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default BizComponentList;
