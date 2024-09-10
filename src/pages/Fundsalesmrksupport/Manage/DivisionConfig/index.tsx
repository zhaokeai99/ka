import { queryDivisionManager } from '@/pages/Fundsalesmrksupport/Manage/Division/service';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Switch, Tag, Tooltip } from 'antd';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import DetailModal from './DetailModal';
import type { TableListItem } from './service';
import { queryDivisionConfigManager, updateFundManager } from './service';

// 理财师赛区配置管理
const DivisionConfigManager = () => {
  const actionRef = useRef<ActionType>();
  const [isShowModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editValues, setEditValues] = useState({});

  const handleChangeStatus = useCallback(async (record) => {
    const { success, errorMsg } = await updateFundManager({
      ...record,
    });
    if (success) {
      message.success('状态更新成功');
      actionRef.current?.reload();
    } else {
      message.error(errorMsg || '状态更新失败');
    }
  }, []);
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

  // const handleDelete = useCallback(async (id) => {
  //   const { success, errorMsg } = await deleteFundManager({ divisionId: id });
  //   if (success) {
  //     message.success('删除成功');
  //     actionRef.current?.reload();
  //   } else {
  //     message.error(errorMsg || '删除失败');
  //   }
  // }, []);
  const QRCodeonClick = useCallback(async (record) => {
    const imgUrl = `data:image/png;base64,${record.divisionQRCode}`;
    const a = document.createElement('a');
    a.href = imgUrl;
    a.setAttribute('download', record.divisionAnotherName + '-' + record.divisionId);
    a.click();
  }, []);

  const columns: ProColumns<TableListItem>[] = useMemo(() => {
    return [
      {
        title: '赛区名称',
        align: 'center',
        ellipsis: true,
        dataIndex: 'divisionId',
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
        title: '赛区别名',
        align: 'center',
        ellipsis: true,
        dataIndex: 'divisionAnotherName',
      },
      {
        title: '活动名称',
        align: 'center',
        ellipsis: true,
        dataIndex: 'pushActivityName',
      },
      {
        title: '背景图',
        ellipsis: true,
        dataIndex: 'backgroundImage',
        hideInSearch: true,
        valueType: 'image',
        align: 'center',
      },
      {
        title: '排行榜展示人数',
        ellipsis: true,
        align: 'center',
        dataIndex: 'rankNum',
      },
      {
        title: '榜单',
        hideInSearch: true,
        align: 'center',
        ellipsis: true,
        dataIndex: 'ranking',
        render: (ReactChild, state) => {
          const rankingList: any = [];
          if (state.ranking) {
            for (let i = 0; i < state.ranking.length; i++) {
              if (state.ranking[i].rankName === '0') {
                rankingList.push(
                  <Tag key={Math.random()} color={'blue'}>
                    收益榜
                  </Tag>,
                );
              }
              if (state.ranking[i].rankName === '1') {
                rankingList.push(
                  <Tag key={Math.random()} color={'yellow'}>
                    收益率榜
                  </Tag>,
                );
              }
              if (state.ranking[i].rankName === '2') {
                rankingList.push(
                  <Tag key={Math.random()} color={'red'}>
                    回撤榜
                  </Tag>,
                );
              }
            }
          }
          return rankingList;
        },
      },
      {
        title: '排行榜摘要',
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        dataIndex: 'rankAbstract',
      },
      {
        title: '赛区二维码',
        align: 'center',
        render: (text, record) => {
          if (record.divisionQRCode) {
            return (
              <>
                <Tooltip placement="rightTop" title="点击二维码下载图片">
                  <img
                    style={{ height: 50, width: 50 }}
                    onClick={() => QRCodeonClick(record)}
                    src={`data:image/png;base64,${record.divisionQRCode}`}
                  />
                </Tooltip>
              </>
            );
          } else {
            return;
          }
        },
      },
      {
        title: '赛区专属URL',
        align: 'center',
        ellipsis: true,
        dataIndex: 'divisionURL',
      },
      {
        title: '客户经理名称',
        align: 'center',
        ellipsis: true,
        dataIndex: 'managerName',
      },
      {
        title: '客户经理二维码',
        ellipsis: true,
        dataIndex: 'managerImage',
        hideInSearch: true,
        valueType: 'image',
        align: 'center',
      },
      {
        title: '联系人邮箱',
        align: 'center',
        ellipsis: true,
        dataIndex: 'pushEmail',
      },
      {
        title: '重定向地址',
        align: 'center',
        ellipsis: true,
        dataIndex: 'redirectUrl',
      },
      {
        title: '状态',
        align: 'center',
        dataIndex: 'configState',
        hideInTable: true,
        valueType: 'select',
        valueEnum: {
          0: '正常',
          1: '停用',
        },
      },
      {
        title: '状态',
        align: 'center',
        dataIndex: 'configState',
        hideInSearch: true,
        render: (text, record) => (
          <Switch
            checkedChildren="停用"
            unCheckedChildren="正常"
            checked={!!text}
            onChange={() => {
              handleChangeStatus({
                divisionId: record.divisionId,
                configState: record.configState == 0 ? 1 : 0,
              });
            }}
          />
        ),
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
        align: 'center',
        hideInSearch: true,
        ellipsis: true,
        dataIndex: 'gmtModified',
        sorter: (a: any, b: any) =>
          new Date(a.gmtModified).getTime() - new Date(b.gmtModified).getTime(),
      },
      {
        title: '操作',
        align: 'center',
        width: 100,
        key: 'option',
        fixed: 'right',
        valueType: 'option',
        render: (text, record) => {
          return (
            <>
              <Button type="link" onClick={() => handleShowModal('edit', record)}>
                编辑
              </Button>
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
        scroll={{ x: 'max-content' }}
        rowKey="divisionId"
        request={async (params) => {
          const result = await queryDivisionConfigManager({
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

export default DivisionConfigManager;
