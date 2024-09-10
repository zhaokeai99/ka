import { Radar } from '@ant-design/charts';
import { Empty, Radio, Space } from 'antd';

import styles from './index.less';
const config = {
  xField: 'name',
  yField: 'quantile',
  meta: {
    quantile: {
      alias: '数值',
      min: 0,
      max: 1,
      formatter: (value: any) => +value,
    },
  },
  tooltip: {
    customContent: (title: string) => title,
  },
  xAxis: {
    tickLine: null,
    label: {
      offset: 30,
      style: {
        textAlign: 'center',
        fontSize: 12,
      },
      autoHide: true,
      autoRotate: true,
    },
  },
  yAxis: {
    label: false,
    grid: {
      alternateColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  // 开启辅助点
  point: {
    size: 2,
  },
  area: {},
};

export default function IndexRadar({
  width = 300,
  height = 240,
  data = [],
  title = '',
  onChange = (value: any) => value,
}) {
  const handleChange = (e: any) => {
    onChange(e);
  };

  if (!Array.isArray(data)) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  if (data.length === 0) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return (
    <div className={styles['container']}>
      <div className={styles['out']} style={{ zIndex: 2 }}>
        <div className={styles['title']}>
          <span>我司</span>
          <span className={styles['type']}>{title || ''}</span>
        </div>
        <Radar {...config} width={width} height={height} data={data} />
        <Radio.Group defaultValue="PERSON" size="small" buttonStyle="solid" onChange={handleChange}>
          <Space style={{ marginTop: '10px' }}>
            <Radio.Button value="PERSON">个人客户</Radio.Button>
            <Radio.Button value="ORG">机构客户</Radio.Button>
          </Space>
        </Radio.Group>
      </div>
    </div>
  );
}
