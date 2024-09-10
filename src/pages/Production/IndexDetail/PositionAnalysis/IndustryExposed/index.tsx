import { Column } from '@ant-design/charts';
import ProCard from '@ant-design/pro-card';
import { Empty, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { EMPTY_DESC, queryFundNavRegIndusData } from '../../service';
import '../index.less';

type PropsType = {
  fundCode: string;
};

const IndustryExposed = (props: PropsType) => {
  const { fundCode } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await queryFundNavRegIndusData({ fundCodes: [fundCode] });
      setLoading(false);
      setData(result[`${fundCode}`] || []);
    })();
  }, [fundCode]);

  const config: any = {
    data,
    style: {
      width: '100%',
      height: '100%',
    },
    appendPadding: [20, 10, 0, 10],
    yField: 'indusCoeff',
    xField: 'classifyOneTypeName',
    tooltip: {
      title: false,
      formatter: (v: any) => {
        return { name: v.classifyOneTypeName, value: `${v.indusCoeff}%` };
      },
    },
    yAxis: {
      label: {
        formatter: (val: any) => `${val}%`,
      },
    },
    xAxis: {
      label: {
        autoRotate: false,
        autoHide: false,
        style: {
          fontSize: 12,
        },
        formatter: (text: any) => {
          return Array.from(text)
            .map((item: any) => `${item}\n`)
            .join('');
        },
      },
    },
    label: {
      position: 'top',
      offset: 2,
      content: (v: any) => {
        return `${v.indusCoeff}%`;
      },
    },
    legend: false,
  };

  return (
    <ProCard ghost bordered title="行业暴露" gutter={[0, 8]} style={{ height: '100%' }}>
      <Spin tip="加载中..." spinning={loading}>
        <div className="chart-empty-style">
          {data.length ? <Column {...config} /> : <Empty description={EMPTY_DESC} />}
        </div>
      </Spin>
    </ProCard>
  );
};

IndustryExposed.isProCard = true;

export default IndustryExposed;
