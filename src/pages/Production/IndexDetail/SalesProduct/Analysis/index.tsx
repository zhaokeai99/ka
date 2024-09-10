import React, { useEffect, useState, useMemo } from 'react';
import ProCard, { StatisticCard } from '@ant-design/pro-card';
import PickerComponent from '../../../../Marketing/ChannelDistribution/PickerComponent';
import { MoneyCollectFilled } from '@ant-design/icons';
import { Line, Column } from '@ant-design/charts';
import { queryFundProfitability, queryAverageRate } from '../../../../Marketing/Product/service';
import ProCardPlus from '@/components/ProCardPlus';
import { Empty } from 'antd';
import moment from 'moment';

type PropsType = {
  fundCode: string;
};

// 能力分析
const Analysis = (props: PropsType) => {
  const { fundCode } = props;
  const [cardInfo, setCardInfo] = useState({ totalProfitAmt: '', totalProfitAcoCnt: '' });
  const [lineData, setLineData] = useState([]);
  const [columnData, setColumnData] = useState([]);

  const queryRateColumn = async () => {
    const { data } = await queryAverageRate({ fundCode });
    setColumnData(data);
  };

  const queryAbilityInfo = async (dateDimension?: any, dateDur?: any) => {
    const { data } = await queryFundProfitability({
      fundCode,
      dateDimension: dateDimension || '3',
      dateDur: dateDur || moment().format('YYYY-MM'),
    });
    setLineData(data?.fundDaySumDetailVOS || []);
    setCardInfo({
      totalProfitAmt: data?.totalProfitAmt || '',
      totalProfitAcoCnt: data?.totalProfitAcoCnt || '',
    });
  };

  useEffect(() => {
    queryAbilityInfo();
    queryRateColumn();
  }, []);

  const lineConfig: any = useMemo(
    () => ({
      data: lineData,
      padding: 'auto',
      xField: 'natureDate',
      yField: 'sumProfitAmt',
      appendPadding: 10,
      yAxis: {
        tickCount: 4,
      },
      slider: {
        start: 0,
        end: 1,
      },
      label: {
        autoRotate: true,
      },
      style: {
        height: '250px',
      },
      meta: {
        sumProfitAmt: { alias: '收益（万）' },
      },
    }),
    [lineData],
  );

  const columnConfig: any = useMemo(
    () => ({
      data: columnData,
      xField: 'name',
      yField: 'incomeRate',
      maxColumnWidth: 35,
      appendPadding: [10, 10, 0, 10],
      xAxis: {
        label: {
          autoRotate: true,
        },
      },
      yAxis: {
        tickCount: 7,
      },
      style: {
        height: '330px',
      },
      meta: {
        incomeRate: { alias: '涨跌幅' },
      },
      tooltip: {
        formatter: (value: any) => {
          return { name: value.name, value: `${value.incomeRate}%` };
        },
      },
    }),
    [columnData],
  );

  return (
    <ProCardPlus direction="column" style={{ marginBottom: '20px' }}>
      <div style={{ paddingBottom: '12px' }}>
        <PickerComponent
          onChange={(val: any) => queryAbilityInfo(val.dateDimension, val.dateDur)}
          initialType="3"
          initialDate={moment().format('YYYY-MM')}
          labelWidth="auto"
        />
      </div>
      <ProCard ghost split="vertical" bordered>
        <ProCard split="horizontal" title="盈利能力">
          <ProCard split="vertical">
            <StatisticCard
              statistic={{
                title: '累计为客户创造收益（亿）',
                value: cardInfo.totalProfitAmt || '--',
                icon: <MoneyCollectFilled style={{ fontSize: 40, color: 'rgb(24, 120, 253)' }} />,
              }}
            />
            <StatisticCard
              statistic={{
                title: '累计赚钱客户数(万)',
                value: cardInfo.totalProfitAcoCnt || '--',
                icon: <MoneyCollectFilled style={{ fontSize: 40, color: 'rgb(24, 120, 253)' }} />,
              }}
            />
          </ProCard>
          <ProCard>
            {!lineData || lineData?.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <Line {...lineConfig} />
            )}
          </ProCard>
        </ProCard>
        <ProCard title="平均收益率">
          {!columnData || columnData?.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <Column {...columnConfig} />
          )}
        </ProCard>
      </ProCard>
    </ProCardPlus>
  );
};

export default Analysis;
