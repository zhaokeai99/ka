import React from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import Title from '../Title';

// 机构排行模块
const InstitutionRank = () => {
  return (
    <ProCardPlus
      ghost
      direction="column"
      style={{ padding: 16, backgroundColor: '#fff', height: '100%' }}
    >
      <Title title="机构排行" />
    </ProCardPlus>
  );
};

InstitutionRank.isProCard = true;

export default InstitutionRank;
