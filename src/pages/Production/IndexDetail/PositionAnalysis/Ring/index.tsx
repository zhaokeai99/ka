import React, { useEffect, useState } from 'react';
import { Pie } from '@ant-design/charts';
import { Empty, Spin } from 'antd';
import ProCard from '@ant-design/pro-card';
import { EMPTY_DESC, queryFundHoldSharesPercent } from '../../service';

type PropsType = {
  fundCode: string;
};

const Ring = (props: PropsType) => {
  const { fundCode } = props;
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await queryFundHoldSharesPercent({ fundCodes: [fundCode] });
      setLoading(false);
      setData([
        { name: '现金', value: res[0]?.cashPercent || 0.0 },
        { name: '股票', value: res[0]?.stockPercent || 0.0 },
        { name: '债券', value: res[0]?.bondPercent || 0.0 },
        { name: '其他', value: res[0]?.otherPercent || 0.0 },
      ]);
      setTotal(res[0]?.totalPercent || 0);
    })();
  }, [fundCode]);

  const config: any = {
    appendPadding: 10,
    data,
    style: {
      height: '100%',
      width: '100%',
    },
    angleField: 'value',
    colorField: 'name',
    radius: 1,
    innerRadius: 0.64,
    label: {
      type: 'inner',
      offset: '-50%',
      style: {
        textAlign: 'center',
      },
      autoRotate: false,
      content: '{name}\n{value}%',
    },
    statistic: {
      title: false,
      content: {
        style: { fontSize: '32px' },
        customHtml: () => (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ marginBottom: '12px', fontSize: '24px' }}>总计</span>
            <span style={{ fontSize: '32px' }}>{total}%</span>
          </div>
        ),
      },
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    legend: {
      layout: 'horizontal',
      position: 'bottom',
    },
  };

  return (
    <ProCard bordered ghost title="资产配置" style={{ height: '100%' }}>
      <Spin tip="加载中..." spinning={loading}>
        <div className="chart-empty-style">
          {data.length ? <Pie {...config} /> : <Empty description={EMPTY_DESC} />}
        </div>
      </Spin>
    </ProCard>
  );
};

Ring.isProCard = true;

export default Ring;
