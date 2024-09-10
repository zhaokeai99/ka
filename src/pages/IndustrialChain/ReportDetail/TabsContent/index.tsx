import React from 'react';
import { Tabs, Empty } from 'antd';

const { TabPane } = Tabs;

interface propsType {
  data: string;
}
const TabsContent = (props: propsType) => {
  return (
    <Tabs defaultActiveKey="abstract">
      <TabPane tab="摘要" key="abstract">
        {props?.data ? (
          <div dangerouslySetInnerHTML={{ __html: props?.data }}></div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </TabPane>
    </Tabs>
  );
};

export default TabsContent;
