import {
  queryIndustryFundInfo,
  SelectKeyProvider,
  TabProvider,
} from '@/pages/IndustrialChain/ChainDetail/service';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import TitleContent from '../TitleContent';

interface DataType {
  fundName: string;
  fundCode: string;
  navUnit: string;
  dqPctchange: string;
  netassetTotal: string;
}

// 基金
const Fund: React.FC = () => {
  const [data, setData] = useState<any>([]);
  const { selectKey }: any = useContext(SelectKeyProvider);
  const { tab } = useContext(TabProvider);
  const [loading, setLoading] = useState(false);
  const columns: ColumnsType<DataType> = useMemo(
    () => [
      {
        title: '基金名称',
        dataIndex: 'fundName',
        key: 'fundName',
        render: (text: any, record: any) => (
          <a rel="noopener noreferrer" href={`#/production/index/newDetail/${record.fundCode}`}>
            {text}
          </a>
        ),
      },
      {
        title: '基金代码',
        dataIndex: 'fundCode',
        key: 'fundCode',
        render: (text: any, record: any) => (
          <a rel="noopener noreferrer" href={`#/production/index/newDetail/${record.fundCode}`}>
            {text}
          </a>
        ),
      },
      {
        title: '净值(元)',
        dataIndex: 'navUnit',
        key: 'navUnit',
      },
      {
        title: '增长率',
        dataIndex: 'dqPctchange',
        key: 'dqPctchange',
      },
      {
        title: '资产规模(亿)',
        dataIndex: 'netassetTotal',
        key: 'netassetTotal',
      },
    ],
    [selectKey?.nodeId, tab],
  );

  const getTreeData = useCallback(async () => {
    setLoading(true);

    const result = selectKey?.nodeId
      ? await queryIndustryFundInfo({
          queryType: 'node', //行业：chain 节点：node
          queryValue: selectKey.nodeId,
        })
      : [];

    setLoading(false);
    setData(result);
  }, [selectKey?.nodeId, tab]);

  useEffect(() => {
    // 当tree的选择节点改变的时候请求接口
    if (tab === 'fund') {
      getTreeData();
    }
  }, [selectKey?.nodeId, tab]);

  return (
    <div className="fund">
      <TitleContent
        data={[
          {
            title: selectKey?.nodeName,
            description: selectKey?.nodeDesc,
          },
        ]}
      />
      <Table
        size="small"
        rowKey="fundName"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={data?.length > 10 ? { y: 300 } : { y: undefined }}
      />
    </div>
  );
};

export default Fund;
