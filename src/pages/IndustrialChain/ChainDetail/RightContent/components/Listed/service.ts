export interface SearchTableProps {
  marginTop?: string;
  radioList: any;
  title: string;
  columns: any;
  data: any;
  loading: boolean;
  onChange: (value: any) => void;
}

export const radioList = [
  {
    value: 'jlr',
    label: '净利润',
  },
  {
    value: 'jlrtb',
    label: '净利润同比',
  },
  {
    value: 'yesrtb',
    label: '营业收入同比',
  },
  {
    value: 'roe',
    label: 'ROE',
  },
  {
    value: 'roetb',
    label: 'ROE同比',
  },
  {
    value: 'eps',
    label: 'EPS',
  },
  {
    value: 'epstb',
    label: 'EPS同比',
  },
];
