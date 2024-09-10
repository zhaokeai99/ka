import React, { useContext, useRef, useState } from 'react';
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { dealNumThousandsAndFloat } from '@/utils/utils';
import '../../index.less';
import { MpAdjustLogQueryByPage, MTK_CODE_DIC, STK_TYPE_DIC } from '../service';
import { cardGutter, contentPadding } from '@/themes';
import ProCard from '@ant-design/pro-card';
import moment from 'moment';
import { TabLayoutContext } from '@/components/thfund-front-component/src';
import { getRowSpanCount } from '../../../../../util/TableRowSpan';

const MpHoldChgSearch = ({ match }: any) => {
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
    const result = await MpAdjustLogQueryByPage(fmtParams);
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
        if (record?.stkType) {
          return STK_TYPE_DIC[record?.stkType];
        }
        return '-';
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
      ellipsis: true,
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '证券市场',
      dataIndex: 'mtkCode',
      align: 'center',
      hideInSearch: true,
      render: (text: string, record: any) => {
        if (record?.mtkCode) {
          return MTK_CODE_DIC[record?.mtkCode];
        }
        return '-';
      },
    },
    {
      title: '上次调整权重',
      dataIndex: 'lastWeight',
      hideInSearch: true,
      className: 'text-right head-center',
      render: (text: string, record: any) => {
        // @ts-ignore
        if (record?.lastWeight !== null && record?.lastWeight !== undefined) {
          return (record?.lastWeight * 100)?.toFixed(2) + '%';
        }
        return '-';
      },
    },
    {
      title: '当前权重',
      dataIndex: 'iniWeight',
      className: 'text-right head-center',
      hideInSearch: true,
      render: (text: string, record: any) => {
        // @ts-ignore
        if (record?.iniWeight !== null && record?.iniWeight !== undefined) {
          return (record?.iniWeight * 100)?.toFixed(2) + '%';
        }
        return '-';
      },
    },
    {
      title: '目标权重',
      dataIndex: 'targetWeight',
      className: 'text-right head-center',
      hideInSearch: true,
      render: (_: string, record: any) => {
        if (record?.targetWeight !== null && record?.targetWeight !== undefined) {
          return (record?.targetWeight * 100)?.toFixed(4) + '%';
        }
        return '-';
      },
    },
    {
      title: '当前汇率',
      dataIndex: 'exRate',
      className: 'text-right head-center',
      hideInSearch: true,
      render: (text: string, record: any) => {
        if (record?.exRate) {
          return record?.exRate;
        }
        return '-';
      },
    },
    {
      title: '交易价格',
      dataIndex: 'targetPrice',
      className: 'text-right head-center',
      hideInSearch: true,
      render: (text: string, record: any) => {
        // @ts-ignore
        const val = record?.targetPrice;
        if (val === undefined || val === null) {
          return '-';
        }
        return dealNumThousandsAndFloat(val, 2);
      },
    },
    {
      title: '调整理由',
      ellipsis: true,
      dataIndex: 'comm',
      className: 'text-left head-center',
      hideInSearch: true,
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
        headerTitle="组合调整"
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
export default MpHoldChgSearch;
