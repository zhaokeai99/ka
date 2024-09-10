import React, { memo, useEffect, useState } from 'react';
import './index.less';
import { cardGutter, contentPadding } from '@/themes';
import ProCard from '@ant-design/pro-card';
import SearchForm from './SearchForm';
import GroupTable from './Table';
import ExcessReturnsCharts from './Charts';

// 组合分析
const MpAnalysis = () => {
  const [formValue, setFormValue] = useState<any>({
    domains: [],
    tradeDate: '',
    circles: [],
  });
  const [domainDic, setDomainDic] = useState<any>([]);

  const onSubmit = (formValues: any) => {
    setFormValue({ ...formValues });
  };

  const onLoadDomainDic = (value: any) => {
    setDomainDic(value);
  };
  useEffect(() => {}, []);

  return (
    <>
      <ProCard
        style={{ padding: contentPadding }}
        direction="column"
        ghost
        gutter={[0, cardGutter]}
        size="small"
      >
        <ProCard bordered={false}>
          <SearchForm onSubmit={onSubmit} onLoadDomainDic={onLoadDomainDic} />
        </ProCard>
        <ProCard>
          <GroupTable formValue={formValue} domainDic={domainDic} />
        </ProCard>
        <ProCard>
          <ExcessReturnsCharts formValue={formValue} domainDic={domainDic} />
        </ProCard>
      </ProCard>
    </>
  );
};
export default memo(MpAnalysis);
