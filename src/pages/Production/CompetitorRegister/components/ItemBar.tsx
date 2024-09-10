import React, { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { Empty, Select } from 'antd';
// import ProCard from '@ant-design/pro-card';
import ProCardPlus from '@/components/ProCardPlus';
import { Bar } from '@ant-design/charts';
import { queryNumGroupByManager } from '../service';

interface propsType {
  startDate: string;
  endDate: string;
  chartType: string;
}

//产品储备Top5
const ItemBar = (props: propsType) => {
  const { startDate, endDate, chartType } = props;
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取产品储备Top5
  const getNumGroupByManager = useCallback(async (paramsObj) => {
    setLoading(true);
    const result = await queryNumGroupByManager(paramsObj);
    setLoading(false);
    setDataList(() => {
      return Array.isArray(result)
        ? result.map((item) => {
            return {
              ...item,
              value: Number(item.value),
            };
          })
        : [];
    });
  }, []);

  useEffect(() => {
    getNumGroupByManager({
      startDate,
      endDate,
      chartType,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, chartType]);

  const config: any = useMemo(() => {
    return {
      data: dataList,
      xField: 'value',
      yField: 'name',
      appendPadding: [0, 10],
      style: { width: '98%', height: '98%' },
      label: {
        position: 'right',
        offset: 2,
      },
      xAxis: {
        line: {},
        // grid: null
      },
    };
  }, [dataList]);

  return (
    <ProCardPlus
      loading={loading}
      size="small"
      title="产品储备Top5"
      layout="center"
      style={{ height: 300 }}
      extra={<Select size="small" style={{ visibility: 'hidden' }} />}
    >
      {dataList.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : <Bar {...config} />}
    </ProCardPlus>
  );
};

export default memo(ItemBar);
