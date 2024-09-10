import React, { memo, useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import UpContent from './UpContent';
import DownContent from './DownContent';
import { cardGutter, contentPadding } from '@/themes';
import { MpBenchmarkQuery } from '@/pages/Investment/Simulation/SingleIndexBenchmark/service';
import { MpDomainQuery } from '@/pages/Investment/Simulation/CustomBenchmark/service';

// 投资->模拟组合->基准管理->自定义基准
const CustomBenchmark = () => {
  const [customBenchmark, setCustomBenchmark] = useState<any>([]);
  const [customMpdomain, setCustomMpDomain] = useState<any>([]);

  const initCustomBenchmark = async () => {
    const result = await MpBenchmarkQuery({ bmType: 3 });
    setCustomBenchmark(result);
  };

  const initMpDomainQuery = async () => {
    const result = await MpDomainQuery();
    setCustomMpDomain(result);
  };

  useEffect(() => {
    // 初始化自定义基准
    initCustomBenchmark();
    // 初始化业务域
    initMpDomainQuery();
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
        <UpContent customBenchmark={customBenchmark} customMpdomain={customMpdomain} />
      </ProCard>
      <ProCard
        style={{ padding: contentPadding }}
        direction="column"
        ghost
        gutter={[0, cardGutter]}
        size="small"
      >
        <DownContent customBenchmark={customBenchmark} customMpdomain={customMpdomain} />
      </ProCard>
    </>
  );
};

export default memo(CustomBenchmark);
