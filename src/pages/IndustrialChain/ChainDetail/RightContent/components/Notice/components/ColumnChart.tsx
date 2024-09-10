import { COLORENUM } from '@/pages/IndustrialChain/data.d';
import { Column } from '@ant-design/plots';
import { Empty } from 'antd';

const COLORTYPE = {
  首亏: COLORENUM['green3'],
  续亏: COLORENUM['green4'],
  扭亏: COLORENUM['green5'],
  不确定: COLORENUM['gray'],
  预减: COLORENUM['red7'],
  略减: COLORENUM['red6'],
  续盈: COLORENUM['red5'],
  略增: COLORENUM['red4'],
  预增: COLORENUM['red3'],
};

const ColumnChart = (props: any) => {
  const config: any = {
    xField: 'profitnoticePeriod',
    yField: 'countNum',
    seriesField: 'profitnoticeStyle',
    appendPadding: 16,
    isStack: true,
    minColumnWidth: 12,
    maxColumnWidth: 12,
    legend: {
      layout: 'horizontal',
      position: 'top-left',
      offsetX: 0,
      offsetY: 0,
    },
    color: ({ profitnoticeStyle }: any) => COLORTYPE[profitnoticeStyle],
  };

  return (
    <>
      <p>业绩预告： 公告数量</p>
      <br />

      {props.data.length <= 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <Column {...config} data={props.data} style={{ height: '350px' }} />
      )}
    </>
  );
};

export default ColumnChart;
