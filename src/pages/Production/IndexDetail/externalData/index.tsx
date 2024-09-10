import ProCard from '@ant-design/pro-card';
import FullMarketDetail from '../FullMarketDetail';
import PositionAnalysis from '../PositionAnalysis';
import RankAndRating from '../RankAndRating';
import RiskInformation from '../RiskInformation';

function externalData({ fundCode }: any) {
  return (
    <ProCard
      ghost
      tabs={{
        type: 'card',
        tabPosition: 'top',
      }}
    >
      <ProCard.TabPane key="1" tab="基本信息" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
        <FullMarketDetail fundCode={fundCode} />
      </ProCard.TabPane>
      <ProCard.TabPane key="2" tab="排名及评价" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
        <RankAndRating fundCode={fundCode} />
      </ProCard.TabPane>
      <ProCard.TabPane key="3" tab="持仓分析" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
        <PositionAnalysis fundCode={fundCode} />
      </ProCard.TabPane>
      <ProCard.TabPane key="4" tab="风险信息" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
        <RiskInformation fundCode={fundCode} />
      </ProCard.TabPane>
    </ProCard>
  );
}

export default externalData;
