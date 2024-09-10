import * as echarts from 'echarts';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';

const FundRunChart: React.FC<{ listData?: any }> = ({ listData }) => {
  const ref = useRef(null);
  const [[amS, amE, pmS, pmE]] = useState([
    moment('2000-01-01 09:30:00').valueOf(),
    moment('2000-01-01 11:30:00').valueOf(),
    moment('2000-01-01 13:00:00').valueOf(),
    moment('2000-01-01 15:00:00').valueOf(),
  ]);

  // 按照时间进行排序 防止后端乱序
  const filterData = (datas) => {
    return datas.sort((a, b) => {
      if (a.businessTime > b.businessTime) {
        return 1;
      } else if (a.businessTime < b.businessTime) {
        return -1;
      }
      return 0;
    });
  };

  const getOption = () => {
    let min = 0.8; //当前实时数据，价格最低
    let max = 1.2; //当前实时数据，价格最高
    let junglePrice = 1; //开盘价
    const responseData = filterData(listData); //p,i,n
    if (responseData != undefined && responseData.length > 0) {
      //开盘价
      junglePrice = responseData[0].marketPrice;
      const maxlist = responseData.map((item) => {
        return Math.max(item.marketPrice, item.iopv, item.realNav);
      });
      const minList = responseData.map((item) => {
        return Math.min(item.marketPrice, item.iopv, item.realNav);
      });
      max = Math.max(...maxlist) + 0.001;
      min = Math.min(...minList) - 0.001;
    }

    const baseNumber = Math.max(Math.abs(max - junglePrice), Math.abs(min - junglePrice));
    const interval = (baseNumber / 2).toFixed(4); //用作y轴的坐标轴分割间隔的值

    const option = {
      color: ['#1890ff', '#52c41a', '#555555'],
      legend: {
        data: ['最新价', 'IOPV', '实时估值'],
        icon: 'rect',
        // top: 0,
      },
      animation: false,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          animation: false,
        },
        snap: true,
      },
      axisPointer: {
        link: { xAxisIndex: 'all' },
        label: {
          backgroundColor: '#777',
        },
      },
      grid: [
        {
          top: '8%',
          left: '5%',
          width: '45%',
          height: '80%',
        },
        {
          top: '8%',
          left: '50%',
          width: '45%',
          height: '80%',
        },
      ],
      xAxis: [
        {
          type: 'time',
          boundaryGap: true,
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#666',
            },
          },
          axisLabel: {
            formatter: (val) => {
              const timeStr = moment(val).format('HH:mm');
              return timeStr === '09:30' || timeStr === '10:30' ? timeStr : '';
            },
          },
          // 因为 "echarts": "^5.3.2",对时间处理是尽量取整点splitNumber只能设置为7 每15分钟一个刻度
          // splitNumber: 7,
          interval: 3600000,
          splitLine: {
            show: true,
            lineStyle: {
              color: '#888',
            },
          },
          splitArea: {
            areaStyle: {
              color: '#1f2025',
            },
          },
          min: amS,
          max: amE,
          axisTick: { show: false },
          axisPointer: {
            z: 100,
            label: {
              formatter: function (params) {
                return moment(params.value).format('HH:mm');
              },
            },
          },
        },
        {
          type: 'time',
          gridIndex: 1,
          boundaryGap: true,
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#666',
            },
          },

          axisLabel: {
            hideOverlap: false,
            formatter: function (val) {
              const timeStr = moment(val).format('HH:mm');
              if (timeStr === '13:00') {
                return '11:30/13:00';
              }
              return timeStr === '14:00' || timeStr === '15:00' ? timeStr : '';
            },
          },
          // 因为 "echarts": "^5.3.2",对时间处理是尽量取整点splitNumber只能设置为7 每15分钟一个刻度
          // splitNumber: 7,
          interval: 3600000,
          splitLine: {
            show: true,
            lineStyle: {
              color: '#888',
            },
          },
          splitArea: {
            areaStyle: {
              color: '#1f2025',
            },
          },
          min: pmS,
          max: pmE,
          axisTick: { show: false },
          axisPointer: {
            z: 100,
            label: {
              formatter: function (params) {
                return moment(params.value).format('HH:mm');
              },
            },
          },
        },
      ],
      yAxis: [
        {
          min: function () {
            return (parseFloat(junglePrice) - 2 * parseFloat(interval)).toFixed(4);
          },
          max: function () {
            return (parseFloat(junglePrice) + 2 * parseFloat(interval)).toFixed(4);
          },
          interval: Math.abs(interval),
          axisLabel: {
            formatter: function (val) {
              return val.toFixed(4);
            },
            color: function (value) {
              return value - junglePrice === 0
                ? '#333333'
                : value - junglePrice > 0
                ? 'red'
                : 'green';
            },
          },
          axisPointer: {
            show: true,
            label: {
              formatter: function (params) {
                return params.value.toFixed(4);
              },
            },
          },
        },
        {
          gridIndex: 1,
          position: 'right',
          min: function () {
            return (parseFloat(junglePrice) - 2 * parseFloat(interval)).toFixed(4);
          },
          max: function () {
            return (parseFloat(junglePrice) + 2 * parseFloat(interval)).toFixed(4);
          },
          interval: Math.abs(interval),
          axisLabel: {
            formatter: function (val) {
              return (((val - junglePrice) / junglePrice) * 100).toFixed(2) + '%';
            },
            color: function (value) {
              return value - junglePrice === 0
                ? '#333333'
                : value - junglePrice > 0
                ? 'red'
                : 'green';
            },
          },
          axisPointer: {
            show: true,
            label: {
              formatter: function (params) {
                return params.value.toFixed(4);
              },
            },
          },
        },
      ],
      series: [
        {
          name: '最新价',
          type: 'line',
          data: responseData.map((item) => {
            const date = '2000-01-01' + ' ' + item.businessTime;
            const dateNumber = moment(date).valueOf();
            return [dateNumber, item.marketPrice];
          }),
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 1,
          },
        },
        {
          name: '最新价',
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: responseData.map((item) => {
            const date = '2000-01-01' + ' ' + item.businessTime;
            const dateNumber = moment(date).valueOf();
            return [dateNumber, item.marketPrice];
          }),
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 1,
          },
        },
        {
          name: 'IOPV',
          type: 'line',
          data: responseData.map((item) => {
            const date = '2000-01-01' + ' ' + item.businessTime;
            const dateNumber = moment(date).valueOf();
            return [dateNumber, item.iopv];
          }),
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 1,
          },
        },
        {
          name: 'IOPV',
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: responseData.map((item) => {
            const date = '2000-01-01' + ' ' + item.businessTime;
            const dateNumber = moment(date).valueOf();
            return [dateNumber, item.iopv];
          }),
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 1,
          },
        },
        {
          name: '实时估值',
          type: 'line',
          data: responseData.map((item) => {
            const date = '2000-01-01' + ' ' + item.businessTime;
            const dateNumber = moment(date).valueOf();
            return [dateNumber, item.realNav];
          }),
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 1,
          },
        },
        {
          name: '实时估值',
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: responseData.map((item) => {
            const date = '2000-01-01' + ' ' + item.businessTime;
            const dateNumber = moment(date).valueOf();
            return [dateNumber, item.realNav];
          }),
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 1,
          },
        },
      ],
    };

    return option;
  };

  useEffect(() => {
    const myChart = echarts.init(ref.current as unknown as HTMLDivElement);
    const option = getOption();
    myChart.setOption(option);
  }, [listData]);

  return (
    <div className="examples">
      <div className="parent" style={{ height: '300px', width: '100%' }} ref={ref}>
        {/* <ReactEcharts option={getOption()} style={{ height: '300px', width: '100%' }} /> */}
      </div>
    </div>
  );
};

export default FundRunChart;
