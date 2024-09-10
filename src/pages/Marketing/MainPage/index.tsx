import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useModel } from 'umi';
import { Select, Space, DatePicker, Empty, Radio, Tooltip } from 'antd';
import { Column } from '@ant-design/charts';
import CardContainer from './CardContainer';
import NonMonetary from './NonMonetary';
import moment from 'moment';
import { queryCorpIntervalAmt, queryProductOnSale } from './service';
import { dealNumThousands, GUTTER_SIZE } from '@/utils/utils';
import styles from './index.less';
import ProCardPlus from '@/components/ProCardPlus';
import { MyPieChart } from './MyPieChart';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function () {
  const [{ dateInfo }, { fetchDateInfo }] = useModel('useMarketingModel');
  const [fundType, setFundType] = useState('');
  const [rangeType, setRangeType] = useState<any>('date');
  const [rangeDate, setRangeDate] = useState<any>([
    moment().subtract(7, 'days'),
    moment().subtract(1, 'days'),
  ]);
  const [dateType, setDateType] = useState('1');
  const [yKeys, setYKeys] = useState('purchaseAmt');
  const [columnData, setColumnData] = useState([]);
  const [onSaleData, setOnSaleData] = useState([]);
  const dateFormat = {
    '1': 'YYYY-MM-DD',
    '3': 'YYYY-MM',
    '5': 'YYYY',
  };

  useEffect(() => {
    fetchDateInfo();
  }, []);

  useEffect(() => {
    (async () => {
      if (!rangeDate || rangeDate.length === 0) {
        setColumnData([]);
        return;
      }
      const { data } = await queryCorpIntervalAmt({
        dateDimension: dateType,
        startDate: rangeDate && rangeDate[0]?.format(dateFormat[dateType]),
        endDate: rangeDate && rangeDate[1]?.format(dateFormat[dateType]),
        ...(fundType ? { fundType } : {}),
      });
      setColumnData(data || []);
    })();
  }, [rangeDate, fundType]);

  // 在售产品数
  useEffect(() => {
    (async () => {
      const data = await queryProductOnSale();
      setOnSaleData(data?.fundTypeStatisticsVOList || []);
    })();
  }, []);

  // 根据类型筛选数据
  const handleData = useCallback(
    (data: any = []) => {
      if (fundType) {
        return data.filter((i: any) => i.typeCode === fundType);
      }
      return data;
    },
    [fundType],
  );

  const pieConfig: any = useMemo(
    () => ({
      data: handleData(onSaleData),
      appendPadding: 10,
      angleField: 'count',
      colorField: 'typeName',
      radius: 1,
      innerRadius: 0.64,
      height: 230,
      label: {
        type: 'inner',
        offset: '-50%',
        style: { textAlign: 'center' },
        autoRotate: false,
        content: '{value}',
      },
      tooltip: {
        formatter: (value: any) => {
          return { name: value.typeName, value: `${value.count}个` };
        },
      },
      interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
      statistic: {
        title: false,
        content: {
          style: {
            fontSize: '18px',
          },
          customHtml: (_: any, _view: any, _datum: any, data: any) => {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '26px' }}>
                <span>{data.reduce((r: any, d: any) => r + d.count, 0)}</span>
                <span>（个）</span>
              </div>
            );
          },
        },
      },
    }),
    [onSaleData, fundType],
  );

  const columnConfig = useMemo(() => {
    return {
      maxColumnWidth: 35,
      appendPadding: 10,
      xField: 'natureDate',
      yField: yKeys,
      style: {
        height: '230px',
      },
      meta: {
        purchaseAmt: {
          alias: '申购金额',
          formatter: (val: any) => `${Number(val).toLocaleString()}万`,
        },
        redeemAmt: {
          alias: '赎回金额',
          formatter: (val: any) => `${Number(val).toLocaleString()}万`,
        },
        netAmt: { alias: '净申购', formatter: (val: any) => `${Number(val).toLocaleString()}万` },
      },
      yAxis: {
        label: {
          formatter: (val: any) => dealNumThousands(val),
        },
      },
      color: (v: any) => {
        const negative = columnData.some((i: any) => i[yKeys] < 0 && v.natureDate === i.natureDate);
        if (negative) {
          return '#F4664A';
        }
        return '#5B8FF9';
      },
    };
  }, [yKeys, columnData]);

  const typeChange = useCallback((val: any) => {
    setDateType(val);
    let type = '';
    switch (val) {
      case '1':
        type = 'date';
        setRangeDate([moment().subtract(7, 'days'), moment().subtract(1, 'days')]);
        break;
      case '3':
        type = 'month';
        setRangeDate([moment().subtract(5, 'months'), moment().subtract(0, 'months')]);
        break;
      case '5':
        type = 'year';
        setRangeDate([moment().subtract(2, 'years'), moment().subtract(0, 'years')]);
        break;
      default:
        type = 'date';
        setRangeDate([moment().subtract(7, 'days'), moment().subtract(1, 'days')]);
        break;
    }
    setRangeType(type);
  }, []);

  const disabledDate = useCallback((current: any) => {
    return current && (current < moment('2020-01-01') || current > moment().subtract(1, 'days'));
  }, []);

  return (
    <ProCardPlus
      className="none-select"
      style={{ padding: '0 12px' }}
      ghost
      direction="column"
      gutter={[0, GUTTER_SIZE]}
      size="small"
      sn="_marketing_marketing_mainPage"
    >
      <div className={styles['header']}>
        <div>
          <span className={styles['title']}>销售监控大盘</span>
          <Radio.Group
            size="middle"
            defaultValue=""
            buttonStyle="solid"
            onChange={(val: any) => setFundType(val.target.value)}
          >
            <Radio.Button value="">全部类型</Radio.Button>
            <Radio.Button value="0">股票型</Radio.Button>
            <Radio.Button value="1">混合型</Radio.Button>
            <Radio.Button value="2">债券型</Radio.Button>
            <Radio.Button value="4">指数型</Radio.Button>
            <Radio.Button value="6">FOF型</Radio.Button>
            <Radio.Button value="7">ETF型</Radio.Button>
          </Radio.Group>
        </div>
        <span className={styles['deal-date']}>交易确认日期: {dateInfo?.dLastT1Day}</span>
      </div>
      <ProCardPlus ghost>
        <CardContainer fundType={fundType} />
      </ProCardPlus>
      <ProCardPlus ghost direction="row" gutter={[GUTTER_SIZE, GUTTER_SIZE]}>
        <ProCardPlus
          title="在售产品数"
          colSpan="32%"
          style={{ height: '320px' }}
          extra={
            <Tooltip
              placement="top"
              title="处在募集中和存续中状态的，并且属于天弘母公司发行的基金产品数"
            >
              <InfoCircleOutlined />
            </Tooltip>
          }
        >
          {!onSaleData || onSaleData.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <MyPieChart {...pieConfig} />
          )}
        </ProCardPlus>
        <ProCardPlus
          title="非货公募申赎趋势"
          colSpan="68%"
          style={{ height: '320px' }}
          direction="column"
          extra={
            <Tooltip placement="left" title="非货公募产品的累计申赎信息">
              <InfoCircleOutlined />
            </Tooltip>
          }
        >
          <Space style={{ width: '100%', justifyContent: 'flex-end', marginTop: '12px' }}>
            <label>类型：</label>
            <Select
              size="small"
              style={{ width: '150px' }}
              defaultValue="purchaseAmt"
              onChange={(val: any) => setYKeys(val)}
            >
              <Option value="purchaseAmt">申购金额</Option>
              <Option value="redeemAmt">赎回金额</Option>
              <Option value="netAmt">净申购</Option>
            </Select>
            <label>时间：</label>
            <Select size="small" style={{ width: '150px' }} defaultValue="1" onChange={typeChange}>
              <Option value="1">日</Option>
              <Option value="3">月</Option>
              <Option value="5">年</Option>
            </Select>
            <RangePicker
              size="small"
              value={rangeDate}
              picker={rangeType}
              onChange={(val: any) => setRangeDate(val)}
              disabledDate={disabledDate}
            />
          </Space>
          <ProCardPlus ghost>
            {!columnData || columnData.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <Column {...columnConfig} data={columnData} />
            )}
          </ProCardPlus>
        </ProCardPlus>
      </ProCardPlus>
      {dateInfo && (
        <ProCardPlus ghost>
          <NonMonetary fundType={fundType} />
        </ProCardPlus>
      )}
    </ProCardPlus>
  );
}
