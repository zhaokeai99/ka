import { useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import { Line } from '@ant-design/charts';
import ProCardPlus from '@/components/ProCardPlus';
import moment from 'moment';

const { RangePicker } = DatePicker;

const config = {
  data: [],
  padding: 'auto',
  xField: 'dateView',
  yField: 'returnToday',
  xAxis: {
    tickCount: 5,
  },
  tooltip: {
    formatter: (datum) => ({
      name: '收益率',
      value: datum?.returnToday,
    }),
  },
  slider: {
    start: 0.8,
    end: 1,
  },
};

function EarnLine({ fundId, baseDate, fetch = () => {}, title, xField, yField }: any) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(moment(baseDate).day(-365).format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(baseDate);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await fetch({
        fundId,
        rangeType: 'day',
        startDate,
        endDate,
      });
      setLoading(false);
      setData(result);
    })();
  }, [startDate, endDate]);

  return (
    <ProCardPlus
      style={{ height: '350px' }}
      bordered
      title={title}
      loading={loading}
      extra={
        <RangePicker
          value={[moment(startDate), moment(endDate)]}
          onChange={(dates: any) => {
            setStartDate(dates[0]);
            setEndDate(dates[1]);
          }}
        />
      }
    >
      <Line {...config} data={data} xField={xField} yField={yField} />
    </ProCardPlus>
  );
}

EarnLine.isProCard = true;

export default EarnLine;
