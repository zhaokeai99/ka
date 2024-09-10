import ProCardPlus from '@/components/ProCardPlus';
import { COLORENUM } from '@/pages/IndustrialChain/data.d';
import { Column } from '@ant-design/plots';
import { Empty, Spin } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { queryIndustryForecast } from '../../../service';
import RadioGroup from '../RadioGroup';

const config = {
  xField: 'industryName',
  yField: 'value',
  legend: false,
  seriesField: 'value',
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
      formatter: (text: any) => `${text}%`,
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
  color: ({ value }: any) => {
    if (value > 0) {
      return COLORENUM['red6'];
    }

    return COLORENUM['green5'];
  },
  tooltip: {
    customContent: (titles: any, items: any): any => {
      const [item] = items;
      const { title, value } = item || {};

      return (
        <ul style={{ padding: 0, paddingTop: 12, textAlign: 'center', lineHeight: '25px' }}>
          <li key={title}>
            <div>{`行业：${title}`}</div>
            <div>{`涨跌幅：${value}%`}</div>
          </li>
        </ul>
      );
    },
  },
};

// 行业表现
const IndustryPerformance = () => {
  const [data, setData] = useState<any>([]);
  const [dateType, setDateType] = useState<string>('2');
  const [loading, setLoading] = useState<boolean>(false);

  const getData = useCallback(async () => {
    setLoading(true);

    const result = (await queryIndustryForecast({ dateType })) || [];

    setData(result);
    setLoading(false);
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
        title="行业表现"
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

IndustryPerformance.isProCard = true;

export default IndustryPerformance;
