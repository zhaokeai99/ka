import React, { memo, useEffect, useState } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import ProCard from '@ant-design/pro-card';
import { Line } from '@ant-design/charts';
import { queryAllMarketFundInfo, queryHistoryFundAssetAmt } from '../service';
import moment from 'moment';
import { Empty, Spin } from 'antd';
import styles from './index.less';

interface RiskInformationProps {
  fundCode: string;
}

// 全市场风险信息
const RiskInformation: React.FC<RiskInformationProps> = (props: any) => {
  const { fundCode } = props;
  const [chartData, setChartData] = useState<any[]>([]);
  const [ratioInfo, setRatioInfo] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 查询最大回撤图表
  const queryChartData = async () => {
    setLoading(true);
    const result = await queryHistoryFundAssetAmt({
      fundCodes: [fundCode],
      colNames: 'mon_1_max_pullback', // 最大回撤
    });
    setLoading(false);
    setChartData(result);
  };

  // 查询比率信息
  const queryRatio = async () => {
    const res = await queryAllMarketFundInfo({ fundCode });
    setRatioInfo([
      { label: '夏普比', value: res?.year1Sharpratio || '-' },
      { label: '卡码比', value: res?.year1Calmarratio || '-' },
      { label: '信息比', value: res?.year1Inforatio || '-' },
      { label: '波动率', value: res?.year1AnnualVolatility || '-' },
    ]);
  };

  useEffect(() => {
    queryChartData();
    queryRatio();
  }, [fundCode]);

  const config: any = {
    data: chartData,
    appendPadding: [20, 10],
    style: {
      height: '400px',
      width: '100%',
    },
    xField: 'assetAmtDate',
    yField: 'fundAssetAmt',
    meta: {
      assetAmtDate: {
        formatter: (val: any) => moment(val).format('YYYY-MM-DD'),
      },
      fundAssetAmt: {
        alias: '最大回撤',
      },
    },
  };

  return (
    <ProCardPlus ghost style={{ padding: '12px 12px' }} direction="column" gutter={[0, 10]}>
      <ProCard ghost bordered title="最大回撤" gutter={[0, 8]}>
        <Spin spinning={loading}>
          {!chartData || chartData.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <Line {...config} />
          )}
        </Spin>
      </ProCard>
      <div className={styles['ratio-style']}>
        {ratioInfo?.map((i: any, k: number) => (
          <div key={k}>
            <span>{i.label}</span>
            <span style={{ fontSize: '20px' }}>{i.value}</span>
          </div>
        ))}
      </div>
    </ProCardPlus>
  );
};

export default memo(RiskInformation);
