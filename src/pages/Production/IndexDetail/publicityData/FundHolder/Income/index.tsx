import moment from 'moment';
import { DualAxes } from '@ant-design/plots';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { cardGutter } from '@/themes';
import { useState, useEffect } from 'react';
import { DatePicker, Radio, Empty, Table, Row, Col, Tooltip } from 'antd';
import { dealNumThousandsAndFloat, dealNumThousands } from '@/utils/utils';

const { RangePicker }: any = DatePicker;

const typeMap = {
  custCnt: '客户总数量',
  holdCustCnt: '持仓客户量',
  incomeCustCnt: '盈利客户数量',
};

const metaConfig = {
  value: {
    nice: true,
    formatter: (value: any) => (value * 0.0001).toFixed(2),
  },
  totalIncomeAmt: {
    nice: true,
    formatter: (value: any) => value,
  },
};

const yAxisConfig = {
  value: {
    title: {
      text: '单位：万人',
      position: 'end',
    },
  },
  totalIncomeAmt: {
    title: {
      text: '单位：万元',
      position: 'end',
    },
  },
};

const config = {
  height: 350,
  xField: 'showDate',
  yField: ['value', 'totalIncomeAmt'],
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
    formatter: (datum: any) => {
      const { type, value, totalIncomeAmt } = datum;
      return {
        name: type,
        value:
          type == '累计为客户赚取收益'
            ? `${dealNumThousandsAndFloat(totalIncomeAmt, 2)}万元`
            : `${(value * 0.0001).toFixed(2)}万人`,
      };
    },
  },
};

const columns = [
  {
    title: '名称',
    dataIndex: 'showDate',
    key: 'showDate',
  },
  {
    title: (
      <span>
        客户总数量
        <Tooltip title={<span>母基金维度数据，买过该产品的客户均纳入统计（基于TA数据计算）</span>}>
          <QuestionCircleOutlined style={{ fontSize: '12px', color: '#999', marginLeft: '2px' }} />
        </Tooltip>
      </span>
    ),
    dataIndex: 'custCntText',
    key: 'custCntText',
  },
  {
    title: (
      <span>
        持仓客户数量
        <Tooltip title={<span>母基金维度数据，持仓大于0的客户数（数据来源于定报）</span>}>
          <QuestionCircleOutlined style={{ fontSize: '12px', color: '#999', marginLeft: '2px' }} />
        </Tooltip>
      </span>
    ),
    dataIndex: 'holdCustCntText',
    key: 'holdCustCntText',
  },
  {
    title: (
      <span>
        盈利客户数量
        <Tooltip
          title={
            <span>
              母基金维度数据，公司自行计算得出(基于资产中心数据计算，暂不包括部分货基和ETF数据统计)
            </span>
          }
        >
          <QuestionCircleOutlined style={{ fontSize: '12px', color: '#999', marginLeft: '2px' }} />
        </Tooltip>
      </span>
    ),
    dataIndex: 'incomeCustCntText',
    key: 'incomeCustCntText',
    render: (_: any) => <>{_ != null ? _ : null}</>,
  },
  {
    title: (
      <span>
        持有人份额占比
        <Tooltip title={<span>母基金维度数据，其中机构数据含联接基金（数据来源于定报）</span>}>
          <QuestionCircleOutlined style={{ fontSize: '12px', color: '#999', marginLeft: '2px' }} />
        </Tooltip>
      </span>
    ),
    dataIndex: 'holdPercent',
    key: 'holdPercent',
    render: (_: any, item: any) => (
      <>
        <div>个人：{item.orgFundPersonHoldPercent}</div>
        <div>机构：{item.orgFundOrgHoldPercent}</div>
      </>
    ),
  },
  {
    title: (
      <span>
        累计为客户赚取收益(万元)
        <Tooltip title={<span>母基金维度数据</span>}>
          <QuestionCircleOutlined style={{ fontSize: '12px', color: '#999', marginLeft: '2px' }} />
        </Tooltip>
      </span>
    ),
    dataIndex: 'totalIncomeAmtText',
    key: 'totalIncomeAmtText',
  },
];

