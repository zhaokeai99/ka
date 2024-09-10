import { useContext } from 'react';
import { Empty, Button, message } from 'antd';
import { Radar } from '@ant-design/charts';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { IndexMapContext } from '../context';

const config = {
  xField: 'name',
  yField: 'rate',
  meta: {
    rate: {
      alias: '数值',
      min: 0,
      max: 1,
      nice: true,
    },
  },
  // label: {
  //   content: ({ value }) => value,
  //   autoRotate: false,
  //   offset: 25,
  // },
  tooltip: {
    customContent: (title: string) => title,
  },
  xAxis: {
    line: null,
    tickLine: null,
  },
  yAxis: {
    label: false,
    grid: {
      alternateColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  // 开启辅助点
  point: {},
  area: {},
};

export default function IndexRadar({
  width = 200,
  height = 200,
  data = [],
  title = '',
  id = '',
  needCompare = false,
}) {
  const { compareIndexCodes, setCompareIndexCodes } = useContext(IndexMapContext);

  if (!Array.isArray(data)) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  if (data.length === 0) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return (
    <>
      {title && <span style={{ fontWeight: 'bold' }}>{title}</span>}
      {needCompare && (
        <Button
          size="small"
          type="primary"
          icon={compareIndexCodes.includes(id) ? <MinusOutlined /> : <PlusOutlined />}
          style={{ float: 'right' }}
          onClick={() => {
            if (compareIndexCodes.includes(id)) {
              setCompareIndexCodes((indexCodes: string[]) =>
                indexCodes.filter((code: string) => code !== id),
              );
              message.success(`指数 ${id} 已从对比队列中移除！`);
              return;
            }

            if (compareIndexCodes.length >= 5) {
              message.warn('最多5条基金进行对比！');
              return;
            }

            setCompareIndexCodes((indexCodes: any) => [...new Set([...indexCodes, id])]);
            message.success(`指数 ${id} 已加入对比队列！`);
          }}
        >
          {compareIndexCodes.includes(id) ? '移除对比' : '加入对比'}
        </Button>
      )}

      <Radar {...config} width={width} style={{ height: height }} data={data} />
    </>
  );
}
