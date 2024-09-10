import React, { useEffect, useState } from 'react';
import { Column } from '@ant-design/plots';
import { Empty, Popover, Spin } from 'antd';
import ProCardPlus from '@/components/ProCardPlus';
import './index.less';
import ProCard from '@ant-design/pro-card';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface RcProps {
  data: [];
  version: number;
  loading: boolean;
}

const ReturnContribution = (props: RcProps) => {
  const { data, version, loading } = props;
  const [config, setConfig] = useState<any>({});

  const handleConfig = (chartData: any) => {
    setConfig({
      data: chartData,
      isGroup: true,
      xField: 'stkName', // x轴
      yField: 'valueDec', //y轴
      //seriesField: 'stkCode', // 图例分组
      padding: [10, 30, 100, 50],
      style: { width: '100%' },
      autoFit: true,
      annotations: [
        // 低于0颜色变化
        {
          type: 'regionFilter',
          start: [-1, 'max'],
          end: [999, 0],
          color: '#FF0000',
        },
        {
          type: 'regionFilter',
          start: [-1, 0],
          end: [999, 'min'],
          color: '#56a73f',
        },
      ],
      // slider: {},
      xAxis: {
        nice: true,
        label: {
          autoRotate: true,
          autoHide: false,
        },
      },
      meta: {
        valueDec: {
          nice: true,
          formatter: (val: number) => (+val * 100).toFixed(2) + '%',
        },
      },
      tooltip: {
        formatter: ({ stkName, valueDec }: any) => {
          return { name: stkName, value: (+valueDec * 100).toFixed(2) + '%' };
        },
      },
    });
  };

  //数据
  useEffect(() => {
    if (data === undefined) {
      handleConfig({});
    } else {
      handleConfig(data);
    }
  }, [version]);

  return (
    <ProCard ghost>
      <ProCardPlus
        title={
          <div>
            收益贡献&nbsp;
            <Popover
              content="股票收益贡献 = 每只股票持仓周期内单位净值变化 / 组合期初单位净值"
              title="收益贡献"
            >
              <QuestionCircleOutlined />
            </Popover>
          </div>
        }
        style={{ height: '100%' }}
      >
        <Spin tip="Loading..." spinning={loading}>
          <div className="charts-empty-style">
            {data?.length ? <Column {...config} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          </div>
        </Spin>
      </ProCardPlus>
    </ProCard>
  );
};

export default ReturnContribution;
