import { memo, useEffect, useState } from 'react';
import { Empty } from 'antd';
import type { PieConfig } from '@ant-design/charts';
import { Pie, measureTextWidth } from '@ant-design/charts';
import { queryFundAssetPosition } from '../service';
import { numberToT } from '@/utils/utils';

function renderStatistic(containerWidth: any, text: string, style: any) {
  const _measureTextWidth = measureTextWidth(text, style),
    textWidth = _measureTextWidth.width,
    textHeight = _measureTextWidth.height;
  const R = containerWidth / 2;
  let scale = 1;
  if (containerWidth < textWidth) {
    scale = Math.min(
      Math.sqrt(Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)))),
      1,
    );
  }
  const textStyleStr = 'width:'.concat(containerWidth, 'px;');
  return '<div style="'
    .concat(textStyleStr, ';font-size:')
    .concat(`${scale}`, 'em;line-height:')
    .concat(scale < 1 ? '1' : 'inherit', ';">')
    .concat(text, '</div>');
}

const circleConfig: PieConfig = {
  appendPadding: 10,
  style: { width: '100%', height: '300px' },
  data: [],
  angleField: 'groupAsset',
  colorField: 'holdGroupName',
  radius: 1,
  innerRadius: 0.6,
  label: {
    type: 'inner',
    offset: '-50%',
    style: { textAlign: 'center' },
    autoRotate: false,
    content: (data) => {
      const { ratioView, holdGroupName } = data || {};
      return `${holdGroupName}\n${ratioView}`;
    },
  },
  legend: {
    position: 'bottom',
  },
  // interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  interactions: [
    { type: 'element-selected' },
    { type: 'element-active' },
    { type: 'pie-statistic-active' },
  ],
  statistic: {
    title: {
      offsetY: -12,
      customHtml: function customHtml(container, view, datum) {
        const _container$getBoundin = container.getBoundingClientRect(),
          width = _container$getBoundin.width,
          height = _container$getBoundin.height;
        const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
        const text = datum ? datum.holdGroupName : '总计';
        return renderStatistic(d, text, { fontSize: 28 });
      },
    },
    content: {
      offsetY: -2,
      // style: { fontSize: '22px' },
      customHtml: function customHtml(container, view, datum, data: any) {
        const _container$getBoundin2 = container.getBoundingClientRect(),
          width = _container$getBoundin2.width;
        const text = datum
          ? ''.concat(datum.groupAsset)
          : ''.concat(
              data.reduce(function (r: any, d: any) {
                return r + d.groupAsset;
              }, 0),
            );
        return renderStatistic(width, numberToT(text), { fontSize: 32 });
      },
    },
  },
};

const Circle = ({ fundId, date }: any) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await queryFundAssetPosition({
        fundId,
        startDate: date,
        endDate: date,
        rangeType: 'day',
      });
      setData(result);
    })();
  }, []);

  if (data.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return <Pie {...circleConfig} data={data} />;
};

export default memo(Circle);
