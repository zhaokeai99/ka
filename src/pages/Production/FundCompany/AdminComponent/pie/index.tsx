import { Pie } from '@ant-design/charts';
import { Empty } from 'antd';
import { memo, useEffect, useState } from 'react';

// @ts-ignore
const pieConfig: any = {
  height: 280,
  angleField: 'value',
  colorField: 'name',
  radius: 0.7,
  innerRadius: 0.6,
  label: false,
  legend: {
    flipPage: false,
    position: 'bottom',
    layout: 'horizontal',
    itemSpacing: 0,
    itemName: {
      style: {
        fontSize: 10,
        width: 100,
      },
    },
  },
  interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  tooltip: {
    formatter: (datum: any) => {
      const { name, value } = datum;
      return { name: name, value: value.toFixed(2) + '%' };
    },
  },
  meta: {
    value: {
      formatter: (text: any) => `${text.toFixed(2)}%`,
    },
  },
};

const PieChart = function ({ data, per, title, lastQuaryDay }: any) {
  const [statistic, setStatistic] = useState({});
  useEffect(() => {
    setStatistic({
      title: {
        style: {
          fontSize: 12,
          fill: '#8c8c8c',
          textAlign: 'center',
          lineHeight: '20px',
        },
        content: title,
      },
      content: {
        style: {
          fontSize: 16,
          fill: '#000',
          textAlign: 'center',
          lineHeight: '20px',
        },
        customHtml: (_: any, _view: any, _datum: any, list: any) => {
          const amount = list.reduce((r: any, d: any) => r + d.scaleItem, 0);
          const _total = Math.floor(amount * 100) / 100;
          return (
            <>
              {/* <div>{data.total}</div> */}
              <div>{_total}</div>
              <div>{per}</div>
            </>
          );
        },
      },
    });
  }, [data]);
  if (data.list.length === 0) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return (
    <div>
      <Pie data={data.list} {...pieConfig} statistic={statistic} />
      <div style={{ position: 'absolute', right: 8, top: 40, fontSize: '12px' }}>
        截至{lastQuaryDay}
      </div>
    </div>
  );
};
export default memo(PieChart);
