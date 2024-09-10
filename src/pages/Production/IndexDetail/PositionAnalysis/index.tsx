import ProCardPlus from '@/components/ProCardPlus';
import ProCard from '@ant-design/pro-card';
import React, { memo } from 'react';
import ChooseAbility from './ChooseAbility';
import CompareColumn from './CompareColumn';
import FamaFrenchModel from './FamaFrenchModel';
import FundPositions from './FundPositions';
import IndustryExposed from './IndustryExposed';
import Ring from './Ring';
import ScaleChange from './ScaleChange';

interface PositionAnalysisProps {
  fundCode: string;
}

// 全市场持仓分析
const PositionAnalysis: React.FC<PositionAnalysisProps> = (props) => {
  const { fundCode } = props;

  return (
    <ProCardPlus ghost style={{ padding: '12px 12px' }} direction="column" gutter={[0, 10]}>
      <ProCard ghost direction="row" gutter={[10, 0]}>
        <Ring fundCode={fundCode} />
        <ScaleChange fundCode={fundCode} />
        <FamaFrenchModel fundCode={fundCode} />
      </ProCard>
      <ProCard ghost direction="row" gutter={[10, 0]}>
        <ChooseAbility fundCode={fundCode} />
        <FundPositions fundCode={fundCode} />
        <CompareColumn fundCode={fundCode} />
      </ProCard>
      <IndustryExposed fundCode={fundCode} />
    </ProCardPlus>
  );
};

export default memo(PositionAnalysis);
