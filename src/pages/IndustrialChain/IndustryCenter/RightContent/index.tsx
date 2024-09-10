import ProCardPlus from '@/components/ProCardPlus';
import { cardGutter } from '@/themes';
import Fund from './Fund';
import IndustryPolicy from './IndustryPolicy';
import Report from './Report';
import PublicOpinion from './PublicOpinion';

type PropsType = {
  colSpan: number | string;
};

const RightContent = (props: PropsType) => (
  <ProCardPlus ghost direction="column" colSpan={props.colSpan} gutter={[0, cardGutter]}>
    <Report />
    <Fund />
    <IndustryPolicy />
    <PublicOpinion />
  </ProCardPlus>
);

RightContent.isProCard = true;

export default RightContent;
