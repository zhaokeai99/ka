import { Column } from '@ant-design/plots';
import { Empty } from 'antd';
import moment from 'moment';
import { dealNumThousandsAndFloat } from '@/utils/utils';

const config = {
  isGroup: true,
  xField: 'reportDate',
  yField: 'holdPercent',
  seriesField: 'type',
  meta: {
    reportDate: {
      formatter: (text: any) => moment(text).format('YYYY-MM-DD'),
    },
    type: {
      formatter: (text: any) => (text === 'person' ? '个人' : '机构(含联接基金)'),
    },
    holdPercent: {
      formatter: (text: any) => `${text}%`,
    },
  },
  yAxis: {},
  tooltip: {
    shared: true,
    showCrosshairs: true,
    showTitle: true,
    customContent: (title: any, items: any): any => {
      return (
        <div style={{ padding: '12px 14px', fontSize: '12px' }}>
          <div>{title}</div>
          {items.map((item: any, index: number) => {
            return (
              <div key={index} className="g2-tooltip-list-item tooltip-line">
                <span className="g2-tooltip-marker" style={{ background: item.color }}></span>
                <span className="tooltip-cat">
                  {item.name}：{dealNumThousandsAndFloat(item.data.shareCnt, 2)}份&nbsp;&nbsp;
                  {item.value}
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
  if (!Array.isArray(props && props.data) || props.data.length === 0)
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return (
    <div>
      <div style={{ zIndex: 2 }}>
        <div>
          <Column {...config} data={props.data} />
        </div>
      </div>
    </div>
  );
}
