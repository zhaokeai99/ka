/**
 * 行业舆情
 */
import React from 'react';
import ProCard from '@ant-design/pro-card';
import { cardGutter, contentPadding } from '@/themes';
import ContrastMarket from './ContrastMarket';
import IndustryContent from './IndustryContent';

const Industry = () => {
  return (
    <ProCard
      ghost
      style={{ padding: contentPadding }}
      gutter={[0, cardGutter]}
      size="small"
      direction="column"
    >
      <ProCard colSpan={24} bodyStyle={{ padding: 0 }} size="small">
        <ContrastMarket />
      </ProCard>
      <ProCard colSpan={24} bodyStyle={{ padding: 0 }} size="small">
        <IndustryContent />
      </ProCard>
    </ProCard>
  );
};

export default Industry;
