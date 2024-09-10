import React, { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { Modal, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { getHlDetailByBondCode } from '../service';
import type { HoldItemType } from '../service';
import styles from './index.less';

interface ModalProps {
  eventDetailId: number;
  visible: boolean;
  onClose: () => void;
}

// 持仓详情信息
const HoldModal = (props: ModalProps) => {
  const { visible } = props;
  const [list, setList] = useState<HoldItemType[]>([]);

  const getDetail = useCallback(async (params) => {
    const result = await getHlDetailByBondCode(params);
    setList(result || []);
  }, []);

  useEffect(() => {
    if (visible) {
      getDetail({ eventDetailId: props.eventDetailId });
    }
  }, [props]);

  const columns: ColumnsType<HoldItemType> = useMemo(
    () => [
      {
        title: '产品名称',
        align: 'center',
        width: 80,
        dataIndex: 'fundName',
      },
      {
        title: '证券名称',
        align: 'center',
        width: 50,
        dataIndex: 'bondName',
      },
      {
        title: '万得代码',
        align: 'center',
        width: 50,
        dataIndex: 'bondCode',
      },
      {
        title: '发行人名称',
        align: 'center',
        width: 80,
        dataIndex: 'issuerName',
      },
      {
        title: '主体评级',
        align: 'center',
        width: 50,
        dataIndex: 'issuerOuterRating',
      },
      {
        title: '债项评级',
        align: 'center',
        width: 50,
        dataIndex: 'outerRating',
      },
      {
        title: '内部主体评级',
        align: 'center',
        width: 50,
        dataIndex: 'issuerInnerRating',
      },
      {
        title: '内部债项评级',
        align: 'center',
        width: 50,
        dataIndex: 'innerRating',
      },
      {
        title: '交易场所',
        align: 'center',
        width: 50,
        dataIndex: 'exchmarket',
      },
      {
        title: '到期日期',
        align: 'center',
        width: 60,
        dataIndex: 'endDate',
      },
      {
        title: '回售日期',
        align: 'center',
        width: 50,
        dataIndex: 'putEndDate',
      },
      {
        title: '债券净值',
        align: 'center',
        width: 50,
        dataIndex: 'hldBalanceAccuracy',
      },
      {
        title: '基金净值',
        align: 'center',
        width: 50,
        dataIndex: 'fundNetNavAccuracy',
      },
      {
        title: '债券占基金净值百分比',
        align: 'center',
        width: 50,
        dataIndex: 'hldRatioAccuracy',
      },
      {
        title: '债券数量',
        align: 'center',
        width: 50,
        dataIndex: 'hldAmountAccuracy',
      },
      {
        title: '持仓债券占债券余额比',
        align: 'center',
        width: 50,
        dataIndex: 'hldMarketAmountRatioAccuracy',
      },
      // {
      //   title: '操作',
      //   align: 'center',
      //   width: 50,
      //   key: 'action',
      //   render: (text: string) => {
      //     return (<span className={styles['detail-link']}>复制</span>);
      //   },
      // },
    ],
    [],
  );

  return (
    <Modal
      title={
        <div className={styles['title-wrap']}>
          <span className={styles['modal-title']}>持仓信息</span>
          {/* <Button type="primary">复制表格</Button> */}
        </div>
      }
      width="90%"
      visible={visible}
      onCancel={props.onClose}
      footer={null}
    >
      <Table
        bordered
        rowKey="fundName"
        size="small"
        columns={columns}
        pagination={false}
        dataSource={list}
      />
    </Modal>
  );
};

export default memo(HoldModal);
