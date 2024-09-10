import React, { useEffect, useState } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import { Tabs } from 'antd';
import CategoryTable from './CategoryTable';
import { catSupportQuery } from '../service';

const { TabPane } = Tabs;

const Category = () => {
  const [tabData, setTabData] = useState<any[]>([]);
  const [tabKey, setTabKey] = useState('');

  useEffect(() => {
    (async () => {
      const data = await catSupportQuery();
      setTabData(data);
      setTabKey(data && data.length > 0 ? data[0].catModuleId : '');
    })();
  }, []);

  return (
    <ProCardPlus ghost style={{ padding: '12px 12px' }} gutter={[0, 8]} size="small">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        size="small"
        type="card"
        tabBarStyle={{ background: '#fff', marginBottom: 0 }}
      >
        {tabData?.map((i: any) => (
          <TabPane key={i.catModuleId} tab={i.catModuleName}>
            <CategoryTable tabId={i.catModuleId} />
          </TabPane>
        ))}
      </Tabs>
    </ProCardPlus>
  );
};

export default Category;
