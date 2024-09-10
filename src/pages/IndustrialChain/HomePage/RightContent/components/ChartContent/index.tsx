import { cardGutter, contentPadding } from '@/themes';
import ProCard from '@ant-design/pro-card';
import { memo } from 'react';
import IndustryPerformance from './IndustryPerformance';
import PreliminaryResults from './PreliminaryResults';
import SellerRatings from './SellerRatings';
import MediaMood from './MediaMood';

const ChartContent = () => {
  return (
    <>
      <ProCard
        ghost
        size="small"
        direction="column"
        gutter={[cardGutter, cardGutter]}
        style={{
          marginTop: '4px',
          paddingBottom: contentPadding,
        }}
      >
        <SellerRatings />
        <IndustryPerformance />
        <PreliminaryResults />
        <MediaMood />
      </ProCard>
    </>
  );
};

export default memo(ChartContent);
