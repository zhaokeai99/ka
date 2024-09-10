import {
  queryCompanyEarningsEstimateCount,
  SelectKeyProvider,
  TabProvider,
} from '@/pages/IndustrialChain/ChainDetail/service';
import { Spin } from 'antd';
import { memo, useCallback, useContext, useEffect, useState } from 'react';
import TitleContent from '../TitleContent';
import ColumnChart from './components/ColumnChart';

// 公告掘金
const Notice = () => {
  const { selectKey }: any = useContext(SelectKeyProvider);
  const { tab } = useContext(TabProvider);
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getData = useCallback(async () => {
    setLoading(true);

    const result = selectKey?.nodeId
      ? await queryCompanyEarningsEstimateCount({
          nodeId: selectKey.nodeId,
        })
      : [];

    setData(result);
    setLoading(false);
  }, [selectKey?.nodeId, tab]);

  useEffect(() => {
    // 当tree的选择节点改变的时候请求接口
    if (tab === 'notice') {
      getData();
    }
  }, [selectKey, tab]);

  return (
    <div className="notice">
      <TitleContent
        data={[
          {
            title: selectKey?.nodeName,
            description: selectKey?.nodeDesc,
          },
        ]}
      />
      <Spin spinning={loading}>
        <ColumnChart data={data} />
      </Spin>
    </div>
  );
};

export default memo(Notice);
