import ProCardPlus from '@/components/ProCardPlus';
import { COLORENUM } from '@/pages/IndustrialChain/data.d';
import { Column } from '@ant-design/plots';
import { Empty, Spin } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { formatData, querySellerEvaluation } from '../../../service';
import RadioGroup from '../RadioGroup';

const COLORTYPE = {
  买入: COLORENUM['red6'],
  增持: COLORENUM['red5'],
  中性: COLORENUM['gray'],
  减持: COLORENUM['green4'],
  卖出: COLORENUM['green5'],
};

const config = {
  xField: 'industryName',
  yField: 'emotionValue',
  seriesField: 'emotion',
  autoFit: true,
  isStack: true,
  padding: [35, 0, 66, 35],
  minColumnWidth: 12,
  maxColumnWidth: 12,
  yAxis: {
    label: {
      autoRotate: false,
      autoHide: false,
      style: {
        fontSize: 11,
      },
    },
  },
  interactions: [
    {
      type: 'active-region',
      enable: false,
    },
  ],
  xAxis: {
    label: {
      autoRotate: false,
      autoHide: false,
      style: {
        fontSize: 10,
      },
      formatter: (text: any) => {
        return Array.from(text)
          .map((item: any) => `${item}\n`)
          .join('');
      },
    },
  },
  legend: {
    layout: 'horizontal',
    position: 'top-left',
    offsetX: 0,
    offsetY: 0,
  },
  connectedArea: {
    style: (oldStyle: any) => ({
      fill: 'rgba(0,0,0,0.25)',
      stroke: oldStyle.fill,
      lineWidth: 0.5,
    }),
  },
  color: ({ emotion }: any) => COLORTYPE[emotion],
};

// 卖方评级
const SellerRatings = () => {
  const [data, setData] = useState<any>([]);
  const [dateType, setDateType] = useState<string>('2');
  const [loading, setLoading] = useState<boolean>(false);

  const getData = useCallback(async () => {
    setLoading(true);

    const result = await querySellerEvaluation({ dateType });

    const newData = formatData(result);

    setLoading(false);

    setData(newData.map((item: any) => ({ ...item, emotionValue: +item?.emotionValue })) || []);
  }, [dateType]);

  useEffect(() => {
    getData();
  }, [dateType]);

  const onChange = useCallback((value: string) => {
    setDateType(value);
  }, []);

  return (
    <Spin spinning={loading}>
      <ProCardPlus
        title="卖方评级"
        layout="center"
        style={{ height: '415px' }}
        extra={<RadioGroup onChange={onChange} />}
      >
        {data?.length <= 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <div style={{ width: '100%' }}>
            <Column {...(config as any)} data={data} style={{ maxHeight: '350px' }} />
          </div>
        )}
      </ProCardPlus>
    </Spin>
  );
};

SellerRatings.isProCard = true;

export default SellerRatings;
