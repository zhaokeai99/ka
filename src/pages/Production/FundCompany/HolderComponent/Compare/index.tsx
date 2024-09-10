import { DualAxes } from '@ant-design/plots';
import { Empty } from 'antd';

const config = {
  height: 350,
  xField: 'reportDate',
  yField: ['holdPercent', 'shareCnt'],
  meta: {
    net: {
      nice: true,
      formatter: (value: any) => {
        return (+value * baseNumber).toFixed(2);
      },
    },
    aaa: {
      nice: true,
      formatter: (value: any) => {
        return (+value * baseNumber).toFixed(2);
      },
    },
  },
  yAxis: {
    net: {
      title: {
        text: '单位：千万',
        position: 'end',
      },
    },
    totalNet: false,
  },
  geometryOptions: [
    {
      geometry: 'column',
      isGroup: true,
      seriesField: 'type',
      columnWidthRatio: 0.4,
    },
    {
      geometry: 'line',
      seriesField: 'type',
      lineStyle: () => {
        return {
          opacity: 0.5,
        };
      },
    },
  ],
  tooltip: {
    shared: true,
    showCrosshairs: true,
    showTitle: true,
    customContent: (title: any, items: any): any => {
      return (
        <div style={{ padding: '12px 14px', fontSize: '12px' }}>
          <b>{title} 我司季度环比走势</b>
          {items.map((item: any, index: number) => {
            return (
              <div key={index} className="g2-tooltip-list-item tooltip-line">
                <span className="g2-tooltip-marker" style={{ background: item.color }}></span>
                <span className="tooltip-cat">
                  {item.data.name}净增：
                  {item.data.isFunds
                    ? (+item.data.totalNet * baseNumber).toFixed(2) + ' 千万 '
                    : item.data.totalNet}
                </span>
                <span className="tooltip-cat" style={{ float: 'right', marginLeft: '20px' }}>
                  增速：{(item.data.growth * 100).toFixed(2) + '%'}
                </span>
              </div>
            );
          })}
        </div>
      );
    },
  },
};

export default function (props: { data: []; type: string }) {
  console.log(props.data);
  if (!Array.isArray(props && props.data) || props.data.length === 0)
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return (
    <div>
      <div style={{ zIndex: 2 }}>
        <div>
          <DualAxes {...config} data={[props.data, props.data]} />
        </div>
      </div>
    </div>
  );
}
