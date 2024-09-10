import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import DetailModal from './DetailModal';
import {
  TableListItem,
  deletePrizeConfig,
  querySeasons,
  queryDivisionManager,
  queryPrizeConfig,
} from './service';

//  开奖管理
const PrizeConfigManager = () => {
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
    const { success, errorMsg } = await deletePrizeConfig({ ...code });
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
        title: 'base主键id',
        hideInSearch: true,
        ellipsis: true,
        dataIndex: 'id',
        hideInTable: true,
      },
      {
        align: 'center',
        title: 'info主键id',
        hideInSearch: true,
        ellipsis: true,
        dataIndex: 'infoId',
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
        dataIndex: 'seasonId',
        ellipsis: true,
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
      },
      {
        align: 'center',
        title: '奖品名称',
        ellipsis: true,
        dataIndex: 'prizeName',
      },
      {
        align: 'center',
        ellipsis: true,
        title: '奖品图片',
        hideInSearch: true,
        dataIndex: 'imageUrl',
        valueType: 'image',
      },
      {
        title: '获奖人数',
        hideInSearch: true,
        align: 'center',
        dataIndex: 'receiveMembers',
      },
      {
        align: 'center',
        ellipsis: true,
        title: '领取方式',
        hideInSearch: true,
        dataIndex: 'receiveWay',
      },
      {
        title: '开始时间',
        hideInSearch: true,
        ellipsis: true,
        align: 'center',
        dataIndex: 'startTime',
      },
      {
        title: '结束时间',
        hideInSearch: true,
        ellipsis: true,
        align: 'center',
        dataIndex: 'endTime',
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
        scroll={{ x: 'min-content' }}
        request={async (params) => {
          const result = await queryPrizeConfig({
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

export default PrizeConfigManager;
