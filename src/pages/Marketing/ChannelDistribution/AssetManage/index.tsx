import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useModel } from 'umi';
import { Line, Column } from '@ant-design/charts';
import ProCard from '@ant-design/pro-card';
import ProTable from '@ant-design/pro-table';
import {
  queryAgencyAssetConfig,
  queryAgencyList,
  queryAgencyStockAmt,
  queryAgencyPurchaseConfig,
} from '../service';
import PickerComponent from '../PickerComponent';
import RangeComponent from '../RangeComponent';
import moment from 'moment';
import BarChart from '../BarChart';
import { Empty } from 'antd';

// 资产管理
export default function (props: any) {
  const { agencyCode } = props.match.params;
  const [{ dateInfo }] = useModel('useMarketingModel');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 7 });
  const [lineData, setLineData] = useState<any[]>([]);
  const [agencyData, setAgencyData] = useState<any[]>([]);
  const [columnData, setColumnData] = useState<any[]>([]);
  const [rangeDate, setRangeDate] = useState({
    startDate: '',
    endDate: '',
  });
  const initialPickerValue = {
    initialDate: dateInfo.dLastT1Day,
    initialType: '1',
  };
  const initialRangeValue = {
    type: 'months',
    start: moment().startOf('months').format('YYYY-MM-DD'),
    end: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  };

  const columns: any[] = [
    {
      title: '日期',
      dataIndex: 'natureDate',
      key: 'natureDate',
      fixed: 'left',
      width: 130,
      align: 'center',
    },
    {
      title: '申购（万）',
      dataIndex: 'purchaseAmt',
      key: 'purchaseAmt',
      align: 'center',
      sorter: true,
      valueType: 'BIFundColor',
    },
    {
      title: '赎回（万）',
      dataIndex: 'redeemAmt',
      key: 'redeemAmt',
      align: 'center',
      sorter: true,
      valueType: 'BIFundColor',
    },
    {
      title: '净申购（万）',
      dataIndex: 'netAmt',
      key: 'netAmt',
      align: 'center',
      sorter: true,
      valueType: 'BIFundColor',
    },
    {
      title: '申购笔数（万）',
      dataIndex: 'purchaseCnt',
      key: 'purchaseCnt',
      align: 'center',
      sorter: true,
      valueType: 'BIFundColor',
    },
    {
      title: '赎回笔数（万）',
      dataIndex: 'redeemCnt',
      key: 'redeemCnt',
      align: 'center',
      sorter: true,
      valueType: 'BIFundColor',
    },
    {
      title: '存量（亿）',
      dataIndex: 'stockAmt',
      key: 'stockAmt',
      align: 'center',
      sorter: true,
      valueType: 'BIFundColor',
    },
    {
      title: '收益（万）',
      dataIndex: 'profitAmt',
      key: 'profitAmt',
      align: 'center',
      sorter: true,
      valueType: 'BIFundColor',
    },
    {
      title: '累计收益（亿）',
      dataIndex: 'accumProfitAmt',
      key: 'accumProfitAmt',
      align: 'center',
      sorter: true,
      valueType: 'BIFundColor',
    },
  ];

  // 资产变化
  const queryTableList = useCallback(
    async (params: any, sorter: any) => {
      const { current, pageSize, startDate, endDate } = params;
      const { success, data } = await queryAgencyList({
        agencyCode: agencyCode,
        page: current,
        pageSize,
        startDate: startDate || initialRangeValue.start,
        endDate: endDate || initialRangeValue.end,
        orderType: sorter && Object.values(sorter)[0] === 'ascend' ? 'asc' : 'desc',
        orderColumn: (sorter && Object.keys(sorter)[0]) || 'natureDate',
      });
      if (success) {
        setPagination({ current: data.page, pageSize: data.pageSize });
      }
      return data;
    },
    [rangeDate],
  );

  // 存量趋势变化
  useEffect(() => {
    (async () => {
      const { success, data } = await queryAgencyStockAmt({
        agencyCode: agencyCode,
        startDate: rangeDate.startDate || initialRangeValue.start,
        endDate: rangeDate.endDate || initialRangeValue.end,
      });
      if (success) {
        setLineData(data);
      }
    })();
  }, [rangeDate]);

  // 资产贡献度
  const queryAgencyAssetInfo = async () => {
    const data = await queryAgencyAssetConfig({
      agencyCode: agencyCode,
      natureDate: dateInfo.dLastT1Day,
    });
    setAgencyData(data);
  };

  // 资产配置
  const queryAgencyPurchaseInfo = async (value: any) => {
    const { success, data } = await queryAgencyPurchaseConfig({
      agencyCode: agencyCode,
      dateDimension: value.dateDimension,
      dateDur: value.dateDur,
    });
    if (success) {
      setColumnData(data);
    }
  };

  useEffect(() => {
    queryAgencyAssetInfo();
    queryAgencyPurchaseInfo({
      dateDimension: initialPickerValue.initialType,
      dateDur: initialPickerValue.initialDate,
    });
  }, []);

  const columnConfig: any = useMemo(
    () => ({
      data: [],
      maxColumnWidth: 35,
      xField: 'fundTypeName',
      yField: 'purchaseAmt',
      appendPadding: [25, 0, 0, 0],
      style: {
        height: '300px',
        width: '100%',
      },
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false,
        },
      },
      yAxis: {
        tickCount: 5,
      },
      meta: {
        purchaseAmt: {
          alias: '投资金额',
          formatter: (value: any) => {
            return `${Number(value).toLocaleString()} 万`;
          },
        },
      },
      label: {
        position: 'top',
        offset: 4,
        content: (value: any) => {
          return `${Number(value.purchaseAmt).toLocaleString()}\n${value.proportion}`;
        },
      },
    }),
    [columnData],
  );

  const lineConfig: any = useMemo(
    () => ({
      xField: 'natureDate',
      yField: 'stockAmt',
      appendPadding: [10, 0],
      yAxis: {
        tickCount: 4,
      },
      meta: {
        stockAmt: {
          alias: '存量规模',
          formatter: (value: any) => {
            return `${value} 亿`;
          },
        },
      },
    }),
    [lineData],
  );

  const rangeOnChange = (value: any) => {
    setRangeDate({
      startDate: value.startDate || '',
      endDate: value.endDate || '',
    });
  };

  return (
    <ProCard split="horizontal" ghost size="small">
      <ProCard split="vertical" ghost>
        <ProCard title="资产贡献度" colSpan={10} style={{ height: '100%' }}>
          <BarChart data={agencyData} />
        </ProCard>
        <ProCard title="资产配置" colSpan={14}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <PickerComponent onChange={queryAgencyPurchaseInfo} {...initialPickerValue} />
          </div>
          <Column {...columnConfig} data={columnData} />
        </ProCard>
      </ProCard>
      <ProCard title="资产变化" split="horizontal">
        <div style={{ margin: '12px 0', display: 'flex', justifyContent: 'flex-end' }}>
          <RangeComponent
            onChange={rangeOnChange}
            selectType={initialRangeValue.type}
            startDate={initialRangeValue.start}
            endDate={initialRangeValue.end}
          />
        </div>
        <ProCard bordered split="vertical" ghost>
          <ProCard title="存量变化趋势" colSpan={12}>
            {!lineData || lineData?.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <Line {...lineConfig} data={lineData} style={{ height: '350px' }} />
            )}
          </ProCard>
          <ProCard ghost colSpan={12}>
            <ProTable
              style={{ paddingTop: '12px' }}
              columns={columns}
              scroll={{ x: 'max-content' }}
              pagination={{
                ...pagination,
                showSizeChanger: false,
              }}
              request={(params, sorter) => queryTableList(params, sorter)}
              params={rangeDate}
              rowKey="natureDate"
              search={false}
              options={false}
            />
          </ProCard>
        </ProCard>
      </ProCard>
    </ProCard>
  );
}
