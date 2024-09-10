import { Line } from '@ant-design/plots';
import { Empty } from 'antd';
// 转化为亿
const baseNumber = 0.00000001;

const config = {
  xField: 'dataDate',
  yField: 'sumNavAmt',
  seriesField: 'sectorName',
  autoFit: true,
  legend: {
    itemHeight: 20,
  },
  meta: {
    sumNavAmt: {
      nice: true,
      formatter: (value: any) => +value * baseNumber,
    },
  },
  yAxis: {
    title: {
      text: '单位：亿',
      position: 'end',
    },
  },
  tooltip: {
    formatter: (value: any) => {
      return { name: value.sectorName, value: `${(+value.sumNavAmt * baseNumber).toFixed(2)}亿` };
    },
  },
};

export default function IndexArea({ data = [] }: any) {
  if (!Array.isArray(data)) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  if (data.length === 0) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return <Line style={{ height: 300 }} data={data} {...(config as any)} />;
}
