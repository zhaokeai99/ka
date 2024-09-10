import React, { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { Drawer, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getSentBondByEvent } from '../service';
import type { BondItemType } from '../service';
import styles from './index.less';

interface ModalProps {
  eventId: number;
  visible: boolean;
  onClose: () => void;
  onViewModal: (val: number) => void;
}

// 关联债券抽屉
const BondDrawer = (props: ModalProps) => {
  const { visible } = props;
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [list, setList] = useState<BondItemType[]>([]);

  const getDataList = useCallback(async (params) => {
    const result = await getSentBondByEvent(params);
    setList(result.data || []);
    setPagination((prePage) => {
      return { ...prePage, current: result.pageNum || 1, total: result.total || 0 };
    });
  }, []);

  useEffect(() => {
    if (visible) {
      getDataList({
        eventId: props.eventId,
        pageNum: 1,
        pageSize: pagination.pageSize,
      });
    }
  }, [props]);

  const handlePageChange = useCallback(
    (page, pageSize) => {
      getDataList({
        eventId: props.eventId,
        pageNum: page,
        pageSize: pageSize,
      });
    },
    [props],
  );

  const columns: ColumnsType<BondItemType> = useMemo(
    () => [
      {
        title: '债券代码',
        align: 'center',
        dataIndex: 'bondCode',
      },
      {
        title: '债券名称',
        align: 'center',
        dataIndex: 'bondName',
      },
      {
        title: '内部评级',
        align: 'center',
        dataIndex: 'innerRating',
      },
      {
        title: '外部评级',
        align: 'center',
        dataIndex: 'outerRating',
      },
      {
        title: '发行方',
        align: 'center',
        dataIndex: 'issuerName',
      },
      {
        title: '持仓信息',
        align: 'center',
        key: 'action',
        render: (text: string, record: BondItemType) => {
          return (
            <div
              className={styles['detail-link']}
              onClick={() => props.onViewModal(record.eventDetailId)}
            >
              查看
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <Drawer
      width="70%"
      title="关联债券"
      visible={visible}
      placement="right"
      onClose={props.onClose}
    >
      <Table
        bordered
        rowKey="bondCode"
        size="small"
        columns={columns}
        dataSource={list}
        pagination={{
          ...pagination,
          onChange: handlePageChange,
        }}
      />
    </Drawer>
  );
};

export default memo(BondDrawer);
