import React, { useState } from 'react';
import { Tabs } from 'antd';
import ProCardPlus from '@/components/ProCardPlus';
import AgencyCustomer from './AgencyCustomer';
import VogChannel from './VogChannel';
import useAuth from '@/components/Hooks/useAuth';
import NoPermissionCard from '@/components/NoPermissionCard';

const { TabPane } = Tabs;

// 客户配置
const Consumer = () => {
  const [tab, setTab] = useState('AgencyCustomer');
  const auth = useAuth({ sn: '_marketing_dataConfig_customer' });

  return (
    <ProCardPlus
      style={{ paddingTop: '4px', backgroundColor: '#FFF' }}
      ghost
      gutter={[0, 8]}
      size="small"
    >
      {auth ? (
        <Tabs
          size="small"
          activeKey={tab}
          onChange={(key) => setTab(key)}
          tabBarStyle={{ background: '#fff' }}
        >
          <TabPane key="VogChannel" tab="客户简称配置">
            <VogChannel />
          </TabPane>
          <TabPane key="AgencyCustomer" tab="机构客户配置">
            <AgencyCustomer />
          </TabPane>
        </Tabs>
      ) : (
        <NoPermissionCard />
      )}
    </ProCardPlus>
  );
};

export default Consumer;
