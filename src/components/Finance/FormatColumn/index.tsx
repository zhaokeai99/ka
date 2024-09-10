import React, { memo } from 'react';

export default memo(
  ({
    value,
    calValue,
    nullValue = '-',
    fixed = 2,
    suffix = '',
    isMoney = false,
  }: {
    value: number | string;
    calValue: number | string;
    nullValue?: string;
    fixed?: number;
    suffix?: string;
    isMoney?: boolean;
  }) => (
    <>
      {value === nullValue
        ? value
        : isMoney
        ? parseFloat(`${calValue}`).toFixed(fixed).toLocaleString()
        : parseFloat(`${calValue}`).toFixed(fixed)}
      {suffix}
    </>
  ),
);
