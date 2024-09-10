import { memo, useState, useEffect } from 'react';
import { Table } from 'antd';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { queryManagerDetail } from './service';

const columns = [
  {
    title: (
      <span>
        基金经理
        <Tooltip
          title={
            <span>
              1.不包含离职基金经理信息；
              <br />
              2.主动转型产品（开大会转型+LOF）统计 转型以来基金经理信息；
              <br />
              3.被动转型产品统计自合同生效以来基金经理信息。
              <br />
              （数据来源于产品管理系统）
            </span>
          }
        >
          <QuestionCircleOutlined style={{ fontSize: '12px', color: '#999', marginLeft: '2px' }} />
        </Tooltip>
      </span>
    ),
    dataIndex: 'fundManagerName',
    key: 'fundManagerName',
    render: (text: any, record: any) => {
      return <a href={`#/production/fundManager/${record.code}`}>{text}</a>;
    },
  },
  {
    title: '任期时间',
    dataIndex: 'workDate',
    key: 'workDate',
  },
  {
    title: '任期内业绩',
    dataIndex: 'workIncomeRate',
    key: 'workIncomeRate',
  },
  {
    title: '最大回撤',
    dataIndex: 'maxPullbackRate',
    key: 'maxPullbackRate',
  },
  {
    title: '标准差',
    dataIndex: 'standardDeviation',
    key: 'standardDeviation',
  },
  {
    title: '从业年限',
    dataIndex: 'certYearsDays',
    key: 'certYearsDays',
  },
  {
    title: '管理年限',
    dataIndex: 'managedYearsDays',
    key: 'managedYearsDays',
  },
];

function FundManager({ fundCode }: any) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await queryManagerDetail({
        code: fundCode,
      });
      setLoading(false);
      setData(res);
    })();
  }, []);

  return (
    <ProCard>
      <Table
        loading={loading}
        columns={columns}
        dataSource={data}
        style={{ width: '100%', height: '100%' }}
        pagination={false}
        size="small"
      />
    </ProCard>
  );
}

export default memo(FundManager);
