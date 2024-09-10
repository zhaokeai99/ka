import useProState from '@/components/Hooks/useProState';
import ThTabs from '@/components/ThTabs';
import {
  negativeColor,
  positiveColor,
  primaryColor3,
  staticCardBgColor,
  staticCardValueColor,
} from '@/themes/index';
import { CloseCircleOutlined } from '@ant-design/icons';
import ProCard, { StatisticCard } from '@ant-design/pro-card';
import { TabLayoutContext } from '@/components/thfund-front-component/src';
import { Col, Row, Tag } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useModel } from 'umi';
import Search from '../../Product/ProductHeader/Search';
import { queryChannelByCode } from '../../Product/service';
import AssetManage from '../AssetManage';
import FundAllocation from '../FundAllocation';
import ProductPosition from '../ProductPosition';
import { queryChannelBasicInfo } from '../service';
import styles from './index.less';

const { TabPane } = ProCard;
const { Statistic } = StatisticCard;

const ChannelDetail: React.FC<{ match: any }> = (props) => {
  const [{ dateInfo }, { fetchDateInfo }] = useModel('useMarketingModel');
  const { agencyCode } = props.match.params;
  const { key: tabTitleKey, setTabTitle } = useContext(TabLayoutContext);
  const [tabKey, setTabKey] = useState('1');
  const [cardInfo, setCardInfo] = useProState({
    channelName: '',
    stockAmt: '',
    accumProfitAmt: '',
    profitAmt: '',
    stockAmtPercent: '',
    natureDate: '',
  });

  const queryBasicInfo = async () => {
    const { data } = await queryChannelBasicInfo({ agencyCode });
    setCardInfo({
      channelName: data?.agencyName || '',
      stockAmt: data?.stockAmt || '',
      accumProfitAmt: data?.accumProfitAmt || '',
      profitAmt: data?.profitAmt || '',
      stockAmtPercent: data?.stockAmtPercent || '',
      natureDate: data?.natureDate || '',
    });
    setTabTitle(tabTitleKey, `${data?.agencyName || ''}`);
  };

  useEffect(() => {
    fetchDateInfo();
    queryBasicInfo();
  }, []);

  async function fetchList(keyword: string): Promise<any[]> {
    return queryChannelByCode({ agencyName: keyword }).then((result) => {
      return result.map((r: any) => ({
        key: r.agencyCode,
        value: r.agencyCode,
        label: r.agencyName,
      }));
    });
  }

  const checkColor = (val: any) => {
    return `${val}`?.startsWith('-') ? negativeColor : staticCardValueColor;
  };

  return (
    <ProCard ghost direction="column" className="none-select" style={{ padding: '12px' }}>
      <ProCard
        gutter={[8, 0]}
        title={
          <Row align="middle" gutter={[15, 0]}>
            <Col style={{ fontSize: '20px', fontWeight: 500 }}>
              {cardInfo.channelName || '暂无简称'}
            </Col>
            <Col>
              <Search
                fetchList={fetchList}
                links="/marketing/sellconfig/channelDistribution/detail/"
              />
            </Col>
            <Col>
              <Tag color={primaryColor3}>公募</Tag>
            </Col>
            <Col style={{ fontSize: '14px', color: '#333' }}>
              统计时间：{cardInfo.natureDate || '--'}
            </Col>
          </Row>
        }
      >
        <StatisticCard
          colSpan={5}
          ghost
          className={styles['card-style']}
          style={{ backgroundColor: staticCardBgColor }}
          statistic={{
            title: `总资产存量(亿)`,
            value: cardInfo.stockAmt || '--',
            valueStyle: { color: checkColor(cardInfo.stockAmt) },
            description: (
              <Statistic
                title="日涨跌幅"
                value={cardInfo.stockAmtPercent || '--'}
                valueStyle={{
                  color: cardInfo.stockAmtPercent?.startsWith('-') ? negativeColor : positiveColor,
                }}
              />
            ),
          }}
        />
        <StatisticCard
          colSpan={5}
          ghost
          style={{ backgroundColor: staticCardBgColor }}
          className={styles['card-style']}
          statistic={{
            title: `累计收益(亿)`,
            value: cardInfo.accumProfitAmt || '--',
            valueStyle: { color: checkColor(cardInfo.accumProfitAmt) },
          }}
        />
        <StatisticCard
          colSpan={5}
          ghost
          style={{ backgroundColor: staticCardBgColor }}
          className={styles['card-style']}
          statistic={{
            title: `最新收益(万)`,
            value: cardInfo.profitAmt || '--',
            valueStyle: { color: checkColor(cardInfo.profitAmt) },
          }}
        />
      </ProCard>
      {dateInfo && (
        <ProCard ghost style={{ marginTop: '10px' }}>
          <ThTabs
            size="small"
            activeKey={tabKey}
            type="card"
            onChange={(key: any) => setTabKey(key)}
          >
            <TabPane
              closeIcon={<CloseCircleOutlined color="blue" />}
              tab="资产管理"
              key="1"
              cardProps={{ bodyStyle: { paddingTop: 0 } }}
            >
              <AssetManage {...props} />
            </TabPane>
            <TabPane tab="资金配置" key="2" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
              <FundAllocation {...props} />
            </TabPane>
            <TabPane tab="产品分布" key="3" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
              <ProductPosition {...props} />
            </TabPane>
            {/* <TabPane tab="服务客群" key="4">
              服务客群敬请期待~
            </TabPane>
            <TabPane tab="理财子" key="5">
              理财子敬请期待~
            </TabPane> */}
          </ThTabs>
        </ProCard>
      )}
    </ProCard>
  );
};

export default ChannelDetail;
