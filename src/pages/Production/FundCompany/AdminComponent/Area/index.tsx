import { memo, useState, useEffect } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import { Area } from '@ant-design/plots';
import { Empty, DatePicker } from 'antd';
import { queryCompanyTrendData } from '../service';
import { dealNumThousandsAndFloat } from '@/utils/utils';
import moment from 'moment';

const { RangePicker }: any = DatePicker;

const areaFields = [
  'mfFundAmt',
  'activeEquityAmt',
  'unactiveEquityAmt',
  'fixedIncomePlusAmt',
  'fixedIncomeAmt',
  'fofAmt',
  'otherAmt',
];
const nameMap = {
  mfFundAmt: '货币基金规模',
  activeEquityAmt: '主动权益基金规模',
  unactiveEquityAmt: '被动权益基金规模',
  fixedIncomePlusAmt: '固收＋基金规模',
  fixedIncomeAmt: '固收基金规模',
  fofAmt: 'fof基金规模',
  otherAmt: '其他基金规模',
};

const config = {
  appendPadding: 10,
  height: 320,
  isGroup: true,
  xField: 'reportDate',
  yField: 'value',
  seriesField: 'type',
  isStack: false,
  yAxis: {
    // title: {
    //   text: '单位：元',
    //   position: 'end',
    // },
  },
  legend: {
    flipPage: false,
    position: 'bottom',
  },
  tooltip: {
    // formatter: (datum: any) => {
    //   const { type, value } = datum;
    //   return { name: type, value: (value * 100).toFixed(2) + '%' };
    // },
    customContent: (title: any, items: any): any => {
      return (
        <div style={{ padding: '12px 14px', fontSize: '12px' }}>
          <b>{title}</b>
          {items.map((item: any, index: number) => {
            return (
              <div key={index} className="g2-tooltip-list-item tooltip-line">
                <span className="g2-tooltip-marker" style={{ background: item.color }}></span>
                <span className="tooltip-cat">
                  {nameMap[item.data.type]}：{dealNumThousandsAndFloat(item.data.money, 2)}
                  万元&nbsp;&nbsp;&nbsp;
                  {item.data.percent}
                </span>
              </div>
            );
          })}
          <div>
            合计：
            {dealNumThousandsAndFloat(
              items.reduce((r: any, d: any) => r + d.data.money, 0),
              2,
            )}
            万元
          </div>
        </div>
      );
    },
  },
  meta: {
    reportDate: {
      formatter: (text: any) => moment(text).format('YYYY-MM-DD'),
    },
    type: {
      formatter: (text: any) => nameMap[text],
    },
    value: {
      formatter: (text: any) => `${(text * 100).toFixed(2)}%`,
    },
  },
};

const AreaChart = function ({ code, baseDates }: any) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [lastQuaryDayValue, setLastQuaryDayValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [areaData, setAreaData] = useState([]);

  useEffect(() => {
    (async () => {
      if (!baseDates?.lastQuaryDay) return;
      const { lastQuaryDay, nearlyTwoYear }: any = baseDates;
      // @ts-ignore
      setStartDate(moment(nearlyTwoYear).format('YYYY-MM-DD'));
      // @ts-ignore
      setEndDate(moment(lastQuaryDay).format('YYYY-MM-DD'));
      // @ts-ignore
      setLastQuaryDayValue(moment(lastQuaryDay).format('YYYY-MM-DD'));
    })();
  }, [baseDates]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!code || !startDate || !endDate) return;
      const params = {
        startDate: moment(startDate).format('YYYYMMDD'),
        endDate: moment(endDate).format('YYYYMMDD'),
        code,
      };
      const data = await queryCompanyTrendData(params);
      const areaResult: any = [];
      data.forEach((item: any) => {
        Object.keys(item).forEach((i: any) => {
          if (areaFields.includes(i)) {
            areaResult.push({
              reportDate: item['reportDate'],
              value: item[i],
              percent: item[`${i}Str`],
              money: item[`${i}Money`],
              type: i,
              totalPublicFundAmt: item['totalPublicFundAmt'],
            });
          }
        });
      });
      setAreaData(areaResult);
      setLoading(false);
    })();
  }, [startDate, endDate]);
  return (
    <ProCardPlus
      title="规模走势"
      loading={loading}
      extra={
        <RangePicker
          value={[moment(startDate), moment(endDate)]}
          disabledDate={(date: any) => {
            return date.isAfter(lastQuaryDayValue);
          }}
          onChange={(dates: any) => {
            setStartDate(dates ? dates[0] : baseDates?.nearlyTwoYear);
            setEndDate(dates ? dates[1] : baseDates?.lastQuaryDay);
          }}
        />
      }
    >
      <div style={{ zIndex: 2 }}>
        {Array.isArray(areaData) ? (
          <div>
            <Area {...config} data={areaData} />
          </div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </ProCardPlus>
  );
};

export default memo(AreaChart);
