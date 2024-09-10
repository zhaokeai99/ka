import React from 'react';
import ProCard from '@ant-design/pro-card';
import { cardGutter } from '@/themes';
import TopCard from './components/TopCard';
import TrendCard from './components/TrendCard';
import PieCard from './components/PieCard';

type PropsType = {
  colSpan: number;
};
// 右边栏
const RightContent = (props: PropsType) => {
  return (
    <ProCard ghost colSpan={props.colSpan} direction="column" gutter={[0, cardGutter]} size="small">
      <TopCard />
      <TrendCard />
      <PieCard />
    </ProCard>
  );
};

RightContent.isProCard = true;

export default RightContent;
