import { Radar } from '@ant-design/charts';
import { Empty } from 'antd';

const config = {
  xField: 'name',
  yField: 'value',
  meta: {
    value: {
      alias: '数值',
      min: 0,
      max: 1,
      formatter: (v: any) => +Number(v).toFixed(2),
    },
  },
  label: {
    style: {
      fill: '#1890ff',
      opacity: 0.6,
      fontSize: 14,
    },
    rotate: true,
  },
  xAxis: {
    tickLine: null,
  },
  yAxis: {
    label: false,
    grid: {
      alternateColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  // 开启辅助点
  point: {
    size: 2,
  },
};

// 默认数据
const defaultData = [
  {
    name: '波动率',
    value: 0,
  },
  {
    name: '最大回撤',
    value: 0,
  },
  {
    name: '动量',
    value: 0,
  },
  {
    name: '趋势',
    value: 0,
  },
  {
    name: '风险',
    value: 0,
  },
];

export default function IndexRadar({ width = 400, height = 400, data = [], title = '' }) {
  if (!Array.isArray(data)) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return (
    <>
      {title && <span style={{ fontWeight: 'bold' }}>{title}</span>}
      <Radar
        style={{ height: height }}
        {...(config as any)}
        width={width}
        data={data.length ? data : defaultData}
      />
    </>
  );
}
