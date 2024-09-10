import React, { useState, useCallback } from 'react';
import ProCard from '@ant-design/pro-card';
import { CouponAfterTabsKeys } from '../data.d';
import RelativeDualChart from './RelativeDualChart';
import RelativeColumnChart from './RelativeColumnChart';
import RelativeTable from './RelativeTable';
import { cardGutter, contentPadding } from '@/themes';

interface IRelativePrice {
  title: string;
  value: CouponAfterTabsKeys.RELATIVE;
}

/**
 * 相对估值偏离
 */
const Relative: React.FC<IRelativePrice> = () => {
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
        <RelativeDualChart params={publicParams} onChangeParams={onChangeParams} />
      </ProCard>
      <ProCard size="small" ghost style={{ padding: 0 }}>
        <RelativeColumnChart params={publicParams} />
      </ProCard>
      <ProCard size="small" ghost style={{ padding: contentPadding }}>
        <RelativeTable params={publicParams} />
      </ProCard>
    </ProCard>
  );
};
export default Relative;
