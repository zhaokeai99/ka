import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { Empty, Select } from 'antd';
// import ProCard from '@ant-design/pro-card';
import ProCardPlus from '@/components/ProCardPlus';
import { Column } from '@ant-design/charts';
import { queryGroupByFundType } from '../service';

interface propsType {
  startDate: string;
  endDate: string;
  chartType: string;
}

//全市场报批注册产品
const ItemColumn = (props: propsType) => {
  const { startDate, endDate, chartType } = props;
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取全市场报批注册产品
  const getGroupByFundType = useCallback(async (paramsObj) => {
    setLoading(true);
    const result = await queryGroupByFundType(paramsObj);
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
    getGroupByFundType({ startDate, endDate, chartType });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, chartType]);

  const config: any = useMemo(() => {
    return {
      data: dataList,
      xField: 'name',
      yField: 'value',
      style: { width: '98%', height: '98%' },
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false,
        },
      },
      yAxis: {
        line: {},
        // grid: null
      },
      label: {
        position: 'top',
        offset: 4,
      },
    };
  }, [dataList]);

  return (
    <ProCardPlus
      loading={loading}
      size="small"
      title="全市场报批注册产品"
      layout="center"
      style={{ height: 300 }}
      extra={<Select size="small" style={{ visibility: 'hidden' }} />}
    >
      {dataList.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <Column {...config} />
      )}
    </ProCardPlus>
  );
};

export default memo(ItemColumn);
