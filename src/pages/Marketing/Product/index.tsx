import ProCardPlus from '@/components/ProCardPlus';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import React, { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import PickerComponent from '../ChannelDistribution/PickerComponent';
import { ProductFundIndex } from './data';
import { queryFundList } from './service';

const valueEnumArray: any = [
  ['', { text: '全部' }],
  ['0', { text: '股票型基金' }],
  ['1', { text: '混合型基金' }],
  ['2', { text: '债券型基金' }],
  // ['3', { text: '货币型基金' }],
  ['4', { text: '指数型基金' }],
  ['6', { text: 'FOF型基金' }],
  ['7', { text: 'ETF型基金' }],
];

const PracticeIndex: React.FC = () => {
  const [{ dateInfo }, { fetchDateInfo }] = useModel('useMarketingModel');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [dateParams, setDateParams] = useState({
    dateDimension: '1',
    dateDur: '',
  });
  const [hideColumns, setHideColumns] = useState(false);

  useEffect(() => {
    fetchDateInfo();
  }, []);

  const pickerOnChange = (values: any) => {
    setDateParams({ ...values });
  };

  const columns: ProColumns<ProductFundIndex, 'BIFundColor'>[] = useMemo(
    () => [
      {
        title: '产品名称',
        dataIndex: 'fundName',
        fixed: 'left',
        width: 230,
        render: (_, item) => (
          <a rel="noopener noreferrer" href={`#/production/index/newDetail/${item.fundCode}`}>
            {_}
          </a>
        ),
      },
      {
        title: '产品代码',
        dataIndex: 'fundCode',
        fixed: 'left',
        width: 130,
      },
      {
        title: '申购金额（万）',
        dataIndex: 'purchaseAmt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '赎回金额（万）',
        dataIndex: 'redeemAmt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '净申购（万）',
        dataIndex: 'netAmt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '申购笔数（万）',
        dataIndex: 'purchaseCnt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '赎回笔数（万）',
        dataIndex: 'redeemCnt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '申购客户数（万）',
        dataIndex: 'purchaseCumCnt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '赎回客户数（万）',
        dataIndex: 'redeemCumCnt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '定投金额（万）',
        dataIndex: 'fixPurchaseAmt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '定投笔数（万）',
        dataIndex: 'fixPurchaseCnt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '定投客户数（万）',
        dataIndex: 'fixPurchaseCumCnt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '新增交易客户数',
        dataIndex: 'newPurchaseCumCnt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '时点规模（亿）',
        dataIndex: 'stockAmt',
        sorter: true,
        search: false,
        hideInTable: hideColumns,
        valueType: 'BIFundColor',
      },
      {
        title: '年初规模（亿）',
        dataIndex: 'yearHeadStockAmt',
        sorter: true,
        search: false,
        hideInTable: hideColumns,
        valueType: 'BIFundColor',
      },
      {
        title: '年度保有净增（亿）',
        dataIndex: 'holdNetAmt',
        sorter: true,
        search: false,
        hideInTable: hideColumns,
        valueType: 'BIFundColor',
      },
      {
        dataIndex: 'pickerValues',
        hideInTable: true,
        renderFormItem: (_, fieldConfig, form) => {
          if (fieldConfig.type === 'form') {
            return null;
          }
          const status = form.getFieldValue('status');
          if (status !== open) {
            return (
              <PickerComponent
                onChange={pickerOnChange}
                initialType="1"
                initialDate={dateInfo?.dLastT1Day}
              />
            );
          }
          return fieldConfig.defaultRender(_);
        },
      },
      {
        title: '产品类型',
        dataIndex: 'vogType',
        hideInTable: true,
        colSize: 3,
        valueType: 'radioButton',
        valueEnum: new Map(valueEnumArray),
        fieldProps: {
          defaultValue: '',
          buttonStyle: 'solid',
        },
      },
    ],
    [dateInfo],
  );

  const proTableRequest = async (params: any, sorter: any) => {
    const {
      pageSize,
      current,
      dateDimension,
      dateDur,
      endDate,
      startDate,
      vogType,
      fundName,
      fundCode,
    } = {
      ...params,
      ...dateParams,
    } as any;
    const { success, data } = await queryFundList({
      pageSize,
      page: current,
      dateDimension: dateDimension,
      dateDur: dateDur || dateInfo.dLastT1Day,
      endDate,
      startDate,
      ...(vogType ? { fundType: vogType } : {}),
      orderType: Object.values(sorter)[0] === 'ascend' ? 'asc' : 'desc',
      orderColumn: Object.keys(sorter)[0] || 'purchaseAmt',
      fundName,
      fundCode,
    });
    if (success) {
      setPagination({
        current: data.page,
        pageSize: data.pageSize,
      });
      setHideColumns(dateDimension !== '1');
    }
    return data;
  };

  return (
    <ProCardPlus
      className="none-select"
      ghost
      style={{ padding: '12px 12px' }}
      sn="_marketing_product"
    >
      {dateInfo && (
        <ProTable<ProductFundIndex>
          headerTitle="非货公募产品交易查询"
          size="middle"
          options={{
            density: false,
          }}
          rowKey="fundCode"
          search={{ labelWidth: 120, defaultCollapsed: false }}
          onReset={() => {
            setDateParams({
              dateDimension: '1',
              dateDur: dateInfo.dLastT1Day,
            });
          }}
          request={proTableRequest}
          pagination={{ ...pagination, pageSizeOptions: ['10', '20', '30', '40'] }}
          columns={columns}
          scroll={{ x: 'max-content' }}
        />
      )}
    </ProCardPlus>
  );
};

export default PracticeIndex;
