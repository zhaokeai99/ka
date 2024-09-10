import { cardGutter, contentPadding } from '@/themes';
import ProCard from '@ant-design/pro-card';
import { Tabs } from 'antd';
import React, { useState } from 'react';
import New from './New';
import Change from './Change';
import Clear from './Clear';
import Policy from './Policy';

const { TabPane } = Tabs;

const PublicPlacement: React.FC = () => {
  const [activeTab] = useState('NEW');

  return (
    <ProCard
      style={{ padding: contentPadding }}
      direction="column"
      ghost
      gutter={[0, cardGutter]}
      size="small"
    >
      <ProCard style={{ padding: `0 ${contentPadding}` }} gutter={[cardGutter, 0]}>
        <Tabs defaultActiveKey={activeTab}>
          <TabPane key="NEW" tab="公募新发管理">
            <New />
          </TabPane>
          <TabPane key="CHANGE" tab="公募改造管理">
            <Change />
          </TabPane>
          <TabPane key="CLEAR" tab="公募清盘管理">
            <Clear />
          </TabPane>
          <TabPane key="POLICY" tab="公募政策管理">
            <Policy />
          </TabPane>
        </Tabs>
      </ProCard>
    </ProCard>
  );
};

export default PublicPlacement;
