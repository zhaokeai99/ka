import ColorSpan from '@/components/ColorSpan';

export const companyColumns: any = [
  {
    title: '排名',
    dataIndex: 'companyAddress',
    width: 40,
    ellipsis: true,
    render: (_: any, __: any, index: number) => {
      return index + 1;
    },
  },
  {
    title: '基金公司',
    dataIndex: 'fundCompany',
    width: 70,
    ellipsis: true,
    render: (text: any) => {
      return text || '--';
    },
  },
  {
    title: '规模(亿)',
    dataIndex: 'fundScale',
    width: 80,
    ellipsis: true,
    render: (text: any) => {
      return text || '--';
    },
  },
  {
    title: '发行量',
    dataIndex: 'productCount',
    width: 60,
    ellipsis: true,
    render: (text: any) => {
      return text || '--';
    },
  },
  // {
  //   title: '近五日流入',
  //   dataIndex: 'fiveInflowAmount',
  //   width: '20%',
  //   render: (text: any) => {
  //     return text || '--';
  //   },
  // },
  {
    title: '今年净流入(亿)',
    dataIndex: 'thisYearInflow',
    width: 100,
    ellipsis: true,
    render: (text: any) => {
      return text || text === 0 ? <ColorSpan value={text} suffix="" /> : '--';
    },
  },
];
export const themeColumns: any = [
  {
    title: '排名',
    dataIndex: 'companyAddress',
    width: 40,
    ellipsis: true,
    render: (_: any, __: any, index: number) => {
      return index + 1;
    },
  },
  {
    title: '基金公司',
    dataIndex: 'fundCompany',
    width: 80,
    ellipsis: true,
    render: (text: any) => {
      return text || '--';
    },
  },
  {
    title: '规模(亿)',
    dataIndex: 'fundScale',
    width: 80,
    ellipsis: true,
    render: (text: any) => {
      return text || '--';
    },
  },
  {
    title: '日涨跌',
    dataIndex: 'dailyRiseFall',
    ellipsis: true,
    width: 70,
    render: (text: any) => {
      return text || text === 0 ? <ColorSpan value={text} suffix="%" /> : '--';
    },
  },
  {
    title: '成交金额(亿)',
    dataIndex: 'dealAmount',
    width: 90,
    ellipsis: true,
    render: (text: any) => {
      return text || '--';
    },
  },
  // {
  //   title: '份额变动(万份)',
  //   dataIndex: 'shareChange',
  //   width: '21%',
  //   render: (text: any) => {
  //     return text || '--';
  //   },
  // },
];
export const widthFundColumns: any = [
  {
    title: '排名',
    dataIndex: 'companyAddress',
    width: 40,
    ellipsis: true,
    render: (_: any, __: any, index: number) => {
      return index + 1;
    },
  },
  {
    title: '基金公司',
    dataIndex: 'fundCompany',
    width: 80,
    ellipsis: true,
    render: (text: any) => {
      return text || '--';
    },
  },
  {
    title: '规模(亿)',
    dataIndex: 'fundScale',
    width: 80,
    ellipsis: true,
    render: (text: any) => {
      return text || '--';
    },
  },
  {
    title: '日涨跌',
    dataIndex: 'dailyRiseFall',
    width: 70,
    ellipsis: true,
    render: (text: any) => <ColorSpan value={text.toFixed(2)} suffix="%" />,
  },
  {
    title: '成交金额(亿)',
    dataIndex: 'dealAmount',
    width: 90,
    ellipsis: true,
    render: (text: any) => {
      return text || '--';
    },
  },
  // {
  //   title: '份额变动(万份)',
  //   dataIndex: 'shareChange',
  //   width: '21%',
  //   render: (text: any) => {
  //     return text || '--';
  //   },
  // },
];
