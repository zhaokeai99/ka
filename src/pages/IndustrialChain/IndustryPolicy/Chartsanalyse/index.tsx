import { Column } from '@ant-design/plots';
import ProCard from '@ant-design/pro-card';
import { Empty } from 'antd';
import { COLORENUM } from '@/pages/IndustrialChain/data.d';
import styles from './index.less';

const COLORTYPE = {
  买入: COLORENUM['red6'],
  增持: COLORENUM['red5'],
  减持: COLORENUM['green4'],
  卖出: COLORENUM['green5'],
  利好: COLORENUM['red6'],
  中性: COLORENUM['gray'],
  利空: COLORENUM['green5'],
};

interface ChartsanalyseProps {
  data: any[];
  total: number;
}

// 情绪
const Chartsanalyse = (props: ChartsanalyseProps) => {
  const { data, total } = props || {};

  const config = {
    data,
    isStack: true,
    appendPadding: [16, 0],
    xField: 'declareDate',
    yField: 'countNum',
    seriesField: 'emotion',
    groupField: 'emotion',
    maxColumnWidth: 24,
    legend: {
      layout: 'horizontal',
      position: 'top-left',
      offsetX: 0,
      offsetY: 0,
    },
    color: ({ emotion }: any) => COLORTYPE[emotion],
  };

  if (data?.length <= 0) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return (
    <ProCard
      size="small"
      title="情绪"
      gutter={[0, 8]}
      style={{ padding: '12px 100px 0', marginTop: 12 }}
      extra={<span className={styles['total-tag']}>共有{total}条搜索结果</span>}
      className={styles['charts-analyes']}
    >
      {data?.length <= 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <Column {...(config as any)} style={{ height: '370px' }} />
      )}
    </ProCard>
  );
};

export default Chartsanalyse;
