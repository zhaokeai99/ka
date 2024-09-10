import React, { useMemo, useState, useEffect, useContext } from 'react';
import { Tag, Spin, Empty } from 'antd';
import styles from '../index.less';
import { Column, ColumnConfig } from '@ant-design/plots';
import ProCard from '@ant-design/pro-card';
import { ICAProps, CouponAfterContext, COLORENUM } from '../data.d';
import { getEventChart } from '../service';

interface IValuationColumnChart extends Omit<ICAProps<string>, 'onChangeParams'> {}
const ValuationColumnChart: React.FC<IValuationColumnChart> = ({ params }) => {
  const { bondCode } = useContext(CouponAfterContext);
  const [chartData, setChartData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await getEventChart({
        bondCode: bondCode,
        date: params,
        type: 'valChange',
      });
      setChartData(data);
      setLoading(false);
    })();
  }, [params, bondCode]);

  const columnConfig: ColumnConfig = useMemo(() => {
    return {
      data: chartData,
      xField: 'dateTime',
      yField: 'resultValue',
      isStack: true,
      seriesField: 'type',
      style: {
        height: 300,
      },
      maxColumnWidth: 32,
      legend: {
        position: 'top-left',
        layout: 'horizontal',
      },
    };
  }, [chartData]);

  const title = useMemo(() => {
    const titleNode: React.ReactNode[] = [
      <span className="pro-card-plus-title" key="closing-column-chart-title">
        异动分析
      </span>,
    ];
    if (params) {
      titleNode.push(
        <Tag
          key="closing-column-chart-params"
          color={COLORENUM.red7}
          className={styles['column-chart-tag']}
        >
          <span>{params}</span>
          <span style={{ margin: '0px 6px' }}>|</span>
          <span>异动风险</span>
        </Tag>,
      );
    }
    return <div className={styles['column-chart-title']}>{titleNode}</div>;
  }, [params]);

  return (
    <ProCard title={title} size="small" layout={'center'}>
      <Spin spinning={loading}>
        {chartData?.length > 0 ? (
          <Column {...columnConfig} />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Spin>
    </ProCard>
  );
};

export default ValuationColumnChart;
