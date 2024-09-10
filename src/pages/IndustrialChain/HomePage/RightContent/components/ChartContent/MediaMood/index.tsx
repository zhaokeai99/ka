import { useCallback, useEffect, useState } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import { Column } from '@ant-design/plots';
import { Empty, Spin } from 'antd';
import RadioGroup from '../RadioGroup';
import { queryMediaSentiment } from '../../../service';
import { COLORENUM } from '@/pages/IndustrialChain/data.d';

const COLORTYPE = {
  利好: COLORENUM['red6'],
  中性: COLORENUM['gray'],
  利空: COLORENUM['green5'],
};

const config = {
  isStack: true,
  autoFit: true,
  xField: 'industryName',
  yField: 'publicSentimentNum',
  seriesField: 'publicSentiment',
  padding: [35, 0, 66, 35],
  minColumnWidth: 12,
  maxColumnWidth: 12,
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
  yAxis: {
    label: {
      autoRotate: false,
      autoHide: false,
      style: {
        fontSize: 11,
      },
    },
  },
  legend: {
    layout: 'horizontal',
    position: 'top-left',
    offsetX: 0,
    offsetY: 0,
  },
  color: ({ publicSentiment }: any) => COLORTYPE[publicSentiment],
};

// 媒体情绪
const MediaMood = () => {
  const [data, setData] = useState<any[]>([]);
  const [dateType, setDateType] = useState<string>('2');
  const [loading, setLoading] = useState<boolean>(false);

  const getData = useCallback(async () => {
    setLoading(true);

    const { data: columnData, success } = await queryMediaSentiment({ dateType });

    if (success) {
      setData(columnData || []);
    }

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
        title="媒体情绪"
        layout="center"
        style={{ height: '415px' }}
        extra={<RadioGroup type={dateType} onChange={onChange} />}
      >
        {data?.length <= 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <div style={{ width: '100%' }}>
            <Column
              {...(config as any)}
              data={data}
              style={{ width: '100%', maxHeight: '350px' }}
            />
          </div>
        )}
      </ProCardPlus>
    </Spin>
  );
};

MediaMood.isProCard = true;

export default MediaMood;
