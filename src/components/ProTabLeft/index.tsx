import React from 'react';
import ProCard from '@ant-design/pro-card';
import { Tabs } from 'antd';
import { useState } from 'react';
import './index.less';
const { TabPane } = Tabs;

const ProCardPlus = (prop: any) => {
  const { title, config } = prop;
  const [activeTabKey, setActiveTabKey] = useState('tab1');

  return (
    <ProCard bodyStyle={{ backgroundColor: 'rgb(240, 242, 245)', padding: '16px 0' }}>
      <div className="tabTitle">{title}</div>
      <Tabs
        tabPosition="right"
        className="columnTab"
        defaultActiveKey={activeTabKey}
        onChange={(v) => {
          setActiveTabKey(v);
        }}
      >
        {config.map(({ key, name, component }) => (
          <TabPane key={key} tab={name}>
            <div className="componentWrap">{component}</div>
          </TabPane>
        ))}
      </Tabs>
    </ProCard>
  );
};

ProCardPlus.isProCard = true;

export default ProCardPlus;
