import React, { useEffect, useState } from 'react';
import { Empty } from 'antd';
import { queryStaticResourcesConfigInfo } from '@/pages/IndustrialChain/IndustryCenter/service';

interface propsType {
  industryCode: string;
  resourcesType: string;
}

// 产业链图片组件
const ChainImg = (props: propsType) => {
  const [chainImg, setChainImg] = useState<string>('');

  useEffect(() => {
    (async () => {
      const { data, success } = await queryStaticResourcesConfigInfo({
        industryCode: props?.industryCode,
        resourcesType: props?.resourcesType,
      });

      if (success) {
        setChainImg(data?.resourcesPath || '');
      }
    })();
  }, []);

  if (!chainImg) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="图谱开发中" />;
  }

  return <img style={{ width: '100%' }} src={chainImg} />;
};

export default ChainImg;
