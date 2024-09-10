import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { cardGutter } from '@/themes';
import TabTable from './TabTable';
import EarnTrend from './EarnTrend';
import EarnPK from './EarnPK';
import { queryFundIncomeTrendData, queryFundPerformanceInfos, queryLastQuaryDay } from './service';

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: '40%',
    render: (_: any, record: any) => {
      return record.tipText ? (
        <span>
          {_}
          <Tooltip title={record.tipText}>
            <QuestionCircleOutlined
              style={{ fontSize: '12px', color: '#999', marginLeft: '2px' }}
            />
          </Tooltip>
        </span>
      ) : (
        _
      );
    },
  },
  {
    title: (
      <span>
        基金业绩
        <Tooltip title="数据来自定期报告">
          <QuestionCircleOutlined style={{ fontSize: '12px', color: '#999', marginLeft: '2px' }} />
        </Tooltip>
      </span>
    ),
    dataIndex: 'incomeRate',
    key: 'incomeRate',
  },
  {
    title: (
      <span>
        比较基准业绩
        <Tooltip title="数据来自定期报告">
          <QuestionCircleOutlined style={{ fontSize: '12px', color: '#999', marginLeft: '2px' }} />
        </Tooltip>
      </span>
    ),
    dataIndex: 'StandardIncomeRate',
    key: 'StandardIncomeRate',
  },
  {
    title: (
      <span>
        超额收益率
        <Tooltip title="数据来自定期报告">
          <QuestionCircleOutlined style={{ fontSize: '12px', color: '#999', marginLeft: '2px' }} />
        </Tooltip>
      </span>
    ),
    dataIndex: 'excessIncomeRate',
    key: 'excessIncomeRate',
  },
];

function Earn({ fundCode }: { fundCode: string }) {
  const [baseDates, setBaseDates] = useState(null);
  useEffect(() => {
    (async () => {
      const _baseDates = await queryLastQuaryDay({
        code: fundCode,
      });
      setBaseDates(_baseDates);
    })();
  }, []);

  return (
    <ProCard
      direction="column"
      gutter={[cardGutter, cardGutter]}
      size="small"
      bodyStyle={{ paddingTop: 'auto 0 ' }}
    >
      <ProCard bodyStyle={{ padding: 0 }}>
        <EarnTrend
          baseDates={baseDates}
          xField="navDate"
          yField="incomeRate"
          fundCode={fundCode}
          title={
            <span>
              收益走势
              <Tooltip title="该走势图为收益率走势图，非净值走势图">
                <QuestionCircleOutlined
                  style={{ fontSize: '12px', color: '#999', marginLeft: '2px' }}
                />
              </Tooltip>
            </span>
          }
          fetch={queryFundIncomeTrendData}
        />
      </ProCard>
      <ProCard layout="center" bordered>
        <TabTable fundCode={fundCode} columns={columns} />
      </ProCard>
      <ProCard bodyStyle={{ padding: 0 }}>
        <EarnPK
          baseDates={baseDates}
          xField="navDate"
          yField="incomeRate"
          fundCode={fundCode}
          title="收益PK"
          fetch={queryFundPerformanceInfos}
        />
      </ProCard>
    </ProCard>
  );
}

export default Earn;
