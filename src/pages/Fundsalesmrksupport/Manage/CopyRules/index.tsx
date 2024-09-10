import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import DetailModal from './DetailModal';
import { queryCopyRules, deleteCopyRules, querySeasons, queryDivisionManager } from './service';
import type { TableListItem } from './service';

// 理财师赛区管理
const CopyRulesManager = () => {
  const actionRef = useRef<ActionType>();
  const [isShowModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editValues, setEditValues] = useState({});

  const handleShowModal = useCallback((type, values) => {
    setEditValues(values);
    setModalType(type);
    setShowModal(true);
  }, []);

  const handleColse = useCallback((key) => {
    setShowModal(false);
    if (key === 'reload') {
      actionRef.current?.reload();
    }
  }, []);

  const handleDelete = useCallback(async (code) => {
    const { success, errorMsg } = await deleteCopyRules({ ...code });
    if (success) {
      message.success('删除成功');
      actionRef.current?.reload();
    } else {
      message.error(errorMsg || '删除失败');
    }
  }, []);

  const columns: ProColumns<TableListItem>[] = useMemo(() => {
    return [
      {
        align: 'center',
        title: '主键id',
        hideInSearch: true,
        ellipsis: true,
        dataIndex: 'id',
        hideInTable: true,
      },
      {
        title: '赛区名称',
        align: 'center',
        dataIndex: 'divisionId',
        ellipsis: true,
        valueType: 'select',
        request: async () => {
          const data = await queryDivisionManager();
          return data?.map((item: any) => {
            return {
              label: item?.divisionName,
              value: item?.divisionId,
            };
          });
        },
        fieldProps: { showSearch: true },
      },
      {
        title: '赛季名称',
        align: 'center',
        ellipsis: true,
        dataIndex: 'seasonId',
        valueType: 'select',
        request: async () => {
          const data = await querySeasons();
          return data?.map((item: any) => {
            return {
              label: item?.seasonName,
              value: item?.seasonId,
            };
          });
        },
        fieldProps: { showSearch: true },
      },
      {
        title: '标题',
        hideInSearch: true,
        align: 'center',
        dataIndex: 'title',
      },
      {
        title: '内容',
        align: 'center',
        ellipsis: true,
        hideInSearch: true,
        dataIndex: 'content',
      },
      {
        title: '文案类型',
        dataIndex: 'type',
        align: 'center',
        hideInTable: true,
        valueType: 'select',
        valueEnum: {
          '0': '活动规则',
          '1': '交易规则',
          '2': '活动预告',
        },
      },
      {
        title: '文案类型',
        hideInSearch: true,
        align: 'center',
        ellipsis: true,
        render: (ReactChild, state) => {
          if (state.type === '0') {
            return '活动规则';
          }
          if (state.type === '1') {
            return '交易规则';
          }
          if (state.type === '2') {
            return '活动预告';
          }
          return '-';
        },
      },
      {
        title: '排序',
        hideInSearch: true,
        align: 'center',
        dataIndex: 'sort',
      },
      {
        title: '创建时间',
        hideInSearch: true,
        align: 'center',
        ellipsis: true,
        dataIndex: 'gmtCreate',
        sorter: (a: any, b: any) =>
          new Date(a.gmtCreate).getTime() - new Date(b.gmtCreate).getTime(),
      },
      {
        title: '修改时间',
        hideInSearch: true,
        ellipsis: true,
        align: 'center',
        dataIndex: 'gmtModified',
        sorter: (a: any, b: any) =>
          new Date(a.gmtModified).getTime() - new Date(b.gmtModified).getTime(),
      },
      {
        title: '操作',
        key: 'option',
        fixed: 'right',
        align: 'center',
        valueType: 'option',
        render: (text, record) => {
          return (
            <>
              <Button type="link" onClick={() => handleShowModal('edit', record)}>
                编辑
              </Button>
              <Popconfirm
                placement="topLeft"
                title={'您确定要删除吗?'}
                onConfirm={() => {
                  handleDelete(record);
                }}
                okText="确定"
                cancelText="取消"
              >
                <Button type="text" danger>
                  删除
                </Button>
              </Popconfirm>
            </>
          );
        },
      },
    ];
  }, []);

  return (
    <>
      <ProTable<TableListItem>
        search={{ labelWidth: 120 }}
        size="small"
        actionRef={actionRef}
        scroll={{ x: 'min-content' }}
        rowKey="id"
        request={async (params) => {
          const result = await queryCopyRules({
            ...params,
            currentPage: params.current,
            pageSize: params.pageSize,
          });
          return {
            data: result || [],
          };
        }}
        toolBarRender={() => [
          <Button
            key="add_button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => handleShowModal('add', {})}
          >
            新增
          </Button>,
        ]}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
      <DetailModal
        visible={isShowModal}
        modalType={modalType}
        initValues={editValues}
        onClose={handleColse}
      />
    </>
  );
};

export default CopyRulesManager;
