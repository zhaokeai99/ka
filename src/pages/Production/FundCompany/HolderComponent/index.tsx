import ProCardPlus from '@/components/ProCardPlus';
import Total from './Total';
import { contentPadding } from '@/themes';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { DatePicker, Tooltip } from 'antd';
import { queryLastQuaryDay, queryCompanyHoldData } from './service';
import { useState, useEffect } from 'react';
import moment from 'moment';
const { RangePicker } = DatePicker;

export default function ({ code }: any) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [lastQuaryDayValue, setLastQuaryDayValue] = useState(null); // 时间控件不可选控制

  const [loading, setLoading] = useState(false);
  const [holderData, setHolderData] = useState({
    barChartList: [],
    totalList: [],
  });
  const [baseDates, setBaseDates] = useState(null);

  useEffect(() => {
    (async () => {
      const _QuaryDay = await queryLastQuaryDay();
      setBaseDates(_QuaryDay);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!baseDates) return;
      const { lastQuaryDay, nearlyOneYear }: any = baseDates;
      setStartDate(moment(nearlyOneYear).format('YYYY-MM-DD'));
      setEndDate(moment(lastQuaryDay).format('YYYY-MM-DD'));
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
      const data = await queryCompanyHoldData(params);
      setHolderData(data);
      setLoading(false);
    })();
  }, [startDate, endDate]);

  return (
    <ProCardPlus
      bodyStyle={{ padding: contentPadding }}
      loading={loading}
      title={
        <>
          <span>持有人结构</span>
          <span style={{ fontSize: '12px' }}>(持有份额)</span>
          <Tooltip title={<span>数据源来自基金产品定报并进行管理人汇总，含联接基金</span>}>
            <QuestionCircleOutlined
              style={{ fontSize: '12px', color: '#999', marginLeft: '2px' }}
            />
          </Tooltip>
        </>
      }
      extra={
        <RangePicker
          value={[moment(startDate), moment(endDate)]}
          disabledDate={(date) => {
            return date.isAfter(lastQuaryDayValue);
          }}
          onChange={(dates: any) => {
            setStartDate(dates ? dates[0] : baseDates?.nearlyOneYear);
            setEndDate(dates ? dates[1] : baseDates?.lastQuaryDay);
          }}
        />
      }
    >
      <Total data={holderData} />
    </ProCardPlus>
  );
}
