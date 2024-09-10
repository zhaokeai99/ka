import React, { memo, useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import UpContent from './UpContent';
import DownContent from './DownContent';
import { cardGutter, contentPadding } from '@/themes';
import { MpBenchmarkQuery, MpDomainQuery } from './service';

// 投资->模拟组合->基准管理->复合基准
const Benchmarks = () => {
  const [mpBenchmarkDic, setMpBenchmarkDic] = useState<any>([]); // 基准字典
  const [domainDic, setDomainDic] = useState<any>([]); // 业务域字典

  const initMpBenchmarksDic = async () => {
    const result = await MpBenchmarkQuery({ bmType: 2 });
    if (result) {
      setMpBenchmarkDic(result);
    }
  };

  const initDomain = async () => {
    const result = await MpDomainQuery();
    if (result) {
      setDomainDic(result);
    }
  };

  useEffect(() => {
    // 初始化复合基准
    initMpBenchmarksDic();
    // 初始化业务域
    initDomain();
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
        <UpContent mpBenchmarkDic={mpBenchmarkDic} domainDic={domainDic} />
      </ProCard>
      <ProCard
        style={{ padding: contentPadding }}
        direction="column"
        ghost
        gutter={[0, cardGutter]}
        size="small"
      >
        <DownContent mpBenchmarkDic={mpBenchmarkDic} domainDic={domainDic} />
      </ProCard>
    </>
  );
};

export default memo(Benchmarks);
