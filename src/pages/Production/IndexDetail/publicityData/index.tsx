import ProCard from '@ant-design/pro-card';
import Earn from './Earn';
import RiskTip from './RiskTip';
import InvestInfo from './InvestInfo';
import FundReward from './FundReward';
import FundHolder from './FundHolder';
import BonusInfo from './BonusInfo';
import RankAndRating from './RankAndRating';
import FundManager from './FundManager';

function externalData({ fundCode }: any) {
  return (
    <ProCard
      ghost
      tabs={{
        type: 'card',
        tabPosition: 'top',
      }}
    >
      <ProCard.TabPane key="1" tab="收益分析" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
        <Earn fundCode={fundCode} />
      </ProCard.TabPane>
      <ProCard.TabPane
        key="2"
        tab="投资目标、范围以及策略"
        cardProps={{ bodyStyle: { paddingTop: 0 } }}
      >
        <InvestInfo fundCode={fundCode} />
      </ProCard.TabPane>
      <ProCard.TabPane key="3" tab="基金评奖" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
        <FundReward fundCode={fundCode} />
      </ProCard.TabPane>
      <ProCard.TabPane key="4" tab="排名及评价" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
        <RankAndRating fundCode={fundCode} />
      </ProCard.TabPane>
      <ProCard.TabPane key="5" tab="持有人" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
        <FundHolder fundCode={fundCode} />
      </ProCard.TabPane>
      <ProCard.TabPane key="6" tab="分红信息" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
        <BonusInfo fundCode={fundCode} />
      </ProCard.TabPane>
      <ProCard.TabPane key="7" tab="宣推风险提示" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
        <RiskTip fundCode={fundCode} />
      </ProCard.TabPane>
      <ProCard.TabPane key="8" tab="基金经理" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
        <FundManager fundCode={fundCode} />
      </ProCard.TabPane>
    </ProCard>
  );
}

export default externalData;
