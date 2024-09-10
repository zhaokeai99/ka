import React, { useState } from 'react';
import { Tabs } from 'antd';
import ProCardPlus from '@/components/ProCardPlus';
import AgencyInfo from './AgencyInfo';
import AgencyDeptInfo from './AgencyDeptInfo';
import UserName from './UserName';
import UserInfo from './UserInfo';
import UserAssociation from './UserAssociation';
import useAuth from '@/components/Hooks/useAuth';
import NoPermissionCard from '@/components/NoPermissionCard';

const { TabPane } = Tabs;

// 客户配置
const Consumer = () => {
  const [tab, setTab] = useState('AgencyInfo');
  const auth = useAuth({ sn: '_marketing_consumer' });

  return (
    <ProCardPlus
      style={{ paddingTop: '4px', backgroundColor: '#FFF' }}
      ghost
      gutter={[0, 8]}
      size="small"
    >
      {auth ? (
        <>
          <Tabs
            size="small"
            activeKey={tab}
            onChange={(key) => setTab(key)}
            tabBarStyle={{ background: '#fff' }}
          >
            <TabPane key="AgencyInfo" tab="机构信息">
              <AgencyInfo />
            </TabPane>
            <TabPane key="AgencyDeptInfo" tab="部门信息">
              <AgencyDeptInfo />
            </TabPane>
            <TabPane key="UserInfo" tab="用户信息">
              <UserInfo />
            </TabPane>
            <TabPane key="UserName" tab="用户户名">
              <UserName />
            </TabPane>
            <TabPane key="UserAssociation" tab="用户关联关系">
              <UserAssociation />
            </TabPane>
          </Tabs>
        </>
      ) : (
        <NoPermissionCard />
      )}
    </ProCardPlus>
  );
};

export default Consumer;
