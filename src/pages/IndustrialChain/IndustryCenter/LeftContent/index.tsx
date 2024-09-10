import ProCardPlus from '@/components/ProCardPlus';
import { cardGutter } from '@/themes';
import IndustrialAtlas from './IndustrialAtlas';
import IndustrialMarket from './IndustrialMarket';
import IndustryPortrait from './IndustryPortrait';
import ImportantIndicator from './ImportantIndicator';

type PropsType = {
  colSpan: number | string;
};

const LeftContent = (props: PropsType) => {
  return (
    <ProCardPlus ghost colSpan={props.colSpan} direction="column" gutter={[0, cardGutter]}>
      <IndustryPortrait />
      <IndustrialMarket />
      <IndustrialAtlas />
      <ImportantIndicator />
    </ProCardPlus>
  );
};

LeftContent.isProCard = true;

export default LeftContent;
