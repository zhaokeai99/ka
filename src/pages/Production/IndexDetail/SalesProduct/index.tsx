import React, { memo, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { useModel } from 'umi';
import Profiles from './Profiles';
import CastSurely from './CastSurely';
import Channel from './Channel';
import Analysis from './Analysis';

const { TabPane } = Tabs;

type PropsType = {
  fundCode: string;
};

const SalesProduct = (props: PropsType) => {
  const { fundCode } = props;
  const [{ dateInfo }, { fetchDateInfo }] = useModel('useMarketingModel');
  const [activeTabKey, setActiveTabKey] = useState('');

  useEffect(() => {
    fetchDateInfo();
  }, []);

  return (
    <Tabs
      className="none-select"
      defaultActiveKey={activeTabKey}
      onChange={(key) => setActiveTabKey(key)}
    >
      {dateInfo && (
        <>
          <TabPane tab="概览" key="1">
            <Profiles fundCode={fundCode} />
          </TabPane>
          <TabPane tab="定投" key="2">
            <CastSurely fundCode={fundCode} />
          </TabPane>
          <TabPane tab="渠道" key="3">
            <Channel fundCode={fundCode} />
          </TabPane>
          <TabPane tab="能力分析" key="4">
            <Analysis fundCode={fundCode} />
          </TabPane>
        </>
      )}
    </Tabs>
  );
};

export default memo(SalesProduct);
