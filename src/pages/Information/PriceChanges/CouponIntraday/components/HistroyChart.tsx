import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { useParams } from 'umi';
import { Empty, Spin } from 'antd';
import ProCardPlus from '@/components/ProCardPlus';
import { DualAxes, DualAxesConfig } from '@ant-design/plots';
import { getHistoryVolChart, ICouponIntradayChartType } from '../service';
import { numberToT } from '../data.d';

const HistroyChart: React.FC & { isProCard: boolean } = () => {
  const pramas = useParams<{ id: string }>();

  const [chartData, setChartData] = useState<ICouponIntradayChartType[]>([]);
  const [loading, setLoading] = useState(false);

  const getChartData = useCallback(
    async (id: string) => {
      setLoading(true);
      const { data } = await getHistoryVolChart({ bondCode: id });
      setChartData(data);
      setLoading(false);
    },
    [chartData],
  );

  useEffect(() => {
    const id = pramas?.id;
    if (!id) {
      return;
    }
    getChartData(id);
  }, [pramas]);

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
        },
      ],
      xAxis: {
        label: {
          autoRotate: true,
        },
      },
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
    };
    return <DualAxes {...config} />;
  }, [chartData]);

  return (
    <ProCardPlus size="small" title="成交历史趋势">
      <Spin spinning={loading}>
        <div
          style={{
            width: '100%',
            marginBottom: chartData?.length > 0 ? '-100px' : '0px',
          }}
        >
          {DualAxesChart}
        </div>
      </Spin>
    </ProCardPlus>
  );
};

HistroyChart.isProCard = true;

export default HistroyChart;
