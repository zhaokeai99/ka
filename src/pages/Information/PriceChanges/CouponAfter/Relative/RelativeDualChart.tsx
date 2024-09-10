import React, { useMemo, useCallback, useRef, memo, useEffect, useContext, useState } from 'react';
import { DualAxes, DualAxesConfig, G2, Plot, ChartRefConfig } from '@ant-design/plots';
import { Empty, Spin } from 'antd';
import { ICAProps, CouponAfterContext, COLORENUM, numberToT } from '../data.d';
import { getValOffsetChart, ICouponAfterChartType } from '../service';
import styles from '@/pages/Information/PriceChanges/CouponAfter/index.less';

const shapeName = 'relative-round';

interface IRelativeDualChartProps extends ICAProps<string> {}

const chartCricleColor = {
  收盘价: '#5B8FF9', //5B8FF9
  中债估值: '#5AD8A6', //5AD8A6
  相对偏离: '#5D7092',
};
/**
 * 相对估值偏离
 */
const RelativeDualChart: React.FC<IRelativeDualChartProps> = ({ params, onChangeParams }) => {
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
                },
                {
                  duration: 1800,
                  easing: 'easeLinear',
                  repeat: true,
                  cursor: 'pointer',
                },
              );
              decorator2.animate(
                {
                  r: 8,
                  opacity: 0,
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
      const { data } = await getValOffsetChart({ bondCode: bondCode });
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

    let rightData: any[] = [];
    const leftData: any[] = [];

    let isShowRightData = true;

    chartData?.forEach((item) => {
      if (item?.type?.includes('成交量')) {
        return;
      } else if (item?.type === '相对偏离') {
        if (item?.resultValue) {
          isShowRightData = false;
        }
        rightData.push({
          ...item,
          rightValue: item?.resultValue,
        });
      } else {
        leftData.push({
          ...item,
          leftValue: item?.resultValue,
        });
      }
    });

    if (isShowRightData) {
      rightData = [];
    }

    const config: DualAxesConfig & {
      geometryOptions: {
        [T in keyof DualAxesConfig['geometryOptions']]: any;
      }[];
    } = {
      data: [leftData, rightData], //TODO 先将成交量过滤掉
      xField: 'dateTime',
      yField: ['leftValue', 'rightValue'],
      padding: [20, 30, 100, 30],
      height: 450,
      geometryOptions: [
        {
          geometry: 'line',
          seriesField: 'type',
          point: {
            shape: shapeName,
            style: {
              cursor: 'pointer',
            },
          },
        },
        {
          geometry: 'line',
          seriesField: 'type',
          point: {
            shape: shapeName,
            style: {
              cursor: 'pointer',
            },
          },
        },
      ],
      yAxis: {
        leftValue: {
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
        rightValue: {
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
      tooltip: {
        shared: false,
        customContent: (title: string, items: any) => {
          if (items?.length !== 1) return null;
          const { data: item } = items[0];
          const filterData = chartData?.filter((v) => v?.dateTime === item?.dateTime) ?? [];
          const { dateTime } = item || {};
          return (
            <>
              <div className={styles['move-tooltip']}>
                <div className={styles['label-span']} style={{ marginBottom: '12px' }}>
                  {dateTime}
                </div>
                {filterData?.map((i) => {
                  const bgColor = chartCricleColor?.[i?.type] ?? '#fa8c16';
                  return (
                    <div key={i?.type} style={{ marginBottom: 10 }}>
                      <span className={styles['icon-span']} style={{ background: bgColor }}></span>
                      <span className={styles['label-span']}>{i?.type}：</span>
                      {i?.resultValue ?? '--'}
                    </div>
                  );
                })}
              </div>
            </>
          );
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
  }, [chartData, params]);

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

export default memo(RelativeDualChart);
