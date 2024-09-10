import { memo, useEffect, useState } from 'react';
import { Table } from 'antd';
import { queryFundAssetLimit } from '../service';

function TabTable({ fundId, columns, rangeType = 'day', endDate, sliceArray = [0, 5] }: any) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await queryFundAssetLimit({
        fundId,
        endDate,
        rangeType,
        limit: 10,
      });

      setData(result);
      setLoading(false);
    })();
  }, []);

  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={data.slice(sliceArray[0], sliceArray[1])}
      style={{ width: '100%', height: '100%' }}
      pagination={false}
      size="small"
    />
  );
}

export default memo(TabTable);
