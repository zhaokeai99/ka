import { DualAxes } from '@ant-design/plots';
import { Empty } from 'antd';

const config = {
  width: 200,
  height: 200,
  padding: 'auto',
  xField: 'axisX',
  yField: ['axisY1', 'axisY2'],
  legend: false,
  meta: {
    axisY1: {
      nice: true,
      formatter: (value: any) => value.toFixed(2) + '%',
    },
    axisY2: {
      nice: true,
    },
  },
};

export default function IndexLine({ data = [], beforeContent }: any) {
  return (
    <>
      {beforeContent}
      <div>
        {Array.isArray(data) && data.length ? (
          <DualAxes {...config} data={[data, data]} style={{ height: 200 }} />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </>
  );
}
