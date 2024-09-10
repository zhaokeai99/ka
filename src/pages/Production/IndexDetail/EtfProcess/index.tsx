import { memo, useState } from 'react';
import { Tabs } from 'antd';
import DailyTask from './DailyTask';
import PCFUpload from './PCFUpload';
import SupplementaryBond from './SupplementaryBond';
const { TabPane } = Tabs;
// ETF流程
function ETFProcess({ fundId }: { fundId: string }) {
  const [activeTabKey, setActiveTabKey] = useState('1');
  return (
    <Tabs defaultActiveKey={activeTabKey} onChange={(key) => setActiveTabKey(key)}>
      <TabPane tab="日常任务" key="1">
        <DailyTask fundId={fundId} />
      </TabPane>
      <TabPane tab="PCF流程" key="2">
        <PCFUpload fundId={fundId} />
      </TabPane>
      <TabPane tab="补券流程" key="3">
        <SupplementaryBond fundId={fundId} />
      </TabPane>
    </Tabs>
  );
}

export default memo(ETFProcess);
