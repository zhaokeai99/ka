import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { useParams } from 'umi';
import { Empty, Spin } from 'antd';
import ProCardPlus from '@/components/ProCardPlus';
import { DualAxes, DualAxesConfig } from '@ant-design/plots';
import { getVolChart, ICouponIntradayChartType } from '../service';
import { numberToT } from '../data.d';

// TODO
const BourseChart: React.FC & { isProCard: boolean } = () => {
  const pramas = useParams<{ id: string }>();

  const [chartData, setChartData] = useState<ICouponIntradayChartType[]>([]);
  const [loading, setLoading] = useState(false);

  const getChartData = useCallback(
    async (id?: string) => {
      setLoading(true);
      const { data } = await getVolChart({ bondCode: id });
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
      style: {
        height: 400,
      },
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
          autoHide: false,
          autoEllipsis: false,
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
    };

    return <DualAxes {...config} />;
  }, [chartData]);

  return (
    <ProCardPlus size="small" title="当日成交曲线-交易所">
      <Spin spinning={loading}>{DualAxesChart}</Spin>
    </ProCardPlus>
  );
};

BourseChart.isProCard = true;

export default BourseChart;
