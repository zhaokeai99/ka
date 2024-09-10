import { Area } from '@ant-design/charts';
import ProCard from '@ant-design/pro-card';
import { Empty, Spin } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { EMPTY_DESC, queryFundNavRegStockPosData } from '../../service';
import '../index.less';

type PropsType = {
  fundCode: string;
};

const FundPositions = (props: PropsType) => {
  const { fundCode } = props;
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await queryFundNavRegStockPosData({ fundCodes: [fundCode] });
      setLoading(false);
      setData(result);
    })();
  }, [fundCode]);

  const config: any = {
    data,
    appendPadding: 10,
    style: {
      height: '100%',
      width: '100%',
    },
    xField: 'pTradeDate',
    yField: 'fundStockPos',
    meta: {
      pTradeDate: {
        formatter: (val: any) => moment(val).format('YYYY-MM-DD'),
      },
      fundStockPos: {
        alias: '股票仓位估算',
      },
    },
  };

  return (
    <ProCard ghost bordered title="基金仓位" style={{ height: '100%' }}>
      <Spin tip="加载中..." spinning={loading}>
        <div className="chart-empty-style">
          {data.length ? <Area {...config} /> : <Empty description={EMPTY_DESC} />}
        </div>
      </Spin>
    </ProCard>
  );
};

FundPositions.isProCard = true;

export default FundPositions;
