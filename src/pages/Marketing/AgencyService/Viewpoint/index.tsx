import React, { useState } from 'react';
import { Tabs } from 'antd';
import ProCardPlus from '@/components/ProCardPlus';
import FundManagerViewpoint from './FundManagerViewpoint';
import StrategyMeeting from './StrategyMeeting';
import MarketView from './MarketView';
import ModuleTitle from './ModuleTitle';
import PeerDynamicState from './PeerDynamicState';
import useAuth from '@/components/Hooks/useAuth';
import NoPermissionCard from '@/components/NoPermissionCard';

const { TabPane } = Tabs;

// 观点配置
const Viewpoint = () => {
  const [tab, setTab] = useState('FundManagerViewpoint');
  const auth = useAuth({ sn: '_marketing_viewpoint' });

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
            <TabPane key="FundManagerViewpoint" tab="基金经理观点">
              <FundManagerViewpoint />
            </TabPane>
            <TabPane key="StrategyMeeting" tab="策略会">
              <StrategyMeeting />
            </TabPane>
            <TabPane key="MarketView" tab="市场观点">
              <MarketView />
            </TabPane>
            <TabPane key="ModuleTitle" tab="模块标题">
              <ModuleTitle />
            </TabPane>
            <TabPane key="PeerDynamicState" tab="同行动态">
              <PeerDynamicState />
            </TabPane>
          </Tabs>
        </>
      ) : (
        <NoPermissionCard />
      )}
    </ProCardPlus>
  );
};

export default Viewpoint;
