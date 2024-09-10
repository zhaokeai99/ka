import React from 'react';
import ProCard from '@ant-design/pro-card';
import { afterTabsKeys, headerTabsCardKeys } from '../data.d';
import ClosingPrice from './ClosingPrice';
import RelativeValuation from './RelativeValuation';
import ValuationMove from './ValuationMove';
import BondTabLayout from '../components/BondTabLayout';
import { contentPadding } from '@/themes';

interface IAfterPriceProps {
  title: string;
  value: headerTabsCardKeys.AFTER;
}

const afterTabsOption = {
  [afterTabsKeys.CLOSE]: '收盘价格异动',
  [afterTabsKeys.RELATIVE]: '相对估值偏离',
  [afterTabsKeys.VALUATION]: '估值异动',
};

const AfterPrice: React.FC<IAfterPriceProps> = () => {
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
          defaultActiveKey: afterTabsKeys.CLOSE,
        }}
      >
        <ClosingPrice title={afterTabsOption.close} value={afterTabsKeys.CLOSE} />
        <ValuationMove title={afterTabsOption.valuation} value={afterTabsKeys.VALUATION} />
        <RelativeValuation title={afterTabsOption.relative} value={afterTabsKeys.RELATIVE} />
      </BondTabLayout>
    </ProCard>
  );
};

export default AfterPrice;
