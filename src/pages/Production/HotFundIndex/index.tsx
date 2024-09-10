import ProCardPlus from '@/components/ProCardPlus';
import { GUTTER_SIZE } from '@/utils/utils';
import { Tabs } from 'antd';
import React, { useState } from 'react';
import FundCompany from './FundCompany';
import FundManage from './FundManage';
import FundProduction from './FundProduction';

const { TabPane } = Tabs;

const getTabType = (type) => {
  // type必须为这三种 否则默认返回第一种
  const tabTypeMap = {
    FUND: 'FUND',
    MANAGER: 'MANAGER',
    FUND_MANAGER: 'MANAGER',
    COMPANY: 'COMPANY',
    FUND_CORP: 'COMPANY',
  };
  if (type && tabTypeMap[type]) {
    return tabTypeMap[type];
  }
  return 'FUND';
};

export default function ({ history }: any) {
  const [key, setKey] = useState(() => {
    const pathname = history.location.pathname;
    const paths = pathname.split('/_single_/');
    const type = getTabType(paths[1]?.toUpperCase());
    return type;
  });

  const [initObj] = useState(() => {
    const {
      pathname,
      query: { schemeid },
    } = history.location;
    // const { schemeid } = history?.location?.query || {};
    const paths = pathname.split('/_single_/');
    const type = getTabType(paths[1]);
    // 当不存在schemeid 说明不需要指定默认的查询方案
    if (!schemeid) {
      return {};
    }
    switch (type) {
      case 'FUND':
        return {
          fundId: schemeid,
        };
      case 'MANAGER':
        return {
          managerId: schemeid,
        };
      case 'COMPANY':
        return {
          companyId: schemeid,
        };
      default:
        return {};
    }
  });

  return (
    <ProCardPlus
      style={{ padding: '12px' }}
      ghost
      direction="column"
      gutter={[0, GUTTER_SIZE]}
      size="middle"
    >
      <Tabs
        activeKey={key}
        size="small"
        tabBarStyle={{ background: '#fff', margin: '0', padding: '0 16px' }}
        onChange={(val: any) => setKey(val)}
      >
        <TabPane tab="基金产品" key="FUND">
          <FundProduction initSchemeId={initObj.fundId} />
        </TabPane>
        <TabPane tab="基金经理" key="MANAGER">
          <FundManage initSchemeId={initObj.managerId} />
        </TabPane>
        <TabPane tab="基金公司" key="COMPANY">
          <FundCompany initSchemeId={initObj.companyId} />
        </TabPane>
      </Tabs>
    </ProCardPlus>
  );
}
