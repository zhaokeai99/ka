import { memo, useState } from 'react';
import { Tabs } from 'antd';
import Basic from './Basic';
import Manager from './Manager';
import Fee from './Fee';
import DateInfo from './DateInfo';
import Person from './Person';
import Tags from './Tags';

const { TabPane } = Tabs;

function Detail({ fundId }: { fundId: string }) {
  const [activeTabKey, setActiveTabKey] = useState('1');

  return (
    <Tabs defaultActiveKey={activeTabKey} onChange={(key) => setActiveTabKey(key)}>
      <TabPane tab="基本信息" key="1">
        <Basic fundId={fundId} />
      </TabPane>
      <TabPane tab="费用信息" key="2">
        <Fee fundId={fundId} />
      </TabPane>
      <TabPane tab="基金经理&投资经理" key="3">
        <Manager fundId={fundId} />
      </TabPane>
      <TabPane tab="日期信息" key="4">
        <DateInfo fundId={fundId} />
      </TabPane>
      <TabPane tab="干系人信息" key="5">
        <Person fundId={fundId} />
      </TabPane>
      <TabPane tab="标签" key="6">
        <Tags fundId={fundId} />
      </TabPane>
    </Tabs>
  );
}

export default memo(Detail);
