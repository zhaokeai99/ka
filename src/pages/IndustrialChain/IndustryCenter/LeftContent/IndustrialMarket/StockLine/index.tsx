import { Mix } from '@antv/g2plot';
import { orderBy as _orderBy } from 'lodash';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { IndustryProvider, queryListChainTrendDailyData } from '../../../service';

const StockLine = () => {
  const { industryName } = useContext(IndustryProvider);
  const chartNodeRef = React.useRef();
  const chartRef = React.useRef<any>();
  const [stockData, setStockData] = useState([]);

  const queryStockList = async () => {
    const { data } = await queryListChainTrendDailyData({ industryName });
    setStockData(data);
  };

  useEffect(() => {
    queryStockList();
  }, []);

  const mixConfig: any = useMemo(() => {
    return {
      appendPadding: 15,
      tooltip: {
        shared: true,
        showCrosshairs: true,
      },
      syncViewPadding: true,
      slider: {
        start: 0.9,
        end: 1,
      },
      data: stockData,
      plots: [
        {
          type: 'stock',
          top: true,
          options: {
            xField: 'tm',
            yField: ['openPrice', 'endPrice', 'highestPrice', 'lowestPrice'],
            legend: false,
            fallingFill: '#48A366',
            risingFill: '#C74448',
            meta: {
              openPrice: { alias: '开盘价' },
              endPrice: { alias: '收盘价' },
              highestPrice: { alias: '最高价' },
              lowestPrice: { alias: '最低价' },
            },
          },
        },
        {
          type: 'line',
          top: true,
          options: {
            xField: 'tm',
            yField: 'ma5',
            // yAxis: false,
            yAxis: {
              min: 3100,
              label: null,
              grid: null,
              line: null,
            },
            color: '#FACC14',
            legend: false,
          },
        },
        {
          type: 'line',
          top: true,
          options: {
            xField: 'tm',
            yField: 'ma10',
            // yAxis: false,
            yAxis: {
              min: 3100,
              label: null,
              grid: null,
              line: null,
            },
            color: '#5FB1EE',
            legend: false,
          },
        },
        {
          type: 'line',
          top: true,
          options: {
            xField: 'tm',
            yField: 'ma20',
            // yAxis: false,
            yAxis: {
              min: 3100,
              label: null,
              grid: null,
              line: null,
            },
            color: '#7262fd',
            legend: false,
          },
        },
        {
          type: 'line',
          top: true,
          options: {
            xField: 'tm',
            yField: 'ma30',
            // yAxis: false,
            yAxis: {
              min: 3100,
              label: null,
              grid: null,
              line: null,
            },
            color: '#78D3F8',
            legend: false,
          },
        },
      ],
      annotations: [{ id: 'max' }, { id: 'min' }],
    };
  }, [stockData]);

  const handleLimitData = useCallback((data: any) => {
    if (!data?.length) return;
    const orderArr = _orderBy(data, ['high']);
    chartRef.current.removeAnnotations([{ id: 'max' }, { id: 'min' }]);
    chartRef.current.addAnnotations([
      {
        id: 'max',
        type: 'dataMarker',
        // 外部获取最大值的数据
        position: [
          orderArr[orderArr?.length - 1]['trade_date'],
          orderArr[orderArr?.length - 1]['high'],
        ],
        top: true,
        autoAdjust: false,
        direction: 'upward',
        text: {
          content: orderArr[orderArr?.length - 1]['high'],
          style: {
            fontSize: 13,
          },
        },
        line: {
          length: 12,
        },
      },
      {
        id: 'min',
        type: 'dataMarker',
        // 外部获取最大值的数据
        position: [orderArr[0]['trade_date'], orderArr[0]['low']],
        direction: 'downward',
        text: {
          content: orderArr[0]['low'],
          style: {
            fontSize: 12,
          },
        },
        autoAdjust: true,
        line: {
          length: 12,
        },
      },
    ]);
  }, []);

  useEffect(() => {
    const chartDom = chartNodeRef?.current;
    if (!chartDom) return;

    let plot: any = chartRef.current;
    if (!plot) {
      plot = new Mix(chartDom, mixConfig);
      plot.render();
      chartRef.current = plot;
    } else {
      plot.update(mixConfig);
      handleLimitData(plot.chart.filteredData);
    }
    plot.on('slider:mouseup', (val: any) => {
      handleLimitData(val.view.filteredData);
    });
  }, [mixConfig]);

  return <div id="container" style={{ height: '400px' }} ref={chartNodeRef as any} />;
};

export default StockLine;
