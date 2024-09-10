import React, { memo } from 'react';
import FormatColumn from '@/components/Finance/FormatColumn';

export default memo(
  ({
    value,
    calValue,
    nullValue = '-',
    fixed = 2,
    suffix = '',
    fallColor = 'green',
    riseColor = 'red',
    isMoney = false,
  }: {
    value: number | string;
    calValue: number | string;
    nullValue?: string;
    fixed?: number;
    suffix?: string;
    fallColor?: string;
    riseColor?: string;
    isMoney?: boolean;
  }) => (
    <span style={{ color: value === nullValue || value < 0 ? fallColor : riseColor }}>
      <FormatColumn
        value={value}
        calValue={calValue}
        nullValue={nullValue}
        fixed={fixed}
        suffix={suffix}
        isMoney={isMoney}
      />
    </span>
  ),
);
