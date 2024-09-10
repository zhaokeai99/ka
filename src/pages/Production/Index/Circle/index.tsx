import type { PieConfig } from '@ant-design/charts';
import { Pie } from '@ant-design/charts';

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
    itemHeight: 15,
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

const Circle = (props: any) => {
  return (
    <Pie {...circleConfig} data={props.data || []} innerRadius={props.type === 'pie' ? 0 : 0.6} />
  );
};

export default Circle;
