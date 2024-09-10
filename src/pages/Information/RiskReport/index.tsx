import React, { useState, useCallback, useMemo } from 'react';
import { Card, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import ProCard from '@ant-design/pro-card';
import SearchForm from './components/SearchForm';
import BondDrawer from './components/BondDrawer';
import HoldModal from './components/HoldModal';
import type { EventListItemType } from './service';
import { getSentEventPageByQuery } from './service';
import styles from './index.less';

// 个券信用风险报告
const RiskReport = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState({});
  const [dataList, setDataList] = useState<EventListItemType[]>([]);
  const [drawerId, setDrawerId] = useState<number>(0); // 关联债券查询key
  const [modalId, setModalId] = useState<number>(0); // 持仓查询key
  const [isOpenDrawer, setOpenDrawer] = useState(false); // 关联债券抽屉
  const [isOpenModal, setOpenModal] = useState(false); // 持仓弹窗

  const getDataList = useCallback(async (params) => {
    setLoading(true);
    const result = await getSentEventPageByQuery(params);
    setLoading(false);
    setDataList(result.data || []);
    setPagination(() => {
      return {
        current: result.pageNum || 1,
        pageSize: result.pageSize || 10,
        total: result.total || 0,
      };
    });
  }, []);

  const handleSearch = useCallback(
    (values) => {
      setSearchValue(values);
      getDataList({ ...values, pageNum: 1, pageSize: pagination.pageSize });
    },
    [pagination],
  );

  // 打开关联债券抽屉
  const handleOpenDrawer = useCallback((records) => {
    setDrawerId(records.id);
    setOpenDrawer(true);
  }, []);

  // 打开持仓弹窗
  const handleOpenModal = useCallback((val) => {
    setModalId(val);
    setOpenModal(true);
  }, []);

  // 分页改变
  const handlePageChange = useCallback(
    (page, pageSize) => {
      getDataList({
        ...searchValue,
        pageNum: page,
        pageSize: pageSize,
      });
    },
    [searchValue],
  );

  const clumns: ColumnsType<EventListItemType> = useMemo(
    () => [
      {
        title: '事件类型',
        width: 80,
        align: 'center',
        dataIndex: 'eventType',
      },
      {
        title: '事件子类型',
        width: 80,
        align: 'center',
        dataIndex: 'eventSubType',
      },
      {
        title: '事件标题',
        width: 100,
        align: 'center',
        dataIndex: 'eventTitle',
      },
      {
        title: '事件摘要',
        width: 100,
        align: 'center',
        dataIndex: 'eventAbstract',
        render: (text: string) => {
          return (
            <Tooltip title={text} placement="bottom">
              <div className={styles['text-ellipsis']}>{text}</div>
            </Tooltip>
          );
        },
      },
      {
        title: '事件内容',
        width: 120,
        align: 'center',
        dataIndex: 'eventContent',
        render: (text: string) => {
          return (
            <Tooltip title={text} placement="bottom">
              <div className={styles['text-ellipsis']}>{text}</div>
            </Tooltip>
          );
        },
      },
      {
        title: '所属类目',
        width: 80,
        align: 'center',
        dataIndex: 'sentType',
      },
      {
        title: '日期',
        width: 80,
        align: 'center',
        dataIndex: 'tDate',
      },
      {
        title: '关联债券',
        key: 'action',
        align: 'center',
        width: 80,
        render: (text: string, record: EventListItemType) => {
          return (
            <div className={styles['detail-link']} onClick={() => handleOpenDrawer(record)}>
              查看
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <ProCard style={{ padding: '12px 12px' }} ghost gutter={[0, 8]} size="small">
      <Card bordered={false} bodyStyle={{ padding: '12px 24px' }}>
        <SearchForm onSearch={handleSearch} />
      </Card>
      <Card bordered={false} title="舆情事件" size="small" style={{ marginTop: '10px' }}>
        <Table
          rowKey="id"
          bordered
          size="small"
          loading={loading}
          columns={clumns}
          dataSource={dataList}
          pagination={{
            ...pagination,
            onChange: handlePageChange,
          }}
        />
      </Card>
      <BondDrawer
        eventId={drawerId}
        visible={isOpenDrawer}
        onClose={useCallback(() => setOpenDrawer(false), [])}
        onViewModal={handleOpenModal}
      />
      <HoldModal
        eventDetailId={modalId}
        visible={isOpenModal}
        onClose={useCallback(() => setOpenModal(false), [])}
      />
    </ProCard>
  );
};

export default RiskReport;
