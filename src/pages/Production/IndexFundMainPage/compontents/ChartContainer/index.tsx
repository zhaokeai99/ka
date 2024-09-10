import React, { memo, useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import ProCardPlus from '@/components/ProCardPlus';
import { Column } from '@ant-design/plots';
import { Spin } from 'antd';
import { useModel } from 'umi';
import { cardGutter } from '@/themes';
import { RedColor, GreenColor, industryName } from '../../config';
import {
  queryOneInflowAmount,
  queryThisYearInflowAmount,
  queryNewScaleAmount,
} from '../../service';

const ChartContainer: React.FC<{ fundType?: any }> = () => {
  const { dateInfo } = useModel('useIndexFundMainPageModal'); // 全局dateInfo
  const [oneInflowAmountData, setOneInflowAmountData] = useState<any>([]); //近一日ETF资金流入情况数据
  const [thisYearInflowAmountData, setThisYearInflowAmountData] = useState<any>([]); //今年ETF资金流入情况数据
  const [newScaleAmountData, setNewScaleAmountData] = useState<any>([]); // 最新ETF规模分布情况数据
  const [oneInflowAmountLoading, setOneInflowAmountLoading] = useState<boolean>(false);
  const [thisYearInflowAmountLoading, setThisYearInflowAmountLoading] = useState<boolean>(false);
  const [newScaleAmountLoading, setNewScaleAmountLoading] = useState<boolean>(false);

  // 近一日ETF资金流入情况
  const oneInflowAmountConfig = {
    xField: 'indexName',
    yField: 'indexValue',
    legend: false,
    seriesField: 'indexValue',
    padding: [20, 0, 90, 60],
    minColumnWidth: 3,
    maxColumnWidth: 3,
    yAxis: {
      title: {
        text: '金额(亿元)',
      },
    },
    xAxis: {
      label: {
        // interval: 1,
        autoRotate: true,
        autoEclipse: true,
        nice: false,
        style: {
          fontSize: 8,
        },
        formatter: (text: any) => {
          return Array.from(text)
            .map((item: any) => `${item}\n`)
            .join('');
        },
      },
    },
    color: ({ indexValue }: any) => {
      if (indexValue > 0) {
        return RedColor['red6'];
      }
      return GreenColor['green5'];
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: datum.indexName, value: datum.indexValue };
      },
    },
  };

  // 近一日ETF资金流入情况
  const thisYearInflowAmountConfig = {
    xField: 'indexName',
    yField: 'indexValue',
    legend: false,
    seriesField: 'indexValue',
    padding: [20, 0, 90, 60],
    minColumnWidth: 3,
    maxColumnWidth: 3,
    yAxis: {
      title: {
        text: '金额(亿元)',
      },
    },
    xAxis: {
      label: {
        autoRotate: true,
        autoEclipse: true,
        nice: false,
        style: {
          fontSize: 8,
        },
        formatter: (text: any) => {
          return Array.from(text)
            .map((item: any) => `${item}\n`)
            .join('');
        },
      },
    },
    color: ({ indexValue }: any) => {
      if (indexValue > 0) {
        return RedColor['red6'];
      }
      return GreenColor['green5'];
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: datum.indexName, value: datum.indexValue };
      },
    },
  };

  // 最新ETF规模分布情况
  const newScaleAmountConfig = {
    xField: 'indexName',
    yField: 'indexValue',
    legend: false,
    seriesField: 'indexName',
    padding: [20, 0, 90, 60],
    minColumnWidth: 3,
    maxColumnWidth: 3,
    yAxis: {
      title: {
        text: '金额(亿元)',
      },
    },
    xAxis: {
      label: {
        autoRotate: true,
        autoEclipse: true,
        nice: false,
        style: {
          fontSize: 8,
        },
        formatter: (text: any) => {
          return Array.from(text)
            .map((item: any) => `${item}\n`)
            .join('');
        },
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: datum.indexName, value: datum.indexValue };
      },
    },
  };

  // 获取近一日ETF资金流入情况
  const getOneInflowAmountData = async () => {
    setOneInflowAmountLoading(true);
    const result = await queryOneInflowAmount({ businessDate: dateInfo?.changeDate, industryName });
    setOneInflowAmountData(result);
    setOneInflowAmountLoading(false);
  };

  // 获取近一日ETF资金流入情况
  const getThisYearInflowAmount = async () => {
    setThisYearInflowAmountLoading(true);
    const result = await queryThisYearInflowAmount({
      businessDate: dateInfo?.changeDate,
      industryName,
    });
    setThisYearInflowAmountData(result);
    setThisYearInflowAmountLoading(false);
  };

  // 获取最新ETF规模分布情况
  const getNewScaleAmount = async () => {
    setNewScaleAmountLoading(true);
    const result = await queryNewScaleAmount({ businessDate: dateInfo?.changeDate, industryName });
    setNewScaleAmountData(result);
    setNewScaleAmountLoading(false);
  };

  useEffect(() => {
    getOneInflowAmountData();
    getThisYearInflowAmount();
    getNewScaleAmount();
  }, [dateInfo.changeDate]);

  return (
    <ProCard gutter={[cardGutter, 0]} ghost>
      <ProCardPlus
        title="近一日ETF资金流入情况"
        style={{ height: '350px' }}
        colSpan={8}
        layout="center"
        loading={oneInflowAmountLoading && <Spin spinning />}
      >
        <Column
          {...(oneInflowAmountConfig as any)}
          data={oneInflowAmountData}
          style={{ width: '100%', maxHeight: '280px' }}
        />
      </ProCardPlus>
      <ProCardPlus
        title="今年以来ETF资金流入情况"
        style={{ height: '350px' }}
        colSpan={8}
        layout="center"
        loading={thisYearInflowAmountLoading && <Spin spinning />}
      >
        <Column
          {...(thisYearInflowAmountConfig as any)}
          data={thisYearInflowAmountData}
          style={{ width: '100%', maxHeight: '280px' }}
        />
      </ProCardPlus>
      <ProCardPlus
        title="最新ETF规模分布情况"
        style={{ height: '350px' }}
        colSpan={8}
        layout="center"
        loading={newScaleAmountLoading && <Spin spinning />}
      >
        <Column
          {...(newScaleAmountConfig as any)}
          data={newScaleAmountData}
          style={{ width: '100%', maxHeight: '280px' }}
        />
      </ProCardPlus>
    </ProCard>
  );
};

export default memo(ChartContainer);
