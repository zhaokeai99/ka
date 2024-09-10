import React, { memo } from 'react';
import { Empty } from 'antd';
import { List } from 'antd';
import './index.less';

const HolderList = (props: any) => {
  const { data } = props;

  if (data.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }
  return (
    <List
      style={{ width: '100%', height: 'calc(400px - 40px)', overflowY: 'scroll' }}
      dataSource={data}
      size="small"
      renderItem={(item: { investorName: string }, i) => {
        return (
          <List.Item>
            <span style={{ width: '10%', textAlign: 'center' }}>{i + 1}</span>
            <span className="investorName" title={item.investorName}>
              {item.investorName}
            </span>
          </List.Item>
        );
      }}
    />
  );
};

export default memo(HolderList);
