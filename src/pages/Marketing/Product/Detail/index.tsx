import React, { useState, useEffect, useContext } from 'react';
import { useModel } from 'umi';
import ProductHeader from '../ProductHeader';
import Profiles from '../../../Production/IndexDetail/SalesProduct/Profiles';
import CastSurely from '../../../Production/IndexDetail/SalesProduct/CastSurely';
import Channel from '../../../Production/IndexDetail/SalesProduct/Channel';
import Analysis from '../../../Production/IndexDetail/SalesProduct/Analysis';
import { queryBIProductInfo } from '../service';
import ProCard from '@ant-design/pro-card';
import { TabLayoutContext } from '@/components/thfund-front-component/src';

const { TabPane } = ProCard;

const FundDetail: React.FC<any> = (props) => {
  const { fundCode } = props.match.params;
  const { key: tabTitleKey, setTabTitle } = useContext(TabLayoutContext);
  const [{ dateInfo }, { fetchDateInfo }] = useModel('useMarketingModel');
  const [fundInfo, setFundInfo] = useState({
    stageDesc: '',
    fundShortName: '',
    fundCode: '',
    productTypeDesc: '',
    productTypeOnedesc: '',
    riskLevelDesc: '',
    contentItem: [],
  });
  const [tabKey, setTabKey] = useState('1');

  useEffect(() => {
    setTabTitle(tabTitleKey, `${fundCode}`);
    fetchDateInfo();
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await queryBIProductInfo({ fundCode });
      setFundInfo({
        ...data,
        contentItem: [
          {
            label: '产品全称',
            value: data?.fundName,
          },
          {
            label: '产品简称',
            value: data?.fundAbbr,
          },
          {
            label: '合同生效日',
            value: data?.contractEffectTime,
          },
          {
            label: '一级分类',
            value: data?.fundInvestType,
          },
          {
            label: '募集开始时间',
            value: data?.raiseStartTime,
          },
          {
            label: '募集结束时间',
            value: data?.raiseEndTime,
          },
        ],
      });
    })();
  }, []);

  return (
    <ProCard ghost direction="column" className="none-select" style={{ padding: '12px' }}>
      <ProductHeader {...fundInfo} desColumn={2} />
      {dateInfo && (
        <ProCard
          ghost
          tabs={{
            type: 'card',
            tabPosition: 'top',
            activeKey: tabKey,
            onChange: (key) => setTabKey(key),
          }}
          style={{ marginTop: '10px' }}
        >
          <TabPane tab="概览" key="1" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
            <Profiles {...props} />
          </TabPane>
          <TabPane tab="定投" key="2" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
            <CastSurely {...props} />
          </TabPane>
          <TabPane tab="渠道" key="3" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
            <Channel {...props} />
          </TabPane>
          <TabPane tab="能力分析" key="4" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
            <Analysis {...props} />
          </TabPane>
        </ProCard>
      )}
    </ProCard>
  );
};

export default FundDetail;
