import React, { useMemo, useCallback, useRef, memo, useEffect, useContext, useState } from 'react';
import { DualAxes, DualAxesConfig, G2, Plot, ChartRefConfig } from '@ant-design/plots';
import { Empty, Spin } from 'antd';
import { ICAProps, COLORENUM, numberToT, StockDetailContext } from '../data.d';
import { getPerformanceChart } from '../service';
import styles from '@/pages/Information/PriceChanges/CouponAfter/index.less';

interface IMoveDualChartType {
  chartType: 'point' | 'line' | 'column'; //
  dateTime: string; //时间
  markPoint: boolean; //是否标记
  resultValue: number;
  type: string;
}

const shapeName = 'move-round';

interface IMoveDualChartProps extends ICAProps<string> {
  moveType: string[];
}

const rightChartDataKeys = [
  '相对中证500涨幅',
  '相对沪深300涨幅',
  '相对科创板指涨幅',
  '相对恒生指数涨幅',
  '相对恒生科技涨幅',
  '相对中信一级行业涨幅',
];

const chartLegendSelected = rightChartDataKeys?.reduce((pre: any, cur: any) => {
  pre[`${cur}`] = false;
  return pre;
}, {});
/**
 * 估值异动
 */
const MoveDualChart: React.FC<IMoveDualChartProps> = ({ params, moveType, onChangeParams }) => {
  const { code } = useContext(StockDetailContext);
  const chartRef: ChartRefConfig = useRef(undefined);
  const histroyPointRef = useRef<string | null>(null);
  const [leftChartData, setLeftChartData] = useState<IMoveDualChartType[]>([]);
  const [rightChartData, setRightChartData] = useState<IMoveDualChartType[]>([]);
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
          const pointData = item?.point ?? [];
          const moveTypeTarget = pointData?.reduce((pre: any, cur: IMoveDualChartType) => {
            // 取异动点类型包含的点
            if ((moveType || []).includes(cur?.type)) {
              pre.push(cur);
            }
            return pre;
          }, []);
          const isMultiple = moveTypeTarget?.length > 1 ? true : false;
          const isRender = moveTypeTarget?.length > 0 ? true : false;
          const circleColor = isMultiple ? COLORENUM.red7 : COLORENUM.orange;
          if (item?.isMove) {
            if (isRender) {
              if (item?.dateTime === target) {
                const decorator1 = group.addShape('circle', {
                  attrs: {
                    x: point.x,
                    y: point.y,
                    r: 8,
                    fill: circleColor,
                    opacity: 0.5,
                    cursor: 'pointer',
                  },
                });
                const decorator2 = group.addShape('circle', {
                  attrs: {
                    x: point.x,
                    y: point.y,
                    r: 8,
                    fill: circleColor,
                    opacity: 0.5,
                    cursor: 'pointer',
                  },
                });
                const decorator3 = group.addShape('circle', {
                  attrs: {
                    x: point.x,
                    y: point.y,
                    r: 8,
                    fill: circleColor,
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
                    fill: circleColor,
                    opacity: 0.7,
                    cursor: 'pointer',
                  },
                });
                group.addShape('circle', {
                  attrs: {
                    x: point.x,
                    y: point.y,
                    r: 0.5,
                    fill: circleColor,
                    cursor: 'pointer',
                  },
                });
              } else {
                group.addShape('circle', {
                  attrs: {
                    x: point.x,
                    y: point.y,
                    r: 4,
                    fill: circleColor,
                    opacity: 0.8,
                    cursor: 'pointer',
                  },
                });
              }
            }
          }
          return group;
        },
      });
    },
    [params, leftChartData, rightChartData, moveType],
  );

  /**
   * 重绘图表
   */
  useEffect(() => {
    renderShape(params);
    if (chartRef?.current?.render) {
      chartRef?.current?.render();
    }
  }, [params, leftChartData, rightChartData, moveType]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await getPerformanceChart({ code: code });
      const rightData: any[] = [];
      const leftData: any[] = [];
      const pointData = (data || [])?.filter((v: any) => {
        return v?.chartType === 'point';
      });
      const volumeData = (data || [])?.filter((v: any) => {
        return v?.type === '成交量';
      });
      const stocksRiseData = (data || [])?.filter((v: any) => {
        return v?.type === '股价涨跌幅';
      });
      data?.forEach((item: IMoveDualChartType) => {
        if (item?.type === '收盘价') {
          const volume = volumeData?.find((v: any) => v?.dateTime === item?.dateTime);
          const point = pointData?.filter((v: any) => v?.dateTime === item?.dateTime);
          const stocksRise = stocksRiseData?.find((v: any) => v?.dateTime === item?.dateTime);
          const isMove = point?.length > 0 ? true : false;
          rightData.push({
            ...item,
            rightValue: item?.resultValue,
            volume: volume?.resultValue ?? null,
            point: point ?? [],
            stocksRise: stocksRise?.resultValue ?? null,
            isMove: isMove,
          });
        } else if (rightChartDataKeys?.includes(item?.type)) {
          const volume = volumeData?.find((v: any) => v?.dateTime === item?.dateTime);
          const stocksRise = stocksRiseData?.find((v: any) => v?.dateTime === item?.dateTime);
          const point = pointData?.filter((v: any) => v?.dateTime === item?.dateTime);
          leftData.push({
            ...item,
            leftValue: item?.resultValue,
            volume: volume?.resultValue ?? null,
            stocksRise: stocksRise?.resultValue ?? null,
            point: point ?? [],
            isMove: false,
          });
        }
      });
      setLeftChartData(leftData);
      setRightChartData(rightData);
      setLoading(false);
    })();
  }, [code]);

  const onPointClick = useCallback(
    (cfg: any) => {
      if (cfg?.data?.shape === shapeName) {
        const data = cfg?.data?.data;
        if (data?.isMove) {
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
    [params, leftChartData, rightChartData, moveType],
  );

  const DualAxesChart: React.ReactNode = useMemo(() => {
    if (leftChartData?.length <= 0 && rightChartData?.length <= 0) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    const config: DualAxesConfig & {
      geometryOptions: {
        [T in keyof DualAxesConfig['geometryOptions']]: any;
      }[];
    } = {
      data: [leftChartData, rightChartData], //TODO 先将成交量过滤掉
      xField: 'dateTime',
      yField: ['leftValue', 'rightValue'],
      padding: [20, 30, 100, 30],
      height: 450,
      geometryOptions: [
        {
          geometry: 'line',
          seriesField: 'type',
        },
        {
          geometry: 'line',
          seriesField: 'type',
          color: '#FF9499',
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
        customContent: (title: string, items: any[]) => {
          if (!items || items?.length <= 0) return null;
          const { data: item } = items[0];
          const { dateTime, point, volume, stocksRise } = item || {};
          const renderPointInfo = (point || [])?.map((i: IMoveDualChartType) => {
            if (moveType?.includes(i?.type)) {
              return (
                <div key={i?.type} style={{ marginBottom: 10 }}>
                  <span
                    className={styles['icon-span']}
                    style={{ background: COLORENUM.red7 }}
                  ></span>
                  <span className={styles['label-span']}>{i?.type}</span>
                </div>
              );
            } else {
              return <></>;
            }
          });
          return (
            <div className={styles['move-tooltip']} key={'chart-tooltip'}>
              <div className={styles['label-span']} style={{ marginBottom: '12px' }}>
                {dateTime}
              </div>
              {items?.map((i, index) => {
                return (
                  <div key={index} style={{ marginBottom: 10 }}>
                    <span className={styles['icon-span']} style={{ background: i?.color }}></span>
                    <span className={styles['label-span']}>{i?.name}：</span>
                    {i?.value}
                  </div>
                );
              })}
              <div style={{ marginBottom: 10 }}>
                <span className={styles['icon-span']} style={{ background: '#a0d911' }}></span>
                <span className={styles['label-span']}>成交量：</span>
                {volume ?? '--'}
              </div>
              <div style={{ marginBottom: 10 }}>
                <span className={styles['icon-span']} style={{ background: '#13c2c2' }}></span>
                <span className={styles['label-span']}>股价涨跌幅：</span>
                {stocksRise ?? '--'}
              </div>
              {renderPointInfo}
            </div>
          );
        },
      },
      legend: {
        position: 'top-left',
        layout: 'horizontal',
        selected: chartLegendSelected,
        itemName: {
          style: {
            lineHeight: 30,
            fontSize: 11,
          },
        },
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
  }, [leftChartData, rightChartData, params, moveType]);

  return (
    <Spin spinning={loading} style={{ width: '100%' }}>
      <div
        style={{
          width: '100%',
          marginBottom: leftChartData?.length > 0 || rightChartData?.length > 0 ? '-100px' : '0px',
        }}
      >
        {DualAxesChart}
      </div>
    </Spin>
  );
};

export default memo(MoveDualChart);
