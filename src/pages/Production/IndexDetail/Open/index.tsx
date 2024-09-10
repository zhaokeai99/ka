import { memo, useEffect, useState } from 'react';
import { Tag, Descriptions } from 'antd';
import ProTable from '@ant-design/pro-table';
import { tableEmptyCellRender } from '@/utils/utils';
import { getFundOpenDateInfo } from './service';

const columns = [
  {
    title: '开放期',
    dataIndex: 'openPeriod',
  },
  {
    title: '开放起始日',
    dataIndex: 'openBeginDate',
  },
  {
    title: '开放终止日',
    dataIndex: 'openEndDate',
  },
];

function Open({ fundId }: any) {
  const [headerData, setHeaderData] = useState({
    openDateRange: '',
    status: '',
  });

  useEffect(() => {
    (async () => {
      // 初始化一次,只取头部数据
      const { map } = await getFundOpenDateInfo({ fundId, pageNo: 1, pageSize: 10 });
      setHeaderData(map);
    })();
  }, []);

  return (
    <>
      <Descriptions style={{ marginTop: '15px' }}>
        <Descriptions.Item label="当前开放状态">
          {headerData?.status === 'OPEN' && <Tag color="orange">开放中</Tag>}
          {headerData?.status === 'CLOSE' && <Tag color="red">封闭中</Tag>}
        </Descriptions.Item>
        {headerData?.openDateRange && (
          <Descriptions.Item label="当前开放期或下一开放期">
            <Tag color="blue">{headerData?.openDateRange}</Tag>
          </Descriptions.Item>
        )}
      </Descriptions>
      <ProTable
        size="small"
        columns={tableEmptyCellRender(columns as any)}
        request={async (params = {}) => {
          const { current = 1 } = params;
          const { dataList, total } = await getFundOpenDateInfo({
            ...params,
            fundId,
            pageNo: current,
          });

          return {
            total,
            data: dataList,
          };
        }}
        // rowKey="id"
        search={false}
        toolBarRender={false}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
      />
    </>
  );
}

export default memo(Open);
