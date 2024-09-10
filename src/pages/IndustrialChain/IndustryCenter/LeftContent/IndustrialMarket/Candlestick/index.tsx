import echarts from 'echarts';
import React, { memo, useContext, useEffect, useState } from 'react';
import { IndustryProvider, queryListChainTrendDailyData } from '../../../service';

const upColor = '#C74448';
const downColor = '#4AA869';

const Candlestick: React.FC = () => {
  const { industryName } = useContext(IndustryProvider);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    (async () => {
      const result = await queryListChainTrendDailyData({ industryName });
      setData(result);
    })();
  }, [industryName]);

  const initChart = () => {
    const element = document.getElementById(`container${industryName}`);
    const myChart = echarts.init(element as HTMLDivElement);
    const option: any = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: false,
      grid: {
        top: '5%',
        left: '5%',
        right: '5%',
        bottom: '15%',
      },
      xAxis: {
        type: 'category',
        data: data?.xData,
        boundaryGap: false,
        axisLine: {
          onZero: false,
          lineStyle: {
            color: '#6f7079',
          },
        },
        splitLine: { show: false },
        min: 'dataMin',
        max: 'dataMax',
      },
      yAxis: {
        axisTick: {
          show: false,
        },
        scale: true,
        axisLine: {
          show: false,
          lineStyle: {
            color: '#6f7079',
          },
        },
      },
      dataZoom: [
        {
          show: true,
          type: 'slider',
          start: 90,
          end: 100,
        },
      ],
      series: [
        {
          name: '日K',
          type: 'candlestick',
          data: data?.kData,
          itemStyle: {
            color: upColor,
            color0: downColor,
            borderColor: upColor,
            borderColor0: downColor,
          },
          markPoint: {
            label: {
              formatter: function (param: any) {
                return param != null ? Math.round(param.value) + '' : '';
              },
            },
            data: [
              {
                name: '最大值',
                type: 'max',
                valueDim: 'highest',
              },
              {
                name: '最小值',
                type: 'min',
                valueDim: 'lowest',
              },
            ],
          },
        },
        {
          name: 'MA5',
          type: 'line',
          data: data?.ma5,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            opacity: 0.7,
          },
          color: '#9a60b4',
        },
        {
          name: 'MA10',
          type: 'line',
          data: data?.ma10,
          showSymbol: false,
          smooth: true,
          lineStyle: {
            opacity: 0.7,
          },
          color: '#fc8452',
        },
        {
          name: 'MA20',
          type: 'line',
          data: data?.ma20,
          showSymbol: false,
          smooth: true,
          lineStyle: {
            opacity: 0.7,
          },
          color: '#73c0de',
        },
        {
          name: 'MA30',
          type: 'line',
          data: data?.ma30,
          showSymbol: false,
          smooth: true,
          lineStyle: {
            opacity: 0.7,
          },
          color: '#5470c6',
        },
      ],
    };
    myChart.setOption(option);
  };

  useEffect(() => {
    initChart();
  }, [data]);

  return <div id={`container${industryName}`} style={{ height: '400px' }}></div>;
};

export default memo(Candlestick);
