import { Column } from '@ant-design/plots';
import ProCard from '@ant-design/pro-card';
import { Empty } from 'antd';
import { COLORENUM } from '@/pages/IndustrialChain/data.d';

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
}

// 情绪
const Chartsanalyse = (props: ChartsanalyseProps) => {
  const { data } = props;

  const config = {
    data,
    isStack: true,
    appendPadding: [16, 0],
    xField: 'clusterEventDate',
    yField: 'resultValue',
    seriesField: 'publicSentiment',
    groupField: 'publicSentiment',
    maxColumnWidth: 24,
    legend: {
      layout: 'horizontal',
      position: 'top-left',
      offsetX: 0,
      offsetY: 0,
    },
    color: ({ publicSentiment }: any) => COLORTYPE[publicSentiment],
  };

  if (data?.length <= 0) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return (
    <ProCard size="small" gutter={[0, 8]} style={{ marginTop: 12 }}>
      <Column {...(config as any)} style={{ height: '370px' }} />
    </ProCard>
  );
};

export default Chartsanalyse;
