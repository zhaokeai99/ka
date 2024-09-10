import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Empty, Spin } from 'antd';
import { DualAxes, G2 } from '@ant-design/plots';
import { numberToT } from '@/pages/IndustrialChain/Tracking/RightContent/util';
import { COLORENUM } from '@/pages/IndustrialChain/data.d';
import {
  ModelInfoProvider,
  queryAbnormalTrackIndex,
} from '@/pages/IndustrialChain/Tracking/service';
import styles from './index.less';

type pointType = {
  indicatorName: string;
  tm: string;
  abnormal: string;
};

const MoveCharts: React.FC = () => {
  const { search = {}, modelInfo = {} }: any = useContext(ModelInfoProvider);
  const [loading, setLoading] = useState<boolean>(false);
  const [moveData, setMoveData] = useState<any>([]);
  const [data, setData] = useState<any>([]);

  const getData = useCallback(async () => {
    const { abnormalDate, industryCode } = search;
    const { abnormalId, preAbnormalName } = modelInfo;

    if (abnormalId && preAbnormalName && abnormalDate && industryCode) {
      setLoading(true);

      const { data: list, success } = await queryAbnormalTrackIndex({
        abnormalDate,
        industryCode,
        abnormalId,
        abnormalName: preAbnormalName,
      });

      if (success) {
        if (list?.length === 1) {
          setData([...list, []]);
        } else if (list?.length === 2) {
          setData(list);
        } else {
          setData([]);
        }

        const result = list?.map((item: any[]) => {
          return item?.filter((iten) => iten.abnormal === '1');
        });

        setMoveData(result?.flat(Infinity));
      }

      setLoading(false);
    } else {
      setData([]);
    }
  }, [modelInfo]);

  useEffect(() => {
    getData();
  }, [modelInfo]);

  // 获取异动的点
  const getMovePoint = (value: pointType) => {
    if (value?.abnormal === '1') {
      return moveData?.findIndex((item: pointType) => {
        return item.indicatorName === value.indicatorName && item.tm === value.tm;
      });
    } else {
      return -1;
    }
  };

  useEffect(() => {
    if (moveData?.length) {
      G2.registerShape('point', 'breath-point', {
        draw(cfg, container) {
          const item: any = cfg.data;

          const point = {
            x: cfg.x,
            y: cfg.y,
          };

          const group: any = container.addGroup();

          if (getMovePoint(item) !== -1) {
            const decorator1 = group.addShape('circle', {
              attrs: {
                x: point.x,
                y: point.y,
                r: 5,
                fill: COLORENUM.red6,
                opacity: 0.5,
              },
            });

            const decorator2 = group.addShape('circle', {
              attrs: {
                x: point.x,
                y: point.y,
                r: 5,
                fill: COLORENUM.red6,
                opacity: 0.5,
              },
            });

            const decorator3 = group.addShape('circle', {
              attrs: {
                x: point.x,
                y: point.y,
                r: 5,
                fill: COLORENUM.red6,
                opacity: 0.5,
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
                fill: COLORENUM.red6,
                opacity: 0.7,
              },
            });

            group.addShape('circle', {
              attrs: {
                x: point.x,
                y: point.y,
                r: 0.5,
                fill: COLORENUM.red6,
              },
            });
          }

          return group;
        },
      });
    }
  }, [moveData]);

  const config = useMemo(() => {
    return {
      data: data,
      height: 450,
      limitInPlot: false,
      padding: [20, 30, 100, 30],
      autoFit: true,
      xField: 'tm',
      yField: ['numericalValue', 'numericalValue'],
      meta: {
        tm: {
          sync: false, // 开启之后 slider 无法重绘
          showLast: true,
        },
        numericalValue: {
          showLast: true,
          formatter: (value: number) => numberToT(value, 2, true),
        },
      },
      slider: {
        start: 0.7,
        end: 1,
      },
      xAxis: {
        label: {
          autoRotate: true,
        },
      },
      tooltip: {
        shared: false,
        customContent: (title: string, items: any) => {
          if (items?.length !== 1) return null;

          const { data: item, color } = items[0];
          const { tm, indicatorName, numericalValue, reason, abnormal, unit } = item || {};

          return (
            <div className={styles['move-tooltip']}>
              <div className={styles['label-span']} style={{ marginBottom: '10px' }}>
                {tm}
              </div>
              <div>
                <span className={styles['icon-span']} style={{ background: color }}></span>
                <span className={styles['label-span']}>{indicatorName}：</span>
                {numericalValue}
                {unit ? ` / ${unit}` : null}
              </div>
              <div style={{ display: 'flex' }}>
                {abnormal === '1' ? (
                  <div className={styles['label-span']} style={{ width: '100px' }}>
                    异动原因：
                  </div>
                ) : null}
                {abnormal === '1' ? (
                  <ul>
                    {reason?.split(';')?.map((val: string, index: number) => (
                      <li key={index}>{val}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          );
        },
      },
      geometryOptions: [
        {
          geometry: 'line',
          seriesField: 'indicatorName',
          color: ['#78d3f8', '#f6903d'],
          point: {
            shape: 'breath-point',
          },
          connectNulls: true,
        },
        {
          geometry: 'line',
          color: ['#f6903d', '#78d3f8'],
          seriesField: 'indicatorName',
          connectNulls: false,
        },
      ],
      legend: {
        maxItemWidth: 450,
      },
    };
  }, [data]);

  return (
    <Spin spinning={loading}>
      <div className={styles['move-charts']} style={{ marginBottom: data?.length ? '-90px' : '0' }}>
        {data?.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <DualAxes {...(config as any)} />
        )}
      </div>
    </Spin>
  );
};

export default MoveCharts;
