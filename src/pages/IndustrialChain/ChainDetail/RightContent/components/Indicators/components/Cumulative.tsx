import React, { useEffect, useState } from 'react';
import { DualAxes } from '@ant-design/plots';
import { Empty } from 'antd';
import { numberToT } from '@/pages/IndustrialChain/Tracking/RightContent/util';
import { CumulativeProps } from '../service';

const Cumulative = ({ data }: CumulativeProps) => {
  const [column, setColumn] = useState<any[]>([]);
  const [broken, setBroken] = useState<any[]>([]);

  useEffect(() => {
    const columnData: any[] = [];
    const brokenData: any[] = [];

    data?.forEach((item: any) => {
      if (item?.indexType === '柱状') {
        columnData.push(item);
      } else if (item?.indexType === '折线') {
        brokenData.push(item);
      }
    });

    setColumn(columnData);
    setBroken(brokenData);
  }, [data]);

  const config = {
    data: [column, broken],
    limitInPlot: false,
    padding: [20, column?.length && broken?.length ? 25 : 15, 60, 25],
    autoFit: true,
    xField: 'tm',
    yField: ['numericalValue', 'numericalValue'],
    meta: {
      tm: {
        sync: false, // 开启之后 slider 无法重绘
      },
      numericalValue: {
        showLast: true,
        formatter: (value: number) => numberToT(value, 2, true),
      },
    },
    // 动态设置开始的位置
    slider: {
      start:
        data?.length > 10
          ? 1 - 3.1 * (10 / data?.length) > 0
            ? 1 - 3.1 * (10 / data?.length)
            : 0
          : 0,
      end: 1,
    },
    geometryOptions: [
      {
        geometry: 'column',
        isGroup: true,
        seriesField: 'indexName',
        columnWidthRatio: 0.4,
      },
      {
        geometry: 'line',
        seriesField: 'indexName',
      },
    ],
  };

  if (data?.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return <DualAxes {...(config as any)} style={{ height: '350px' }} />;
};

export default Cumulative;
