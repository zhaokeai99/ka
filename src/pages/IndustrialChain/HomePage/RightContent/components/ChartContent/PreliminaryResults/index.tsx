import ProCardPlus from '@/components/ProCardPlus';
import { COLORENUM } from '@/pages/IndustrialChain/data.d';
import { Column, G2 } from '@ant-design/plots';
import { Empty, Image, Spin } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { formatData, queryIndustryPerformance } from '../../../service';
import DateRadioGroup from '../DateRadioGroup';

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

G2.registerInteraction('element-link', {
  start: [
    {
      trigger: 'interval:mouseenter',
      action: 'element-link-by-color:link',
    },
  ],
  end: [
    {
      trigger: 'interval:mouseleave',
      action: 'element-link-by-color:unlink',
    },
  ],
});

const config = {
  xField: 'industryName',
  yField: 'emotionValue',
  seriesField: 'emotion',
  isPercent: true,
  autoFit: true,
  isStack: true,
  padding: [35, 0, 66, 35],
  minColumnWidth: 12,
  maxColumnWidth: 12,
  interactions: [
    {
      type: 'element-highlight-by-color',
    },
    {
      type: 'element-link',
    },
  ],
  colorField: 'emotion',
  color: ({ emotion }: any) => COLORTYPE[emotion],
  yAxis: {
    label: {
      autoRotate: false,
      autoHide: false,
      style: {
        fontSize: 11,
      },
      formatter: (text: any) => text + '%',
    },
  },
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
};

// 业绩预告
const PreliminaryResults = () => {
  const [data, setData] = useState<any>([]);
  const [dateType, setDateType] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const getData = useCallback(async () => {
    if (dateType) {
      setLoading(true);

      const result = (await queryIndustryPerformance({ dateType })) || [];
      const newData = formatData(result);

      setData(newData);
      setLoading(false);
    }
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
        title="业绩预告"
        layout="center"
        style={{ height: '415px' }}
        tooltip={
          <Image
            width={200}
            height={95}
            src="https://cdnprod.tianhongjijin.com.cn/fundsalescrm/prod/Snipaste_2022-04-20_09-17-37.png"
          />
        }
        extra={<DateRadioGroup onChange={onChange} />}
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

PreliminaryResults.isProCard = true;

export default PreliminaryResults;
