import { useContext, useRef, useState } from 'react';
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { dealNumThousandsAndFloat } from '@/utils/utils';
import '../../index.less';
import { MpRsDealQueryByPage, MTK_CODE_DIC, STK_TYPE_DIC } from '../service';
import { cardGutter, contentPadding } from '@/themes';
import ProCard from '@ant-design/pro-card';
import moment from 'moment';
import {
  DEAL_DIRECTION_DIC,
  ORDER_CODE_DIC,
} from '@/pages/Investment/Simulation/PortfolioManagement/service';
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
    const result = await MpRsDealQueryByPage(fmtParams);
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
        return MTK_CODE_DIC[record.mtkCode];
      },
    },
    {
      title: '下单方式',
      dataIndex: 'orderType',
      align: 'center',
      hideInSearch: true,
      render: (text: string, record: any) => {
        return ORDER_CODE_DIC[record.orderType];
      },
    },
    {
      title: '成交权重',
      dataIndex: 'dealWeight',
      className: 'text-right head-center',
      hideInSearch: true,
      render: (text: string, record: any) => {
        // @ts-ignore
        const val = record?.dealWeight;
        if (val === undefined || val === null) {
          return '-';
        }
        return (val * 100).toFixed(2) + '%';
      },
    },
    {
      title: '成交汇率',
      dataIndex: 'exRate',
      className: 'text-right head-center',
      hideInSearch: true,
    },
    {
      title: '成交方向',
      dataIndex: 'dealDirection',
      align: 'center',
      hideInSearch: true,
      render: (text: string, record: any) => {
        return DEAL_DIRECTION_DIC[record.dealDirection];
      },
    },
    {
      title: '成交价格',
      dataIndex: 'dealPrice',
      className: 'text-right head-center',
      hideInSearch: true,
      render: (text: string, record: any) => {
        // @ts-ignore
        const val = record?.dealPrice;
        if (val === undefined || val === null) {
          return '-';
        }
        return dealNumThousandsAndFloat(val, 2);
      },
    },
    {
      title: '成交股数(手)',
      dataIndex: 'dealAmount',
      className: 'text-right head-center',
      hideInSearch: true,
      render: (text: string, record: any) => {
        // @ts-ignore
        const val = record?.dealAmount;
        if (val === undefined || val === null) {
          return '-';
        }
        return dealNumThousandsAndFloat(val / 100, 2);
      },
    },
    {
      title: '成交金额(万元)',
      dataIndex: 'dealBalance',
      className: 'text-right head-center',
      hideInSearch: true,
      render: (text: string, record: any) => {
        // @ts-ignore
        const val = record?.dealBalance;
        if (val === undefined || val === null) {
          return '-';
        }
        return dealNumThousandsAndFloat((val / 10000).toFixed(2), 2);
      },
    },
    {
      title: '交易费用',
      dataIndex: 'ordelFee',
      className: 'text-right head-center',
      hideInSearch: true,
      render: (text: string, record: any) => {
        // @ts-ignore
        const val = record?.ordelFee;
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
        headerTitle="成交明细"
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
