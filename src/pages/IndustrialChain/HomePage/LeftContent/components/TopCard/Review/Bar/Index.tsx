import { COLORENUM } from '@/pages/IndustrialChain/data.d';
import { Bar } from '@ant-design/plots';

const COLORTYPE = {
  涨: COLORENUM['red6'],
  平盘: COLORENUM['gray'],
  跌: COLORENUM['green5'],
};

const flatColor = 'rgba(0,0,0,0.55)';

const BarCharts = ({ data }: any) => {
  const config = {
    data,
    isStack: true,
    xField: 'value',
    yField: 'stockNum',
    seriesField: 'type',
    antialias: false,
    xAxis: {
      label: false,
      tickLine: null,
      grid: null,
      line: null,
    },
    yAxis: {
      label: false,
      tickLine: null,
      grid: null,
      line: null,
    },
    tooltip: false,
    color: ({ type }: any) => COLORTYPE[type],
    legend: {
      itemName: {
        style: (item: any) => {
          return {
            fill: item.value === '平盘' ? flatColor : COLORTYPE[item.value],
          };
        },
      },
      itemValue: {
        formatter: (text: any) => {
          const itemArr = data.filter((item2: any) => item2.type === text) ?? [];

          return itemArr.length ? itemArr[0]?.value : '-';
        },
        style: (item: any) => {
          return {
            fontSize: '15',
            fontWeight: '600',
            fill: item.value === '平盘' ? flatColor : COLORTYPE[item.value],
          };
        },
      },
    },
  };

  return <Bar {...(config as any)} style={{ height: '35px' }} />;
};

export default BarCharts;
