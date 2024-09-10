import React, { useEffect, useState, useCallback, memo } from 'react';
import { Tag, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { getXyNegativeSentimentDetailByEvent } from './service';
import type { bondListType, ItemDataType } from './service';
import styles from './index.less';

interface ModalProps {
  eventId: number;
  xyType: number;
  visible: boolean;
  onClose: () => void;
}

const columns: ColumnsType<bondListType> = [
  {
    title: '债券代码',
    align: 'center',
    dataIndex: 'bondCode',
    key: 'bondCode',
  },
  {
    title: '债券简称',
    align: 'center',
    dataIndex: 'bondName',
    key: 'bondName',
  },
  {
    title: '发行方',
    align: 'center',
    dataIndex: 'issuerName',
    key: 'issuerName',
  },
];

// 债券详情
const DetailModal = (props: ModalProps) => {
  const { visible } = props;
  const [detailData, setDetailData] = useState<ItemDataType>({
    bondList: [],
    enclosureUrl: '',
    eventAbstract: '',
    eventContent: '',
    eventSubType: '',
    eventTitle: '',
    eventType: '',
    sentType: '',
  });

  const getDetail = useCallback(async (params) => {
    const result = await getXyNegativeSentimentDetailByEvent({
      eventId: params.eventId,
      xyType: params.xyType,
    });
    setDetailData(result || {});
  }, []);

  useEffect(() => {
    if (visible) {
      getDetail(props);
    }
  }, [props]);

  return (
    <Modal title="详情" width="60%" visible={visible} onCancel={props.onClose} footer={null}>
      <div className={styles['tag-wrap']}>
        {detailData.sentType && <Tag>{detailData.sentType}</Tag>}
        {detailData.eventType && <Tag>{detailData.eventType}</Tag>}
        {detailData.eventSubType && <Tag>{detailData.eventSubType}</Tag>}
      </div>
      <div className={styles['detail-title']}>{detailData.eventTitle}</div>
      <div className={styles['detail-content']}>
        <div className={styles['content-title']}>事件摘要：</div>
        <div className={styles['content-text']}>{detailData.eventAbstract || '无'}</div>
      </div>
      <div className={styles['detail-content']}>
        <div className={styles['content-title']}>事件内容：</div>
        <div className={styles['content-text']}>{detailData.eventContent || '无'}</div>
      </div>
      {detailData.enclosureUrl && (
        <a
          href={detailData.enclosureUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles['file-link']}
        >
          附件链接&gt;&gt;&gt;
        </a>
      )}
      <div className={styles['detail-content']}>
        <div className={styles['content-title']}>关联债券：</div>
        <div className={styles['content-table']}>
          <Table
            bordered
            size="small"
            columns={columns}
            pagination={false}
            dataSource={detailData.bondList || []}
          />
        </div>
      </div>
    </Modal>
  );
};

export default memo(DetailModal);
