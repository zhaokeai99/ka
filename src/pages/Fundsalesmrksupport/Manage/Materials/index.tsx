import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import DetailModal from './DetailModal';
import { deleteMaterials, queryMaterials, queryDivisionManager, querySeasons } from './service';
import type { TableListItem } from './service';

//  赛季管理
const MaterialsManager = () => {
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

  const handleSeasonsDelete = useCallback(async (code) => {
    const { success, errorMsg } = await deleteMaterials({ ...code });
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
        align: 'center',
        title: '主题',
        ellipsis: true,
        dataIndex: 'title',
      },
      {
        align: 'center',
        title: '主题文字色号',
        ellipsis: true,
        dataIndex: 'titleColour',
        hideInSearch: true,
      },
      {
        align: 'center',
        ellipsis: true,
        title: '主要简介',
        hideInSearch: true,
        dataIndex: 'mainContent',
      },
      {
        align: 'center',
        ellipsis: true,
        title: '主要简介文字色号',
        hideInSearch: true,
        dataIndex: 'mainContentColour',
      },
      {
        title: '简介',
        hideInSearch: true,
        ellipsis: true,
        align: 'center',
        dataIndex: 'content',
      },
      {
        title: '简介文字色号',
        hideInSearch: true,
        ellipsis: true,
        align: 'center',
        dataIndex: 'contentColour',
      },
      {
        align: 'center',
        ellipsis: true,
        title: '背景图',
        hideInSearch: true,
        valueType: 'image',
        dataIndex: 'backgroundPicture',
      },
      {
        title: '跳转地址',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        dataIndex: 'skipUrl',
      },
      {
        align: 'center',
        ellipsis: true,
        title: '排序',
        hideInSearch: true,
        dataIndex: 'staticOrder',
      },
      {
        title: '状态',
        dataIndex: 'state',
        hideInTable: true,
        valueType: 'select',
        valueEnum: {
          '0': '可用',
          '1': '不可用',
        },
      },
      {
        title: '状态',
        ellipsis: true,
        align: 'center',
        hideInSearch: true,
        render: (ReactChild, state) => {
          if (state.state === '0') {
            return '可用';
          }
          if (state.state === '1') {
            return '不可用';
          }
          return '';
        },
      },
      {
        title: '创建日期',
        hideInSearch: true,
        ellipsis: true,
        align: 'center',
        dataIndex: 'gmtCreate',
        sorter: (a: any, b: any) =>
          new Date(a.gmtCreate).getTime() - new Date(b.gmtCreate).getTime(),
      },
      {
        title: '修改日期',
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
        valueType: 'option',
        align: 'center',
        fixed: 'right',
        render: (text, record) => {
          return (
            <>
              <Button type="link" onClick={() => handleShowModal('edit', record)}>
                编辑
              </Button>
              <Popconfirm
                placement="topLeft"
                title={'删除后不可恢复，您确定要删除吗?'}
                onConfirm={() => {
                  handleSeasonsDelete(record);
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
        size="small"
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 120 }}
        scroll={{ x: 'max-content' }}
        request={async (params) => {
          const result = await queryMaterials({
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

export default MaterialsManager;
