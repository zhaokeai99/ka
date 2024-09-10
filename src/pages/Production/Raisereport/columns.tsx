import React from 'react';

export default (type: number): any[] => {
  switch (type) {
    case 1:
      return [
        {
          title: '基金代码',
          dataIndex: 'fundCode',
          render: (text: string) => <span style={{ color: '#3277fc' }}>{text}</span>,
        },
        {
          title: '基金名称',
          dataIndex: 'fundName',
        },
        {
          title: '净认购金额（人民币）',
          dataIndex: 'pureTotalAmount',
        },
        {
          title: '认购资金在募集期间产生的利息',
          dataIndex: 'totalInst',
        },
        {
          title: '有效认购份额',
          dataIndex: 'pureTotalShare',
        },
        {
          title: '利息结转份额',
          dataIndex: 'totalInstShre',
        },
        {
          title: '合计份额',
          dataIndex: 'totalShare',
        },
        {
          title: '管理人认购份额',
          dataIndex: 'fundManagerTotalShare',
        },
        {
          title: '管理人占总份额比例',
          dataIndex: 'fundManagerTotalShareRatio',
        },
        {
          title: '从业人认购份额',
          dataIndex: 'staffTotalShare',
          // hideInTable: issponsor,
        },
        {
          title: '从业人占总份额比例',
          dataIndex: 'staffTotalShareRatio',
          // hideInTable: issponsor,
        },
      ];
    case 4:
      return [
        {
          title: '基金代码',
          dataIndex: 'fundCode',
          render: (text: string) => <span style={{ color: '#3277fc' }}>{text}</span>,
        },
        {
          title: '基金名称',
          dataIndex: 'fundName',
        },
        {
          title: '总户数',
          dataIndex: 'acctCnt',
        },
        {
          title: '净认购金额',
          dataIndex: 'pureTotalAmount',
        },
        {
          title: '募集期总利息',
          dataIndex: 'totalInst',
        },
        {
          title: '募集期总金额',
          dataIndex: 'totalAmount',
        },
        {
          title: '净认购份额',
          dataIndex: 'pureTotalShare',
        },
        {
          title: '总利息结转份额',
          dataIndex: 'totalInstShre',
        },
        {
          title: '总份额',
          dataIndex: 'totalShare',
        },
        {
          title: '个人净认购份额',
          dataIndex: 'perTotalShare',
        },
        {
          title: '个人占总规模比例',
          dataIndex: 'perShareRatioPercent',
        },
        {
          title: '个人利息折份额',
          dataIndex: 'perInstShare',
        },
        {
          title: '机构利息折份额',
          dataIndex: 'orgInstShare',
        },
        {
          title: '机构净认购金额',
          dataIndex: 'orgTotalAmount',
        },
        {
          title: '机构占总规模比例',
          dataIndex: 'orgShareRatioPercent',
        },
        {
          title: '从业人员认购份额',
          dataIndex: 'staffTotalShare',
        },
        {
          title: '从业人员认购占比',
          dataIndex: 'staffTotalShareRatio',
        },
        {
          title: '从业人员总户数',
          dataIndex: 'staffTotalAcct',
        },
        {
          title: '基金管理人认购总份额',
          dataIndex: 'fundManagerTotalShare',
        },
        {
          title: '基金管理人认购份额占总规模比例',
          dataIndex: 'fundManagerTotalShareRatio',
        },
      ];
    default:
      return [];
  }
};
