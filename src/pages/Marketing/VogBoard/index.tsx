import ProCardPlus from '@/components/ProCardPlus';
import React, { useState } from 'react';
import FundRank from './FundRank';
import StockTrend from './StockTrend';
import TimePicker from './TimePicker';
import TotalAchieve from './TotalAchieve';
// import ChannelRank from './ChannelRank';
// import InstitutionRank from './InstitutionRank';
// import UserStatistics from './UserStatistics';
// import UrbanDistribution from './UrbanDistribution';
import { VogProvider } from './service';
import Anchor from '@/components/Anchor';

const VogBoard: React.FC = () => {
  const [vogParams, setVogParams] = useState({});

  return (
    <VogProvider.Provider value={vogParams}>
      <ProCardPlus
        className="none-select"
        direction="column"
        style={{ padding: 16 }}
        ghost
        gutter={[0, 16]}
        sn="_marketing_vogBoard"
      >
        <TimePicker onChange={(val: any) => setVogParams(val)} />
        <TotalAchieve />
        {/* 后续上 */}
        {/* <ProCardPlus ghost gutter={[16, 0]}>
          <UrbanDistribution />
          <UserStatistics />
        </ProCardPlus> */}
        <StockTrend />
        <FundRank />
        {/* 后续上 */}
        {/* <ProCardPlus ghost gutter={[16, 0]}>
          <ChannelRank />
          <InstitutionRank />
        </ProCardPlus> */}
        <Anchor
          data={[
            {
              id: 'totalAchieve',
              title: '整体达成',
            },
            {
              id: 'keyIndicators',
              title: '重点指标',
            },
            {
              id: 'stockTrend',
              title: '存量规模',
            },
            {
              id: 'fundRank',
              title: '非货公募产品排行',
            },
          ]}
        />
      </ProCardPlus>
    </VogProvider.Provider>
  );
};

export default VogBoard;
