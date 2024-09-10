// UrbanDistribution
import React from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import Title from '../Title';

// 城市分布模块
const UrbanDistribution = () => {
  return (
    <ProCardPlus ghost direction="column" style={{ padding: 16, backgroundColor: '#fff' }}>
      <Title title="城市分布" />
    </ProCardPlus>
  );
};

UrbanDistribution.isProCard = true;

export default UrbanDistribution;
