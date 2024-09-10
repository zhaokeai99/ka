import { SelectKeyProvider } from '@/pages/IndustrialChain/ChainDetail/service';
import { useContext, useEffect } from 'react';
import TitleContent from '../TitleContent';

// 非上市发债公司
const Private = () => {
  const { selectKey }: any = useContext(SelectKeyProvider);

  useEffect(() => {
    // 当tree的选择节点改变的时候请求接口
    console.log('Private-非上市', selectKey);
  }, [selectKey?.nodeId]);

  return (
    <div className="private">
      <TitleContent
        data={[
          {
            title: selectKey?.nodeName,
            description: selectKey?.nodeDesc,
          },
        ]}
      />
      <h3>非上市公司</h3>
    </div>
  );
};

export default Private;
