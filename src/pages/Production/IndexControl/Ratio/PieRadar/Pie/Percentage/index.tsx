import { Empty, Table } from 'antd';
import React, { useState, useEffect } from 'react';
import { getProductPie } from '../service';
import './index.less';

function Percentage(props: { floodFund: any; sectorId: number }) {
  const { floodFund, sectorId } = props;
  const [percentageData, setPercentageData] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getProductPie({ floodFund, sectorId });
      if (res && res.success && res.data) {
        const data = res.data.map(
          (item: { name: string; ranking: any; value: string }, i: number) => ({
            ...item,
            ranking: item.name === '其他基金' ? '' : i + 1,
            value: `${item.value}%`,
          }),
        );
        setPercentageData(data);
      }
    })();
  }, [floodFund, sectorId]);

  const columns = [
    {
      title: '排名',
      dataIndex: 'ranking',
      key: 'ranking',
      width: 40,
      fixed: 'left',
    },
    {
      title: '公司',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
    },
    {
      title: '规模(E)',
      dataIndex: 'sumManage',
      key: 'sumManage',
    },
    {
      title: '产品',
      key: 'num',
      width: 40,
      dataIndex: 'num',
    },
    {
      title: '市占率',
      key: 'value',
      dataIndex: 'value',
    },
  ];

  return (
    <>
      {percentageData.length ? (
        <div className="Percentage_Table">
          <Table
            bordered
            scroll={{ x: 'max-content', y: '100%' }}
            size="small"
            columns={columns as any}
            dataSource={percentageData}
            pagination={false}
          />
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </>
  );
}

export default Percentage;
