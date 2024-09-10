import React, { memo, useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { contentPadding, cardGutter } from '@/themes/index';
import ProCardPlus from '@/components/ProCardPlus';
import Circle from './Circle';
import Column from './Column';
import GroupColumn from './GroupColumn';
import DualAxes from './DualAxes';
import HolderList from './HolderList';
import { queryFundDailyMarketBaseDate } from '../service';
import { queryFundSalesHoldTop10 } from './service';
import { Empty } from 'antd';

function Asset({ fundId: fundId, fundCode: fundCode }: { fundId: any; fundCode: any }) {
  const [baseDate, setBaseDate] = useState(null);
  const [holderListData, setHolderListData] = useState([]);

  useEffect(() => {
    (async () => {
      const date = await queryFundDailyMarketBaseDate({ fundId });
      setBaseDate(date);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const result = await queryFundSalesHoldTop10({
        fundCode: fundCode,
      });
      setHolderListData(result);
    })();
  }, []);

  if (!baseDate) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return (
    <ProCard style={{ padding: contentPadding }} direction="column" ghost gutter={[0, cardGutter]}>
      <ProCard gutter={[cardGutter, 0]} ghost>
        <ProCardPlus
          colSpan={7}
          title="规模配置"
          style={{ height: '400px' }}
          bodyStyle={{ paddingTop: 0 }}
          layout="center"
          bordered
        >
          <Circle fundId={fundId} date={baseDate} />
        </ProCardPlus>
        <ProCardPlus
          colSpan={10}
          title="规模变动"
          style={{ height: '400px' }}
          bodyStyle={{ paddingTop: 0 }}
          layout="center"
          bordered
        >
          <Column fundId={fundId} date={baseDate} />
        </ProCardPlus>
        <ProCardPlus
          colSpan={7}
          title="机构持有人前十大"
          style={{ height: '400px' }}
          bodyStyle={{ padding: 0 }}
          layout="center"
          bordered
        >
          <HolderList data={holderListData} />
        </ProCardPlus>
      </ProCard>
      <ProCard gutter={[cardGutter, 0]} ghost>
        <ProCardPlus
          colSpan={12}
          title="持有人结构"
          style={{ height: '400px' }}
          bodyStyle={{ paddingTop: 0 }}
          layout="center"
          bordered
        >
          <GroupColumn fundId={fundId} date={baseDate} />
        </ProCardPlus>
        <ProCardPlus
          colSpan={12}
          title="资产配置"
          style={{ height: '400px' }}
          bodyStyle={{ paddingTop: 0 }}
          layout="center"
          bordered
        >
          <DualAxes fundId={fundId} date={baseDate} />
        </ProCardPlus>
      </ProCard>
    </ProCard>
  );
}

export default memo(Asset);
