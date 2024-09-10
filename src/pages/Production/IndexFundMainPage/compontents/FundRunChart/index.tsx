import React, { useEffect, useState, useCallback } from 'react';
import { Radio, Spin } from 'antd';
import { GUTTER_SIZE } from '@/utils/utils';
import ProCardPlus from '@/components/ProCardPlus';
import { queryAllEtfFunds, queryIndexFundEtfRealFaNav } from '../../service';
import styles from './index.less';
import Chart from './Chart';
import moment from 'moment';

let getChartDataTimer: NodeJS.Timeout;

const isBusinessTime = (time: string) => {
  const timeStr = moment('2000-01-01 ' + time).valueOf();
  const [amS, amE, pmS, pmE] = [
    moment('2000-01-01 09:30:00').valueOf(),
    moment('2000-01-01 11:30:00').valueOf(),
    moment('2000-01-01 13:00:00').valueOf(),
    moment('2000-01-01 15:00:00').valueOf(),
  ];
  return (timeStr >= amS && timeStr <= amE) || (timeStr >= pmS && timeStr <= pmE);
};

const FundRunChart: React.FC<{ fundType?: any }> = ({}) => {
  const [fundTypeList, setFundTypeList] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [etfFundCode, setEtfFundCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await queryAllEtfFunds({});
      if (data?.length >= 1) {
        const typeOptions = data.map((fund: { fundCode: string; fundName: string }) => ({
          value: fund.fundCode,
          label: fund.fundName,
        }));
        setFundTypeList(typeOptions);
        setEtfFundCode(typeOptions[0].value);
      }
    })();
    return () => {
      clearTimeout(getChartDataTimer);
    };
  }, []);

  const getChartData = useCallback(async () => {
    const data = await queryIndexFundEtfRealFaNav({ fundCode: etfFundCode });
    const dataLen = data?.length;
    clearTimeout(getChartDataTimer);
    if (dataLen >= 1) {
      setChartData(data);
      if (isBusinessTime(data[dataLen - 1]?.businessTime)) {
        getChartDataTimer = setTimeout(getChartData, 15 * 1000);
      }
    } else {
      setChartData([]);
    }
    setIsLoading(false);
  }, [etfFundCode]);

  useEffect(() => {
    // 重新选择ETF基金时 清除定时器 并显示loading
    setIsLoading(true);
    clearTimeout(getChartDataTimer);
    if (etfFundCode) {
      getChartData();
    }
  }, [etfFundCode]);

  return (
    <ProCardPlus
      direction="column"
      ghost
      colSpan="100%"
      style={{ marginTop: 8, background: '#fff' }}
      gutter={[0, GUTTER_SIZE]}
    >
      <ProCardPlus gutter={GUTTER_SIZE} style={{ padding: '0 12px', marginTop: 8 }} ghost>
        <div>
          <Radio.Group
            defaultValue=""
            buttonStyle="solid"
            optionType="button"
            className={styles['radio-group']}
            value={etfFundCode}
            options={fundTypeList}
            onChange={(val: any) => {
              setEtfFundCode(val.target.value);
            }}
          />
        </div>
      </ProCardPlus>
      <ProCardPlus
        style={{ padding: '0 12px' }}
        ghost
        bodyStyle={{ height: 310, position: 'relative' }}
      >
        <Chart listData={chartData} />
        {isLoading ? (
          <div className={styles['spin-container']}>
            <Spin size="large" />
          </div>
        ) : null}
      </ProCardPlus>
    </ProCardPlus>
  );
};

export default FundRunChart;
