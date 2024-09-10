import { Column } from '@ant-design/plots';
import { Empty } from 'antd';
import styles from './index.less';
// 转化为千万
const baseNumber = 0.0000001;

const metaConfig = {
  value: {
    nice: true,
    formatter: (value: any) => {
      return (+value * baseNumber).toFixed(2);
    },
  },
};

const yAxisConfig = {
  title: {
    text: '单位：千万',
    position: 'end',
  },
};

const config = {
  height: 350,
  autoFit: true,
  isGroup: true,
  xField: 'date',
  yField: 'value',
  seriesField: 'name',
  meta: {},
  yAxis: {},
  slider: {
    start: 0,
    end: 1,
  },
  tooltip: {
    shared: true,
    showCrosshairs: true,
    showTitle: true,
    customContent: (title: any, items: any): any => {
      return (
        <div style={{ padding: '12px 14px', fontSize: '12px' }}>
          <b>{title} 我司总量走势</b>
          {items.map((item: any, index: number) => {
            return (
              <div key={index} className="g2-tooltip-list-item tooltip-line">
                <span className="g2-tooltip-marker" style={{ background: item.color }}></span>
                <span className="tooltip-cat">
                  {item.data.name}存量：
                  {item.data.isFunds
                    ? (+item.data.value * baseNumber).toFixed(2) + ' 千万 '
                    : item.data.value}
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
  if (!Array.isArray(props?.data)) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  if (props.data.length === 0) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return (
    <div className={styles['total-container']}>
      <Column
        {...config}
        data={props.data}
        meta={props.type === 'funds' ? metaConfig : null}
        yAxis={props.type === 'funds' ? yAxisConfig : null}
      />
    </div>
  );
}