export default function ({ fundCode, baseDates, fetch = () => {} }: any) {
  const [loading, setLoading] = useState(false);
  const [showTypeMap, setShowTypeMap] = useState({
    // radio对应时间范围 [startDate, endDate]
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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showType, setShowType] = useState('bhy');
  const [lastQuaryDayValue, setLastQuaryDayValue] = useState(null); // 时间控件不可选控制
  const [freType, setFreType] = useState('H');
  const [incomeData, setIncomeData] = useState({
    newList: [],
    oldList: [],
    extInfo: {},
  });

  useEffect(() => {
    (async () => {
      if (!baseDates) return;
      const {
        nearlyHalfYear,
        nearlyOneYear,
        nearlyTwoYear,
        nearlyThreeYear,
        nearlyFiveYear,
        orgHoldDate,
      }: any = baseDates;
      // @ts-ignore
      setStartDate(moment(nearlyOneYear).format('YYYY-MM-DD'));
      // @ts-ignore
      setEndDate(moment(orgHoldDate).format('YYYY-MM-DD'));
      // @ts-ignore
      setLastQuaryDayValue(moment(orgHoldDate).format('YYYY-MM-DD'));
      setShowTypeMap({
        bhy: [
          moment(nearlyHalfYear).format('YYYY-MM-DD'),
          moment(orgHoldDate).format('YYYY-MM-DD'),
        ],
        b1y: [moment(nearlyOneYear).format('YYYY-MM-DD'), moment(orgHoldDate).format('YYYY-MM-DD')],
        b2y: [moment(nearlyTwoYear).format('YYYY-MM-DD'), moment(orgHoldDate).format('YYYY-MM-DD')],
        b3y: [
          moment(nearlyThreeYear).format('YYYY-MM-DD'),
          moment(orgHoldDate).format('YYYY-MM-DD'),
        ],
        b5y: [
          moment(nearlyFiveYear).format('YYYY-MM-DD'),
          moment(orgHoldDate).format('YYYY-MM-DD'),
        ],
      });
    })();
  }, [baseDates]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!baseDates || !startDate || !endDate) return;
      const _incomeData = await fetch({
        startDate: moment(startDate).format('YYYYMMDD'),
        endDate: moment(endDate).format('YYYYMMDD'),
        code: fundCode,
        freType: freType,
      });
      setLoading(false);
      const newList = (_incomeData?.newList || []).map((item: any) => {
        return {
          ...item,
          type: typeMap[item?.type],
        };
      });
      const oldList = (_incomeData?.oldList || []).map((item: any) => {
        return {
          ...item,
          type: '累计为客户赚取收益',
          totalIncomeAmtText: dealNumThousandsAndFloat(item.totalIncomeAmt, 2),
          incomeCustCntText: dealNumThousands(item.incomeCustCnt),
          holdCustCntText: dealNumThousands(item.holdCustCnt),
          custCntText: dealNumThousands(item.custCnt),
        };
      });
      setIncomeData({ ..._incomeData, newList, oldList });
    })();
  }, [startDate, endDate, freType]);

  return (
    <ProCard
      bodyStyle={{ padding: 0 }}
      loading={loading}
      extra={
        <Row gutter={[12, 12]}>
          <Col>
            <span>时间：</span>
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
              {/* <Radio.Button value="brt">成立以来</Radio.Button> */}
              <Radio.Button value="bhy">近半年</Radio.Button>
              <Radio.Button value="b1y">近1年</Radio.Button>
              <Radio.Button value="b2y">近2年</Radio.Button>
              <Radio.Button value="b3y">近3年</Radio.Button>
              <Radio.Button value="b5y">近5年</Radio.Button>
              <Radio.Button value="">自定义</Radio.Button>
            </Radio.Group>
            <RangePicker
              disabled={showType}
              disabledDate={(date) => {
                return date.isAfter(lastQuaryDayValue);
              }}
              value={[moment(startDate), moment(endDate)]}
              onChange={(dates: any) => {
                setStartDate(dates ? dates[0] : baseDates?.nearlyHalfYear);
                setEndDate(dates ? dates[1] : baseDates?.orgHoldDate);
              }}
            />
          </Col>
          <Col>
            <span>频率：</span>
            <Radio.Group
              defaultValue="H"
              buttonStyle="solid"
              onChange={(e) => {
                const currentFreType = e.target.value;
                console.log(currentFreType);
                setFreType(currentFreType);
              }}
            >
              {/* <Radio.Button value="Q">季度</Radio.Button> */}
              <Radio.Button value="H">半年</Radio.Button>
              <Radio.Button value="Y">年</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
      }
    >
      {!incomeData?.newList || incomeData.newList.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <ProCard bodyStyle={{ padding: 0 }} wrap gutter={[cardGutter, cardGutter]}>
          <ProCard bodyStyle={{ padding: 0 }} colSpan={24}>
            <div>
              <DualAxes
                {...config}
                data={[incomeData.newList, incomeData.oldList]}
                yAxis={yAxisConfig}
                meta={metaConfig}
              />
            </div>
          </ProCard>
          <ProCard bodyStyle={{ padding: 0 }} colSpan={24}>
            <Table
              loading={loading}
              columns={columns}
              dataSource={incomeData.oldList}
              style={{ width: '100%', height: '100%' }}
              pagination={false}
              size="small"
            />
            {fundCode.includes('000198') && <div>{incomeData.extInfo.desc}</div>}
          </ProCard>
        </ProCard>
      )}
    </ProCard>
  );
}
