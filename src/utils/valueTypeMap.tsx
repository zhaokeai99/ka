import { FundDefaultValue, FundDefaultNullValue, FundDefaultFixed } from '@/utils/utils';
// import { negativeColor } from '@/themes/index';

export const valueTypeMap = {
  FundPercent: {
    render: (_: any) => (
      <span style={{ color: _ < 0 ? 'green' : 'red' }}>
        {_ === FundDefaultValue ? (
          <>{FundDefaultNullValue}</>
        ) : (
          `${(_ * 100).toFixed(FundDefaultFixed)}%`
        )}
      </span>
    ),
  },
  FundDigit: {
    render: (_: any) => (
      <>{_ === FundDefaultValue ? FundDefaultNullValue : parseFloat(_).toFixed(FundDefaultFixed)}</>
    ),
  },
  // 需要对数据扩展100
  FundDigit_2: {
    render: (_: any) => (
      <>
        {_ === FundDefaultValue
          ? FundDefaultNullValue
          : parseFloat(_ * 100).toFixed(FundDefaultFixed)}
      </>
    ),
  },
  FundMoney_10: {
    render: (_: any) => (
      <>
        {_ === FundDefaultValue
          ? FundDefaultNullValue
          : parseFloat(_ / 10000000000).toFixed(FundDefaultFixed)}
      </>
    ),
  },
  FundMoney_6: {
    render: (_: any) => (
      <>
        {_ === FundDefaultValue
          ? FundDefaultNullValue
          : parseFloat(_ / 1000000).toFixed(FundDefaultFixed)}
      </>
    ),
  },
  FundMoney_4: {
    render: (_: any) => (
      <>
        {_ === FundDefaultValue
          ? FundDefaultNullValue
          : parseFloat(_ / 10000).toFixed(FundDefaultFixed)}
      </>
    ),
  },
  BIFundColor: {
    render: (val: any) => {
      return (
        <span style={{ color: `${val}` !== '--' && `${val}`.startsWith('-') ? '#40B333' : '#333' }}>
          {val}
        </span>
      );
    },
  },
};
