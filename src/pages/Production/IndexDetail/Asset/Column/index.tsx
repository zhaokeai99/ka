import React, { useState, useEffect, memo } from 'react';
import { Empty } from 'antd';
import { Column } from '@ant-design/charts';
import moment from 'moment';
import { queryFundAsset } from '../service';
import { numberToT } from '@/utils/utils';

const config = {
  data: [],
  xField: 'dateView',
  yField: 'totalAsset',
  style: {
    width: '98%',
    height: '100%',
  },
  xAxis: {
    label: {
      autoHide: true,
      autoRotate: false,
    },
  },
  yAxis: {
    label: {
      formatter: (v: any) => {
        return numberToT(v);
      },
    },
  },
  meta: {
    type: { alias: '类别' },
    sales: { alias: '销售额' },
  },
};

const MyColumn = ({ fundId, date }: any) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await queryFundAsset({
        fundId,
        rangeType: 'month',
        startDate: moment(date).month(-12).format('YYYY-MM-DD'),
        endDate: date,
      });
      setData(result);
    })();
  }, []);

  if (data.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return <Column {...config} data={data} />;
};

export default memo(MyColumn);
