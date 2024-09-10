import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import UpContent from './UpContent';
import DownContent from './DownContent';
import { cardGutter, contentPadding } from '@/themes';
import { MpBenchmarkQuery, MpDomainQuery } from './service';

// 投资->模拟组合->基准管理->单市场基准
const SingleIndexBenchmark = () => {
  const [domainDic, setDomainDic] = useState<any>([]);
  const [sigleBenchmarkDic, setSigleBenchmarkDic] = useState<any>([]);

  const initMpDomainQuery = async () => {
    const result = await MpDomainQuery();
    setDomainDic(result);
  };

  const initSigleBenchmarks = async () => {
    const result = await MpBenchmarkQuery({ bmType: 1 });
    setSigleBenchmarkDic(result);
  };

  useEffect(() => {
    // 初始化业务域
    initMpDomainQuery();
    // 初始化单市场基准
    initSigleBenchmarks();
  }, []);

  return (
    <>
      <ProCard
        style={{ padding: contentPadding }}
        direction="column"
        ghost
        gutter={[0, cardGutter]}
        size="small"
      >
        <UpContent
          domainDic={domainDic}
          sigleBenchmarkDic={sigleBenchmarkDic}
          refReshBenchmarkDic={initSigleBenchmarks}
        />
      </ProCard>
      <ProCard
        style={{ padding: contentPadding }}
        direction="column"
        ghost
        gutter={[0, cardGutter]}
        size="small"
      >
        <DownContent domainDic={domainDic} sigleBenchmarkDic={sigleBenchmarkDic} />
      </ProCard>
    </>
  );
};

export default SingleIndexBenchmark;
