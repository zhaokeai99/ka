import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { cardGutter, contentPadding } from '@/themes';
import { Button, message, Modal, Alert } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import type { TableListItem } from './service';
import {
  SelmLiveRoadShowInfoFacadeQueryLiveRoadShowInfoByPage,
  SelmLiveRoadShowInfoFacadeSaveLiveRoadShowInfo,
  SelmLiveRoadShowInfoFacadeCountLiveInfo,
  SelmLiveRoadShowInfoFacadeGetLiveInfoDic,
} from './service';
import AddForm from './components/add';
import EditForm from './components/edit';
import MailForm from './components/mail';
import MsgForm from './components/msg';
import moment from 'moment';

const { confirm } = Modal;

const LiveInfo = () => {
  const actionRef = useRef<ActionType>();
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [mailVisible, setMailVisible] = useState<boolean>(false);
  const [msgVisible, setMsgVisible] = useState<boolean>(false);
  const [editData, setEditData] = useState<any>(undefined);
  const [sendMailId, setSendMailId] = useState<any>(undefined);
  const [msgId, setMsgId] = useState<any>(Math.random());
  const [countInfo, setCountInfo] = useState<any>(undefined);
  const [checkId, setCheckId] = useState<any>(undefined);
  const [liveDic, setLiveDic] = useState<any>({ cc: undefined, to: undefined });
  //allFinSum: 0, allNormalSum: 0, allSum: 13, allTodoSum: 8, today: '', todayFinSum: 0, todayNormalSum: 0, todaySum: 0, todayTodoSum: 0,
  //加载日志
  const loadLog = async () => {
    const params = {};
    const result = await SelmLiveRoadShowInfoFacadeCountLiveInfo(params);
    setCountInfo(result);
  };

  const loadDic = async () => {
    const result = await SelmLiveRoadShowInfoFacadeGetLiveInfoDic();
    setLiveDic(result);
  };

  useEffect(() => {
    loadDic();
  }, []);

  const request = async (params?: any) => {
    const result = await SelmLiveRoadShowInfoFacadeQueryLiveRoadShowInfoByPage({
      current: params.current,
      pageSize: params.pageSize,
      themeLike: params.theme,
      addrLike: params.addr,
      analystLike: params.analyst,
      brokerLike: params.broker,
      industryLike: params.industry,
      contactLike: params.contact,
      showTimeBegin: params.showTimeBegin,
      showTimeEnd: params.showTimeEnd,
      status: params.status,
      sortField: 'show_time asc, update_time',
      sortOrder: 'asc',
    });
    loadLog();
    setCheckId(undefined);

    const { data = [], current, pageSize, pages, total } = result || {};

    if (JSON.stringify(result) !== '{}') {
      return {
        data,
        current,
        pageSize,
        pages,
        total,
        success: true,
      };
    }

    return {
      data: [],
      success: true,
    };
  };

  const handleAddModal = () => {
    setAddVisible(true);
  };
  const handleEditModal = (row: TableListItem) => {
    setEditVisible(true);
    setEditData(row);
  };

  const remove = (row: TableListItem) => {
    confirm({
      title: '取消',
      content: '确认取消该记录吗?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        const params = { id: row.id, status: 2 };
        const data = await SelmLiveRoadShowInfoFacadeSaveLiveRoadShowInfo(params);
        if (data.success) {
          message.success('取消成功!');
          actionRef?.current?.reload();
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
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
  const mailClose = (key: any) => {
    setMailVisible(false);
    setSendMailId(undefined);
    if (key === 'reload') {
      actionRef?.current?.reload();
      return;
    }
  };

  const msgClose = (key: any) => {
    setMsgVisible(false);
    if (key === 'reload') {
      actionRef?.current?.reload();
      return;
    }
  };

  const columns: ProColumns<TableListItem>[] = useMemo(() => {
    return [
      {
        title: '状态',
        align: 'center',
        dataIndex: 'status',
        valueType: 'select',
        width: 50,
        valueEnum: { 0: '首次', 1: '变更', 2: '取消' },
        order: 95,
        render: (text, row) => {
          return row.status === 0 ? text : <span style={{ color: 'red' }}>{text}</span>;
        },
      },
      {
        title: '时间',
        ellipsis: true,
        align: 'center',
        dataIndex: 'showTime',
        width: 120,
        order: 98,
        hideInSearch: true,
      },
      {
        title: '开始时间',
        dataIndex: 'showTimeBegin',
        order: 97,
        hideInTable: true,
        valueType: 'date',
        initialValue: moment().format('YYYY-MM-DD'),
      },
      {
        title: '结束时间',
        dataIndex: 'showTimeEnd',
        order: 96,
        hideInTable: true,
        valueType: 'date',
      },
      {
        title: '券商',
        ellipsis: true,
        align: 'center',
        dataIndex: 'broker',
        width: 80,
        order: 99,
      },
      {
        title: '行业',
        ellipsis: true,
        align: 'center',
        dataIndex: 'industry',
        width: 80,
        order: 93,
      },
      {
        title: '分析师',
        ellipsis: true,
        align: 'center',
        dataIndex: 'analyst',
        width: 80,
        order: 92,
      },
      {
        title: '主题',
        align: 'center',
        dataIndex: 'theme',
        width: 150,
        order: 94,
        render: (text) => <span style={{ color: '#387bfb' }}>{text}</span>,
      },
      {
        title: '联系人',
        ellipsis: true,
        align: 'center',
        dataIndex: 'contact',
        width: 80,
        order: 91,
      },
      {
        title: '更新时间',
        ellipsis: true,
        align: 'center',
        dataIndex: 'updateTime',
        width: 120,
        order: 90,
        render: (text, row) => {
          return moment(row.updateTime).format('YYYY-MM-DD HH:mm');
        },
      },
      {
        title: '操作',
        align: 'center',
        key: 'option',
        valueType: 'option',
        width: 120,
        ellipsis: true,
        render: (text, record) => {
          const result = [];
          if (record.status !== 2) {
            result.push(
              <a
                onClick={() => {
                  handleEditModal(record);
                }}
              >
                {' '}
                编辑{' '}
              </a>,
            );
            result.push(
              <a
                onClick={() => {
                  remove(record);
                }}
              >
                {' '}
                取消{' '}
              </a>,
            );
          }
          return result;
        },
      },
    ];
  }, []);

  //异常监控
  const dataHandle = () => {
    setMsgId(Math.random() * 9999999);
    setMsgVisible(true);
  };

  //显示邮件
  const showMail = (id: any) => {
    setSendMailId(id);
    setMailVisible(true);
  };

  const getLiveInfo = (info: any) => {
    if (info) {
      const text = `当日数据未处理 ${info.todayTodoSum} 条，已处理 ${info.todayFinSum} 条，共计 ${info.todayFinSum}条。数据未处理共计 ${info.allTodoSum} 条。`;
      return text;
    }
    return '';
  };

  const rowClick = (record: any) => {
    if (checkId === record.id) {
      setCheckId(undefined);
    } else {
      setCheckId(record.id);
    }
  };

  const getRowClassName = (record: any) => {
    if (record.id === checkId) {
      return 'ant-table-row-selected';
    }
    return undefined;
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
        <ProTable<TableListItem>
          cardProps={{ title: '路演中心', bordered: false }}
          headerTitle={
            <>
              <Alert
                message={
                  <div>
                    <div>
                      {getLiveInfo(countInfo)}
                      <a style={{ marginLeft: 20 }} onClick={dataHandle}>
                        查看详情
                      </a>
                    </div>
                  </div>
                }
                type="info"
                showIcon
              />
            </>
          }
          onRow={(record) => {
            return {
              onClick: () => rowClick(record),
            };
          }}
          rowClassName={(record) => getRowClassName(record)}
          rowKey={'id'}
          size="small"
          actionRef={actionRef}
          columnEmptyText={false}
          search={{ labelWidth: 'auto' }}
          form={{ ignoreRules: true }}
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
          request={request}
          columns={columns}
          pagination={{
            showSizeChanger: true,
            current: 1,
            pageSize: 30,
            pageSizeOptions: [10, 20, 30, 50, 100],
          }}
          options={{ density: false }}
        />
      </ProCard>
      <AddForm visible={addVisible} onClose={addClose} onShowMail={showMail} dic={liveDic} />
      <EditForm
        visible={editVisible}
        onClose={editClose}
        data={editData}
        onShowMail={showMail}
        dic={liveDic}
      />
      <MailForm visible={mailVisible} onClose={mailClose} data={sendMailId} dic={liveDic} />
      <MsgForm visible={msgVisible} onClose={msgClose} id={msgId} />
    </>
  );
};

export default memo(LiveInfo);
