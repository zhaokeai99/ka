import { useContext, useRef, useState } from 'react';
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { dealNumThousandsAndFloat } from '@/utils/utils';
import '../../index.less';
import { MpRsHoldItemFacadeQueryByPage, MTK_CODE_DIC, STK_TYPE_DIC } from '../service';
import { cardGutter, contentPadding } from '@/themes';
import ProCard from '@ant-design/pro-card';
import moment from 'moment';
import { TabLayoutContext } from '@/components/thfund-front-component/src';
import { getRowSpanCount } from '../../../../../util/TableRowSpan';

const MpHoldItemSearch = ({ match }: any) => {
  const { key: tabKey, setTabTitle } = useContext(TabLayoutContext);
  const [checkJumpUrlParam] = useState<any>(() => {
    const { mpCode, mpName, domain } = match.params;
    setTabTitle(tabKey, mpName);
    return { mpCode: mpCode, mpName: mpName, domain: domain };
  });
  const actionRef = useRef<ActionType>();
  const [tableData, setTableData] = useState<any>([]);

  const request = async (params?: any) => {
    const { mpCode, domain } = checkJumpUrlParam;
    if (params?.tradeDate) {
      params.tradeDate = moment(params?.tradeDate)?.format('YYYYMMDD');
    }
    const fmtParams = { ...params, mpCode, domain };
    const result = await MpRsHoldItemFacadeQueryByPage(fmtParams);
    if (result?.success) {
      const { data, total } = result?.data;
      setTableData(data);
      return {
        data: data || [],
        total: total,
        success: true,
      };
    }
    return {
      data: [],
      total: 0,
      success: false,
    };
  };

  const columns: any = [
    {
      title: '交易日期',
      dataIndex: 'tradeDate',
      valueType: 'date',
      align: 'center',
      hideInTable: true,
    },
    {
      title: '交易日期',
      dataIndex: 'tradeDate',
      align: 'center',
      hideInSearch: true,
      render: (text: string, record: any, index: number) => {
        const obj: any = {
          children: text,
          props: {},
        };
        obj.props.rowSpan = getRowSpanCount(tableData, 'tradeDate', index);
        obj.children = <div>{record.tradeDate}</div>;
        return obj;
      },
    },
    {
      title: '证券类型',
      dataIndex: 'stkType',
      align: 'center',
      hideInSearch: true,
      render: (text: string, record: any) => {
        // @ts-ignore
        return STK_TYPE_DIC[record.stkType];
      },
    },
    {
      title: '证券代码',
      dataIndex: 'stkCode',
      align: 'center',
    },
    {
      title: '证券名称',
      dataIndex: 'stkName',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '证券市场',
      dataIndex: 'mtkCode',
      align: 'center',
      hideInSearch: true,
      render: (text: string, record: any) => {
        // @ts-ignore
        const val = record?.mtkCode;
        if (val === undefined || val === null) {
          return '-';
        }
        return MTK_CODE_DIC[val];
      },
    },
    {
      title: '权重',
      dataIndex: 'weight',
      className: 'text-right head-center',
      hideInSearch: true,
      render: (text: string, record: any) => {
        // @ts-ignore
        const val = record?.weight;
        if (val === undefined || val === null) {
          return '-';
        }
        return (val * 100).toFixed(2) + '%';
      },
    },
    {
      title: '持有(手)',
      dataIndex: 'amount',
      className: 'text-right head-center',
      hideInSearch: true,
      render: (text: string, record: any) => {
        // @ts-ignore
        const val = record?.amount;
        if (val === undefined || val === null) {
          return '-';
        }
        return dealNumThousandsAndFloat(val / 100, 2);
      },
    },
    {
      title: '价格(收盘价)',
      dataIndex: 'price',
      className: 'text-right head-center',
      hideInSearch: true,
      render: (text: string, record: any) => {
        // @ts-ignore
        const val = record?.price;
        if (val === undefined || val === null) {
          return '-';
        }
        return dealNumThousandsAndFloat(val, 2);
      },
    },
    {
      title: '汇率',
      dataIndex: 'exRate',
      hideInSearch: true,
      className: 'text-right head-center',
    },
    {
      title: '市值(¥)',
      dataIndex: 'marketValue',
      hideInSearch: true,
      className: 'text-right head-center',
      render: (text: string, record: any) => {
        // @ts-ignore
        const val = record?.marketValue;
        if (val === undefined || val === null) {
          return '-';
        }
        return dealNumThousandsAndFloat(val, 2);
      },
    },
    {
      title: '当日收益(万元)',
      dataIndex: 'profit',
      hideInSearch: true,
      className: 'text-right head-center',
      render: (text: string, record: any) => {
        // @ts-ignore
        const val = record?.profit;
        if (val === undefined || val === null) {
          return '-';
        }
        return dealNumThousandsAndFloat((val / 10000).toFixed(2), 2);
      },
    },
    {
      title: '当日收益率',
      dataIndex: 'profitRatio',
      hideInSearch: true,
      className: 'text-right head-center',
      render: (text: string, record: any) => {
        // @ts-ignore
        const val = record?.profitRatio;
        if (val === undefined || val === null) {
          return '-';
        }
        return (val * 100).toFixed(4) + '%';
      },
    },
    {
      title: '成本价',
      dataIndex: 'costPrice',
      hideInSearch: true,
      className: 'text-right head-center',
      render: (text: string, record: any) => {
        // @ts-ignore
        const val = record?.costPrice;
        if (val === undefined || val === null) {
          return '-';
        }
        return dealNumThousandsAndFloat(val.toFixed(4), 4);
      },
    },
    {
      title: '总成本(万元)',
      dataIndex: 'costValue',
      hideInSearch: true,
      className: 'text-right head-center',
      render: (text: string, record: any) => {
        // @ts-ignore
        const val = record?.costValue;
        if (val === undefined || val === null) {
          return '-';
        }
        return dealNumThousandsAndFloat((val / 10000).toFixed(2), 2);
      },
    },
    {
      title: '总收益(万元)',
      dataIndex: 'accuIncome',
      hideInSearch: true,
      className: 'text-right head-center',
      render: (text: string, record: any) => {
        // @ts-ignore
        const val = record?.holdProfit;
        if (val === undefined || val === null) {
          return '-';
        }
        return dealNumThousandsAndFloat((val / 10000).toFixed(2), 2);
      },
    },
    {
      title: '总费用',
      dataIndex: 'totalFee',
      hideInSearch: true,
      className: 'text-right head-center',
      render: (text: string, record: any) => {
        // @ts-ignore
        const val = record?.totalFee;
        if (val === undefined || val === null) {
          return '-';
        }
        return dealNumThousandsAndFloat(val, 2);
      },
    },
  ];

  return (
    <ProCard
      style={{ padding: contentPadding }}
      direction="column"
      ghost
      gutter={[0, cardGutter]}
      size="small"
    >
      <ProTable
        headerTitle="组合持仓"
        size="small"
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={request}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        search={{ labelWidth: 'auto' }}
        options={{ density: false }}
      />
    </ProCard>
  );
};
export default MpHoldItemSearch;
