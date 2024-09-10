import ProTable, { ActionType } from '@ant-design/pro-table';
import { Button, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import { delProductExaminePolicy, queryProductExamineList } from '../service';
import DetailModal from './DetailModal';

const Policy = () => {
  const [modalType, setModalType] = useState('');
  const actionRef = useRef<ActionType>();
  const [formVisible, setFormVisible] = useState(false);
  const [values, setValues] = useState<any>({});
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageNo: 1,
    total: 0,
    showQuickJumper: true,
  });

  // 关闭
  const handleColse = (key?: string) => {
    setFormVisible(false);

    if (key === 'reload') {
      actionRef.current?.reload();
    }
  };

  // 删除
  const handDel = async (id: { id: any }) => {
    const { data } = await delProductExaminePolicy(id);

    if (data) {
      message.success('删除成功');
      actionRef.current?.reload();
    } else {
      message.error('删除失败');
    }
  };

  const columns: any = [
    {
      title: '产品大类',
      dataIndex: 'fundCategory',
      search: false,
      ellipsis: true,
      key: 'fundCategory',
    },
    {
      title: '细分类型',
      dataIndex: 'subdivideCategory',
      search: false,
      key: 'subdivideCategory',
    },
    {
      title: '受理状态',
      dataIndex: 'dealStatus',
      search: false,
      key: 'dealStatus',
    },
    {
      title: '标题分类',
      dataIndex: 'titleCategory',
      search: false,
      key: 'titleCategory',
    },
    {
      title: '标题',
      dataIndex: 'title',
      search: false,
      key: 'title',
    },
    {
      title: '内容描述',
      dataIndex: 'content',
      search: false,
      key: 'content',
    },
    {
      title: '操作',
      search: false,
      fixed: 'right',
      width: '100',
      align: 'center',
      render: (_v: any, item: any) => {
        return (
          <>
            <Button
              type="link"
              size="small"
              onClick={() => {
                setModalType('edit');
                setFormVisible(true);
                setValues(item);
              }}
            >
              修改
            </Button>
            <Popconfirm
              title="您确定要删除吗?"
              onConfirm={() => handDel({ id: item?.detailId })}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" size="small">
                删除
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  // 查询列表
  const queryProductInfo = async (params: any) => {
    const { data, success } = await queryProductExamineList({
      offsetId: '',
      pageSize: params?.pageSize,
      pageNo: params?.current,
    });
    const { dataList, total, pageNum } = data || {};
    if (success) {
      setPagination((pageParams) => ({
        ...pageParams,
        total,
        pageNo: pageNum,
      }));
    }
    return {
      data: dataList || [],
      success: true,
    };
  };
  return (
    <>
      <ProTable
        columns={columns}
        request={queryProductInfo}
        scroll={{ x: 'max-content' }}
        rowKey={(v) => {
          return v?.detailId || v?.id;
        }}
        actionRef={actionRef}
        options={false}
        search={false}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              setFormVisible(true);
              setModalType('add');
            }}
          >
            新增
          </Button>,
          <Button type="primary"> 导入 </Button>,
        ]}
        pagination={pagination}
        form={{
          ignoreRules: false,
        }}
      />
      <DetailModal
        values={values}
        modalType={modalType}
        formVisible={formVisible}
        onClose={handleColse}
      />
    </>
  );
};

export default Policy;
