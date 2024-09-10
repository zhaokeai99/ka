import { SelectKeyProvider } from '@/pages/IndustrialChain/ChainDetail/service';
import { memo, useContext } from 'react';
import TitleContent from '../TitleContent';
import ChartContent from './components/ChartContent';

// 指标
const Indicators = () => {
  const { selectKey }: any = useContext(SelectKeyProvider);

  return (
    <div className="indicators">
      <TitleContent
        data={[
          {
            title: selectKey?.nodeName,
            description: selectKey?.nodeDesc,
          },
        ]}
      />
      <ChartContent />
    </div>
  );
};

export default memo(Indicators);
