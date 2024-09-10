import React, { useMemo, useState, useCallback, memo, useEffect } from 'react';
import { Empty, Radio, RadioChangeEvent, Spin } from 'antd';
import { Column, ColumnConfig } from '@ant-design/charts';
import { contentPadding } from '@/themes';
import { queryStatChart } from './service';
import ProCardPlus from '@/components/ProCardPlus';
import { COLORINDUSTRYENUM } from '../IndustryContent/data.d';

enum RadioDateKeys {
  '24H' = '1',
  '7DAYS' = '7',
  '30DAYS' = '30',
  'HALFYEAR' = '180',
}

const defaultRadioValue = RadioDateKeys['7DAYS'];

const DateRadioOption = {
  [RadioDateKeys['24H']]: '24小时',
  [RadioDateKeys['7DAYS']]: '七天',
  [RadioDateKeys['30DAYS']]: '三十天',
  [RadioDateKeys['HALFYEAR']]: '近半年',
};

const chartColor = {
  利空: COLORINDUSTRYENUM['green5'],
  全部: COLORINDUSTRYENUM['blue'],
};

const ContrastMarket: React.FC & { isProCard: boolean } = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getChartData = useCallback(async (value) => {
    setLoading(true);
    setChartData([]);
    const { data, success } = await queryStatChart({
      days: value,
    });
    if (success) {
      setChartData(data);
    } else {
      setChartData([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getChartData(defaultRadioValue);
  }, []);

  const chartConfig: ColumnConfig = useMemo(() => {
    return {
      data: chartData || [],
      xField: 'industryName', //industryName
      yField: 'resultValue', //negativeCount
      isGroup: true,
      seriesField: 'publicSentiment',
      groupField: 'publicSentiment',
      style: {
        height: 350,
        width: '100%',
      },
      maxColumnWidth: 36,
      marginRatio: 0,
      color: (v) => chartColor?.[v.publicSentiment],
      xAxis: {
        label: {
          autoRotate: false,
          autoHide: false,
          formatter: (text: any) => {
            return Array.from(text)
              .map((item: any) => `${item}\n`)
              .join('');
          },
        },
      },
    };
  }, [chartData]);

  const onRadioChange = useCallback(async (e: RadioChangeEvent) => {
    getChartData(e.target.value);
  }, []);

  return (
    <Spin spinning={loading}>
      <ProCardPlus
        extra={
          <Radio.Group
            buttonStyle="solid"
            defaultValue={defaultRadioValue}
            onChange={onRadioChange}
            size="small"
          >
            {Object.keys(DateRadioOption).map((item) => {
              return (
                <Radio.Button value={item} key={item}>
                  {DateRadioOption[item]}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        }
        size="small"
        ghost
        bodyStyle={{
          paddingTop: contentPadding,
          paddingLeft: contentPadding,
          paddingRight: contentPadding,
          paddingBottom: 0,
          minHeight: 368,
        }}
        layout="center"
        title="行业舆情统计"
      >
        {chartConfig?.data?.length > 0 ? (
          <Column {...chartConfig} />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </ProCardPlus>
    </Spin>
  );
};

ContrastMarket.isProCard = true;

export default memo(ContrastMarket);
