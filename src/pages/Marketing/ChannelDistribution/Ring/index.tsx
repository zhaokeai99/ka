import React, { useMemo, memo } from 'react';
import { Pie } from '@ant-design/charts';

const Ring = (props: any) => {
  const config: any = useMemo(
    () => ({
      style: {
        height: '250px',
      },
      appendPadding: 15,
      angleField: 'value',
      colorField: 'name',
      radius: 1,
      innerRadius: 0.6,
      label: {
        type: 'outer',
        content: (v: any) => Number(v.value).toLocaleString(),
      },
      tooltip: {
        formatter: (v: any) => {
          return {
            name: v.name,
            value: `${v.value}${props.unit}`,
          };
        },
      },
      statistic: {
        title: false,
        content: {
          style: {
            fontSize: '18px',
            fontWeight: 400,
          },
          customHtml: (_: any, _view: any, _datum: any, data: any) => {
            let amount = 0;
            if (props.conversion) {
              amount = data.reduce((r: any, d: any) => r + d.valueDetail, 0) / 100000000;
            } else {
              amount = data.reduce((r: any, d: any) => r + d.value, 0);
            }
            const total = Math.floor(amount * 100) / 100;
            return (
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '26px' }}>
                <span>{!!total ? Number(total).toLocaleString() : '--'}</span>
                <span>{`（${props.unit}）`}</span>
              </div>
            );
          },
        },
      },
      interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
      legend: {
        itemName: {
          formatter: (text: string, item: any, index: number) => {
            const currItem: any = props.data[index] || {};
            return `${currItem.name} ｜ ${currItem.proportion} |  ${currItem.value}`;
          },
        },
        offsetX: -12,
      },
    }),
    [props.data],
  );

  return <Pie {...config} data={props.data || []} />;
};

export default memo(Ring);
