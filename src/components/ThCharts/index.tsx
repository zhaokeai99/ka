import React, { memo } from 'react';
import { Column } from '@ant-design/charts';
import { isEqual } from 'lodash-es';

export const ThColumn: React.FC<any> = memo(
  (config) => {
    return <Column {...config} />;
  },
  (pre, next) => {
    return isEqual(pre?.data, next?.data) && isEqual(pre.yField, next.yField);
  },
);
