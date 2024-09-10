import React, { memo } from 'react';
import { Descriptions } from 'antd';

const Investor = (props: any) => {
  const { data } = props;
  return (
    <Descriptions title="投资者情况说明">
      <Descriptions.Item label="基金代码">{data?.fundCode ?? '-'}</Descriptions.Item>
      <Descriptions.Item label="基金名称">{data?.fundName ?? '-'}</Descriptions.Item>
      <Descriptions.Item label="机构客户数">{data?.orgAcctCnt ?? '-'}</Descriptions.Item>
      <Descriptions.Item label="机构认购的基金份额">{data?.orgTotalShare ?? '-'}</Descriptions.Item>
      <Descriptions.Item label="机构认购占总份额的比例">
        {data?.orgShareRatioPercent ?? '-'}
      </Descriptions.Item>
      <Descriptions.Item label="个人客户数">{data?.perAcctCnt ?? '-'}</Descriptions.Item>
      <Descriptions.Item label="个人认购份额">{data?.perTotalShare ?? '-'}</Descriptions.Item>
      <Descriptions.Item label="个人认购占总份额的比例">
        {data?.perShareRatioPercent ?? '-'}
      </Descriptions.Item>
      <Descriptions.Item label="合计客户数">{data?.totalAcctCnt ?? '-'}</Descriptions.Item>
      <Descriptions.Item label="合计认购的基金份额">{data?.totalShare ?? '-'}</Descriptions.Item>
      <Descriptions.Item label="合计认购占总份额比例">
        {data?.totalShareRatioPercent ?? '-'}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default memo(Investor);
