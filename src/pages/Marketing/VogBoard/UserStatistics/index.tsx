import React from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import Title from '../Title';

// 用户统计模块
const UserStatistics = () => {
  return (
    <ProCardPlus ghost direction="column" style={{ padding: 16, backgroundColor: '#fff' }}>
      <Title title="用户统计" />
    </ProCardPlus>
  );
};

UserStatistics.isProCard = true;

export default UserStatistics;
