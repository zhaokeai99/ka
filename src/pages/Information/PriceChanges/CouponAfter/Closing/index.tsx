import React, { useState, useCallback } from 'react';
import ProCard from '@ant-design/pro-card';
import { CouponAfterTabsKeys } from '../data.d';
import ClosingDualChart from './ClosingDualChart';
import ClosingTable from './ClosingTable';
import ClosingColumnChart from './ClosingColumnChart';
import { cardGutter, contentPadding } from '@/themes';

interface IClosingPrice {
  title: string;
  value: CouponAfterTabsKeys.CLOSE;
}

/**
 * 收盘价格异动
 */
const Closing: React.FC<IClosingPrice> = () => {
  const [publicParams, setPublicParams] = useState<string>('');

  const onChangeParams = useCallback(
    (e) => {
      setPublicParams(e);
    },
    [publicParams],
  );

  return (
    <ProCard size="small" ghost direction="column" gutter={[cardGutter, cardGutter]}>
      <ProCard size="small" ghost style={{ padding: contentPadding }} layout="center">
        <ClosingDualChart params={publicParams} onChangeParams={onChangeParams} />
      </ProCard>
      <ProCard size="small" ghost style={{ padding: 0 }}>
        <ClosingColumnChart params={publicParams} />
      </ProCard>
      <ProCard size="small" ghost style={{ padding: contentPadding }}>
        <ClosingTable params={publicParams} />
      </ProCard>
    </ProCard>
  );
};
export default Closing;
