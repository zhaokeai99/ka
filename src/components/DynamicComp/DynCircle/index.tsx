// 产品 - 产品概览 - 产品状态分布 环图/饼图
import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import type { PieConfig } from '@ant-design/charts';
import { Pie } from '@ant-design/charts';
import ProCardPlus from '@/components/ProCardPlus';
import services from './service';

const circleConfig: PieConfig = {
  appendPadding: 10,
  style: { width: '80%', height: '300px' },
  data: [],
  angleField: 'value',
  colorField: 'name',
  radius: 1,
  label: {
    type: 'inner',
    offset: '-50%',
    content: '{value}',
    style: {
      textAlign: 'center',
      fontSize: 14,
    },
  },
  legend: {
    position: 'bottom',
  },
  interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  statistic: {
    title: false,
    content: {
      style: {
        whiteSpace: 'pre-wrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      content: '',
    },
  },
};

export default function (props: any) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { dataUrl, title, staticParams } = props || {};
  const { pieType } = staticParams || {};

  useEffect(() => {
    (async () => {
      if (services?.[dataUrl]) {
        setLoading(true);
        const result = await services[dataUrl]();
        setData(result);
        setLoading(false);
      }
    })();
  }, []);

  return (
    <ProCardPlus
      style={{ height: '390px' }}
      title={title}
      layout="center"
      loading={loading && <Spin spinning />}
    >
      <Pie {...circleConfig} data={data || []} innerRadius={pieType === 'pie' ? 0 : 0.6} />
    </ProCardPlus>
  );
}
