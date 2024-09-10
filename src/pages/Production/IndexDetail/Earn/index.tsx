import { memo, useState, useEffect } from 'react';
import { Empty } from 'antd';
import ProCard from '@ant-design/pro-card';
import { cardGutter } from '@/themes';
import moment from 'moment';
import { tableEmptyCellRender } from '@/utils/utils';
import TabTable from './TabTable';
import EarnLine from './EarnLine';
import { queryFundDailyMarketBaseDate } from '../service';
import { queryEarnFundAsset, queryFundAssetPullback } from './service';

const column1 = [
  {
    title: '日期',
    dataIndex: 'dateView',
    key: 'dateView',
  },
  {
    title: '单位净值',
    dataIndex: 'unitNav',
    key: 'unitNav',
  },
  {
    title: '累计净值',
    dataIndex: 'totalNav',
    key: 'totalNav',
  },
  {
    title: '日增长率',
    dataIndex: 'returnTodayView',
    key: 'returnTodayView',
  },
];

const column2 = [
  {
    title: '',
    dataIndex: '',
    key: '',
    render: () => '本基金',
  },
  {
    title: '1周',
    dataIndex: 'returnWeekView',
    key: 'returnWeekView',
  },
  {
    title: '1个月',
    dataIndex: 'returnMonthView',
    key: 'returnMonthView',
  },
  {
    title: '3个月',
    dataIndex: 'return3MonthView',
    key: 'return3MonthView',
  },
  {
    title: '6个月',
    dataIndex: 'return6MonthView',
    key: 'return6MonthView',
  },
  {
    title: '今年以来',
    dataIndex: 'returnNowYearView',
    key: 'returnNowYearView',
  },
  {
    title: '1年',
    dataIndex: 'return1YearView',
    key: 'return1YearView',
  },
  {
    title: '2年',
    dataIndex: 'return2YearView',
    key: 'return2YearView',
  },
  {
    title: '3年(年化)',
    dataIndex: 'return3YearView',
    key: 'return3YearView',
  },
  {
    title: '5年(年化)',
    dataIndex: 'return5YearView',
    key: 'return5YearView',
  },
];

function Earn({ fundId }: { fundId: string }) {
  const [activeTabKey, setActiveTabKey] = useState('tab1');
  const [baseDate, setBaseDate] = useState(null);

  useEffect(() => {
    (async () => {
      const date = await queryFundDailyMarketBaseDate({ fundId });
      setBaseDate(date);
    })();
  }, []);

  if (!baseDate) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return (
    <ProCard direction="column" gutter={[0, cardGutter]} size="small" bodyStyle={{ paddingTop: 0 }}>
      <ProCard
        tabs={{
          activeKey: activeTabKey,
          onChange: (tabKey) => setActiveTabKey(tabKey),
        }}
      >
        <ProCard.TabPane key="tab1" tab="最近10日历史数据" cardProps={{ bordered: true }}>
          <ProCard colSpan={12} style={{ maxHeight: '400px' }} layout="center">
            <TabTable
              endDate={baseDate}
              fundId={fundId}
              columns={tableEmptyCellRender(column1 as any)}
              sliceArray={[0, 5]}
            />
          </ProCard>
          <ProCard colSpan={12} style={{ maxHeight: '400px' }} layout="center">
            <TabTable
              startDate={moment(baseDate).day(-10).format('YYYY-MM-DD')}
              endDate={baseDate}
              fundId={fundId}
              columns={tableEmptyCellRender(column1 as any)}
              sliceArray={[5, 10]}
            />
          </ProCard>
        </ProCard.TabPane>
        <ProCard.TabPane key="tab2" tab="历史回报" cardProps={{ bordered: true }}>
          <TabTable
            startDate={baseDate}
            endDate={baseDate}
            fundId={fundId}
            columns={tableEmptyCellRender(column2 as any)}
            sliceArray={[0, 1]}
          />
        </ProCard.TabPane>
      </ProCard>
      <EarnLine
        xField="dateView"
        yField="returnToday"
        fundId={fundId}
        baseDate={baseDate}
        title="收益走势"
        fetch={queryEarnFundAsset}
      />
      <EarnLine
        xField="date"
        yField="pullback"
        fundId={fundId}
        baseDate={baseDate}
        title="动态回撤"
        fetch={queryFundAssetPullback}
      />
    </ProCard>
  );
}

export default memo(Earn);
