import { cardGutter } from '@/themes';
import ProCard from '@ant-design/pro-card';
import TrendCard from './components/IndustryHotspot/Index';
import IndustryPolicyList from './components/IndustryPolicyList';
import MoneyFlowsCard from './components/MoneyFlows/Index';
import TopCard from './components/TopCard/Index';

type PropsType = {
  colSpan: number;
};

// 左边栏
const LeftContent = (props: PropsType) => {
  return (
    <ProCard ghost colSpan={props.colSpan} direction="column" gutter={[0, cardGutter]} size="small">
      <TopCard />
      <MoneyFlowsCard />
      <TrendCard />
      <IndustryPolicyList />
    </ProCard>
  );
};

LeftContent.isProCard = true;

export default LeftContent;
