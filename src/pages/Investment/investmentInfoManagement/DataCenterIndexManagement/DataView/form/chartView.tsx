import React, { memo, useEffect, useImperativeHandle, useRef } from 'react';
import _ from 'lodash';
import * as echarts from 'echarts';

type PropsType = {
  clientHeight: number;
  tableData: any[];
  chartType: any;
  cRef: any;
  chartStyle: any;
};
/**
 * 图表显示
 * @param props
 * @constructor
 */
const StockChart = (props: PropsType) => {
  const { clientHeight, tableData, chartType, cRef, chartStyle } = props;
  const ref = useRef<any>(null);
  const myChartRef = useRef<any>(null);

  // 监听resize
  useEffect(() => {
    function onResize() {
      myChartRef.current = echarts.init(ref.current);
      myChartRef.current.resize();
    }

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);
  /**
   * 初始化
   */
  const initChart = (datas: any, styles: any) => {
    myChartRef.current = echarts.init(ref.current);
    if (datas && datas.attrData) {
      let frequency: any = undefined,
        unitLeft: any = undefined,
        unitRight: any = undefined;
      const legend = datas.attrData.map((n: any) => n.indexName);
      const yAxis: any = [],
        indexCodes: any = [],
        series: any = [];
      let unitLeftIndex = 0,
        unitRightIndex = 0;
      //yAxis
      datas.attrData.map((m: any) => {
        let showChart = false;
        if (frequency) {
          if (frequency !== m.frequency) {
            return undefined;
          }
        } else {
          frequency = m.frequency;
        }
        //yAxis
        {
          const obj: any = {
            type: 'value',
            splitLine: {
              show: styles?.gridline ? true : false,
            },
          };
          if (styles.unit) {
            obj.name = m.indexUnit;
          }
          if (chartType === 'area') {
            obj.stack = 'Total';
          } else {
            obj.scale = true;
          }

          if (!m.axisPosition || m.axisPosition === 'left') {
            if (!unitLeft) {
              obj.position = 'left';
              unitLeft = m.indexUnit;
              yAxis.push(obj);
              if (!unitLeftIndex && !unitRightIndex) {
                unitLeftIndex = 0;
                unitRightIndex = 1;
              }
            }
          } else if (m.axisPosition === 'right') {
            if (!unitRight) {
              obj.position = 'right';
              unitRight = m.indexUnit;
              yAxis.push(obj);
              if (!unitLeftIndex && !unitRightIndex) {
                unitLeftIndex = 1;
                unitRightIndex = 0;
              }
            }
          }
          if (unitLeft === m.indexUnit || unitRight === m.indexUnit) {
            indexCodes.push(m.indexCode);
            showChart = true;
          }
        }
        //series
        {
          if (!showChart) {
            return;
          }
          const obj: any = {
            name: m.indexName,
            color: m.chartColor,
            symbol: styles?.mark ? 'emptyCircle' : 'none',
            // yAxisIndex: i++,
          };
          if (styles?.mark) {
            obj.itemStyle = {
              normal: {
                label: {
                  show: true, //开启显示数值
                  position: 'top', //数值在上方显示
                },
              },
            };
          }
          if (chartType === 'custom') {
            if (m.chartType === 'smoothLine') {
              obj.type = 'line';
              obj.smooth = true;
            } else if (m.chartType === 'line') {
              obj.type = 'line';
              obj.smooth = false;
            } else if (m.chartType === 'column') {
              obj.type = 'bar';
              // obj.yAxisIndex = 1;
            } else if (m.chartType === 'area') {
              obj.type = 'line';
              obj.areaStyle = {};
            }
          } else if (chartType === 'line') {
            obj.type = 'line';
            obj.smooth = false;
          } else if (chartType === 'column') {
            obj.type = 'bar';
            // obj.yAxisIndex = 1;
          } else if (chartType === 'area') {
            obj.type = 'line';
            obj.areaStyle = {};
            obj.stack = 'Total';
          } else {
            obj.type = 'line';
            obj.smooth = true;
          }
          if (unitLeft === m.indexUnit) {
            obj.yAxisIndex = unitLeftIndex;
          } else if (unitRight === m.indexUnit) {
            obj.yAxisIndex = unitRightIndex;
          }
          series.push(obj);
        }
        return;
      });

      const xAxis = ['date', ...indexCodes];

      const targetDatas: any = [];
      datas.data.forEach((d: any) => {
        for (const key in d) {
          const i = _.indexOf(indexCodes, key);
          if (i >= 0) {
            for (const key2 in d) {
              if (d[key2] === null) {
                d[key2] = '-';
              }
            }
            targetDatas.push(d);
            return;
          }
        }
      });
      console.log('targetDatas', datas, targetDatas);
      const dataZoomStart =
        targetDatas.length === 0 || targetDatas.length < 80
          ? 0
          : parseInt(((1 - 60 / targetDatas.length) * 100).toString());

      const option = {
        dataset: {
          dimensions: xAxis,
          source: targetDatas,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
        },
        legend: { data: legend },
        xAxis: [
          {
            type: 'category',
          },
        ],
        yAxis: yAxis,
        series: series,
        dataZoom: [
          {
            type: 'inside',
            start: dataZoomStart,
            end: 100,
          },
          {
            show: true,
            type: 'slider',
            start: dataZoomStart,
            end: 100,
          },
        ],
      };
      if (myChartRef.current) {
        myChartRef.current.setOption(option, true);
      }
    }
  };

  useEffect(() => {
    initChart(tableData, chartStyle);
  }, [chartType, tableData, chartStyle]);

  //指定查询
  useImperativeHandle(cRef, () => ({
    exportPic: () => {
      myChartRef.current = echarts.init(ref.current);
      if (myChartRef.current) {
        const picInfo = myChartRef.current.getDataURL({
          type: 'png',
          pixelRatio: 2,
          backgroundColor: '#fff',
        });
        const aLink = document.createElement('a');
        aLink.download = '图表';
        aLink.style.display = 'none';
        aLink.href = picInfo;
        document.body.appendChild(aLink);
        aLink.click();
        URL.revokeObjectURL(aLink.href);
        document.body.removeChild(aLink);
      }
    },
  }));
  return (
    <div>
      <div ref={ref} style={{ width: '100%', height: clientHeight, display: 'flex' }}></div>
    </div>
  );
};

StockChart.isProCard = true;

export default memo(StockChart);
