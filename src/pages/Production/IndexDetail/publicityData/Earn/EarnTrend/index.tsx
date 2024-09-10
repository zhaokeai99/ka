import { useState, useEffect } from 'react';
import { DatePicker, Radio, Empty, Row, Col } from 'antd';
import { Line } from '@ant-design/charts';
import ProCardPlus from '@/components/ProCardPlus';
import moment from 'moment';
import BoothComponent from '@/components/boothComponent';
// import assetData from "../mock.json";

const { RangePicker } = DatePicker;

const config = {
  height: 350,
  appendPadding: [10, 20, 0, 0],
  tooltip: {
    formatter: (datum: any) => ({
      name: '收益率',
      value: datum?.incomeRate + '%',
    }),
  },
};

function EarnTrend({ fundCode, baseDates, fetch = () => {}, title, xField, yField }: any) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [lastQuaryDayValue, setLastQuaryDayValue] = useState(null); // 时间控件不可选控制
  const [showTypeMap, setShowTypeMap] = useState({
    // radio对应时间范围 [startDate, endDate]
    brt: [null, moment().format('YYYY-MM-DD')],
    bhy: [
      moment()
        .month(moment().month() - 6)
        .format('YYYY-MM-DD'),
      moment().format('YYYY-MM-DD'),
    ],
    b1y: [
      moment()
        .year(moment().year() - 1)
        .format('YYYY-MM-DD'),
      moment().format('YYYY-MM-DD'),
    ],
    b2y: [
      moment()
        .year(moment().year() - 2)
        .format('YYYY-MM-DD'),
      moment().format('YYYY-MM-DD'),
    ],
    b3y: [
      moment()
        .year(moment().year() - 3)
        .format('YYYY-MM-DD'),
      moment().format('YYYY-MM-DD'),
    ],
    b5y: [
      moment()
        .year(moment().year() - 5)
        .format('YYYY-MM-DD'),
      moment().format('YYYY-MM-DD'),
    ],
  });
  const [showType, setShowType] = useState('b1y');

  useEffect(() => {
    (async () => {
      if (!baseDates) return;
      const {
        lastQuaryDay,
        nearlyHalfYear,
        nearlyOneYear,
        nearlyTwoYear,
        nearlyThreeYear,
        nearlyFiveYear,
        foundDate,
      }: any = baseDates;
      // @ts-ignore
      setStartDate(moment(nearlyOneYear).format('YYYY-MM-DD'));
      // @ts-ignore
      setEndDate(moment(lastQuaryDay).format('YYYY-MM-DD'));
      // @ts-ignore
      setLastQuaryDayValue(moment(lastQuaryDay).format('YYYY-MM-DD'));
      setShowTypeMap({
        brt: [moment(foundDate).format('YYYY-MM-DD'), moment(lastQuaryDay).format('YYYY-MM-DD')],
        bhy: [
          moment(nearlyHalfYear).format('YYYY-MM-DD'),
          moment(lastQuaryDay).format('YYYY-MM-DD'),
        ],
        b1y: [
          moment(nearlyOneYear).format('YYYY-MM-DD'),
          moment(lastQuaryDay).format('YYYY-MM-DD'),
        ],
        b2y: [
          moment(nearlyTwoYear).format('YYYY-MM-DD'),
          moment(lastQuaryDay).format('YYYY-MM-DD'),
        ],
        b3y: [
          moment(nearlyThreeYear).format('YYYY-MM-DD'),
          moment(lastQuaryDay).format('YYYY-MM-DD'),
        ],
        b5y: [
          moment(nearlyFiveYear).format('YYYY-MM-DD'),
          moment(lastQuaryDay).format('YYYY-MM-DD'),
        ],
      });
    })();
  }, [baseDates]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!baseDates || !startDate || !endDate) return;
      const result = await fetch({
        code: fundCode,
        startDate: moment(startDate).format('YYYYMMDD'),
        endDate: moment(endDate).format('YYYYMMDD'),
      });
      setLoading(false);
      setData(result);
    })();
  }, [startDate, endDate]);

  return (
    <>
      <BoothComponent boothId="income_rate" />
      <ProCardPlus
        bordered
        title={title}
        loading={loading}
        extra={
          <Row gutter={[8, 12]}>
            <Col>
              <Radio.Group
                defaultValue="b1y"
                buttonStyle="solid"
                onChange={(e) => {
                  const currentShowType = e.target.value;
                  setShowType(currentShowType);
                  if (currentShowType) {
                    setStartDate(showTypeMap[currentShowType][0]);
                    setEndDate(showTypeMap[currentShowType][1]);
                  }
                }}
              >
                <Radio.Button value="brt">成立以来</Radio.Button>
                <Radio.Button value="bhy">近半年</Radio.Button>
                <Radio.Button value="b1y">近1年</Radio.Button>
                <Radio.Button value="b2y">近2年</Radio.Button>
                <Radio.Button value="b3y">近3年</Radio.Button>
                <Radio.Button value="b5y">近5年</Radio.Button>
                <Radio.Button value="">自定义</Radio.Button>
              </Radio.Group>
            </Col>
            <Col>
              <RangePicker
                disabled={showType}
                disabledDate={(date) => {
                  return date.isAfter(lastQuaryDayValue);
                }}
                value={[moment(startDate), moment(endDate)]}
                onChange={(dates: any) => {
                  setStartDate(dates ? dates[0] : baseDates?.nearlyOneYear);
                  setEndDate(dates ? dates[1] : baseDates?.lastQuaryDay);
                }}
              />
            </Col>
          </Row>
        }
      >
        <div>
          {data.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <Line {...config} data={data} xField={xField} yField={yField} />
          )}
        </div>
      </ProCardPlus>
    </>
  );
}

export default EarnTrend;
