import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Popconfirm } from 'antd';
import { useCallback, useMemo, useRef, useState } from 'react';
import DetailModal from './DetailModal';
import type { TableListItem } from './service';
import { deleteSeasons, queryDivisionManager, querySeasons } from './service';

//  赛季管理
const SeasonManager = () => {
  const actionRef = useRef<ActionType>();
  const [isShowModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editValues, setEditValues] = useState({});

  const handleShowModal = useCallback((type, values) => {
    if (type === 'edit' && values.state == 1) {
      message.error('当前赛季已经开启，不允许修改！');
      return;
    }
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
    if (code.state == 1) {
      message.error('当前赛季已经开启，不允许删除！');
      return;
    }
    const { success, errorMsg } = await deleteSeasons({ seasonId: code.seasonId });
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
        align: 'center',
        title: '赛季名称',
        ellipsis: true,
        dataIndex: 'seasonName',
      },
      {
        align: 'center',
        title: '赛季id',
        ellipsis: true,
        dataIndex: 'seasonId',
        hideInSearch: true,
      },
      {
        align: 'center',
        title: '体验金/万元',
        ellipsis: true,
        dataIndex: 'experienceAmount',
        hideInSearch: true,
      },
      {
        align: 'center',
        ellipsis: true,
        title: '渠道ID',
        hideInSearch: true,
        dataIndex: 'channelId',
      },
      {
        align: 'center',
        ellipsis: true,
        title: '活动ID',
        hideInSearch: true,
        dataIndex: 'activityId',
      },
      {
        title: '赛季状态',
        dataIndex: 'state',
        hideInTable: true,
        valueType: 'select',
        valueEnum: {
          0: '未开启',
          1: '已开启',
          2: '已结束',
        },
      },
      {
        title: '赛季状态',
        ellipsis: true,
        align: 'center',
        hideInSearch: true,
        render: (ReactChild, state) => {
          if (state.state == 0) {
            return '未开启';
          }
          if (state.state == 1) {
            return '已开启';
          }
          if (state.state == 2) {
            return '已结束';
          }
          return '';
        },
      },
      {
        title: '赛季开始日期',
        hideInSearch: true,
        ellipsis: true,
        align: 'center',
        dataIndex: 'startDate',
      },
      {
        title: '赛季结束日期',
        hideInSearch: true,
        ellipsis: true,
        align: 'center',
        dataIndex: 'endDate',
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
        rowKey="seasonId"
        search={{ labelWidth: 120 }}
        scroll={{ x: 'max-content' }}
        request={async (params) => {
          const result = await querySeasons({
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

export default SeasonManager;
