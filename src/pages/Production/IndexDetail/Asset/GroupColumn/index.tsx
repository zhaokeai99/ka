import React, { useState, useEffect, memo } from 'react';
import { Empty } from 'antd';
import { Column } from '@ant-design/charts';
import { queryFundAssetHolder } from '../service';
import moment from 'moment';

const config = {
  data: [],
  isGroup: true,
  style: {
    width: '98%',
    height: '100%',
  },
  xField: 'dateView',
  yField: 'assetRatio',
  seriesField: 'holder',
  yAxis: {
    max: 1,
    label: {
      formatter: (v: any) => `${parseFloat((v * 100).toFixed(2))}%`,
    },
  },
  tooltip: {
    formatter: (datum: any) => ({
      name: datum.holder,
      value: `${parseFloat((datum.assetRatio * 100).toFixed(2))}%`,
    }),
  },
};

const GroupColumn = ({ fundId, date }: any) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await queryFundAssetHolder({
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

export default memo(GroupColumn);
