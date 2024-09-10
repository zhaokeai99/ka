import { Rate } from 'antd';
import React from 'react';

const desc = ['低风险1颗星', '', '中风险3颗星', '', '高风险5颗星'];

const Rater = function ({ data }: any) {
  return (
    <span>
      <Rate disabled tooltips={desc} value={data.score} style={{ color: 'red' }} />
    </span>
  );
};

export default Rater;
