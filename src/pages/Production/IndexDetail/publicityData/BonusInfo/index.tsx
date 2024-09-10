import { useEffect, useState } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { Table, Tooltip } from 'antd';
import { cardGutter } from '@/themes';
import { queryFundCodeDividendInfos } from './service';
const columns = [
  {
    title: (
      <span>
        分红次数
        <Tooltip title={<span>基金份额维度数据（非母基金维度，数据来源于wind）</span>}>
          <QuestionCircleOutlined style={{ fontSize: '12px', color: '#999', marginLeft: '2px' }} />
        </Tooltip>
      </span>
    ),
    dataIndex: 'dividendCount',
    key: 'dividendCount',
    render: (text: any) => <div>第{text}次</div>,
  },
  {
    title: '权益登记日/除息日',
    dataIndex: 'dividendDate',
    key: 'dividendDate',
  },
  {
    title: '单位分红金额',
    dataIndex: 'bonus',
    key: 'bonus',
  },
  {
    title: '分红公告日',
    dataIndex: 'dividendNoticeDate',
    key: 'dividendNoticeDate',
  },
];

function BonusInfo({ fundCode }) {
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
    <ProCard gutter={[0, cardGutter]} size="small" wrap>
      <ProCard colSpan={6}>当前已分红： {data?.dividendInfosCount} 次</ProCard>
      <ProCard colSpan={18}>下一次计划分红日期： {data?.nextExDate} </ProCard>
      <Table
        loading={loading}
        columns={columns}
        dataSource={data?.infos}
        style={{ width: '100%', height: '100%' }}
        pagination={false}
        size="small"
      />
    </ProCard>
  );
}

export default BonusInfo;
