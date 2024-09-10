import { cardGutter, contentPadding } from '@/themes';
import ProCard from '@ant-design/pro-card';
import { memo } from 'react';
import LeftContent from './LeftContent';
import RightContent from './RightContent';

// 全景产业链首页
const HomePage = () => {
  return (
    <ProCard ghost style={{ padding: contentPadding }} gutter={[cardGutter, 0]} size="small">
      <LeftContent colSpan={7} />
      <RightContent colSpan={17} />
    </ProCard>
  );
};

export default memo(HomePage);
