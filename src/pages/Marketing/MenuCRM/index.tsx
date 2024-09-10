import React from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import ThTabs from '@/components/ThTabs';
import Banner from './Banner';
import Message from './Message';

const { TabPane } = ThTabs;

const MenuCRM = () => {
  return (
    <ProCardPlus
      sn="_marketing_dataConfig_authority" // 与销售看板共用一个sn
      style={{ padding: '12px 12px' }}
      ghost
      gutter={[0, 8]}
      size="small"
    >
      <ThTabs size="small" type="card">
        <TabPane key="message" tab="消息配置">
          <Message />
        </TabPane>
        <TabPane key="banner" tab="Banner配置">
          <Banner />
        </TabPane>
      </ThTabs>
    </ProCardPlus>
  );
};

export default MenuCRM;
