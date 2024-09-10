import React, { useState } from 'react';
import { Tabs } from 'antd';
import ProCardPlus from '@/components/ProCardPlus';
import FundManager from './FundManager';
import ProductPromotion from './ProductPromotion';
import useAuth from '@/components/Hooks/useAuth';
import NoPermissionCard from '@/components/NoPermissionCard';

const { TabPane } = Tabs;

// 文案配置
const CopyWriter = () => {
  const [tab, setTab] = useState('FundManager');
  const auth = useAuth({ sn: '_marketing_copywriter' });

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
            <TabPane key="FundManager" tab="基金经理">
              <FundManager />
            </TabPane>
            <TabPane key="ProductPromotion" tab="产品推介">
              <ProductPromotion />
            </TabPane>
          </Tabs>
        </>
      ) : (
        <NoPermissionCard />
      )}
    </ProCardPlus>
  );
};

export default CopyWriter;
