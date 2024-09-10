import React, { useState, useCallback } from 'react';
import ProCard from '@ant-design/pro-card';
import { CouponAfterTabsKeys } from '../data.d';
import ValuationTable from './ValuationTable';
import ValuationDualChart from './ValuationDualChart';
import ValuationColumnChart from './ValuationColumnChart';
import { cardGutter, contentPadding } from '@/themes';

interface IValuationPrice {
  title: string;
  value: CouponAfterTabsKeys.VALUATION;
}

/**
 * 估值异动
 */
const Valuation: React.FC<IValuationPrice> = () => {
  const [publicParams, setPublicParams] = useState<string>('');

  const onChangeParams = useCallback(
    (e) => {
      setPublicParams(e);
    },
    [publicParams],
  );
  return (
    <ProCard size="small" ghost direction="column" gutter={[cardGutter, cardGutter]}>
      <ProCard size="small" ghost style={{ padding: contentPadding }}>
        <ValuationDualChart params={publicParams} onChangeParams={onChangeParams} />
      </ProCard>
      <ProCard size="small" ghost style={{ padding: 0 }}>
        <ValuationColumnChart params={publicParams} />
      </ProCard>
      <ProCard size="small" ghost style={{ padding: contentPadding }}>
        <ValuationTable params={publicParams} />
      </ProCard>
    </ProCard>
  );
};
export default Valuation;
