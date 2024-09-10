import { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { Table, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { cardGutter } from '@/themes';
import { queryFundCodeDividendInfos } from './service';
import BoothComponent from '@/components/boothComponent';
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: '5%',
  },
  {
    title: (
      <span>
        变更日期
        <Tooltip
          title={
            <span>
              该日期为产品投资目标、范围及策略在产品管理系统中的更新时间，可能与法律文件中变更时间不一致
            </span>
          }
        >
          <QuestionCircleOutlined style={{ fontSize: '12px', color: '#999', marginLeft: '2px' }} />
        </Tooltip>
      </span>
    ),
    dataIndex: 'updateDate',
    key: 'updateDate',
    width: '12%',
    render: (_: any) => <span>{_ ? _ : '-'}</span>,
  },
  {
    title: (
      <span>
        变更前
        <Tooltip title={<span>数据来源于产品管理系统</span>}>
          <QuestionCircleOutlined style={{ fontSize: '12px', color: '#999', marginLeft: '2px' }} />
        </Tooltip>
      </span>
    ),
    dataIndex: 'last',
    key: 'last',
    width: '40%',
  },
  {
    title: (
      <span>
        当前最新
        <Tooltip title={<span>数据来源于产品管理系统</span>}>
          <QuestionCircleOutlined style={{ fontSize: '12px', color: '#999', marginLeft: '2px' }} />
        </Tooltip>
      </span>
    ),
    dataIndex: 'current',
    key: 'current',
    width: '43%',
  },
];

function InvestInfo({ fundCode }: any) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await queryFundCodeDividendInfos({
        code: fundCode,
      });
      setData(result);
      setLoading(false);
    })();
  }, []);

  return (
    <ProCard gutter={[0, cardGutter]} size="small">
      <BoothComponent boothId="invest" />
      <Table
        loading={loading}
        columns={columns}
        dataSource={[
          {
            name: '投资目标',
            updateDate: data.investUpdate,
            last: data.lastInvestTarget,
            current: data.investTarget,
          },
          {
            name: '投资范围',
            updateDate: data.investUpdate,
            last: data.lastInvestScope,
            current: data.investScope,
          },
          {
            name: '投资策略',
            updateDate: data.investUpdate,
            last: data.lastInvestStrategy,
            current: data.investStrategy,
          },
        ]}
        style={{ width: '100%', height: '100%' }}
        pagination={false}
        size="small"
      />
    </ProCard>
  );
}

export default InvestInfo;
