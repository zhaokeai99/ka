import React, { useState, useCallback } from 'react';
import ProCard from '@ant-design/pro-card';
import SelectMenu from './components/SelectMenu';
import TrendCard from './components/TrendCard';
import ListCard from './components/ListCard';
import { IIndustySearchParams, initEndDate, initStartDate } from './data.d';
import styles from './index.less';

const IndustryContent: React.FC & { isProCard: boolean } = () => {
  const [total, setTotal] = useState<number>(0); // 总条数
  const [params, setParams] = useState<IIndustySearchParams>({
    industryId: '',
    industryName: '',
    startDate: initStartDate.format('yyyy-MM-DD 00:00:00'),
    endDate: initEndDate.format('yyyy-MM-DD 23:59:59'),
    publicSentiment: '',
  });

  const onChangeParams = useCallback(
    (value) => {
      setParams((preState) => {
        return {
          ...preState,
          ...value,
        };
      });
    },
    [params],
  );

  const changeTotal = useCallback(
    (value) => {
      setTotal(value);
    },
    [total],
  );

  return (
    <ProCard split="vertical" size="small" ghost className={styles['industry-content-container']}>
      <ProCard colSpan={4} size="small" layout="center">
        <SelectMenu params={params} onChangeParams={onChangeParams} />
      </ProCard>
      <ProCard colSpan={20} size="small" direction="column" bodyStyle={{ padding: 0 }}>
        <TrendCard params={params} total={total} onChangeParams={onChangeParams} />
        <ListCard params={params} total={total} changeTotal={changeTotal} />
      </ProCard>
    </ProCard>
  );
};

IndustryContent.isProCard = true;

export default IndustryContent;
