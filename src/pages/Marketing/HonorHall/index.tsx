import React, { useState } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import Propt from './Propt';
import Prizes from './Prizes';
import List from './List';
import Awards from './Awards';
import Marketing from './Marketing';
import ThTabs from '@/components/ThTabs';

const { TabPane } = ThTabs;

const HonorHall: React.FC = () => {
  const [tabKey, setTabKey] = useState('Propt');

  return (
    <ProCardPlus ghost style={{ padding: '12px' }} sn="_marketing_honorHall">
      <ThTabs activeKey={tabKey} onChange={(key: any) => setTabKey(key)} size="small" type="card">
        <TabPane key="Propt" tab="部门信息管理">
          <Propt pageId="Propt" activeKey={tabKey} />
        </TabPane>
        <TabPane key="Prizes" tab="奖项配置">
          <Prizes pageId="Prizes" activeKey={tabKey} />
        </TabPane>
        <TabPane key="List" tab="榜单配置">
          <List pageId="List" activeKey={tabKey} />
        </TabPane>
        <TabPane key="Awards" tab="颁奖配置">
          <Awards pageId="Awards" activeKey={tabKey} />
        </TabPane>
        <TabPane key="Marketing" tab="营销管理">
          <Marketing pageId="Marketing" activeKey={tabKey} />
        </TabPane>
      </ThTabs>
    </ProCardPlus>
  );
};

export default HonorHall;
