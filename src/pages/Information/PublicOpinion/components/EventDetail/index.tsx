import React, { useCallback, memo } from 'react';
import { Tag } from 'antd';
import styles from './index.less';

interface DetailProps {
  data: {
    sentType: string;
    eventType: string;
    eventSubType: string;
    issuerList: any[];
    bondList: any[];
  };
  hanldeOpenDetail: (data: any) => void;
}

const Detail = ({ data, hanldeOpenDetail }: DetailProps) => {
  const renderBondList = useCallback((bondList: any[] = []) => {
    if (!Array.isArray(bondList)) {
      return null;
    }
    const curList =
      bondList.length > 2 ? bondList.slice(0, 2).concat({ bondCode: '', bondName: '' }) : bondList;

    return curList.map((itm: any) => (
      <Tag key={itm.bondCode} className={styles.tag}>
        <span className={styles.blue}>
          {itm.bondName ? `[${itm.bondName}][${itm.bondCode}]` : '...'}
        </span>
      </Tag>
    ));
  }, []);

  const renderIssuerList = useCallback((issuerList: any[] = []) => {
    if (!Array.isArray(issuerList)) {
      return null;
    }
    const curList =
      issuerList.length > 2
        ? issuerList.slice(0, 2).concat({ issuerCode: '...', issuerName: '...' })
        : issuerList;
    return curList.map((itm: any) => (
      <Tag key={itm.issuerCode} className={styles.tag}>
        {itm.issuerName}
      </Tag>
    ));
  }, []);

  return (
    <div className={styles['list-content']}>
      <div
        className={`${styles['content-detail']} ${styles.blue}`}
        onClick={() => hanldeOpenDetail(data)}
      >
        详情&gt;&gt;
      </div>
      <Tag className={styles.tag}>{data.sentType}</Tag>
      <Tag className={styles.tag}>{data.eventType}</Tag>
      <Tag className={styles.tag}>{data.eventSubType}</Tag>
      {renderIssuerList(data.issuerList)}
      {renderBondList(data.bondList)}
    </div>
  );
};

export default memo(Detail);
