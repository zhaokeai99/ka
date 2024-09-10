import React, { useState } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import RoleDept from './RoleDept';
import RoleScreen from './RoleScreen';
import User from './User';
import ThTabs from '@/components/ThTabs';

const { TabPane } = ThTabs;

// 客户配置
const Consumer = () => {
  const [tab, setTab] = useState('RoleDept');

  return (
    <ProCardPlus
      sn="_marketing_dataConfig_authority"
      style={{ padding: '12px 12px' }}
      ghost
      gutter={[0, 8]}
      size="small"
    >
      <ThTabs size="small" activeKey={tab} type="card" onChange={(key: any) => setTab(key)}>
        <TabPane key="User" tab="人员角色配置">
          <User />
        </TabPane>
        <TabPane key="RoleDept" tab="角色部门权限配置">
          <RoleDept />
        </TabPane>
        <TabPane key="RoleScreen" tab="角色筛选权限配置">
          <RoleScreen />
        </TabPane>
      </ThTabs>
    </ProCardPlus>
  );
};

export default Consumer;
