import React, { memo } from 'react';
import { Descriptions } from 'antd';

const Instructions = (props: any) => {
  const { data } = props;
  return (
    <Descriptions title="备案请示">
      <Descriptions.Item label="基金代码">{data?.fundCode ?? '-'}</Descriptions.Item>
      <Descriptions.Item label="基金名称">{data?.fundName ?? '-'}</Descriptions.Item>
      <Descriptions.Item label="募集时间">{data?.raiseDate ?? '-'}</Descriptions.Item>
      <Descriptions.Item label="净认购金额">{data?.pureTotalAmount ?? '-'}</Descriptions.Item>
      <Descriptions.Item label="募集期总利息">{data?.totalInst ?? '-'}</Descriptions.Item>
      <Descriptions.Item label="折算总份额（含本息）">{data?.totalShare ?? '-'}</Descriptions.Item>
      <Descriptions.Item label="总户数">{data?.totalCnt ?? '-'}</Descriptions.Item>
    </Descriptions>
  );
};

export default memo(Instructions);
