import ProCardPlus from '@/components/ProCardPlus';
import { Column } from '@ant-design/plots';
import { Button, Empty, InputNumber, message, Select, Space, Spin } from 'antd';
import { map as _map } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { queryFundMarketRate, querySearchFundMarketCondition } from '../service';
import './index.less';

const { Option } = Select;

const FundMarketRate = ({ fundCodes, title }: any) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectData, setSelectData] = useState([]);
  const [ratioA, setRatioA] = useState(0.01);
  const [ratioB, setRatioB] = useState(0.99);
  const [indexA, setIndexA] = useState(null);
  const [indexB, setIndexB] = useState(null);

  const config: any = useMemo(
    () => ({
      data,
      isGroup: true,
      xField: 'rateType',
      yField: 'rate',
      legend: {
        position: 'top',
        itemHeight: 15,
        flipPage: false,
      },
      seriesField: 'fundName',
      maxColumnWidth: 40,
      style: { width: '100%', height: '98%' },
      yAxis: {
        title: {
          text: '大盘胜率',
          style: {
            fontSize: 14,
          },
        },
        label: {
          formatter: (text: number) => `${(text * 100).toFixed(2)}%`,
        },
      },
      tooltip: {
        formatter: ({ fundName, rate }: any) => {
          return { name: fundName, value: `${(rate * 100).toFixed(2) || 0}%` };
        },
      },
    }),
    [data],
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await querySearchFundMarketCondition();

      if (result.length) {
        const { pctChangeOneDay } = result[0];
        setIndexA(pctChangeOneDay);
        setIndexB(pctChangeOneDay);
        setSelectData(result);

        const list = await queryFundMarketRate({
          fundCodes: _map(fundCodes, 'code'),
          ratioA,
          ratioB,
          indexA: pctChangeOneDay,
          indexB: pctChangeOneDay,
        });

        setData(list || []);
      }

      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeSelect = (setValue: any, value: any) => {
    setValue(value);
  };

  const onChangeValue = (setValue: any, otherSetValue: any, value: any) => {
    setValue(value);
    otherSetValue(Number(1 - value).toFixed(2));
  };

  const onSearch = async () => {
    if (fundCodes.length && selectData.length && ratioA && ratioB && indexA && indexB) {
      if (ratioA + ratioB > 1) {
        message.warning('比较基准之和不能大于1！');
        return;
      }
      setLoading(true);
      const result = await queryFundMarketRate({
        fundCodes: _map(fundCodes, 'code'),
        ratioA,
        ratioB,
        indexA,
        indexB,
      });
      setLoading(false);
      setData(result || []);
    } else {
      setData([]);
    }
  };

  useEffect(() => {
    onSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fundCodes]);

  return (
    <ProCardPlus
      title={title}
      extra={
        <>
          {/* {extra} */}
          <Space>
            比较基准:
            <Select
              size="small"
              className="pk-fund-market-rate-select"
              value={indexA}
              onChange={(v) => onChangeSelect(setIndexA, v)}
            >
              {(selectData || []).map(({ indexName, indexCode, pctChangeOneDay }) => (
                <Option key={indexCode} value={pctChangeOneDay}>
                  {indexName}
                </Option>
              ))}
            </Select>
            <InputNumber
              size="small"
              className="pk-fund-market-rate-input"
              value={ratioA}
              onChange={(e) => onChangeValue(setRatioA, setRatioB, e)}
              max={1}
              min={0}
            />
            <Select
              size="small"
              className="pk-fund-market-rate-select"
              value={indexB}
              onChange={(v) => onChangeSelect(setIndexB, v)}
            >
              {(selectData || []).map(({ indexName, indexCode, pctChangeOneDay }) => (
                <Option key={indexCode} value={pctChangeOneDay}>
                  {indexName}
                </Option>
              ))}
            </Select>
            <InputNumber
              size="small"
              className="pk-fund-market-rate-input"
              value={ratioB}
              onChange={(e) => onChangeValue(setRatioB, setRatioA, e)}
              max={1}
              min={0}
            />
            <Button size="small" onClick={onSearch} type="primary">
              查询
            </Button>
          </Space>
        </>
      }
    >
      <Spin tip="加载中..." spinning={loading}>
        <div className="pk-fund-market-rate-container">
          {data.length ? <Column {...config} /> : <Empty />}
        </div>
      </Spin>
    </ProCardPlus>
  );
};

export default FundMarketRate;
