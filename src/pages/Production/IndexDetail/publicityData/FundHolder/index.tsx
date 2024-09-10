import { useState, useEffect } from 'react';
import HolderList from './HolderList';
import Total from './Total';
import Income from './Income';
import ProCard from '@ant-design/pro-card';
import ProCardPlus from '@/components/ProCardPlus';
import { cardGutter, contentPadding } from '@/themes';
import './index.less';
import {
  queryLastQuaryDay,
  queryFundSalesHoldTop10,
  queryFundHoldPercent,
  queryFundShowIncomeInfos,
} from './service';

function FundHolder({ fundCode }: any) {
  const [baseDates, setBaseDates] = useState(null);

  useEffect(() => {
    (async () => {
      const _baseDates = await queryLastQuaryDay();
      setBaseDates(_baseDates);
    })();
  }, []);

  return (
    <ProCard gutter={[cardGutter, cardGutter]} style={{ padding: contentPadding }} ghost wrap>
      <ProCardPlus colSpan={12} style={{ height: '400px' }} bodyStyle={{ paddingTop: 0 }} bordered>
        <Total baseDates={baseDates} fetch={queryFundHoldPercent} fundCode={fundCode} />
      </ProCardPlus>
      <ProCardPlus colSpan={12} style={{ height: '400px' }} bodyStyle={{ paddingTop: 0 }} bordered>
        <HolderList baseDates={baseDates} fetch={queryFundSalesHoldTop10} fundCode={fundCode} />
      </ProCardPlus>
      <ProCard bordered>
        <Income baseDates={baseDates} fetch={queryFundShowIncomeInfos} fundCode={fundCode} />
      </ProCard>
    </ProCard>
  );
}

export default FundHolder;
