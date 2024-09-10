import React from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import ThTabs from '@/components/ThTabs';
import CopyWriter from './CopyWriter';
import Consumer from './Consumer';
import Viewpoint from './Viewpoint';
import StaticResource from './StaticResource';

const { TabPane } = ThTabs;

const AgencyService = () => {
  return (
    <ProCardPlus style={{ padding: '12px 12px' }} ghost gutter={[0, 8]} size="small">
      <ThTabs size="small" type="card">
        <TabPane key="CopyWriter" tab="机构服务文案配置">
          <CopyWriter />
        </TabPane>
        <TabPane key="Consumer" tab="机构服务客户配置">
          <Consumer />
        </TabPane>
        <TabPane key="Viewpoint" tab="机构服务观点配置">
          <Viewpoint />
        </TabPane>
        <TabPane key="StaticResource" tab="机构服务静态资源配置">
          <StaticResource />
        </TabPane>
      </ThTabs>
    </ProCardPlus>
  );
};

export default AgencyService;
