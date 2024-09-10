import { Pie } from '@ant-design/plots';
import React, { memo } from 'react';

const MyPie = ({ pieData }: any) => {
  const config = {
    appendPadding: 15,
    angleField: 'value',
    colorField: 'title',
    radius: 1,
    data: pieData,
    innerRadius: 0.7,
    style: {
      width: '80%',
      height: '300px',
    },
    label: {
      content: (val: any) => {
        return `${val.title}${Number(val.value).toLocaleString()}%`;
      },
    },
    legend: {
      layout: ' vertical',
      position: 'right',
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    tooltip: {
      formatter: (value: any) => {
        return {
          name: value.title,
          value: `${Number(value.value).toLocaleString()}%`,
        };
      },
    },
    statistic: {
      title: {
        offsetY: -4,
        customHtml: () => {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '26px' }}>
              <span style={{ fontSize: '18px' }}>总计</span>
            </div>
          );
        },
      },
      content: {
        offsetY: -4,
        customHtml: (_: any, _view: any, _datum: any, data: any) => {
          const amount = data.reduce((r: any, d: { value: any }) => r + d.value, 0);
          const total = Math.floor(amount * 100) / 100;
          return (
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '26px' }}>
              <span style={{ fontWeight: '500', fontSize: '28px' }}>
                {!!total ? Number(total).toLocaleString() : '--'}%
              </span>
            </div>
          );
        },
      },
    },
  };

  return <Pie {...config} />;
};

export default memo(MyPie);
