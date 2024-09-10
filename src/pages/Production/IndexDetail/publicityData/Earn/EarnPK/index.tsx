import { memo, useState, useEffect } from 'react';
import { DatePicker, Radio, Table, Row, Col, message, Tag } from 'antd';
import { Line } from '@ant-design/charts';
import ProCardPlus from '@/components/ProCardPlus';
import { cardGutter } from '@/themes';
import moment from 'moment';
import { querySearchIndexInfo } from '../service';
import ProCard from '@ant-design/pro-card';
import BoothComponent from '@/components/boothComponent';
import DebounceSelect from '@/components/DebounceSelect';

const { RangePicker } = DatePicker;
const config = {
  height: 350,
  padding: 'auto',
  seriesField: 'category',
  meta: {
    navDate: {
      formatter: (value: any) => {
        return moment(value).format('YYYY-MM-DD');
      },
    },
  },
  tooltip: {
    formatter: (datum: any) => ({
      name: datum.category,
      value: datum?.incomeRate + '%',
    }),
  },
};

const columnsDefault = [
  {
    title: '名称',
    dataIndex: 'formDate',
    key: 'formDate',
  },
  {
    title: '基金业绩',
    dataIndex: 'incomeRateStr',
    key: 'incomeRateStr',
  },
];

function EarnPK({ fundCode, baseDates, fetch = () => {}, title, xField, yField }: any) {
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [lastQuaryDayValue, setLastQuaryDayValue] = useState(null); // 时间控件不可选控制
  const [freType, setFreType] = useState('Q');
  const [indexList, setIndexList] = useState([]);
  const [columns, setColumns] = useState(columnsDefault);

  async function fetchList(keyword: string): Promise<any[]> {
    return await querySearchIndexInfo({ keyword: keyword }).then((result: any) =>
      result.map(({ indexName, indexCode }: any) => {
        return {
          key: indexCode,
          value: indexCode,
          // label: indexName
          label: (
            <>
              {indexName}
              <Tag color="blue" style={{ marginLeft: '10px' }}>
                {indexCode}
              </Tag>
            </>
          ),
        };
      }),
    );
  }

  useEffect(() => {
    (async () => {
      if (!baseDates) return;
      const { lastQuaryDay, nearlyOneYear }: any = baseDates;
      // @ts-ignore
      setStartDate(moment(nearlyOneYear).format('YYYY-MM-DD'));
      // @ts-ignore
      setEndDate(moment(lastQuaryDay).format('YYYY-MM-DD'));
      // @ts-ignore
      setLastQuaryDayValue(moment(lastQuaryDay).format('YYYY-MM-DD'));
    })();
  }, [baseDates]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!baseDates || !startDate || !endDate) return;
      const result = await fetch({
        startDate: moment(startDate).format('YYYYMMDD'),
        endDate: moment(endDate).format('YYYYMMDD'),
        code: fundCode,
        freType,
        indexCodeNames: indexList.map((i: any) => {
          return {
            code: i.value,
            name: i.label.props.children[0],
          };
        }),
      });
      setLoading(false);
      const chartResult: [] = [];
      result.forEach((item: any) => {
        item.infos.forEach((i: any) => {
          chartResult.push({
            ...i,
            category: item.name,
          });
        });
      });
      setChartData(
        chartResult.sort((a: any, b: any) => {
          return a.navDate - b.navDate;
        }),
      );
      setColumns([
        {
          title: '名称',
          dataIndex: 'formDate',
          key: 'formDate',
        },
        ...result.map((item) => {
          return {
            title: item.name,
            dataIndex: item.name,
            key: item.name,
          };
        }),
      ]);
      setData(
        result[0]?.infos.map((item: any, index: number) => {
          const itemObj = {};
          result.forEach((i: any) => {
            itemObj[i.name] = i.infos[index].incomeRateStr;
          });
          return {
            navDate: item.navDate,
            incomeRate: item.incomeRate,
            formDate: item.formDate,
            ...itemObj,
          };
        }),
      );
    })();
  }, [indexList, freType, startDate, endDate]);

  return (
    <>
      <BoothComponent boothId="earnPK" />
      <ProCardPlus
        bordered
        title={<div style={{ width: '50px' }}>{title}</div>}
        loading={loading}
        wrap
        gutter={[cardGutter, cardGutter]}
        extra={
          <Row gutter={[8, 12]}>
            <Col>
              <span>PK指数选择：</span>
              <DebounceSelect
                value={indexList}
                onChange={(newValue) => {
                  if (newValue.length > 3) {
                    message.warn('最多3条基金进行对比！');
                    return;
                  }
                  setIndexList(newValue);
                }}
                showSearch
                placeholder="请输入关键字搜索"
                fetchOptions={fetchList}
                style={{ width: '370px' }}
                mode="multiple"
                size="middle"
              />
            </Col>
            <Col>
              <span>PK数据频率：</span>
              <Radio.Group
                defaultValue="Q"
                buttonStyle="solid"
                onChange={(e) => {
                  setFreType(e.target.value);
                }}
              >
                <Radio.Button value="Q">季度</Radio.Button>
                <Radio.Button value="H">半年</Radio.Button>
                <Radio.Button value="Y">年</Radio.Button>
              </Radio.Group>
            </Col>
            <Col>
              <RangePicker
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
        <ProCard bodyStyle={{ padding: 0 }} colSpan={24}>
          <div>
            <Line {...config} data={chartData} xField={xField} yField={yField} />
          </div>
        </ProCard>

        <ProCard bodyStyle={{ padding: 0 }} colSpan={24}>
          <Table
            loading={loading}
            columns={columns}
            dataSource={data}
            style={{ width: '100%', height: '100%' }}
            pagination={false}
            size="small"
          />
        </ProCard>
      </ProCardPlus>
    </>
  );
}

export default memo(EarnPK);
