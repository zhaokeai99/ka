import React, { useEffect, useState } from 'react';
import { Column } from '@ant-design/charts';
import { Empty, Spin } from 'antd';
import ProCard from '@ant-design/pro-card';
import { EMPTY_DESC, queryFundHoldPercent } from '../../service';
import moment from 'moment';
import '../index.less';

type PropsType = {
  fundCode: string;
};

const CompareColumn = (props: PropsType) => {
  const { fundCode } = props;
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await queryFundHoldPercent({ fundCodes: [fundCode] });
      setLoading(false);
      setData(result || []);
    })();
  }, [fundCode]);

  const config: any = {
    data,
    appendPadding: 10,
    style: {
      height: '100%',
      width: '100%',
    },
    maxColumnWidth: 24,
    xField: 'date',
    yField: 'percent',
    seriesField: 'holdType',
    // isPercent: true,
    isStack: true,
    legend: {
      position: 'bottom',
    },
    slider: {
      start: 0.8,
      end: 1,
      formatter: (val: any) => moment(val).format('YYYY-MM-DD'),
    },
    tooltip: {
      formatter: (datum: any) => {
        const { holdType, percent } = datum;
        return { name: holdType === 'PERSON' ? '个人' : '机构', value: percent + '%' };
      },
    },
    meta: {
      date: {
        formatter: (text: any) => moment(text).format('YYYY-MM-DD'),
      },
      holdType: {
        formatter: (text: any) => (text === 'PERSON' ? '个人' : '机构'),
      },
      percent: {
        formatter: (text: any) => `${text}%`,
      },
    },
  };

  return (
    <ProCard bordered ghost title="持有人结构" style={{ height: '100%' }}>
      <Spin tip="加载中..." spinning={loading}>
        <div className="chart-empty-style">
          {data.length ? <Column {...config} /> : <Empty description={EMPTY_DESC} />}
        </div>
      </Spin>
    </ProCard>
  );
};

CompareColumn.isProCard = true;

export default CompareColumn;
