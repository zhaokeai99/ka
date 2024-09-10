import { DualAxes } from '@ant-design/charts';
import ProCard from '@ant-design/pro-card';
import { Empty, Spin } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { EMPTY_DESC, queryFundNavRegClModelData } from '../../service';
import '../index.less';

type PropsType = {
  fundCode: string;
};

const ChooseAbility = (props: PropsType) => {
  const { fundCode } = props;
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await queryFundNavRegClModelData({ fundCodes: [fundCode] });
      setLoading(false);
      setData(result);
    })();
  }, [fundCode]);

  const config: any = {
    data: [data, data],
    xField: 'pTradeDate',
    yField: ['selectionValue', 'timingValue'],
    appendPadding: 10,
    style: {
      height: '100%',
      width: '100%',
    },
    geometryOptions: [
      {
        geometry: 'line',
        color: '#5B8FF9',
      },
      {
        geometry: 'line',
        color: '#5AD8A6',
      },
    ],
    meta: {
      pTradeDate: {
        formatter: (val: any) => moment(val).format('YYYY-MM-DD'),
      },
      selectionValue: {
        alias: '选股能力',
      },
      timingValue: {
        alias: '择时能力',
      },
    },
    legend: {
      position: 'bottom',
    },
  };

  return (
    <ProCard ghost bordered title="选股&择时能力" style={{ height: '100%' }}>
      <Spin tip="加载中..." spinning={loading}>
        <div className="chart-empty-style">
          {data.length ? <DualAxes {...config} /> : <Empty description={EMPTY_DESC} />}
        </div>
      </Spin>
    </ProCard>
  );
};

ChooseAbility.isProCard = true;

export default ChooseAbility;
