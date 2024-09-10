import React, { memo } from 'react';
import ProCard from '@ant-design/pro-card';
import { cardGutter, contentPadding } from '@/themes';
import LeftContent from './LeftContent';
import RightContent from './RightContent';

// 舆情
const Narrow = () => {
  return (
    <ProCard ghost style={{ padding: contentPadding }} gutter={[cardGutter, 0]} size="small">
      <LeftContent colSpan={18} />
      <RightContent colSpan={6} />
    </ProCard>
  );
};

export default memo(Narrow);
