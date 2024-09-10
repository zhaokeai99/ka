import ColorSpan from '@/components/ColorSpan';
import ProTable from '@ant-design/pro-table';
import { Alert, Spin } from 'antd';
import React, { useState } from 'react';
import { queryDaily, queryHistory } from '../service';
import moment from 'moment';

interface TabTableProps {
  activeTab: string;
  list: any[];
  rowKey: string;
  columns: any[];
  expandedRowKeys: any;
  setExpandedRowKeys: (arr: string[]) => {};
}

// 子级tabColumns
const historyTabColumns: any[] = [
  {
    width: '2%',
    hideInSearch: true,
    fixed: 'left',
  },
  {
    title: '证券代码',
    dataIndex: 'stockCode',
    width: '28%',
    key: 'stockCode',
  },
  {
    title: '基金代码',
    dataIndex: 'indexCode',
    key: 'indexCode',
    hideInTable: true,
    initialValue: '987003',
    request: async () => {
      const data = [
        {
          label: '987003',
          value: '987003',
        },
      ];
      return data;
    },
    order: 1,
  },
  {
    title: '证券名称',
    dataIndex: 'stockName',
    align: 'right',
    ellipsis: true,
    width: '15%',
    key: 'stockName',
  },
  {
    title: '开始时间',
    dataIndex: 'startDate',
    width: '10%',
    align: 'right',
    key: 'startDate',
    render: (value: number) => <div>{moment(value).format('YYYY-MM-DD')}</div>,
  },
  {
    title: '结束时间',
    dataIndex: 'endDate',
    width: '10%',
    align: 'right',
    key: 'endDate',
    render: (value: number) => <div>{moment(value).format('YYYY-MM-DD')}</div>,
  },
  {
    title: '指数权重',
    dataIndex: 'indexWeight',
    width: '10%',
    key: 'indexWeight',
    align: 'right',
    render: (value: any) => <div>{value !== '-' ? `${value}%` : value}</div>,
  },
  {
    title: '涨跌幅',
    dataIndex: 'stockQuotation',
    key: 'stockQuotation',
    align: 'right',
    width: '10%',
    render: (value: any) => {
      return value !== '-' ? <ColorSpan value={value} suffix="%" /> : value;
    },
  },
  {
    title: '成交额',
    dataIndex: 'stockTradeScale',
    width: '10%',
    align: 'right',
    render: (value: any) => <div>{value !== '-' ? `${value}亿` : value}</div>,
    key: 'stockTradeScale',
  },
];
const dailyTabColumns: any[] = [
  {
    width: '2%',
    fixed: 'left',
    hideInSearch: true,
  },
  {
    title: '证券代码',
    dataIndex: 'stockCode',
    width: '28%',
    key: 'stockCode',
  },
  {
    title: '基金代码',
    dataIndex: 'indexCode',
    key: 'indexCode',
    initialValue: '987003',
    request: async () => {
      const data = [
        {
          label: '987003',
          value: '987003',
        },
      ];
      return data;
    },
    hideInTable: true,
    order: 1,
  },
  {
    title: '证券名称',
    dataIndex: 'stockName',
    align: 'right',
    ellipsis: true,
    width: '15%',
    key: 'stockName',
  },
  {
    title: '业务日期',
    dataIndex: 'businessDate',
    align: 'right',
    width: '15%',
    key: 'businessDate',
    render: (value: number) => {
      return <div>{moment(value).format('YYYY-MM-DD')}</div>;
    },
  },
  {
    title: '现价',
    dataIndex: 'stockPresentPrice',
    width: '10%',
    key: 'stockPresentPrice',
    align: 'right',
    render: (value: any) => <div>{value || '-'}</div>,
  },
  {
    title: '指数权重',
    dataIndex: 'indexWeight',
    width: '10%',
    key: 'indexWeight',
    align: 'right',
    render: (value: any) => {
      return value !== '-' ? <ColorSpan value={value} suffix="%" /> : value;
    },
  },
  {
    title: '涨跌幅',
    dataIndex: 'stockQuotation',
    key: 'stockQuotation',
    align: 'right',
    width: '10%',
    render: (value: any) => {
      return value !== '-' ? <ColorSpan value={value} suffix="%" /> : value;
    },
  },
  {
    title: '成交额',
    dataIndex: 'stockTradeScale',
    width: '10%',
    align: 'right',
    render: (value: any) => <div>{value !== '-' ? `${value}亿` : value}</div>,
    key: 'stockTradeScale',
  },
];

const TabTable = ({
  activeTab,
  list,
  rowKey,
  columns,
  expandedRowKeys,
  setExpandedRowKeys,
}: TabTableProps) => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // 获取数据
  const queryData = async (param: any, active: string) => {
    setLoading(true);
    const { indexCode, stockCode, endDate, startDate } = param;
    let res = [];
    if (active === 'HISTORY') {
      res = await queryHistory(
        {
          stockCode: stockCode || null,
          indexCode,
          endDate,
          industryType: 'wind',
          startDate,
        },
        active,
      );
    } else {
      res = await queryDaily(
        {
          stockCode: stockCode || null,
          indexCode,
          industryType: 'wind',
        },
        active,
      );
    }
    setData(res);
    setLoading(false);
    return res;
  };

  // 子级table
  const expandedRowRender = () => {
    return (
      <ProTable
        columns={activeTab === 'HISTORY' ? historyTabColumns : dailyTabColumns}
        headerTitle={false}
        showHeader={false}
        rowKey="stockCode"
        options={false}
        search={false}
        dataSource={list}
        pagination={false}
      />
    );
  };

  const headerTitle = () => {
    return (
      <Alert
        style={{ width: '100%' }}
        message={
          <Spin spinning={loading}>
            <div className="alertCollapse">
              <span>{data?.indexName || '-'}：</span>
              {rowKey === 'HISTORY' ? (
                ''
              ) : (
                <span>{<ColorSpan value={data?.indexPresentPrice || '-'} />}</span>
              )}
              <span>
                {data?.indexQuotation ? <ColorSpan value={data?.indexQuotation} suffix="%" /> : '-'}
              </span>
              <span>
                {data?.indexTradeScale ? (
                  <ColorSpan value={data?.indexTradeScale} suffix="亿" />
                ) : (
                  '-'
                )}
              </span>
            </div>
          </Spin>
        }
        type="info"
        showIcon
      />
    );
  };

  return (
    <div className={data?.length ? 'alert' : 'notHover alert'}>
      <ProTable
        columns={columns}
        expandIconColumnIndex={-1} // 去除表格body里的+号
        request={async (params: any) => {
          const { indexCode, endDate, startDate } = params;
          let classList = {};
          setExpandedRowKeys(['']);
          if (rowKey === 'HISTORY') {
            if (indexCode && endDate && startDate) {
              classList = await queryData(params, activeTab);
            } else {
              setData({});
            }
          } else {
            classList = await queryData(params, activeTab);
            if (!indexCode) setData({});
          }
          return {
            data: classList?.industryClassList,
            success: true,
          };
        }}
        headerTitle={headerTitle()}
        rowKey={(v) => {
          return v.id;
        }}
        options={false}
        expandable={{
          expandedRowRender,
          expandedRowKeys,
        }}
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
        form={{
          ignoreRules: false,
        }}
      />
    </div>
  );
};

export default TabTable;
