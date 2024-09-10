import React, { memo } from 'react';
import { Descriptions } from 'antd';

const EffectBasic = (props: any) => {
  const { data } = props;
  return (
    <Descriptions title="生效公告">
      <Descriptions.Item label="基金代码">{data?.fundCode ?? '-'}</Descriptions.Item>
      <Descriptions.Item label="基金名称">{data?.fundName ?? '-'}</Descriptions.Item>
      <Descriptions.Item label="募集时间">{data?.raiseDate ?? '-'}</Descriptions.Item>
      <Descriptions.Item label="有效认购总户数">{data?.acctCnt ?? '-'}</Descriptions.Item>
    </Descriptions>
  );
};

export default memo(EffectBasic);
