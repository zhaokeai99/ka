import { Column } from '@ant-design/plots';
import { Empty } from 'antd';
import moment from 'moment';
import ProCard from '@ant-design/pro-card';
import { useEffect, useState } from 'react';
import { DatePicker, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { dealNumThousandsAndFloat } from '@/utils/utils';
import styles from './index.less';

const { RangePicker } = DatePicker;

const config: any = {
  appendPadding: [10, 30, 0, 0],
  height: 350,
  maxColumnWidth: 24,
  xField: 'date',
  yField: 'percent',
  seriesField: 'holdType',
  isStack: true,
  legend: {
    position: 'bottom',
  },
  tooltip: {
    // formatter: (datum: any) => {
    //   const { holdType, percent } = datum;
    //   return { name: holdType === 'PERSON' ? '个人' : '机构', value: percent + '%' };
    // },
    customContent: (title: any, items: any): any => {
      return (
        <div style={{ padding: '12px 14px', fontSize: '12px' }}>
          <div>{title}</div>
          {items.map((item: any, index: number) => {
            return (
              <div key={index} className="g2-tooltip-list-item tooltip-line">
                <span className="g2-tooltip-marker" style={{ background: item.color }}></span>
                <span className="tooltip-cat">
                  {item.name}：{dealNumThousandsAndFloat(item.data.share, 2)}份&nbsp;&nbsp;
                  {item.data.percent}%
                </span>
              </div>
            );
          })}
        </div>
      );
    },
  },
  meta: {
    date: {
      formatter: (text: any) => moment(text).format('YYYY-MM-DD'),
    },
    holdType: {
      formatter: (text: any) => (text === 'PERSON' ? '个人' : '机构（含联接基金）'),
    },
    percent: {
      formatter: (text: any) => `${text}%`,
    },
  },
};

export default function ({ fundCode, baseDates, fetch = () => {} }: any) {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [lastQuaryDayValue, setLastQuaryDayValue] = useState(null); // 时间控件不可选控制

  useEffect(() => {
    (async () => {
      if (!baseDates) return;
      const { nearlyHalfYear, orgHoldDate }: any = baseDates;
      // @ts-ignore
      setStartDate(moment(nearlyHalfYear).format('YYYY-MM-DD'));
      // @ts-ignore
      setEndDate(moment(orgHoldDate).format('YYYY-MM-DD'));
      // @ts-ignore
      setLastQuaryDayValue(moment(orgHoldDate).format('YYYY-MM-DD'));
    })();
  }, [baseDates]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!baseDates || !startDate || !endDate) return;
      const result = await fetch({
        fundCodes: [fundCode],
        startDate: moment(startDate).format('YYYYMMDD'),
        endDate: moment(endDate).format('YYYYMMDD'),
        promo: 'Y',
      });
      setData(result);
      setLoading(false);
    })();
  }, [startDate, endDate]);

  return (
    <ProCard
      className={styles['share']}
      loading={loading}
      title={
        <>
          <span>持有人结构</span>
          <span style={{ fontSize: '12px' }}>(持有份额)</span>
          <Tooltip
            title={
              <span>
                基金份额维度数据（630及1231数据来源于定期报告，其他日期数据基于估值系统数据计算）
              </span>
            }
          >
            <QuestionCircleOutlined
              style={{ fontSize: '12px', color: '#999', marginLeft: '2px' }}
            />
          </Tooltip>
        </>
      }
      bodyStyle={{ padding: 0 }}
      headStyle={{ padding: 0 }}
      extra={
        <RangePicker
          disabledDate={(date) => {
            return date.isAfter(lastQuaryDayValue);
          }}
          value={[moment(startDate), moment(endDate)]}
          onChange={(dates: any) => {
            setStartDate(dates ? dates[0] : baseDates?.nearlyHalfYear);
            setEndDate(dates ? dates[1] : baseDates?.orgHoldDate);
          }}
        />
      }
    >
      {!Array.isArray(data) || data.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div>
          <Column {...config} data={data} />
        </div>
      )}
    </ProCard>
  );
}
