import { cardGutter } from '@/themes';
import ProCard from '@ant-design/pro-card';
import ChainCard from './components/ChainCard';
import ChartContent from './components/ChartContent';
import GoodDegrees from './components/GoodDegrees';

type PropsType = {
  colSpan: number;
};

const RightContent = (props: PropsType) => {
  return (
    <ProCard ghost colSpan={props.colSpan} direction="column" gutter={[0, cardGutter]} size="small">
      <ChainCard />
      <GoodDegrees />
      <ChartContent />
    </ProCard>
  );
};

RightContent.isProCard = true;

export default RightContent;
