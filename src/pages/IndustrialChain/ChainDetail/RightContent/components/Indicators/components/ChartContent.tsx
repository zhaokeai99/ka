import React, { useState, useContext, useEffect, memo } from 'react';
import ProCard from '@ant-design/pro-card';
import { WarningFilled } from '@ant-design/icons';
import { Empty, Spin } from 'antd';
import Cumulative from './Cumulative';
import { cardGutter } from '@/themes';
import {
  queryChainNodeEdbData,
  SelectKeyProvider,
  TabProvider,
} from '@/pages/IndustrialChain/ChainDetail/service';
import { COLORENUM } from '@/pages/IndustrialChain/data.d';
import styles from '../index.less';

const ChartContent = () => {
  const { selectKey = {} }: any = useContext(SelectKeyProvider);
  const { tab } = useContext(TabProvider);
  const [chartList, setChartList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 获取图表数据
  const getData = async () => {
    setLoading(true);

    const result = selectKey?.nodeId
      ? await queryChainNodeEdbData({
          nodeId: selectKey?.nodeId,
        })
      : [];

    const res = result?.map((item: any) => {
      return {
        data: item,
        title: item[0]?.tableTitle,
        abnormalSignal: item[0]?.abnormalSignal,
      };
    });

    setLoading(false);
    setChartList(res || []);
  };

  useEffect(() => {
    if (tab === 'indicators') {
      getData();
    }
  }, [selectKey?.nodeId, tab]);

  const randerTitle = ({ abnormalSignal, title }: any) => {
    return (
      <>
        {title}
        {abnormalSignal ? (
          <>
            &nbsp;&nbsp;
            <WarningFilled title="异动" style={{ color: COLORENUM?.red6 }} />
          </>
        ) : null}
      </>
    );
  };

  return (
    <div className="chart-content">
      <Spin spinning={loading}>
        <ProCard gutter={[cardGutter, cardGutter]} wrap className={styles['column-chart']}>
          {chartList?.length ? (
            chartList?.map((item: any, index: number) => (
              <ProCard
                bordered
                size="small"
                colSpan="50%"
                key={index}
                title={randerTitle(item)}
                className={styles['column-chart-card']}
              >
                <Cumulative data={item?.data} />
              </ProCard>
            ))
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </ProCard>
      </Spin>
    </div>
  );
};

export default memo(ChartContent);
