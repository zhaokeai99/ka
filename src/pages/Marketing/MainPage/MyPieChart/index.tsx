import React, { memo } from 'react';
import { Pie } from '@ant-design/charts';
import { isEqual } from 'lodash';

export const MyPieChart: React.FC<any> = memo(
  (config) => {
    return <Pie {...config} />;
  },
  (pre, next) => {
    return isEqual(pre?.data, next?.data);
  },
);
