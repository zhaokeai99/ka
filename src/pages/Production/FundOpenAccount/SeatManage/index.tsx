import React, { useState, useCallback, useRef } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import IndexAddForm from './IndexAddForm';
import PrepareDocument from '../DocumentPrepare/PrepareDocument';
import Context from '../DocumentPrepare/context';
import { queryApplyList, cancelOpenSeatFlow, completeOpenSeatMaterial } from './service';

const { confirm } = Modal;

type TableListItem = {
  id: string;
  fundId: string;
  fundCode: string;
  fundName: string;
  status: string;
  manager: string;
  productType: string;
  acctType: string;
  recordType: string;
};

const SeatManage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [showAdd, setShowAdd] = useState(false); // 是否显示 新建浮窗
  const [showDocument, setShowDocument] = useState(false); // 是否显示 开户材料准备浮窗
  const [id, setId] = useState(0); // 浮窗详情id
  const [fundId, setFundId] = useState(); // 选择查看的基金id

  // 撤销申请
  const cancelApply = async (applyId: string) => {
    confirm({
      title: '确认要撤销该申请吗?',
      onOk: async () => {
        const result = await cancelOpenSeatFlow({ id: applyId });
        if (result) {
          message.success('撤销成功');
          actionRef.current?.reload();
          return;
        }
        message.error('撤销失败');
      },
    });
  };

  const handleColse = useCallback((key) => {
    setShowAdd(false);
    setShowDocument(false);
    if (key === 'reload') {
      actionRef.current?.reload();
    }
  }, []);

  const onFinish = async () => {
    message.info('正在生成文件，请稍后...');
    const data = await completeOpenSeatMaterial({ id });
    if (data) {
      message.success('生成成功');
      handleColse('reload');
      window.open(data); // 打开下载
      return true;
    }
    message.warning('完成准备材料失败');
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '席位号',
      dataIndex: 'seatNo',
      fixed: 'left',
      width: 130,
    },
    {
      title: '托管人',
      dataIndex: 'trustee',
      fixed: 'left',
      width: 200,
    },
    {
      title: '券商',
      dataIndex: 'broker',
      hideInSearch: true,
    },
    {
      title: '业务类别',
      dataIndex: 'seatType',
      valueType: 'select',
      hideInSearch: true,
      valueEnum: {
        SEAT_RENT: { text: '席位租用' },
        SEAT_QUIT: { text: '席位退租' },
        TRADE_AUTHORITY: { text: '申赎权限' },
      },
    },
    {
      title: '席位类型',
      dataIndex: 'childType',
      hideInSearch: true,
    },
    {
      title: '申请状态',
      dataIndex: 'status',
      search: false,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      fixed: 'right',
      width: 180,
      title: '操作',
      dataIndex: '',
      valueType: 'option',
      render: (text: any, record: any) => {
        return [
          <a
            key="view"
            onClick={() => {
              setId(record.id);
              setFundId(record.fundId);
              setShowDocument(true);
            }}
          >
            编辑材料
          </a>,
          <a key="cancel" onClick={() => cancelApply(record?.id)}>
            撤销
          </a>,
        ];
      },
    },
  ];

  return (
    <ProCardPlus ghost style={{ padding: '12px' }}>
      {/* table列表 */}
      <ProTable<TableListItem>
        size="small"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 130,
        }}
        request={async (params) => {
          const { total, dataList } = await queryApplyList({
            ...params,
            manager: params?.manager?.value,
            keyword: params?.fundName,
            pageSize: params?.pageSize,
            pageNo: params?.current,
          });
          return {
            total,
            data: dataList,
          };
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
        scroll={{ x: 'max-content' }}
        options={{
          density: false,
        }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setShowAdd(true);
            }}
          >
            发起申请
          </Button>,
        ]}
      />
      {/* 新建表单浮窗 */}
      <IndexAddForm showAdd={showAdd} onClose={handleColse} />
      <Context.Provider value={fundId}>
        <PrepareDocument
          showDocument={showDocument}
          onClose={handleColse}
          isSeat={true}
          id={id}
          title={'准备材料'}
          okText={'完成准备材料'}
          onFinishProps={onFinish}
        />
      </Context.Provider>
    </ProCardPlus>
  );
};

export default SeatManage;
