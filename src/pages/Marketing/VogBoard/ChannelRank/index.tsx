import React from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import Title from '../Title';

// 渠道排行模块
const ChannelRank = () => {
  return (
    <ProCardPlus
      ghost
      direction="column"
      style={{ padding: 16, backgroundColor: '#fff', height: '100%' }}
    >
      <Title title="渠道排行" />
    </ProCardPlus>
  );
};

ChannelRank.isProCard = true;

export default ChannelRank;
