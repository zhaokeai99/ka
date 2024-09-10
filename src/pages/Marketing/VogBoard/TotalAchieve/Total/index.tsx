import ProCardPlus from '@/components/ProCardPlus';
import { StatisticCard } from '@ant-design/pro-card';
import { Divider, Spin } from 'antd';
import styles from './index.less';

const iconUrl = 'https://cdnprod.tianhongjijin.com.cn/thfile/th_logo1652665610748.png';

type PropsType = {
  data: {
    assetAmtTotal: string;
    assetAddTotal: string;
    fundCountTotal: number | string;
  };
  loading?: boolean;
};

const Total = (props: PropsType) => {
  const { data, loading = false } = props;

  return (
    <Spin spinning={loading}>
      <ProCardPlus ghost direction="row" layout="center" className={styles['container']}>
        <img className={styles['img']} alt="" src={iconUrl} />
        <Divider type="vertical" style={{ height: '100%' }} />
        <StatisticCard
          ghost
          className={styles['card']}
          statistic={{
            title: '存量规模',
            tip: '数据中剔除ETF联接基金买入的ETF份额对应的规模、FOF产品买入的我司非货公募规模;',
            value: `${data?.assetAmtTotal || '--'} 亿`,
            valueStyle: { fontFamily: 'HelveticaNeue' },
          }}
        />
        <Divider type="vertical" style={{ height: '100%' }} />
        <StatisticCard
          ghost
          className={styles['card']}
          statistic={{
            title: '区间保有净增',
            tip: '数据中剔除ETF联接基金买入的ETF份额对应的规模、FOF产品买入的我司非货公募规模;',
            value: `${data?.assetAddTotal || '--'} 亿`,
            valueStyle: { fontFamily: 'HelveticaNeue' },
          }}
        />
        <Divider type="vertical" style={{ height: '100%' }} />
        <StatisticCard
          ghost
          className={styles['card']}
          statistic={{
            title: '产品数量',
            tip: '不含中港互认产品;',
            value: `${data?.fundCountTotal || '--'} 支`,
            valueStyle: { fontFamily: 'HelveticaNeue' },
          }}
        />
      </ProCardPlus>
    </Spin>
  );
};

export default Total;
