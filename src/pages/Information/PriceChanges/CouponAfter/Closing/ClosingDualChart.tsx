import React, { useMemo, useCallback, useRef, memo, useEffect, useContext, useState } from 'react';
import { DualAxes, DualAxesConfig, G2, Plot, ChartRefConfig } from '@ant-design/plots';
import { Empty, Spin } from 'antd';
import { ICAProps, CouponAfterContext, COLORENUM, numberToT } from '../data.d';
import { getClosePriceChart, ICouponAfterChartType } from '../service';

const shapeName = 'close-round';

interface IClosingDualChartProps extends ICAProps<string | null> {}

/**
 * 收盘价格异动
 */
const ClosingDualChart: React.FC<IClosingDualChartProps> = ({ params, onChangeParams }) => {
  const { bondCode } = useContext(CouponAfterContext);
  const chartRef: ChartRefConfig = useRef(undefined);
  const histroyPointRef = useRef<string | null>(null);
  const [chartData, setChartData] = useState<ICouponAfterChartType[]>([]);
  const [loading, setLoading] = useState(false);

  const renderShape = useCallback(
    (target?: any) => {
      G2.registerShape('point', shapeName, {
        draw(config, container) {
          const item: any = config.data;
          const point = {
            x: config.x,
            y: config.y,
          };
          const group: any = container.addGroup();
          if (item?.markPoint) {
            if (item?.dateTime === target) {
              const decorator1 = group.addShape('circle', {
                attrs: {
                  x: point.x,
                  y: point.y,
                  r: 8,
                  fill: COLORENUM.red7,
                  opacity: 0.5,
                  cursor: 'pointer',
                },
              });
              const decorator2 = group.addShape('circle', {
                attrs: {
                  x: point.x,
                  y: point.y,
                  r: 8,
                  fill: COLORENUM.red7,
                  opacity: 0.5,
                  cursor: 'pointer',
                },
              });
              const decorator3 = group.addShape('circle', {
                attrs: {
                  x: point.x,
                  y: point.y,
                  r: 8,
                  fill: COLORENUM.red7,
                  opacity: 0.5,
                  cursor: 'pointer',
                },
              });
              decorator1.animate(
                {
                  r: 8,
                  opacity: 0,
                  cursor: 'pointer',
                },
                {
                  duration: 1800,
                  easing: 'easeLinear',
                  repeat: true,
                },
              );
              decorator2.animate(
                {
                  r: 8,
                  opacity: 0,
                  cursor: 'pointer',
                },
                {
                  duration: 1800,
                  easing: 'easeLinear',
                  repeat: true,
                  delay: 600,
                },
              );
              decorator3.animate(
                {
                  r: 8,
                  opacity: 0,
                  cursor: 'pointer',
                },
                {
                  duration: 1800,
                  easing: 'easeLinear',
                  repeat: true,
                  delay: 1200,
                },
              );
              group.addShape('circle', {
                attrs: {
                  x: point.x,
                  y: point.y,
                  r: 3,
                  fill: COLORENUM.red7,
                  opacity: 0.7,
                  cursor: 'pointer',
                },
              });
              group.addShape('circle', {
                attrs: {
                  x: point.x,
                  y: point.y,
                  r: 0.5,
                  fill: COLORENUM.red7,
                  cursor: 'pointer',
                },
              });
            } else {
              group.addShape('circle', {
                attrs: {
                  x: point.x,
                  y: point.y,
                  r: 4,
                  fill: COLORENUM.red7,
                  opacity: 0.8,
                  cursor: 'pointer',
                },
              });
            }
          }
          return group;
        },
      });
    },
    [params, chartData],
  );

  /**
   * 重绘图表
   */
  useEffect(() => {
    renderShape(params);
    if (chartRef?.current?.render) {
      chartRef?.current?.render();
    }
  }, [params]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await getClosePriceChart({ bondCode: bondCode });
      setChartData(data || []);
      setLoading(false);
    })();
  }, [bondCode]);

  const onPointClick = useCallback(
    (cfg: any) => {
      if (cfg?.data?.shape === shapeName) {
        const data = cfg?.data?.data;
        if (data?.markPoint) {
          if (histroyPointRef?.current === data?.dateTime) {
            histroyPointRef.current = null;
            onChangeParams('');
          } else {
            histroyPointRef.current = data?.dateTime;
            onChangeParams(data?.dateTime);
          }
        }
      }
    },
    [params],
  );

  const DualAxesChart: React.ReactNode = useMemo(() => {
    if (chartData?.length <= 0) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    const dlData = chartData?.reduce<any>(
      (pre, cur) => {
        if (cur.chartType == 'column') {
          pre.column.push(cur);
        } else if (cur.chartType == 'line') {
          pre.line.push(cur);
        } else if (cur.chartType == 'point') {
          pre.point.push(cur);
        }
        return pre;
      },
      {
        point: [],
        column: [],
        line: [],
      },
    );

    const config: DualAxesConfig & {
      geometryOptions: {
        [T in keyof DualAxesConfig['geometryOptions']]: any;
      }[];
    } = {
      data: [dlData?.column, dlData?.line],
      xField: 'dateTime',
      yField: ['resultValue', 'resultValue'],
      padding: [20, 30, 100, 30],
      height: 450,
      geometryOptions: [
        {
          geometry: 'column',
          seriesField: 'type',
          maxColumnWidth: 24,
        },
        {
          geometry: 'line',
          seriesField: 'type',
          point: {
            shape: shapeName,
          },
        },
      ],
      yAxis: {
        resultValue: {
          label: {
            formatter: (value: string) => {
              const numberValue = Number(value);
              if (Number.isNaN(numberValue) || numberValue === 0) {
                return value;
              } else {
                return numberToT(numberValue, 2, true);
              }
            },
          },
        },
      },
      legend: {
        position: 'top-left',
        layout: 'horizontal',
      },
      slider: {
        start: 0,
        end: 1,
      },
      chartRef: chartRef,
      onReady: (plot: Plot<any>) => {
        plot.on('element:click', onPointClick);
      },
    };
    return <DualAxes {...config} />;
  }, [chartData]);

  return (
    <Spin spinning={loading} style={{ width: '100%' }}>
      <div
        style={{
          width: '100%',
          marginBottom: chartData?.length > 0 ? '-100px' : '0px',
        }}
      >
        {DualAxesChart}
      </div>
    </Spin>
  );
};

export default memo(ClosingDualChart);
