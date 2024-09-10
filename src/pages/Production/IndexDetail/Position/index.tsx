import { memo, useEffect, useState } from 'react';
import { Empty } from 'antd';
import ProCard from '@ant-design/pro-card';
import moment from 'moment';
import { valueTypeMap } from '@/utils/valueTypeMap';
import TableCard from './TableCard';
import { queryFundDailyMarketBaseDate } from '../service';
import { queryStockRange, queryBondRange, queryBondIndustry, queryStockIndustry } from './service';
import { cardGutter, contentPadding } from '@/themes';
import useAuth from '@/components/Hooks/useAuth';

const { FundMoney_6 } = valueTypeMap;

const columns1 = [
  {
    title: '代码',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '股票名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '市值(百万)',
    dataIndex: 'eval',
    key: 'eval',
    render: FundMoney_6.render,
  },
  {
    title: '占净资产',
    dataIndex: 'positionsRatioView',
    key: 'positionsRatioView',
  },
];

const columns2 = [
  {
    title: '代码',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '股票名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '市值(百万)',
    dataIndex: 'eval',
    key: 'eval',
    render: FundMoney_6.render,
  },
  {
    title: '占净资产',
    dataIndex: 'positionsRatioView',
    key: 'positionsRatioView',
  },
];

const columns3 = [
  {
    title: '行业编码',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '行业名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '市值(百万)',
    dataIndex: 'eval',
    key: 'eval',
    render: FundMoney_6.render,
  },
  {
    title: '占净资产',
    dataIndex: 'positionsRatioView',
    key: 'positionsRatioView',
  },
];

const columns4 = [
  {
    title: '编号',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '债券品种',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '市值(百万)',
    dataIndex: 'eval',
    key: 'eval',
    render: FundMoney_6.render,
  },
  {
    title: '占净资产',
    dataIndex: 'positionsRatioView',
    key: 'positionsRatioView',
  },
];

function Position({ fundId }: { fundId: string }) {
  const [baseDate, setBaseDate] = useState(null);
  const [webBaseDate] = useState(() => moment().subtract(3, 'month').format('YYYY-MM-DD'));
  const stockPositionTimer = useAuth({
    sn: '_production_index_detail__stockPosition___datePicker',
  });
  const bondPositionTimer = useAuth({ sn: '_production_index_detail__bondPosition___datePicker' });

  useEffect(() => {
    (async () => {
      const date = await queryFundDailyMarketBaseDate({ fundId });
      setBaseDate(date);
    })();
  }, []);

  if (!baseDate) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return (
    <ProCard style={{ padding: contentPadding }} direction="column" ghost gutter={[0, cardGutter]}>
      <ProCard gutter={[cardGutter, 0]} ghost>
        <TableCard
          column={columns1}
          baseDate={stockPositionTimer ? baseDate : webBaseDate}
          fetch={queryStockRange}
          params={{
            title: '十大股票持仓',
            fundId,
          }}
        />
        <TableCard
          column={columns2}
          baseDate={bondPositionTimer ? baseDate : webBaseDate}
          fetch={queryBondRange}
          params={{
            title: '五大债券持仓',
            fundId,
          }}
        />
      </ProCard>
      <ProCard gutter={[cardGutter, 0]} ghost>
        <TableCard
          column={columns3}
          baseDate={baseDate}
          fetch={queryStockIndustry}
          params={{
            title: '股票行业分布',
            stockIndustryType: 'sw',
            fundId,
          }}
        />
        <TableCard
          column={columns4}
          baseDate={baseDate}
          fetch={queryBondIndustry}
          params={{
            title: '债券品种分布',
            bondIndustryType: 'type',
            fundId,
          }}
        />
      </ProCard>
    </ProCard>
  );
}

export default memo(Position);
