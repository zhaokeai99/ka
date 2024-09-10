import React from 'react';
import ProCard from '@ant-design/pro-card';
import { headerTabsCardKeys, intradayTabsKeys } from '../data.d';
import ValuationDeviation from './ValuationDeviation';
import YesterdayClosedOff from './YesterdayClosedOff';
import BondTabLayout from '../components/BondTabLayout';
import { contentPadding } from '@/themes';

interface IIntradayPriceProps {
  title: string;
  value: headerTabsCardKeys.INTRADAY;
}

const intradayTabsOption = {
  [intradayTabsKeys.PRE]: '昨收偏离',
  [intradayTabsKeys.VALUATION]: '估值偏离',
};

const IntradayPrice: React.FC<IIntradayPriceProps> = () => {
  return (
    <ProCard
      size="small"
      style={{
        paddingTop: 0,
        paddingLeft: contentPadding,
        paddingRight: contentPadding,
        paddingBottom: 0,
      }}
      bodyStyle={{ padding: 0 }}
    >
      <BondTabLayout
        options={{
          defaultActiveKey: intradayTabsKeys.VALUATION,
        }}
      >
        <ValuationDeviation
          title={intradayTabsOption.valuation}
          value={intradayTabsKeys.VALUATION}
        />
        <YesterdayClosedOff title={intradayTabsOption.pre} value={intradayTabsKeys.PRE} />
      </BondTabLayout>
    </ProCard>
  );
};

export default IntradayPrice;
