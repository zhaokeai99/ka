import { DualAxes } from '@ant-design/plots';
import { Empty } from 'antd';
import styles from './index.less';
// 转化为千万
const baseNumber = 0.0000001;
const metaConfig = {
  net: {
    nice: true,
    formatter: (value: any) => value.toFixed(2),
  },
  totalNet: {
    nice: true,
    formatter: (value: any) => value.toFixed(2),
  },
};

const yAxisConfig = {
  net: null,
  totalNet: false,
};

const config = {
  height: 350,
  xField: 'date',
  autoFit: true,
  yField: ['net', 'totalNet'],
  slider: {},
  meta: {
    net: {
      nice: true,
      formatter: (value: any) => {
        return (+value * baseNumber).toFixed(2);
      },
    },
    totalNet: {
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
      seriesField: 'name',
      columnWidthRatio: 0.4,
    },
    {
      geometry: 'line',
      seriesField: 'name',
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

export default function (props: { data: { barChartList: []; totalList: [] }; type: string }) {
  if (
    !Array.isArray(props && props.data && props.data.barChartList) ||
    !Array.isArray(props && props.data && props.data.totalList)
  )
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  if (props.data.barChartList.length === 0 && props.data.totalList.length === 0)
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return (
    <div className={styles['compare-container']}>
      {props?.type === 'funds' ? (
        <DualAxes {...(config as any)} data={[props.data.barChartList, props.data.totalList]} />
      ) : (
        <DualAxes
          {...config}
          data={[props.data.barChartList, props.data.totalList]}
          yAxis={yAxisConfig as any}
          meta={metaConfig}
        />
      )}
    </div>
  );
}
